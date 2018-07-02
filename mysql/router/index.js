const express = require('express'),
    router = express.Router();
    router.get('/',(req,res)=>{

//传递参数1     //<!--接受参数1 <%= name %>-->
        // res.render('index.ejs',{
        //     name:'hbb',
        //     job:'enginer',
        //     'age':18
        // })
        //传递参数2
        let obj = {
            name:'hbb',
             job:'enginer',
             age:18
        }
        res.render('index.ejs',{data:obj})
    })
    module.exports = router