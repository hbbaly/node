const Router = require('koa-router')
const router = new Router()
const {PositiveIntegerValidator} = require('../../../lib/validator.js')
const config = require('../../../config/index')
router.get('/error/:id',async (ctx, next) => {
  console.log(config)
  const path = ctx.params, 
        query = ctx.request.query, 
        header = ctx.request.header, 
        body = ctx.request.body
    const error = await new PositiveIntegerValidator().validate(ctx)
    // 。get(path， parsed)  // 获取参数，path参数路径，parsed是否进行类型转换
    const id = error.get('path.id')
    console.log(id,'di')
    ctx.body='validator'
})
module.exports = router