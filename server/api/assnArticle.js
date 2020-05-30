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
  toHump,
  toLine,
  imageConfig
} = tools
// 创建一个路由容器
const router = express.Router()
router.post('/article/issue', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      params = toLine(params)
      params['create_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      params['gmt_create'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('insert into t_assn_article set ?',
        [params],
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

router.post('/article/update', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      let params = req.body
      const id = params.id
      delete params.id
      params = toLine(params)
      params['modified_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_assn_article set ? where id = ?',
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

router.post('/article/delete', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const userId = decode.userId
      const params = req.body
      const id = params.id
      delete params.id
      params['modified_by'] = userId
      params['gmt_modified'] = moment().format('YYYY-MM-DD HH:mm:ss')
      pool.query('update t_assn_article set ? where id = ?',
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

router.post('/article/clicks', function (req, res) {
  checkToken(req.headers['x-token'], function (flag, decode) {
    if (flag) {
      const params = req.body
      const id = params.id
      pool.query('update t_assn_article set clicks=clicks+1 where id = ?',
        [id],
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

router.post('/article/image', imageConfig(), function (req, res) {
  const fileName = req.file.filename
  json(res, { fileName }, 'select')
})

router.get('/article/list', function (req, res) {
  let params = req.query
  const isPage = Boolean(params.pageNum && params.pageSize)
  const pageNum = params.pageNum || 1
  const pageSize = params.pageSize || 10
  let start = (pageNum - 1) * pageSize
  let end
  if (isPage) {
    start = (pageNum - 1) * pageSize
    end = Number(pageSize)
  } else {
    start = 0
    end = 500
  }
  const limit = {
    start: start,
    end: end
  }
  params = toLine(params)
  pool.query(`select count(1) as total from t_assn_article a
  left join t_assn_base_info b on a.assn_id=b.assn_id
  where a.deleted = 0
  and (case when ? is not null then (b.assn_name like ?) else (1=1) end)
  and (case when ? is not null then (a.article_title like ?) else (1=1) end)
  `, [params['assn_name'], `%${params['assn_name']}%`, params['article_title'], `%${params['article_title']}%`], function (error, results, fields) {
    if (error) {
      json(res, error, 'error')
    }
    const total = JSON.parse(JSON.stringify(results))[0].total
    pool.query(`select a.id,a.assn_id,a.article_title,a.clicks,a.rich_text,a.gmt_modified,
    a.gmt_create,a.create_by,b.user_name,c.assn_name
    from t_assn_article a 
    left join t_user_base_info b on a.create_by=b.user_id
    left join t_assn_base_info c on a.assn_id=c.assn_id
    where a.deleted=0 
    and (case when ? is not null then (assn_name like ?) else (1=1) end)
    and (case when ? is not null then (article_title like ?) else (1=1) end)
    order by a.gmt_modified desc limit ?,?`, [params['assn_name'], `%${params['assn_name']}%`, params['article_title'], `%${params['article_title']}%`, limit.start, limit.end], function (error, results, fields) {
      if (error) {
        json(res, error, 'error')
      }
      results = toHump(results)
      let data = {}
      if (isPage) {
        data.record = results
        data.total = total
      } else {
        data = results
      }
      json(res, data, 'select', '查询成功')
    })
  })
})

module.exports = router
