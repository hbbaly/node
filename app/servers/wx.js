const axios = require('axios')
const util = require('util')
const config = require('../../config/index')
const { Auth } = require('../../middleware/auth')
const { User } = require('../models/user')
const { generateToken } = require('../../core/utils')
const { AuthFailed } = require('../../core/http-execption')
class WxManager {
  static async codeToToken (code) {
    // 处理loginUrl
    const url = util.format(config.wx.loginUrl, config.wx.appId, config.wx.appSecret, code)
    // 请求微信服务器接口获取openid
    const result = await axios.get(url)
    if (result.status !== 200) {
      throw new AuthFailed('openid获取失败')
    }
    const errCode = result.data.errcode,
          errMsg = result.data.errmsg;
    if (errCode){
      throw new AuthFailed('openid获取失败:'+errMsg)
    }
    const openId = result.data.openid
    const user = null
    user = User.getUserByOpenId(openId)
    if (!user) user = User.createUserByOpenid(openId)
    const token = await generateToken(user.id, Auth.USER)
    return token
  }
}
module.exports = {
  WxManager
}