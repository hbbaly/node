const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/classic'
})
const { Flow } = require('../../models/flow.js')
const { Auth } = require('../../../middleware/auth.js')
const { Art } = require('../../models/art')
router.get('/lastest', new Auth().m, async (ctx) => {
  const flow = await Flow.findOne({
    order:[
      ['index','DESC']
    ]
  })
  const art = await Art.getData(flow.type, flow.art_id)
  // 这里需要序列化，否则得不到想要的
  // 着一种方法不推荐art.dataValues.index= flow.index
  art.setDataValue('index', flow.index)
  ctx.body = art
})
module.exports = router