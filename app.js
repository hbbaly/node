const Koa = require('koa')
const app = new Koa()

const InitManger = require('./core/init')
InitManger.initCore(app)

app.listen(3000)