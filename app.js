require('module-alias/register')
const Koa = require('koa')
const parser = require('koa-bodyparser')
const app = new Koa()

const InitManger = require('./core/init')

const catchError = require('./middleware/execption')
// require('./app/models/user')
app.use(parser())

app.use(catchError)

InitManger.initCore(app)
app.listen(3000)