const tools = require('../../tools')
const json = tools.json
const pool = require('../../database')

function checkAssn(params, res) {
  return new Promise((resolve, reject) => {
    pool.query('select assn_name from t_assn_base_info where assn_name = ? and deleted=0',
      params['assn_name'],
      function (error, results, fields) {
        if (error) {
          reject(json(res, error, 'error'))
        }
        if (results.length) {
          reject(json(res, '', 'error', '该社团名称已存在'))
        } else {
          resolve()
        }
      })
  })
}

function createdAssn(params, res) {
  return new Promise((resolve, reject) => {
    pool.query('insert into t_assn_base_info set ?',
      params,
      function (error, results, fields) {
        if (error) {
          reject(json(res, error, 'error'))
        }
        resolve()
      })
  })
}

function setEditor(params, res) {
  return new Promise((resolve, reject) => {
    // 查询社团维护者roleId
    pool.query('select role_id from t_role_info where role_name = "editor"',
      function (error, results, fields) {
        if (error) {
          reject(json(res, error, 'error'))
        }
        // 社团维护者权限
        const role_id = results[0]['role_id']
        pool.query('update t_user_base_info set role_id = ? where user_id = ?',
          [role_id, params['assn_principal_id']],
          function (error, results, fields) {
            if (error) {
              reject(json(res, error, 'error'))
            }
            resolve()
          })
      })
  })
}

module.exports = {
  checkAssn,
  createdAssn,
  setEditor
}
