const Router = require('koa-router')
const router = new Router()

router.get('/error', (ctx, next) => {
    const error = new Error('错误')
    error.errorCode = 10001
    error.status = 400
    error.requestUrl = ctx.method + ctx.path
    throw error
})
module.exports = router