const express = require('express')
// 数据链接
const pool = require('../database')
// 工具类
const tools = require('../tools')
// 根据时间创建id
const uuid = require('uuid/v1')
// 返回json
const json = tools.json
// 检验token
const checkToken = tools.checkToken
// 时间格式化
const moment = require('moment')
// excel导出
const nodeExcel = require('excel-export')
// sql拼接
const sqlLink = tools.sqlLink
// 下划线转换驼峰
const toHump = tools.toHump
// 驼峰转换下划线
const toLine = tools.toLine
const toArray = tools.toArray
const imageConfig = tools.imageConfig
// 使用一下promise
const {
  checkAssn,
  createdAssn,
  setEditor
} = require('./dao/assn')
// 创建一个路由容器
const router = express.Router()
// 把路由都挂载到 router 路由容器中
router.get('/assn/export', function (req, res) {
  let params = req.query
  params = toLine(params)
  pool.query(`select a.assn_name,a.assn_introduce,a.is_hiring,
    b.user_name,c.assn_type_name,d.assn_people_total,e.department_total
    from t_assn_base_info a 
    left join t_user_base_info b on a.assn_principal_id=b.user_id
    left join t_assn_type c on a.assn_type_id=c.assn_type_id
    left join (select assn_id,count(1) as assn_people_total from t_assn_member where deleted=0 group by assn_id) d on a.assn_id = d.assn_id
    left join (select assn_id,count(1) as department_total from t_assn_department where deleted=0 group by assn_id) e on a.assn_id = e.assn_id
    where a.deleted=0 
    and (case when ? is not null then (a.assn_id = ?) else (1=1) end)
    and (case when ? is not null then (a.assn_name like ?) else (1=1) end)
    and (case when ? is not null then (a.assn_type_id = ?) else (1=1) end)
    and (case when ? is not null then (a.is_hiring = ?) else (1=1) end)
    order by a.gmt_modified desc`, [params['assn_id'], params['assn_id'], params['assn_name'], `%${params['assn_name']}%`, params['assn_type_id'], params['assn_type_id'], params['is_hiring'], params['is_hiring']], function (error, results, fields) {
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
      caption: '社团负责人',
      type: 'string'
    }, {
      caption: '社团总人数',
      type: 'number'
    }, {
      caption: '社团部门数',
      type: 'number'
    }, {
      caption: '社团类别',
      type: 'string'
    }, {
      caption: '是否纳新',
      type: 'string',
      beforeCellWrite: function (row, cellData) {
        if (cellData) {
          return '是'
        } else {
          return '否'
        }
      }
    }, {
      caption: '社团介绍',
      type: 'string'
    }]
    const array = ['assnName', 'userName', 'assnPeopleTotal', 'departmentTotal', 'assnTypeName', 'isHiring', 'assnIntroduce']
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

router.post('/assn/image', imageConfig(), function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      const fileName = req.file.filename
      const assnId = req.body.assnId
      const params = {
        assn_img: fileName,
        modified_by: userId,
        gmt_modified: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      pool.query('update t_assn_base_info set ? where assn_id = ?',
        [params, assnId],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          json(res, results, 'update')
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.get('/assn/nameList', function (req, res) {
  let params = req.query
  params = toLine(params)
  pool.query(`select assn_name,assn_id from t_assn_base_info where deleted = 0
  order by gmt_modified desc`, function (error, results, fields) {
    if (error) {
      json(res, error, 'error')
    }
    results = toHump(results)
    json(res, results, 'select', '查询成功')
  })
})

router.get('/assn/handleAssn', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    const userId = decode.userId
    pool.query(`select assn_id,assn_principal_id,assn_name,gmt_modified
      from t_assn_base_info where assn_principal_id = ? and deleted = 0
      order by gmt_modified desc`, [userId], function (error, results, fields) {
      if (error) {
        json(res, error, 'error')
      }
      results = toHump(results)
      json(res, results, 'select', '查询成功')
    })
  })
})

router.get('/assn/list', function (req, res) {
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
  pool.query(`select count(1) as total from t_assn_base_info 
  where deleted = 0
  and (case when ? is not null then (assn_name like ?) else (1=1) end)
  and (case when ? is not null then (assn_type_id = ?) else (1=1) end)
  and (case when ? is not null then (is_hiring = ?) else (1=1) end)
  `, [params['assn_name'], `%${params['assn_name']}%`, params['assn_type_id'], params['assn_type_id'], params['is_hiring'], params['is_hiring']], function (error, results, fields) {
    if (error) {
      json(res, error, 'error')
    }
    const total = JSON.parse(JSON.stringify(results))[0].total
    pool.query(`select a.assn_id,a.assn_name,a.assn_introduce,a.assn_type_id,a.is_hiring,a.assn_img,
    assn_principal_id,assn_introduce,b.user_name,c.assn_type_name,d.assn_people_total,e.department_total
    from t_assn_base_info a 
    left join t_user_base_info b on a.assn_principal_id=b.user_id
    left join t_assn_type c on a.assn_type_id=c.assn_type_id
    left join (select assn_id,count(1) as assn_people_total from t_assn_member where deleted=0 group by assn_id) d on a.assn_id = d.assn_id
    left join (select assn_id,count(1) as department_total from t_assn_department where deleted=0 group by assn_id) e on a.assn_id = e.assn_id
    where a.deleted=0 
    and (case when ? is not null then (a.assn_id = ?) else (1=1) end)
    and (case when ? is not null then (a.assn_name like ?) else (1=1) end)
    and (case when ? is not null then (a.assn_type_id = ?) else (1=1) end)
    and (case when ? is not null then (a.is_hiring = ?) else (1=1) end)
    order by a.gmt_modified desc limit ?,?`, [params['assn_id'], params['assn_id'], params['assn_name'], `%${params['assn_name']}%`, params['assn_type_id'], params['assn_type_id'], params['is_hiring'], params['is_hiring'], limit.start, limit.end], function (error, results, fields) {
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

router.post('/assn/create', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      params = toLine(params)
      params['create_by'] = userId
      params.assn_id = uuid()
      params['gmt_create'] = moment().format('YYYY-MM-DD HH:mm:ss')
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      checkAssn(params, res).then(data => {
        return createdAssn(params, res)
      }).then(data => {
        return setEditor(params, res)
      }).then(data => {
        json(res, '', 'select')
      })
      // pool.query('select assn_name from t_assn_base_info where assn_name = ? and deleted=0',
      //   params['assn_name'],
      //   function (error, results, fields) {
      //     if (error) {
      //       json(res, error, 'error')
      //     }
      //     if (results.length) {
      //       json(res, '', 'error', '该社团名称已存在')
      //     } else {
      //       pool.query('insert into t_assn_base_info set ?',
      //         params,
      //         function (error, results, fields) {
      //           if (error) {
      //             json(res, error, 'error')
      //           }
      //           json(res, results, 'insert')
      //         })
      //     }
      //   })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.post('/assn/edit', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      params = toLine(params)
      const assn_id = params.assn_id
      class FromData {
        constructor(params) {
          this.assn_name = params.assn_name
          this.assn_principal_id = params.assn_principal_id
          this.assn_type_id = params.assn_type_id
          this.is_hiring = params.is_hiring
          this.assn_introduce = params.assn_introduce
        }
      }
      params = new FromData(params)
      params['modified_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_assn_base_info set ? where assn_id = ?',
        [params, assn_id],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          json(res, results, 'insert')
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.post('/assn/disband', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      const params = req.body
      const assnId = params.assnId
      delete params.assnId
      params['modified_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_assn_base_info set ? where assn_id = ?',
        [params, assnId],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          json(res, results, 'update')
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.post('/assn/changeHiring', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      const assnId = params.assnId
      delete params.assnId
      params = toLine(params)
      params['modified_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_assn_base_info set ? where assn_id = ?',
        [params, assnId],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          json(res, results, 'update')
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.get('/assn/typeList', function (req, res) {
  let sql = 'select * from t_assn_type'
  const params = {}
  params['deleted'] = 0
  sql = sqlLink(pool, sql, params)
  pool.query(sql, function (error, results, fields) {
    if (error) {
      json(res, error, 'error')
    }
    results = toHump(results)
    json(res, results, 'select')
  })
})

router.post('/assn/addType', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      let sql = 'select * from t_assn_type'
      let params = req.body
      params = toLine(params)
      params['deleted'] = 0
      sql = sqlLink(pool, sql, params)
      pool.query(sql, function (error, results, fields) {
        if (error) {
          json(res, error, 'error')
        }
        if (results.length) {
          json(res, '', 'error', '社团类别重复')
        } else {
          const userId = decode.userId
          let params = req.body
          params = toLine(params)
          params['create_by'] = userId
          params.assn_type_id = uuid()
          params['gmt_create'] = moment().format('YYYY-MM-DD HH:mm:ss')
          params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
          pool.query('insert into t_assn_type set ?',
            params,
            function (error, results, fields) {
              if (error) {
                json(res, error, 'error')
              }
              json(res, results, 'insert')
            })
        }
      })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.post('/assn/editType', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      const assnTypeId = params.assnTypeId
      delete params.assnTypeId
      params = toLine(params)
      params['modified_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_assn_type set ? where assn_type_id = ?',
        [params, assnTypeId],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          json(res, results, 'update')
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.post('/assn/deleteType', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      const params = req.body
      const assnTypeId = params.assnTypeId
      delete params.assnTypeId
      pool.query('select count(1) as total from t_assn_base_info where assn_type_id = ?',
        [assnTypeId],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          const total = JSON.parse(JSON.stringify(results))[0].total
          if (total) {
            json(res, '', 'error', '该类别已被社团应用')
          } else {
            params['modified_by'] = userId
            params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
            pool.query('update t_assn_type set ? where assn_type_id = ?',
              [params, assnTypeId],
              function (error, results, fields) {
                if (error) {
                  json(res, error, 'error')
                }
                json(res, results, 'update')
              })
          }
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

module.exports = router
