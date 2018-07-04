const mysql = require('mysql');

module.exports = function (sql,zhi,callback){
    let config = mysql.createConnection({
        host:"localhost",// 数据库的地址
        user:"root",
        password:"",
        port:"3306",// 数据库端口
        database:"blog"// 使用哪个数据库
    });
    config.connect();// 开始连接
    // 进行数据库操作  1. 数据库代码  2.回调
    // 插入的格式1.数据库代码 2.动态的值 3.回调
    config.query(sql,zhi,(err,data) => {
        callback(err,data);
    });
    config.end();// 结束连接
};