const express = require('express'),
router = express.Router();
router.get('/',(req,res)=>{
    res.send('正则验证 page')
})
module.exports = router