const express = require('express'),
router = express.Router(),
sql = require('../mysql/mysql');
router.get('/',(req,res)=>{
    res.render('index')
})
router.use('/regist',require('./regist'))
router.use('/login',require('./login'))
router.use('/err',require('./err'))
module.exports = router