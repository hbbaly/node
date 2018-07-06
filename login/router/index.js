const express = require('express'),
    router = express.Router(),
    sql = require('../mysql/mysql');
// router.all();
router.get('/',(req,res) =>{
    sql('CREATE TABLE `blog`.`user` ( `id` INT(11) NOT NULL AUTO_INCREMENT, `username` VARCHAR(64) NOT NULL , `password` VARCHAR(64) NOT NULL ) ENGINE = InnoDB;',(err,data) => {
        res.render('index.ejs')
    });
});
router.get('/delete',(req,res) =>{
    sql("DELETE FROM `user` WHERE `id` = 0",(err,data) => {
        res.render('delete.ejs')
    });
});
router.get('/logout',(req,res) =>{
    res.clearCookie('login')
    res.redirect('/')
});
router.use('/regist',require('./regist'))
router.use('/login',require('./login'))

module.exports = router;