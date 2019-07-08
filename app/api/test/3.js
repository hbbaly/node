const Router = require('koa-router')
const router = new Router()

router.post('/v1/test/:id', (ctx, next) => {
  const params = ctx.params
  const headers = ctx.request.header
  const query = ctx.request.query
  const body = ctx.request.body
  ctx.body = {
    name: 'Test'
  }
})
module.exports = router