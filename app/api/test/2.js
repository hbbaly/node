const Router = require('koa-router')
const router = new Router()

router.get('/test', (ctx, next) => {
  console.log('hbb')
  ctx.body = {
    name: 'Test'
  }
})
module.exports = router