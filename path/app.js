const http = require('http'),
express = require('express'),
app = express();
//设置路径
app.use('/',require('./router/index'))
app.use('/admin',require('./router/admin'))
app.use('/list',require('./router/list'))
app.use('/a+b+/',require('./router/regTest'))
http.createServer(app).listen(200)
