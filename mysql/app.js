const http = require('http'),
express = require('express'),
bodyParser = require('body-parser'),
app = express();
//设置末班引擎目录
app.set('views',__dirname+"/views")
//设置末班引擎
app.set('view engine','ejs')
app.use(bodyParser.json())     // 用来接收post数据
app.use(bodyParser.urlencoded({extended:true}))  // extended:true 可以接收任何数据类型的数据
app.use('/',require('./router/index'));
http.createServer(app).listen(200)
