const express = require('express')
// 数据链接
const pool = require('../database')
// 工具类
const tools = require('../tools')
// 根据时间创建id
const uuid = require('uuid/v1')
// 时间格式化
const moment = require('moment')
// excel导出
const nodeExcel = require('excel-export')
// 工具类使用
const {
  json,
  checkToken,
  toArray,
  toHump,
  toLine,
  queryExcel
} = tools

// 接收文件
const multer = require('multer')
// 设置过滤规则（可选）
var excelFilter = function (req, file, cb) {
  const acceptableMime = ['xlsx', 'xls']
  let suffixName = file.originalname.split('.')
  suffixName = suffixName[suffixName.length - 1]
  if (acceptableMime.indexOf(suffixName) !== -1) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
// 设置限制（可选）
const excelLimit = {
  fieldSize: '2MB'
}
// 创建 multer 实例
var excelUploader = multer({
  fileFilter: excelFilter,
  limits: excelLimit
}).single('file')

// 创建一个路由容器
const router = express.Router()
// 把路由都挂载到 router 路由容器中
router.post('/assnMember/import', excelUploader, function (req, res) {
  if (!req.file) {
    return json(res, '', 'error', '上传的格式不正确')
  }
  const userId = req.body.userId
  const buffer = req.file.buffer
  const data = queryExcel(buffer)
  for (const [index, ele] of data.entries()) {
    let dataArray = ele.split(',')
    const namesReg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
    const numberReg = /^[1][0-9]{10}$/
    dataArray = dataArray.slice(0, -1)
    dataArray = dataArray.map(function (item, index, array) {
      return item.trim()
    })
    if (dataArray.indexOf(0, '') === -1) {
      if (!namesReg.test(dataArray[0]) || !namesReg.test(dataArray[1]) || !namesReg.test(dataArray[2]) || !numberReg.test(dataArray[3])) {
        return json(res, '', 'error', `第${index + 1}行数据格式不正确`)
      }
      const params = {}
      pool.query(`select a.assn_id,b.department_id from t_assn_base_info a
          left join t_assn_department b on a.assn_id=b.assn_id
          where a.assn_principal_id = ? and a.assn_name = ? and b.department_name = ? and a.deleted=0
          order by a.gmt_modified desc`, [userId, dataArray[0], dataArray[1]], function (error, results, fields) {
        if (error) {
          json(res, error, 'error')
        }
        if (!results.length) {
          return json(res, '', 'error', `第${index + 1}行数据不正确，你没有权限操作此社团,后续操作取消`)
        } else {
          params.assn_id = results[0].assn_id
          params.department_id = results[0].department_id
          pool.query(`select user_id from t_user_base_info 
          where user_name = ? and user_account = ? and deleted=0
          order by gmt_modified desc`, [dataArray[2], dataArray[3]], function (error, results, fields) {
            if (error) {
              json(res, error, 'error')
            }
            if (!results.length) {
              return json(res, '', 'error', `第${index + 1}行数据不正确,系统并无此人，后续操作取消`)
            } else {
              params.user_id = results[0].user_id
              pool.query(`select a.assn_id from t_assn_member a
                left join t_user_base_info b on a.user_id=b.user_id
                left join t_assn_base_info c on a.assn_id=c.assn_id
                left join t_assn_department d on a.department_id=d.department_id
                where a.deleted=0 and c.assn_name = ? and d.department_name = ?
                and b.user_name = ? and b.user_account = ?
                `, [dataArray[0], dataArray[1], dataArray[2], dataArray[3]], function (error, results, fields) {
                if (error) {
                  json(res, error, 'error')
                }
                if (results.length) {
                  return json(res, '', 'error', `第${index + 1}行数据不正确,系统已有此人，后续操作取消`)
                } else {
                  params.create_by = userId
                  params.gmt_create = moment().format('YYYY-MM-DD HH:mm:ss')
                  params.gmt_modified = moment().format('YYYY-MM-DD HH:mm:ss')
                  pool.query('insert into t_assn_member set ?',
                    params,
                    function (error, results, fields) {
                      if (error) {
                        json(res, error, 'error')
                      }
                      params['handle_type'] = 1
                      pool.query('insert into t_assn_member_change set ?',
                        params,
                        function (error, results, fields) {
                          if (error) {
                            json(res, error, 'error')
                          } else {
                            json(res, results, 'insert')
                          }
                        })
                    })
                }
              })
            }
          })
        }
      })
    } else {
      return json(res, '', 'error', '请每一行都填写所有参数')
    }
  }
})

router.get('/assnMember/template', function (req, res) {
  const conf = {}
  // conf.stylesXmlFile = 'styles.xml'
  conf.name = 'mysheet'
  conf.cols = [{
    caption: '序号',
    type: 'number'
  }, {
    caption: '社团名称',
    type: 'string'
  }, {
    caption: '部门名称',
    type: 'string'
  }, {
    caption: '社员名称',
    type: 'string'
  }, {
    caption: '社员账号',
    type: 'number'
  }]
  conf.rows = {}
  const data = nodeExcel.execute(conf)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8')
  // res.setHeader('Content-Disposition', 'attachment; filename=' + 'Report.xlsx')
  res.end(data, 'binary')
})

router.get('/assnMember/export', function (req, res) {
  let params = req.query
  params = toLine(params)
  pool.query(`select a.gmt_create,b.user_name,b.user_gender,b.user_email,b.user_phone,
    c.assn_name,d.department_name
    from t_assn_member a
    left join t_user_base_info b on a.user_id=b.user_id
    left join t_assn_base_info c on a.assn_id=c.assn_id
    left join t_assn_department d on a.department_id=d.department_id
    where a.deleted=0
    and (case when ? is not null then (c.assn_name like ?) else (1=1) end)
    and (case when ? is not null then (a.department_id = ?) else (1=1) end)
    and (case when ? is not null then (b.user_name like ?) else (1=1) end)
    order by a.gmt_modified desc`, [params['assn_name'], `%${params['assn_name']}%`, params['department_id'], params['department_id'], params['user_name'], params['user_name']], function (error, results, fields) {
    if (error) {
      json(res, error, 'error')
    }
    results = toHump(results)
    const conf = {}
    // conf.stylesXmlFile = 'styles.xml'
    conf.name = 'mysheet'
    conf.cols = [{
      caption: '序号',
      type: 'number'
    }, {
      caption: '社团名称',
      type: 'string'
    }, {
      caption: '部门名称',
      type: 'string'
    }, {
      caption: '社员名称',
      type: 'string'
    }, {
      caption: '社员性别',
      type: 'number',
      beforeCellWrite: function (row, cellData) {
        if (cellData) {
          return '男'
        } else {
          return '女'
        }
      }
    }, {
      caption: '社员电话',
      type: 'string'
    }, {
      caption: '社员邮箱',
      type: 'string'
    }, {
      caption: '加入时间',
      type: 'date',
      beforeCellWrite: function (row, cellData) {
        if (cellData) {
          return moment(cellData).format('YYYY-MM-DD')
        } else {
          return null
        }
      }
    }]
    const array = ['assnName', 'departmentName', 'userName', 'userGender', 'userPhone', 'userEmail', 'gmtCreate']
    const rows = []
    for (const [index, el] of results.entries()) {
      rows.push(toArray(array, el, index))
    }
    conf.rows = rows
    const data = nodeExcel.execute(conf)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8')
    // res.setHeader('Content-Disposition', 'attachment; filename=' + 'Report.xlsx')
    res.end(data, 'binary')
  })
})

router.get('/assnMember/assnSex', function (req, res) {
  const params = req.query
  const assnId = params.assnId
  pool.query(`select b.user_gender,count(1) as total from t_assn_member a
      left join t_user_base_info b on a.user_id=b.user_id
      where a.assn_id = ? and a.deleted=0
      group by b.user_gender`, [assnId], function (error, results, fields) {
    if (error) {
      json(res, error, 'error')
    }
    results = toHump(results)
    json(res, results, 'select', '查询成功')
  })
})

router.get('/assnMember/assnCount', function (req, res) {
  const params = req.query
  const assnId = params.assnId
  pool.query(`select total1,total2,total3
  from (select count(1) as total1 from t_assn_member where assn_id = ? and deleted=0 and YEAR(gmt_create)=YEAR(NOW())) as a,
  (select count(1) as total2 from t_assn_member where assn_id = ? and deleted=0 and YEAR(gmt_create)=YEAR(date_sub(now(),interval 1 year))) as b,
  (select count(1) as total3 from t_assn_member where assn_id = ? and deleted=0 and YEAR(gmt_create)=YEAR(date_sub(now(),interval 2 year))) as c
  `, [assnId, assnId, assnId], function (error, results, fields) {
    if (error) {
      json(res, error, 'error')
    }
    results = results[0]
    json(res, results, 'select', '查询成功')
  })
})

router.get('/assnMember/myAssn', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    const userId = decode.userId
    pool.query(`select a.assn_id,a.department_id,a.user_id,a.gmt_modified,b.assn_name,c.department_name
      from t_assn_member a
      left join t_assn_base_info b on a.assn_id=b.assn_id
      left join t_assn_department c on a.department_id=c.department_id 
      where a.user_id = ? and b.deleted=0
      order by a.gmt_modified desc`, [userId], function (error, results, fields) {
      if (error) {
        json(res, error, 'error')
      }
      results = toHump(results)
      json(res, results, 'select', '查询成功')
    })
  })
})

router.get('/assnMember/list', function (req, res) {
  let params = req.query
  const pageNum = params.pageNum || 1
  const pageSize = params.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = Number(pageSize)
  const limit = {
    start: start,
    end: end
  }
  params = toLine(params)
  pool.query(`select count(1) as total from t_assn_member a
    left join t_user_base_info b on a.user_id=b.user_id
    left join t_assn_base_info c on a.assn_id=c.assn_id
    left join t_assn_department d on a.department_id=d.department_id 
    where a.deleted = 0
    and (case when ? is not null then (c.assn_name like ?) else (1=1) end)
    and (case when ? is not null then (a.department_id = ?) else (1=1) end)
    and (case when ? is not null then (b.user_name like ?) else (1=1) end)
    `, [params['assn_name'], `%${params['assn_name']}%`, params['department_id'], params['department_id'], params['user_name'], params['user_name']], function (error, results, fields) {
    if (error) {
      json(res, error, 'error')
    }
    const total = JSON.parse(JSON.stringify(results))[0].total
    pool.query(`select a.id,a.assn_id,a.department_id,a.user_id,a.gmt_create,b.user_name,b.user_gender,b.user_email,b.user_phone,
    c.assn_name,c.assn_principal_id,d.department_name
    from t_assn_member a
    left join t_user_base_info b on a.user_id=b.user_id
    left join t_assn_base_info c on a.assn_id=c.assn_id
    left join t_assn_department d on a.department_id=d.department_id
    where a.deleted=0
    and (case when ? is not null then (c.assn_name like ?) else (1=1) end)
    and (case when ? is not null then (a.department_id = ?) else (1=1) end)
    and (case when ? is not null then (b.user_name like ?) else (1=1) end)
    order by a.gmt_modified desc limit ?,?`, [params['assn_name'], `%${params['assn_name']}%`, params['department_id'], params['department_id'], params['user_name'], params['user_name'], limit.start, limit.end], function (error, results, fields) {
      if (error) {
        json(res, error, 'error')
      }
      results = toHump(results)
      const data = {}
      data.record = results
      data.total = total
      json(res, data, 'select', '查询成功')
    })
  })
})

router.post('/assnMember/create', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const handleId = decode.userId
      let params = req.body
      const {
        assnId,
        departmentId,
        userId
      } = params
      params = toLine(params)
      params['create_by'] = handleId
      params['gmt_create'] = moment().format('YYYY-MM-DD HH:mm:ss')
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('select user_id from t_assn_member where assn_id = ? and department_id = ? and user_id = ? and deleted = 0',
        [assnId, departmentId, userId],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          if (!results.length) {
            pool.query('insert into t_assn_member set ?',
              params,
              function (error, results, fields) {
                if (error) {
                  json(res, error, 'error')
                }
                params['handle_type'] = 1
                pool.query('insert into t_assn_member_change set ?',
                  params,
                  function (error, results, fields) {
                    if (error) {
                      json(res, error, 'error')
                    } else {
                      json(res, results, 'insert')
                    }
                  })
              })
          } else {
            json(res, '', 'error', '这个社员已存在')
          }
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.post('/assnMember/edit', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const handleId = decode.userId
      let params = req.body
      const oldInfo = {
        assn_id: params.oldAssnId,
        department_id: params.oldDepartmentId
      }
      const id = params.id
      params = toLine(params)
      const user_id = params['user_id']
      pool.query('select user_id from t_assn_member where assn_id = ? and department_id = ? and user_id = ? and deleted = 0',
        [params.assn_id, params.department_id, user_id],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          if (!results.length) {
            class FromData {
              constructor(params) {
                this.assn_id = params.assn_id
                this.department_id = params.department_id
              }
            }
            params = new FromData(params)
            params['modified_by'] = handleId
            params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
            pool.query('update t_assn_member set ? where user_id = ? and id = ?',
              [params, user_id, id],
              function (error, results, fields) {
                if (error) {
                  json(res, error, 'error')
                }
                let paramsIn = Object.assign({
                  user_id,
                  handle_type: 1
                }, params)
                let paramsOut = Object.assign({
                  user_id,
                  handle_type: 0,
                  modified_by: params['modified_by'],
                  gmt_modified: params['gmt_modified']
                }, oldInfo)
                paramsIn.create_by = handleId
                paramsIn.gmt_create = moment().format('YYYY-MM-DD HH:mm:ss')
                paramsOut.create_by = handleId
                paramsOut.gmt_create = moment().format('YYYY-MM-DD HH:mm:ss')
                const array = ['assn_id',
                  'department_id',
                  'user_id',
                  'handle_type',
                  'create_by',
                  'gmt_create',
                  'gmt_modified'
                ]
                paramsIn = toArray(array, paramsIn)
                paramsOut = toArray(array, paramsOut)
                const values = [paramsIn, paramsOut]
                pool.query('insert into t_assn_member_change(assn_id,department_id,user_id,handle_type,create_by,gmt_create,gmt_modified) values ?',
                  [values],
                  function (error, results, fields) {
                    if (error) {
                      json(res, error, 'error')
                    } else {
                      json(res, results, 'insert')
                    }
                  })
              })
          } else {
            json(res, '', 'error', '这个社员已存在')
          }
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.post('/assnMember/disband', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const handleId = decode.userId
      let params = req.body
      const assnId = params.assnId
      const departmentId = params.departmentId
      const userId = params.userId
      params = {
        deleted: 1
      }
      params['modified_by'] = handleId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_assn_member set ? where assn_id = ? and department_id = ? and user_id = ?',
        [params, assnId, departmentId, userId],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          const handleType = 0
          let data = {
            assnId,
            departmentId,
            userId,
            handleType,
            'modifiedBy': handleId,
            'gmtModified': moment().format('YYYY-MM-DD HH:mm:ss'),
            'gmtCreate': moment().format('YYYY-MM-DD HH:mm:ss')
          }
          data = toLine(data)
          pool.query('insert into t_assn_member_change set ?',
            data,
            function (error, results, fields) {
              if (error) {
                json(res, error, 'error')
              } else {
                json(res, '更新成功', 'update')
              }
            })
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

module.exports = router
