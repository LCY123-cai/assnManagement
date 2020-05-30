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
router.get('/application/count', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    let params = req.query
    const userId = decode.userId
    const assnIds = params.assnIds
    params = toLine(params)
    pool.query(`select id from t_assn_application_record 
      where deleted= 0 and is_handle = 0
      and (user_id = ? or assn_id in (?))
      order by gmt_modified desc`, [userId, assnIds], function (error, results, fields) {
      if (error) {
        json(res, error, 'error')
      }
      const count = results.length
      results = {
        count
      }
      json(res, results, 'select')
    })
  })
})

router.get('/application/list', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    let params = req.query
    const userId = decode.userId
    const assnIds = params.assnIds
    params = toLine(params)
    pool.query(`select a.id,a.assn_id,a.department_id,a.user_id,user_account,a.is_handle,a.is_agree,a.remark,a.gmt_modified,a.create_by,
      b.user_name,b.user_gender,b.user_introduction,c.assn_name,d.department_name
      from t_assn_application_record a
      left join t_user_base_info b on a.user_id=b.user_id
      left join t_assn_base_info c on a.assn_id=c.assn_id
      left join t_assn_department d on a.department_id=d.department_id
      where a.deleted= 0 
      and (a.user_id = ? or a.assn_id in (?))
      order by a.gmt_modified desc`, [userId, assnIds], function (error, results, fields) {
      if (error) {
        json(res, error, 'error')
      }
      results = toHump(results)
      json(res, results, 'select')
    })
  })
})

router.post('/application/apply', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      params = toLine(params)
      params['user_id'] = userId
      params['create_by'] = userId
      params['gmt_create'] = moment().format('YYYY-MM-DD HH:mm:ss')
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('select user_id from t_assn_application_record where assn_id=? and department_id = ? and user_id=? and deleted=0',
        [params['assn_id'], params['department_id'], params['user_id']],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          if (results.length) {
            json(res, '', 'error', '你已提交过申请,请勿重复提交')
          } else {
            pool.query('select user_id from t_assn_member where assn_id=? and department_id = ? and user_id=? and deleted=0',
              [params['assn_id'], params['department_id'], params['user_id']],
              function (error, results, fields) {
                if (error) {
                  json(res, error, 'error')
                }
                if (results.length) {
                  json(res, '', 'error', '你已是这个社团部门的社员,请勿重复提交')
                } else {
                  pool.query(`select assn_id from t_assn_base_info where 
                  assn_id=? and is_hiring = 1 and deleted=0`, [params['assn_id']],
                  function (error, results, fields) {
                    if (error) {
                      json(res, error, 'error')
                    }
                    if (results.length) {
                      pool.query('insert into t_assn_application_record set ?',
                        params,
                        function (error, results, fields) {
                          if (error) {
                            json(res, error, 'error')
                          }
                          json(res, results, 'insert')
                        })
                    } else {
                      json(res, '', 'error', '当前社团不被允许纳新')
                    }
                  })
                }
              })
          }
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.post('/application/delete', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      const params = req.body
      const id = params.id
      delete params.id
      params['modified_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_assn_application_record set ? where id = ?',
        [params, id],
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

router.post('/application/handle', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const handleId = decode.userId
      let params = req.body
      const id = params.id
      const isAgree = params.isAgree
      const applicationInfo = params.applicationInfo
      delete params.applicationInfo
      delete params.id
      params = toLine(params)
      params['modified_by'] = handleId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      if (isAgree) {
        pool.query('update t_assn_application_record set ? where id = ?',
          [params, id],
          function (error, results, fields) {
            if (error) {
              json(res, error, 'error')
            }
            let data = {}
            data.assnId = applicationInfo.assnId
            data.departmentId = applicationInfo.departmentId
            data.userId = applicationInfo.userId
            data.createBy = handleId
            data.gmtCreate = moment().format('YYYY-MM-DD HH:mm:ss')
            data.gmtModified = moment().format('YYYY-MM-DD HH:mm:ss')
            data = toLine(data)
            pool.query('insert into t_assn_member set ?',
              data,
              function (error, results, fields) {
                if (error) {
                  json(res, error, 'error')
                }
                data['handle_type'] = 1
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
          })
      } else {
        pool.query('update t_assn_application_record set ? where id = ?',
          [params, id],
          function (error, results, fields) {
            if (error) {
              json(res, error, 'error')
            }
            json(res, results, 'update')
          })
      }
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

module.exports = router
