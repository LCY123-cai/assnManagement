const express = require('express')
// 数据链接
const pool = require('../database')
// 工具类
const tools = require('../tools')
// 根据时间创建id
const uuid = require('uuid/v1')
// 时间格式化
const moment = require('moment')
// 工具类使用
const {
  json,
  checkToken,
  sqlLink,
  toHump,
  toLine
} = tools
// 创建一个路由容器
const router = express.Router()
// 把路由都挂载到 router 路由容器中
router.get('/department/list', function (req, res) {
  let params = req.query
  params = toLine(params)
  pool.query(`select a.department_id,a.department_name,a.department_introduce,b.department_people_total from t_assn_department a
  left join (select department_id,count(1) as department_people_total from t_assn_member group by department_id) b on a.department_id = b.department_id
  where deleted=0 and assn_id=? 
  order by gmt_modified desc`, [params['assn_id']], function (error, results, fields) {
    if (error) {
      json(res, error, 'error')
    }
    results = toHump(results)
    json(res, results, 'select')
  })
})

router.post('/department/create', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      params = toLine(params)
      params['create_by'] = userId
      params.department_id = uuid()
      params['gmt_create'] = moment().format('YYYY-MM-DD HH:mm:ss')
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('select department_name from t_assn_department where assn_id=? and department_name = ? and deleted=0',
        [params['assn_id'], params['department_name']],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          if (results.length) {
            json(res, '', 'error', '该部门名称已存在')
          } else {
            pool.query('insert into t_assn_department set ?',
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

router.post('/department/edit', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      params = toLine(params)
      const department_id = params.department_id
      class FromData {
        constructor(params) {
          this.department_name = params.department_name
          this.department_introduce = params.department_introduce
        }
      }
      params = new FromData(params)
      params['modified_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_assn_department set ? where department_id = ?',
        [params, department_id],
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

router.post('/department/disband', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      const params = req.body
      const departmentId = params.departmentId
      delete params.departmentId
      params['modified_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_assn_department set ? where department_id = ?',
        [params, departmentId],
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

module.exports = router
