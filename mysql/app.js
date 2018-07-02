const http = require('http'),
express = require('express'),
app = express();
//设置末班引擎目录
app.set('views',__dirname+"/views")
//设置末班引擎
app.set('view engine','ejs')
app.use('/',require('./router/index'));
http.createServer(app).listen(200)
