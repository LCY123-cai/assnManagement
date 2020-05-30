const express = require('express')
// 数据链接
const pool = require('../database')
// 时间格式化
const moment = require('moment')
// 工具类
const tools = require('../tools')
// 根据时间创建id
const uuid = require('uuid/v1')
// 工具类使用
const {
  json,
  createToken,
  checkToken,
  imageConfig,
  toHump,
  toLine
} = tools
// 创建一个路由容器
const router = express.Router()
// 把路由都挂载到 router 路由容器中
router.post('/user/login', function (req, res) {
  const params = req.body
  const account = params.userAccount
  const password = params.userPassword
  pool.query('select * from t_user_base_info where user_account=? and user_password=? and deleted=0', [account, password], function (error, results, fields) {
    if (error) {
      json(res, error, 'error')
    }
    if (results.length) {
      results = results[0]
      const userId = results.user_id
      results = createToken(userId, '1h')
      json(res, results, 'select', '登录成功')
    } else {
      json(res, results, 'error', '账号或者密码错误，请仔细检查')
    }
  })
})

router.get('/user/info', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      let userId
      if (req.query.show === 'true') {
        userId = decode.userId
      } else {
        userId = undefined
      }
      pool.query(`SELECT base.user_id,user_account,user_name,user_gender,user_email,user_phone,user_img,user_introduction,role_name,
      GROUP_CONCAT(assn.assn_id  SEPARATOR ',') assn_id, GROUP_CONCAT(assn.assn_name  SEPARATOR ',') assn_name
      FROM t_user_base_info base
      LEFT JOIN t_role_info role ON base.role_id = role.role_id
      LEFT JOIN t_assn_base_info assn ON base.user_id = assn.assn_principal_id
      where base.deleted = 0
      and assn.deleted = 0
      and (case when ? is not null then (base.user_id = ?) else (1=1) end)
      GROUP BY base.user_id,user_account,user_name,user_gender,user_email,user_phone,user_img,user_introduction,role_name
      `, [
        [userId],
        [userId]
      ], function (error, results, fields) {
        if (error) {
          json(res, error, 'error')
        }
        results = toHump(results)
        json(res, results, 'select')
      })
    } else {
      json(res, '', 'error', '登录失效', '50014')
    }
  })
})

router.post('/user/register', function (req, res) {
  let params = req.body
  delete params.confirmPassword
  params.userGender = Number(params.userGender)
  params = toLine(params)
  params['gmt_create'] = moment().format('YYYY-MM-DD HH:mm:ss')
  params['user_id'] = uuid()
  pool.query('select role_id from t_role_info where role_name = "visitor"',
    function (error, results, fields) {
      if (error) {
        json(res, error, 'error')
      }
      // 游客权限
      params['role_id'] = results[0]['role_id']
      pool.query('select id from t_user_base_info where user_account = ?', [params['user_account']],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          if (results.length > 0) {
            json(res, '', 'error', '该账号已被注册过了')
          } else {
            pool.query('insert into t_user_base_info set ?',
              [params],
              function (error, results, fields) {
                if (error) {
                  json(res, error, 'error')
                }
                json(res, results, 'insert')
              })
          }
        })
    })
})

router.post('/user/edit', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      params = toLine(params)
      class FromData {
        constructor(params) {
          this.user_phone = params.user_phone
          this.user_email = params.user_email
          this.user_introduction = params.user_introduction
        }
      }
      params = new FromData(params)
      params['modified_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_user_base_info set ? where user_id = ?',
        [params, userId],
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

router.post('/user/changePassword', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      const checkPassword = params.userPassword
      pool.query('select user_id from t_user_base_info s where user_id = ? and user_password = ?',
        [userId, checkPassword],
        function (error, results, fields) {
          if (error) {
            json(res, error, 'error')
          }
          if (results.length) {
            const user_password = params.newPassword
            params = toLine(params)
            params = {
              user_password
            }
            params['modified_by'] = userId
            params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
            pool.query('update t_user_base_info set ? where user_id = ?',
              [params, userId],
              function (error, results, fields) {
                if (error) {
                  json(res, error, 'error')
                }
                json(res, results, 'update')
              })
          } else {
            json(res, '', 'error', '旧密码不正确，请仔细检查')
          }
        })
    } else {
      json(res, '', 'error', '非法凭证', '50008')
    }
  })
})

router.post('/user/image', imageConfig(), function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      const fileName = req.file.filename
      const params = {
        user_img: fileName,
        modified_by: userId,
        gmt_modified: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      pool.query('update t_user_base_info set ? where user_id = ?',
        [params, userId],
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
