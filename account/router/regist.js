const express = require('express'),
router = express.Router(),
sql = require('../mysql/mysql'),
crypto = require('crypto');
router.get('/',(req,res)=>{
    res.render('regist')
})
router.post('/',(req,res)=>{
    sql('SELECT * FROM user WHERE username = ?',[req.body.username],(err,data)=>{
        console.log(data)
        if(err) {
            if(err){
                res.render('err.ejs',{data:'错误'});
                return
            }
        } 
        if(data.length===0){
            let password = crypto.createHash('md5').update(req.body.password).digest('hex')
            sql('INSERT INTO user (id, username, pass) VALUES (0, ?, ?)',[req.body.username,password],(err,data)=>{
                if(err) res.render('err',{data:'注册失败'})
                res.locals.result = '<h1>成功</h1><a style="margin:10px;" href="/">首页</a><a href="/login">前往登陆</a>'
                res.render('regist')
            })
        }else if(data.length>0){
            res.render('err',{data:'已存在该用户'})
        }
    })
    
})
module.exports = router