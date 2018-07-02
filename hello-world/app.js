const http = require('http'),
express = require('express'),
app = express();
app.get('/',(req,res)=>{
    res.send('hello world')
})
http.createServer(app).listen(200)
