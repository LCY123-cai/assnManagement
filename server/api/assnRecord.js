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
  sqlLink,
  toArray,
  toHump,
  toLine
} = tools
// 创建一个路由容器
const router = express.Router()
// 把路由都挂载到 router 路由容器中
router.get('/assnRecord/export', function (req, res) {
  let params = req.query
  params = toLine(params)
  pool.query(`select a.handle_type,a.gmt_create,b.user_name,b.user_gender,b.user_email,b.user_phone,
    c.assn_name,d.department_name
    from t_assn_member_change a
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
      caption: '操作类型',
      type: 'number',
      beforeCellWrite: function (row, cellData) {
        if (cellData) {
          return '加入'
        } else {
          return '离开'
        }
      }
    }, {
      caption: '操作时间',
      type: 'date',
      beforeCellWrite: function (row, cellData) {
        if (cellData) {
          return moment(cellData).format('YYYY-MM-DD')
        } else {
          return null
        }
      }
    }]
    const array = ['assnName', 'departmentName', 'userName', 'userGender', 'userPhone', 'userEmail', 'handleType', 'gmtCreate']
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

router.get('/assnRecord/list', function (req, res) {
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
  pool.query(`select count(1) as total from t_assn_member_change a
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
    pool.query(`select a.assn_id,a.department_id,a.user_id,a.handle_type,a.gmt_create,b.user_name,b.user_gender,b.user_email,b.user_phone,
    c.assn_name,c.assn_principal_id,d.department_name
    from t_assn_member_change a
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

router.get('/assnRecord/user', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    const userId = decode.userId
    let params = req.query
    params = toLine(params)
    pool.query(`select a.handle_type,a.gmt_modified,b.user_name,c.assn_name,d.department_name,e.user_name as handle_name
    from t_assn_member_change a
    left join t_user_base_info b on a.user_id=b.user_id
    left join t_assn_base_info c on a.assn_id=c.assn_id
    left join t_assn_department d on a.department_id=d.department_id
    left join t_user_base_info e on a.create_by=e.user_id
    where a.deleted=0 and a.user_id = ?
    order by a.gmt_modified desc`, [userId], function (error, results, fields) {
      if (error) {
        json(res, error, 'error')
      }
      results = toHump(results)
      json(res, results, 'select', '查询成功')
    })
  })
})

module.exports = router
