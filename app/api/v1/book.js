const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/book'
})
const { Auth } = require('@middle/auth.js')
const { Book } = require('@models/book.js')
const { PositiveIntegerValidator, SearchValidator } = require('@lib/validator')
router.get('/hot',async ctx => {
  const list = await HotBook.getHotAll()
  ctx.body = list
})
router.get('/:id/detail', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = await new Book(v.get('path.id')).detail()
  ctx.body = book
})
router.get('/search', async ctx => {
  const v = await new SearchValidator().validate(ctx)
    const result = await Book.searchBook(
        v.get('query.q'), v.get('query.start'), v.get('query.count'))
    ctx.body = result
})
router.get('/favor/count', new Auth().m, async ctx => {
  const count = await Book.getFavorCount(ctx.auth.uid)
  ctx.body = {count}
})
module.exports = router