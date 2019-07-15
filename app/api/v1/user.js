const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/user'
})
const {User} = require('../../models/user')
const { RegisterValidator } = require('../../../lib/validator')
router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
  let user = {
    nickName: v.get('body.nickName'),
    email: v.get('body.email'),
    password: v.get('body.password2')
  }
  User.create(user)
})

module.exports = router