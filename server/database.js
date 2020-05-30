const mysql = require('mysql')
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '5188155iq',
  database: 'assnManagement'
})

// 向外暴露方法
module.exports = pool
