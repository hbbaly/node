const Koa = require('koa')
const app = new Koa()
const parser = require('koa-bodyparser')
const InitManger = require('./core/init')

const catchError = require('./middleware/execption')
require('./app/models/user')
app.use(catchError)

InitManger.initCore(app)
app.use(parser())
app.listen(3000)