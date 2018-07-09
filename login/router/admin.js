const express = require('express'),
    router = express.Router(),
    sql = require('../mysql/mysql');
    router.use((req,res,next) => {
        if(req.session.admin){
            next()
        }else{
            res.send('请用管理员账号登陆')
        }
    });
    router.get('/',(req,res)=>{
        res.render('admin/admin')
    })
    router.get('/user',(req,res)=>{
        sql('SELECT * FROM `user`',(err,data)=>{
            res.render('admin/user',{data:data})
        })
    })
    module.exports = router;