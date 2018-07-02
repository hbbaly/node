const express = require('express'),
router = express.Router();
router.get('/',(req,res)=>{
    res.send('index page')
})
module.exports = router