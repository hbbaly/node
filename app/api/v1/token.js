const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/token'
})
const {User} = require('../../models/user')
const {success} = require('../../../lib/helper.js')
const { TokenValidator } = require('../../../lib/validator')
const {LoginType} = require('../../../lib/enum.js')
const { generateToken } = require('../../../core/utils.js')
const { Auth } = require('../../../middleware/auth.js')
const { WxManager } = require('../../servers/wx.js')
router.post('/', async (ctx, next) => {
  const v = await new TokenValidator().validate(ctx)
  let token
  switch (v.get('body.type')) {
      case LoginType.USER_EMAIL:
        token = await emailLogin(v.get('body.account'),v.get('body.secret'))
        break;
      case LoginType.USER_MINI_PROGRAM:

        token = await WxManager.codeToToken(v.get('body.account'))
        break;
    default:
      break;
  }
  ctx.body = {
      token
  }
  // success()
})
async function emailLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret)
    return generateToken(user.id, Auth.USER)
}
module.exports = router