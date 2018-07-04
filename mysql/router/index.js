const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');

    router.get('/', (req, res)=>{
        sql('SELECT * FROM `node`', (err, data) => {
            res.render('index.ejs', { data : data  } )
        })
    })
    router.get('/change', (req, res)=>{
        sql("INSERT INTO `node` (`id`, `userName`, `password`) VALUES ('1', 'hbb', '123')", (err, data) => {
            res.render('post.ejs')
        })
    })
    router.get('/reg', (req, res)=>{
        // get方式提交的内容
        console.log(req.query);
        // ? 动态数据   1.数据库代码 2.动态的值[  ]
        sql('INSERT INTO `node` (`id`, `userName`, `password`) VALUES (0,?,?)',[ req.query.userName ,req.query.password ],(err,data) => {
            res.json({
                chenggong:"成功"
            })
        });
    })
    router.get('/ajax', (req, res)=>{
        //res.render('ajax.ejs')
        // get方式提交的内容
        console.log(req.query);
        // ? 动态数据   1.数据库代码 2.动态的值[  ]
        sql('INSERT INTO `node` (`id`, `userName`, `password`) VALUES (0,?,?)',[ req.query.userName ,req.query.password ],(err,data) => {
            res.json({
                chenggong:"成功"
            })
        });
    })
    router.post('/reg', (req, res)=>{
        // get方式提交的内容
        console.log(req.body);
        // ? 动态数据   1.数据库代码 2.动态的值[  ]
        sql('INSERT INTO `node` (`id`, `userName`, `password`) VALUES (?,?,?)',[ req.body.userName ,req.body.password ],(err,data) => {
            res.json({
                chenggong:"post成功"
            })
        });
    })
    module.exports = router