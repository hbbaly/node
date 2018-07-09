const http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');
app.set('views',__dirname+'/views');// 设置模板引擎的目录
app.set('view engine','ejs');// 设置使用的模板引擎是什么
app.use(express.static(__dirname+'/public'));// 设置静态资源目录 js img  css
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true } ));
app.use(cookieParser('asdfasdfasdf'));// 密钥
app.use((req,res,next)=>{
    if(req.cookies['login']){
        res.locals.login = req.cookies.login.name;
    }
    // 继续往下执行
    next()
});
app.use('/',require('./router/index'));
http.createServer(app).listen(200);