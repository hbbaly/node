const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/user'
})
const { RegisterValidator } = require('../../../lib/validator')
router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
})
module.exports = router