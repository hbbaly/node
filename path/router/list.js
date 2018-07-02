const express = require('express'),
router = express.Router();
router.get('/list',(req,res)=>{
    res.send('list page')
})
module.exports = router