const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/book'
})
// const { Auth } = require('@middle/auth.js')
const { Book } = require('@models/book.js')
const { PositiveIntegerValidator } = require('@lib/validator')
router.get('/hot',async ctx => {
  const list = await HotBook.getHotAll()
  ctx.body = list
})
router.get('/:id/detail', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = await new Book(v.get('path.id')).detail()
  ctx.body = book
})
module.exports = router