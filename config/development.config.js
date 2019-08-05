module.exports = {
  HOST: 'localhost:3000/dev',
  API_SERVER: 'localhost:3000/dev',
  API_SSO: 'localhost:3000/dev',
  IMG_SERVER: 'localhost:3000/dev',
  DATABASE:{
    dbName:'test',
    host:'localhost',
    port:3306,
    user:'root',
    password:'123456789',
  },
  secret: {
    secretKey:"abcdefg",
    expiresIn:60*60*24*30
  },
  wx: {
    appId: 'wx939c79c923f4f808',
    appSecret: '7b89bfa83091d4bcf9b8572a0de32824',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  yushu:{
    detailUrl:'http://t.yushu.im/v2/book/id/%s',
    keywordUrl:'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
  }
}