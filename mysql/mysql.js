const mysql = require('mysql');
let config = mysql.createConnection({
    // 数据库的地址
    host:"localhost",
    // 数据库的用户名
    user:'root',
    // 数据库的密码
    password:'',
    // 数据库的端口号
    port:3306,
    //那个数据库
    database:'node'
})
// 开始连接
config.connect()
// 进行数据库操作  1. 数据库代码  2.回调
config.query('SELECT * FROM node',(err,data)=>{
    console.log(err,data)
})
config.end()