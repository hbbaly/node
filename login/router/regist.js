const express = require('express'),
    router = express.Router(),
    sql = require('../mysql/mysql');
// router.all();
router.get('/',(req,res) =>{
    res.render('login.ejs')
});
router.post('/',(req,res)=>{
    console.log(req.body)
    sql('SELECT * FROM user where username = ?',[req.body.username],(err,data)=>{
        console.log(data)
        if(data.length===0){
            sql('INSERT INTO user (id,username,password) VALUES (0,?,?)',[req.body.username,req.body.password],(err,data) => {
                if(err){
                    res.render('err.ejs')
                }
                res.locals.result = "<h1>成功</h1>"
                res.render('login.ejs')
            })
        }else{
            res.render('err.ejs');
        }
    })
})
module.exports = router;