const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/classic'
})
const { Auth } = require('../../../middleware/auth.js')
router.get('/lastest', new Auth().m, async (ctx) => {
  ctx.body = {

  }
})
module.exports = router