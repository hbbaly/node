const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/like'
})
const {success} = require('../../../lib/helper.js')
const { Auth } = require('../../../middleware/auth.js')
const { LikeValidator } = require('../../../lib/validator')
const { Favor }  = require('../../models/favor')
router.post('/',new Auth().m, async (ctx, next) => {
  const v = await new LikeValidator().validate(ctx, {
    id: 'art_id'
  })
  await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
  success()
})
router.post('/cancel',new Auth().m, async (ctx, next) => {
  const v = await new LikeValidator().validate(ctx, {
    id: 'art_id'
  })
  await Favor.disLike(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
  success()
})

module.exports = router