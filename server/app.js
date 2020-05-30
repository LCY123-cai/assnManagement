const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const user = require('./api/user')
const assn = require('./api/assn')
const assnDepartment = require('./api/assnDepartment')
const assnMember = require('./api/assnMember')
const assnApplication = require('./api/assnApplication')
const assnRecord = require('./api/assnRecord')
const assnArticle = require('./api/assnArticle')
const app = express()

// 开放public文件夹
app.use('/public/', express.static(path.join(__dirname, './public/')))
// post请求设置
app.use(bodyParser.urlencoded({ extended: false, limit: '1024kb' }))
app.use(bodyParser.json({ limit: '1024kb' }))
// 把路由挂载到 app 中
app.use(user)
app.use(assn)
app.use(assnDepartment)
app.use(assnMember)
app.use(assnApplication)
app.use(assnRecord)
app.use(assnArticle)

// 开启服务
app.listen(8085, function () {
  console.log('服务已启动，端口为8085')
})
