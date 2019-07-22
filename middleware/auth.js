const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const config = require('../config/index')
const { Forbbiden } = require('../core/http-execption')
class Auth {
  constructor (level) {
    this.level = level
    Auth.USER = 8
    Auth.ADMIN = 16
    Auth.SUPER_ADMIN = 32
  }
  get m () {
    return async (ctx, next) => {
      const userToken = basicAuth(ctx.req)
      let errMsg = 'token不合法'
      let decode
      // 验证token
      if (!userToken || !userToken.name) {
        throw new Forbbiden(errMsg)
      }
      try {
        decode = jwt.verify(userToken.name, config.secret.secretKey)
      } catch (error) {
        // token过期
        if (error.ame === 'TokenExpiredError') errMsg = 'token已过期'
        //token不合法
        throw new Forbbiden(errMsg)
      }
      if (Auth.USER < this.level) throw new Forbbiden('权限不足')
      ctx.auth = {
        uid:decode.uid,
        scope:decode.scope
      }
      
      await next()
    }
  }
}
module.exports = {
  Auth
}