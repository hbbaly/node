const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/user'
})
const {User} = require('../../models/user')
const {success} = require('../../../lib/helper.js')
const { RegisterValidator } = require('../../../lib/validator')
router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
  // 生成密码话费成本，越大耗费性能越高
  let user = {
    nickName: v.get('body.nickName'),
    email: v.get('body.email'),
    password: v.get('body.password2')
  }
  User.create(user)
  success()
})

module.exports = router