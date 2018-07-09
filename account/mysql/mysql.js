const mysql = require('mysql')
module.exports = (sql, zhi, callback) => {
    let config = mysql.createConnection({
        host:"localhost",// 数据库的地址
        user:"root",
        password:"",
        port:"3306",// 数据库端口
        database:"blog"// 使用哪个数据库
    });
    config.connect()
    config.query(sql, zhi, (err, data) => {
        callback(err,data)
    })
    config.end()
}