const express = require('express'),
    router = express.Router(),
    sql = require('../mysql/mysql');
// router.all();
router.get('/',(req,res) =>{
    sql('CREATE TABLE `blog`.`user` ( `id` INT(11) NOT NULL AUTO_INCREMENT, `username` VARCHAR(64) NOT NULL , `password` VARCHAR(64) NOT NULL ) ENGINE = InnoDB;',(err,data) => {
        res.render('index.ejs')
    });
});
router.get('/regist',(req,res) =>{
    console.log(req.query);
    sql("INSERT INTO `user` (`id`, `username`, `password`) VALUES (0, ?, ?)",[ req.query.username ,req.query.password ],(err,data) => {
        res.render('regist.ejs')
    });
});
router.get('/delete',(req,res) =>{
    console.log(req.query);
    sql("DELETE FROM `user` WHERE `id` = 0",(err,data) => {
        res.render('delete.ejs')
    });
});
router.use('/login',require('./login'))
module.exports = router;