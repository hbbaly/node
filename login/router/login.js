const express = require('express'),
    router = express.Router(),
    crypto = require('crypto'),
    sql = require('../mysql/mysql');
router.get('/',(req,res) =>{
    res.render('login.ejs')
});
router.post('/',(req,res)=>{
    console.log(req.body)
    md5 = crypto.createHash('md5')
    sql('SELECT * FROM user where username = ?',[req.body.username],(err,data)=>{
        if(data.length == 0){
            res.send('用户名不存在');
            return
        }
        let password = md5.update(req.body.password).digest('hex')  //md5加密
        console.log(password)
        if(data[0]['password'] == req.body.password){
            // 登陆成功
            // 1. cookie的名称  2.数据  3.过期时间
            res.cookie('login',{ name:req.body.username } ,{ maxAge: 1000*60*60*24 } );
            res.json({
                result:'成功'
            });
        }else{
            // 登陆失败
            res.send('错误')
        }
    })
})
module.exports = router;