const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/classic'
})
const { Flow } = require('@models/flow.js')
const { Auth } = require('@middle/auth.js')
const { Art } = require('@models/art')
const { Favor } = require('@models/favor')
const { PositiveIntegerValidator, LikeFavorType } = require('@lib/validator')
router.get('/lastest', new Auth().m, async (ctx) => {
  const flow = await Flow.findOne({
    order:[
      ['index','DESC']
    ]
  })
  const art = await new Art(flow.type, flow.art_id).getData(true)
  const likeBool = await Favor.likeIt(flow.art_id, flow.type, ctx.auth.uid)
  // 这里需要序列化，否则得不到想要的
  // 着一种方法不推荐art.dataValues.index= flow.index
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeBool)

  ctx.body = art
})
router.get('/:index/next', new Auth().m, async (ctx) => {
  // 校验参数 id是否为正整数
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where:{
      index: index + 1
    }
  })
  const art = await new Art(flow.type, flow.art_id).getData(true)
  const likeBool = await Favor.likeIt(flow.art_id, flow.type, ctx.auth.uid)
  // 这里需要序列化，否则得不到想要的
  // 着一种方法不推荐art.dataValues.index= flow.index
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeBool)

  ctx.body = art
})
router.get('/:index/prev', new Auth().m, async (ctx) => {
  // 校验参数 id是否为正整数
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where:{
      index: index - 1
    }
  })
  const art = await new Art(flow.type, flow.art_id).getData(true)
  const likeBool = await Favor.likeIt(flow.art_id, flow.type, ctx.auth.uid)
  // 这里需要序列化，否则得不到想要的
  // 着一种方法不推荐art.dataValues.index= flow.index
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeBool)

  ctx.body = art
})
// 点赞情况
router.get('/:type/:id/favor', new Auth().m, async (ctx) => {
  // 校验参数 id是否为正整数
  const v = await new LikeFavorType().validate(ctx)
  const id = v.get('path.id'), type = parseInt(v.get('path.type'))
  const art = await new Art(type, id).getData(true)
  const likeBool = await Favor.likeIt(id, type, ctx.auth.uid)
  // 这里需要序列化，否则得不到想要的
  // 着一种方法不推荐art.dataValues.index= flow.index

  ctx.body = {
    fav_nums: art.fav_nums,
    like_status: likeBool
  }
})

router.get('/favor', new Auth().m, async ctx => {

  ctx.body = await Favor.getMyClassicFavor(ctx.auth.uid)
})
router.get('/:type/:id', new Auth().m, async ctx => {
  // 校验参数 id是否为正整数
  const v = await new LikeFavorType().validate(ctx)
  const id = v.get('path.id'), type = parseInt(v.get('path.type'))
  const art = await new Art(type, id).getDetail(true)
  const likeBool = await Favor.likeIt(id, type, ctx.auth.uid)
  // 这里需要序列化，否则得不到想要的
  // 着一种方法不推荐art.dataValues.index= flow.index
  art.setDataValue('like_status', likeBool)

  ctx.body = {
    art: art
  }
})
module.exports = router