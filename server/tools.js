/**
 * 工具类
 */
// 引用jws模块
const jwt = require('jsonwebtoken')
const xlsx = require('xlsx')
const path = require('path')
const uuid = require('uuid/v1')
const multer = require('multer')
class Unity {
  /**
   *
   * @param {*} res 请求
   * @param {*} result 数据
   * @param {*} type 类型
   * @param {*} msg 提示消息
   * @param {*} code 返回码
   */
  json(res, result, type, msg, code) {
    if (type === 'insert') {
      res.json({
        code: '20000',
        msg: msg || '添加成功',
        data: ''
      })
    } else if (type === 'delete') {
      res.json({
        code: '20000',
        msg: msg || '删除成功',
        data: ''
      })
    } else if (type === 'update') {
      res.json({
        code: '20000',
        msg: msg || '更改成功',
        data: ''
      })
    } else if (type === 'select') {
      res.json({
        code: '20000',
        msg: msg || '查询成功',
        data: result
      })
    } else if (type === 'error') {
      res.json({
        code: code || '50000',
        msg: msg || '数据库链接失败或者sql语句执行失败',
        data: result
      })
    }
  }
  // 创建token
  createToken(cont, time) {
    // Token 数据
    const payload = {
      userId: cont
    }
    // 这是加密的key（密钥或私钥）
    const secret = 'qiuliang'
    const token = jwt.sign(payload, secret, {
      // 24小时过期,以秒作为单位或者使用字符串快速设置
      expiresIn: time
    })
    return token
  }
  // 检查token
  checkToken(token, callback) {
    // 这是加密的key（密钥或私钥）
    const secret = 'qiuliang'
    jwt.verify(token, secret, function (err, decode) {
      if (err) {
        // 当token过期，或这是一个伪造的token，或这是无效的token时会触发此逻辑
        callback(false, decode)
      } else {
        callback(true, decode)
      }
    })
  }
  // 下划线转换驼峰
  toHump(obj) {
    if (Array.isArray(obj)) {
      const temp = []
      for (const el of obj) {
        const insideTemp = {}
        for (const [key, val] of Object.entries(el)) {
          const name = key.replace(/\_(\w)/g, function (all, letter) {
            return letter.toUpperCase()
          })
          insideTemp[name] = val
        }
        temp.push(insideTemp)
      }
      return temp
    } else if (typeof obj === 'object') {
      const temp = {}
      for (const [key, val] of Object.entries(obj)) {
        const name = key.replace(/\_(\w)/g, function (all, letter) {
          return letter.toUpperCase()
        })
        temp[name] = val
      }
      return temp
    }
  }
  // 驼峰转换下划线
  toLine(obj) {
    delete obj.pageSize
    delete obj.pageNum
    const temp = {}
    for (const [key, val] of Object.entries(obj)) {
      const name = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      temp[name] = val
    }
    return temp
  }
  /**
   *
   * @param {*} pool 传入的连接，用于转义
   * @param {*} sql 传入的sql基础语句
   * @param {*} params 传入的需要拼接的对象
   * @param {*} order 排序规则
   * @param {*} limit 分页设置
   * @param {*} relation 条件查询还是模糊查询（'='或者'like'），可以是字符串或者对象
   * @param {*} link 连接字段，目前只能是and
   */
  sqlLink(pool, sql, params, limit = {
    open: false,
    start: 0,
    end: 10
  }, order = {
    direction: 'desc',
    rely: 'gmt_modified'
  }, relation = '=', link = 'and') {
    if (Object.keys(params).length) {
      sql = sql + ' ' + 'where'
      for (const [key, val] of Object.entries(params)) {
        if (val !== null && val !== undefined && val !== 'undefined') {
          if (relation.constructor === Object) {
            if (relation.hasOwnProperty(key)) {
              const toVal = pool.escape(`%${val}%`)
              sql = `${sql} ${key} like ` + toVal + ` ${link}`
            } else {
              const toVal = pool.escape(val)
              sql = `${sql} ${key} = ${toVal} ${link}`
            }
          } else {
            const toVal = pool.escape(val)
            sql = `${sql} ${key} ${relation} ${toVal} ${link}`
          }
        }
      }
      sql = sql.split(' ')
      sql.pop()
      sql = sql.join(' ')
    }
    sql = `${sql} order by ${order.rely} ${order.direction}`
    if (limit.open) {
      sql += ` limit ${limit.start},${limit.end}`
    }
    return sql
  }
  toArray(array, object, number) {
    const result = []
    result.push(Number(number) + 1)
    for (const el of array) {
      for (const [key, value] of Object.entries(object)) {
        if (key === el) {
          result.push(value || null)
        }
      }
    }
    return result
  }
  queryExcel(buffer) {
    const workbook = xlsx.read(buffer)
    const sheetNames = workbook.SheetNames
    const sheet1 = workbook.Sheets[sheetNames[0]]
    const range = xlsx.utils.decode_range(sheet1['!ref'])

    // 总的数据
    const results = []
    // 循环获取单元格值
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      let row_value = ''
      for (let C = range.s.c + 1; C <= range.e.c; ++C) {
        // 获取单元格地址
        const cell_address = {
          c: C,
          r: R
        }
        // 根据单元格地址获取单元格
        const cell = xlsx.utils.encode_cell(cell_address)
        // 获取单元格值
        if (sheet1[cell]) {
          // 如果出现乱码可以使用iconv-lite进行转码
          // row_value += iconv.decode(sheet1[cell].v, 'gbk') + ", ";
          row_value += sheet1[cell].v + ', '
        } else {
          row_value += ', '
        }
      }
      results.push(row_value)
    }
    return results
  }
  imageConfig() {
    const storage = multer.diskStorage({
      // destination：字段设置上传路径，可以为函数
      destination: path.resolve(__dirname, './public/img/use'),

      // filename：设置文件保存的文件名
      filename: function (req, file, cb) {
        const extName = file.originalname.slice(file.originalname.lastIndexOf('.'))
        const fileName = uuid()
        cb(null, fileName + extName)
      }
    })
    // 设置过滤规则（可选）
    const imageFilter = function (req, file, cb) {
      const acceptableMime = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
      // 微信公众号只接收上述四种类型的图片
      if (acceptableMime.indexOf(file.mimetype) !== -1) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    }
    // 设置限制（可选）
    const imageLimit = {
      fieldSize: '20MB'
    }
    // 创建 multer 实例 定义表单字段、数量限制
    const imageUploader = multer({
      storage: storage,
      fileFilter: imageFilter,
      limits: imageLimit
    }).single('avatar')
    return imageUploader
  }
}

module.exports = new Unity()
