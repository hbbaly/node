const Router = require('koa-router')
const router = new Router()
const {PositiveIntegerValidator} = require('../../../lib/validator.js')
router.get('/error/:id',async (ctx, next) => {
    const error = await new PositiveIntegerValidator().validate(ctx)
    console.log(error, '123456')
    ctx.body='validator'
})
module.exports = router