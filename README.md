# Node开发服务端

## koa相关知识

[koa-learn](https://github.com/hbbaly/koa2-learn)

[koa基本知识](https://hbbaly.github.io/nodeJs/koa2.html)

主要讲解`koa`基本知识

```js
const Koa = require('koa')
// 倒入语法
// commonJs require
// ES6 import from
// AMD 

const app = new Koa()

// 中间件
function test () {
  console.log('hello island')
}
// 使用中间件 use    
// app.use(test)
// 也可以这样使用

// koa洋葱模式，  先进后出
// 中间件调用，返回强制Promise

// **洋葱模型 先决条件： 使用async await， 比如 next前面使用await 保证洋葱模型**
app.use(async (ctx, next) => {
  console.log('hello 1')
  await next()
  console.log('hello 2')
})
app.use(async (ctx, next) => {
  console.log('hello 3')
  await next()
  console.log('hello 4')
})

app.listen(3000)
```

## 路由系统

1. 使用`koa-router`

```js
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

router.get('/', async(ctx, next) => {
  ctx.body = 'hbbaly'
})
app.use(router.routes())
app.listen(3000)
```

## 多路由拆分

新建`api`文件夹，在其内建`test`文件夹及`1.js， 2.js`
```js
// 1.js
const Router = require('koa-router')
const router = new Router()

router.get('/', (ctx, next) => {
  ctx.body = {
    name: 'Index'
  }
})
module.exports = router
```

```js
// 2.js
const Router = require('koa-router')
const router = new Router()

router.get('/test', (ctx, next) => {
  ctx.body = {
    name: 'Test'
  }
})
module.exports = router
```
```js
// app.js
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const Index = require('./api/test/1')
const Test = require('./api/test/2')
app.use(Index.routes())
app.use(Test.routes())
app.listen(3000)
```

## 自动重启

```js
npm i -g nodemon
```

```js
// package.json
"scripts": {
  //......
  "dev": "nodemon app.js"
  }
```

```js
npm run dev
```

## nodemon与断点调试结合

![case](./readme/1.png 'case')
跟着步骤进行`vscode`调试配置

## 路由自动注册

```js
npm i -D require-directory
```

```js
// app.js
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()

const requireDirectory = require('require-directory')
function loadRouter (obj) {
  if (obj instanceof Router) app.use(obj.routes())
}
requireDirectory(module, './api',{visit: loadRouter})

app.listen(3000)
```
## 整理app里面的内容

```js
// core/init
const Router = require('koa-router')
const requireDirectory = require('require-directory')
// 配置绝对路径 ， 
const configPath = `${process.cwd()}/app/api`
class InitManger {
  static initCore (app) {
    InitManger.app = app
    InitManger.initLoadRouter()
  }
  static initLoadRouter () {
    function loadRouter (obj) {
      if (obj instanceof Router) InitManger.app.use(obj.routes())
    }
    requireDirectory(module, configPath, {visit: loadRouter})
  }
}
module.exports = InitManger
```

```js
// app.js
const Koa = require('koa')
const app = new Koa()

const InitManger = require('./core/init')
InitManger.initCore(app)

app.listen(3000)
```

## 获取参数方式

```js
const Router = require('koa-router')
const router = new Router()

router.post('/v1/test/:id', (ctx, next) => {
  const params = ctx.params  // 1
  const headers = ctx.request.header // 2
  const query = ctx.request.query // 3
  const body = ctx.request.body // 4
  ctx.body = {
    name: 'Test'
  }
})
module.exports = router
```
## 全局异常处理

为了预防错误, 使用 `try catch` 但是`try catch`不能捕获异步异常
下面代码没有捕获`throw`抛出异常
```js
const test1 = () => {
  try{
    test3()
  } catch(error) {
    console.log('error')
  }
}
const test3 = () => {
  setTimeout(() => {
    throw new Error('error') // pass
  },1000)
}
test1()
```

使用`async await`与`promise`捕获异步异常
如果返回的是`Promise`,可以使用`async await`
```js
const test2 = async () => {
  try{
    await test4()
  } catch(error) {
    console.log('error') // error
  }
}
const test4 = () => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('error'))
    }, 1000)
  })
  return promise
}
```
## 编写捕获异常中间件
`middleware/execption.js`
```js
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    throw Error('服务器异常')
  }
}
module.exports = catchError
```

`app.js`使用中间价

```js
const catchError = require('./middleware/execption')
app.use(catchError)
```
## 整理错误信息

自定义报错信息
`app/api/test/5.js`

```js
const Router = require('koa-router')
const router = new Router()

router.get('/error', (ctx, next) => {
    const error = new Error('错误')
    error.errorCode = 10001
    error.status = 400
    error.requestUrl = ctx.method + ctx.path
    throw error
})
module.exports = router
```
`middleware/execption.js`中间件

```js
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 自定义异常错误信息包括：
    // {
    //   error_code: // 错误对应状态码
    //   error_status: // http状态码
    //   request-url: // 请求url
    //   error_message: // 请求错误信息
    // }
    console.log(error, 'error')
    if (error.errorCode){
      ctx.body = {
        code: error.errorCode,
        msg: error.message,
        request: error.requestUrl
      }
      ctx.status = error.status
    }
  }
}
module.exports = catchError
```
这种方式我们每一次都要`new error`，还要手动去添加`msg，code url`参数，使用面向对象来写

`core/http-execption.js`
```js

class HttpExecption extends Error{
  constructor (msg="服务器异常", code=10001, status=500){
    super()
    this.message = msg
    this.errorCode = code
    this.status = status
  }
}
class ParamsError extends HttpExecption{
  constructor (msg="参数异常", code=10002, status=412){
    super()
    this.message = msg
    this.errorCode = code
    this.status = status
  }
}
class AuthError extends HttpExecption{
  constructor (msg="拒绝访问", code=10003, status = 401){
    super()
    this.message = msg
    this.errorCode = code
    this.status = status
  }
}
module.exports = {
  HttpExecption,
  ParamsError,
  AuthError
}
```
定义了三个类,去使用

`app/api/test/5.js`
```js
const Router = require('koa-router')
const router = new Router()
const { HttpExecption } = require('../../../core/http-execption')
router.get('/error', (ctx, next) => {
    const error = new HttpExecption()
    // error.errorCode = 10001
    // error.status = 400
    error.requestUrl = ctx.method +' '+ ctx.path
    throw error
})
module.exports = router
```

## validator校验参数
添加[core/validator.js](./core/validator.js),`[core/validator.js](./core/http-execption.js),[core/validator.js](./core/utils.js)这三个js

`lib/validator.js`
```js
const {LinValidator, Rule} = require('../core/validator.js')
class PositiveIntegerValidator extends LinValidator {
  constructor() {
      super()
      this.id = [
          new Rule('isInt', '需要是正整数', {
              min: 1
          }),
      ]
  }
}
module.exports = {
  PositiveIntegerValidator
}
```

判断一个参数是不是正整数

`app/api/test/6.js`[代码](./app/api/test/6.js)

```js
const Router = require('koa-router')
const router = new Router()
const {PositiveIntegerValidator} = require('../../../lib/validator.js')
router.get('/error/:id',async (ctx, next) => {
  const path = ctx.params, 
        query = ctx.request.query, 
        header = ctx.request.header, 
        body = ctx.request.body
    const error = await new PositiveIntegerValidator().validate(ctx)
    // 。get(path， parsed)  // 获取参数，path参数路径，parsed是否进行类型转换
    const id = error.get('path.id')
    console.log(id,'di')
    ctx.body='validator'
})
module.exports = router
```
上例既判断了`id`是不是正整数，不是抛出错误，也有获取参数的方法`get`

## 配置环境变量

安装`cross-env`

```js
npm i -D cross-env
```

修改`package.json`

```js
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=development  nodemon app.js"
  },
```

新建`config`文件夹，其内有[default.config](./config/default.config.js),[development.config](./config/development.config.js),[production.config](./config/production.config.js),[index](./config/index.js)

这三个文件

`default.config.js`
```js
// 通用配置
module.exports = {
  name: 'node-case',
  version: '1.0.0'
}
```
`development.config.js`

```js
// 开发环境配置
module.exports = {
  HOST: 'localhost:3000/dev',
  API_SERVER: 'localhost:3000/dev',
  API_SSO: 'localhost:3000/dev',
  IMG_SERVER: 'localhost:3000/dev'
}
```

`production.config.js`

```js
module.exports = {
  HOST: 'localhost:3000/prod',
  API_SERVER: 'localhost:3000/prod',
  API_SSO: 'localhost:3000/prod',
  IMG_SERVER: 'localhost:3000/prod'
}
```

`index.js`

```js
// 判断环境
const commonConfig  = require( './default.config')
const developmentConfig  = require( './development.config')
const productionConfig  = require( './production.config')

function buildConfig (type) {
  let envConfig = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig
  return Object.assign(commonConfig, envConfig)
}
module.exports = buildConfig()

```
`7.js`[代码](./app/api/test/7.js)

```js
const config = require('../../../config/index')
console.log(config)
// { name: 'node-case',
//   version: '1.0.0',
//   HOST: 'localhost:3000/dev',
//   API_SERVER: 'localhost:3000/dev',
//   API_SSO: 'localhost:3000/dev',
//   IMG_SERVER: 'localhost:3000/dev' }
```

## Navicat管理MySql

安装`sequelize, mysql2`

```js
npm i -D sequelize mysql2
```

配置数据库参数

`config/development.config.js`

```js
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
}
```

使用`sequelize`连接数据库， 并配置数据库的参数

`core/db.js`

```js
const Sequelize = require('sequelize')

const { dbName, user, password, port, host} = require('../config/index').DATABASE

const sequelize = new Sequelize(dbName, user, password,{
  dialect:'mysql',
  host,
  port,
  logging:true,
  define: {
    // 显示 create_time, update_time, 
    timestamps: true,
    // delete_time
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true   // 吧所有驼峰转化为下划线
  }
})
// force 千万不要设置为true， 他会先删除表，在创建表，原来表里面的内容就会丢失
sequelize.sync({force: false})

module.exports = {
  sequelize
}
```

`models/user.js`

```js
const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')

class User extends Model {

}
// 初始化用户属性
User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }, 
  nickName: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  openId: {
    type: Sequelize.STRING(64), // 最长64
    unique: true
  }
},{
  sequelize,
  tableName: 'user'
})
```

在电脑上打开`xampp`及`navicate`查看数据库

## 注册参数校验

`app/api/v1/user.js`

```js
const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/user'
})
const { RegisterValidator } = require('../../../lib/validator')
router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
})
module.exports = router
```

`lib/validator.js`

```js
.../////
class RegisterValidator extends LinValidator {
  constructor () {
    super()
    this.email = [
      new  Rule('isEmail', '邮箱不符合规范')
    ]
    this.nickName = [
      new Rule('isLength', '昵称不符合规范', {
        min: 2,
        max: 20
      })
    ]
    this.password = [
      new Rule('isLength', '密码长度不符合规范', {
        min: 8,
        max: 20
      }),
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ]
    this.password2 = this.password
  }
  validatePassword (vals) {
    const { password, password2 } = vals.body
    if (password !== password2) throw new Error('密码不一致')
  }
}
module.exports = {
  ...////
  RegisterValidator
}
```

使用`postman`进行模拟即可

## 密码加密
使用`bcryptjs`对密码进行加密

```js
npm i -D bcryptjs
```

`models/user.js`
```js
const Router = require('koa-router')
const bcrypt = require('bcryptjs')
const router = new Router({
  prefix: '/v1/user'
})
const {User} = require('../../models/user')
const { RegisterValidator } = require('../../../lib/validator')
router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
  const salt = bcrypt.genSaltSync(10)
  const pwd = bcrypt.hashSync(v.get('body.password2'), salt)
  // 生成密码话费成本，越大耗费性能越高
  let user = {
    nickName: v.get('body.nickName'),
    email: v.get('body.email'),
    password: pwd
  }
  User.create(user)
})

module.exports = router
```

## 使用set对models的属性进行改变
去掉`models/user.js`里面对密码的加密，使用`set`
```js
const bcrypt = require('bcryptjs')
......

password: {
    type:Sequelize.STRING,
    set (val) {
      const salt = bcrypt.genSaltSync(10)
      const pwd = bcrypt.hashSync(val, salt)
      this.setDataValue(pwd)
    }
  },
```

## 请求成功处理

`core/http-execption.js`

```js
...
class Success extends HttpExecption{
  constructor(msg, errorCode){
      super()
      this.code = 201
      this.msg = msg || 'ok'
      this.errorCode = errorCode || 0
  }
}
module.exports = {
  ...
  Success
}
```

`lib/helper.js`

```js
const { Success } = require('../core/http-execption')
function success(msg,errorCode){
  throw new Success(msg, errorCode)
}

module.exports = {
  success
}
```

`v1/user.js`

```js
...
let user = {
    nickName: v.get('body.nickName'),
    email: v.get('body.email'),
    password: v.get('body.password2')
  }
  User.create(user)
  success()
```

## 登陆处理

### 密码处理

登陆方式多元化导致密码**不是必须参数**，我们可以设定登陆方式`type`来判断
密码是否为必传参数

`lib/enum.js`

```js
const LoginType = {
  USER_MINI_PROGRAM:100,
  USER_EMAIL:101,
  USER_MOBILE:102,
  ADMIN_EMAIL:200,
  isThisType
}
function isThisType(object, val){
  return Object.values(object).includes(val)
}
module.exports = {
  LoginType
}
```
判断登陆方式

```js
class TokenValidator extends LinValidator {
  constructor () {
    super()
    this.account = [
      new Rule('isLength','不符合账号规则', {
        min: 4,
        max: 32
      })]
    this.secret = [
      new Rule('isOptional'),
      new Rule('isLength', '至少6个字符', {
        min: 6,
        max: 128
    })
    ]
  }
  // 自定义判断登陆方式，校验是否合法
  validateLoginType (vals) {
    if (!vals.body.type) throw new Error('缺少type')
    if (!LoginType.isThisType(LoginType, vals.body.type)) throw new Error('type不合法')
  }
}
```

### 验证密码

`models/user.js`

```js
class User extends Model {
  // 在User里面添加静态方法， 判断账号存在及密码是不是一致
  static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new AuthFailed('账号不存在')
        }
        // user.password === plainPassword
        const correct = bcrypt.compareSync(plainPassword, user.password)

        if(!correct){
            throw new AuthFailed('密码不正确')
        }
        return user
    }
}
```

### 验证邮箱登陆时情景

`app/api/v1/token.js`
```js
const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/token'
})
const {User} = require('../../models/user')
const {success} = require('../../../lib/helper.js')
const { TokenValidator } = require('../../../lib/validator')
const {LoginType} = require('../../../lib/enum.js')
router.post('/', async (ctx, next) => {
  // 参数校验
  const v = await new TokenValidator().validate(ctx)
  // 获取token
  let token
  switch (v.get('body.type')) {
      case LoginType.USER_EMAIL:
        token = await emailLogin(v.get('body.account'),v.get('body.secret'))
        break;
      case LoginType.USER_MOBILE:
      break;
    default:
      break;
  }
  ctx.body = {
      token
  }
  success()
})
// 判断密码
async function emailLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret)
}
module.exports = router
```

## jsonwebtoken

安装`jsonwebtoken`

```js
npm i -D jsonwebtoken
```
`core/utils.js`

```js
const jwt = require('jsonwebtoken')
const config  = require('../config/index')
const generateToken = function(uid, scope){
    const secretKey = config.secret.secretKey
    const expiresIn = config.secret.expiresIn
    // 使用jsonwebtoken生成token
    const token = jwt.sign({
        uid,
        scope
    },secretKey,{
        expiresIn
    })
    return token
}
module.exports = {
  generateToken,
}
```

## HttpBasicAuth传递令牌及token验证，权限的设定

安装`basic-auth`

```js
npm i -D basic-auth
```

编写 `Forbbiden`报错类
`core/http-execption.js`
```js
class Forbbiden extends HttpExecption {
  constructor(msg, errorCode) {
    super()
    this.message = msg || '禁止访问'
    this.errorCode = errorCode || 10006
    this.status = 403
  }
}
```

`middleware/auth.js`编写中间件

```js
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const config = require('../config/index')
const { Forbbiden } = require('../core/http-execption')
class Auth {
  constructor (level) {
    this.level = level // 传入的权限值
    Auth.USER = 8  // 8 代表普通用户
    Auth.ADMIN = 16 // 管理员
    Auth.SUPER_ADMIN = 32 // 超级管理员
  }
  get m () {
    return async (ctx, next) => {
      // 获取token
      const userToken = basicAuth(ctx.req) 
      let errMsg = 'token不合法'
      let decode
      // 验证token
      if (!userToken || !userToken.name) {
        throw new Forbbiden(errMsg)
      }
      try {
        // 获取生成token的参数
        decode = jwt.verify(userToken.name, config.secret.secretKey)
      } catch (error) {
        // token过期
        if (error.ame === 'TokenExpiredError') errMsg = 'token已过期'
        //token不合法
        throw new Forbbiden(errMsg)
      }
      // 判断是不是满足普通用户权限
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
```

## 微信用户通过openid登陆

参考资料： [auth.code2Session](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html)

需要在微信环境模拟，并且微信`js_code`需提前获取到

配置wx全局所用到的变量

`config/development.config.js`

```js
wx: {
  appId: 'wx939c79c923f4f808',
  appSecret: '7b89bfa83091d4bcf9b8572a0de32824',
  loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
}
```
`models/user.js`添加相应的处理方法

```js
class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
    // 检查数据库里面有没有已经存在用户
    static async getUserByOpenId (openid) {
      const user = await User.findOne({
        where: {
          openid
        }
      })
      return user
    }
    static async createUserByOpenid (openid) {
      return await User.create({
        openid
      })
    }
}
```
`servers/wx.js`

```js
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
    // 处理获取的结果
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
    // 检测存不存在用户
    user = User.getUserByOpenId(openId)
    if (!user) user = User.createUserByOpenid(openId)
    // 生成token
    const token = await generateToken(user.id, Auth.USER)
    return token
  }
}
module.exports = {
  WxManager
}
```

`v1/token.js`

```js
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
```
添加对应的微信用户登陆的判断处理

## movie， music， sentence模型定义

`models/classic.js`

```js
const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')

const classicFileds  = {
  image: {
      type:Sequelize.STRING,
  },
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  fav_nums: {
      type:Sequelize.INTEGER,
      defaultValue:0
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT,
}

class Movie extends Model {

}
Movie.init(classicFileds,{
  sequelize,
  tableName: 'movie'
})

class Music extends Model {

}
const musicFileds = Object.assign({url: Sequelize.STRING}, classicFileds)
Music.init(musicFileds,{
  sequelize,
  tableName: 'music'
})

class Sentence extends Model {
}

Sentence.init(classicFileds, {
    sequelize,
    tableName: 'sentence'
})

module.exports = {
  Movie,
  Sentence,
  Music
}
```

定义这三个模型

## 找到这三个模型中index最大的数据

`models/art.js`

```js
const { Movie, Music, Sentence} = require('./classic')
class Art {
  static async getData (type, id){
    const finder = {
      where:{
        id: id
      }
    }
    let art = null
    switch(type){
      case 100:
        art = await Movie.findOne(finder)
        break;
      case 200: 
        art = await Music.findOne(finder)
        break;
      case 300:
        art = await Sentence.findOne(finder)
        break;
      case 400:
        break;
      default:
        break;
    }
    return art
  }
}
module.exports = {
  Art
}
```

`v1/classic.js`

```js
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
```

这里就找到对应的最新的数据了，
数据序列化，这里使用推荐使用`sequelize`的`setDataValue`

## 点赞功能及增加点赞人数

`lib/validator.js`

参数校验规则
```js
function checkLikeType (vals){
  let type = vals.body.type || vals.path.type || false
  if (!type) throw new Error('缺少type')
  type = parseInt(type)
  if (!LoginType.isThisType(type)) throw new Error('type不符合条件')
}
class LikeValidator extends LinValidator {
  constructor (){
    super ()
    this.validateType = checkLikeType
  }
}
```
`models/favor.js`
新建favor表，并且点击事件及增加fav_nums人数
```js
const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')
const { LikeError, DislikeError} = require('../../core/http-execption')
const { Art } = require('./art')
class Favor extends Model {
  static async like(art_id, type, uid){
    // 数据库中存不存在
    // 首先插入favor一个数据
    // 更新对应表中的fav_nums
    const favor = await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    if (favor) {
      throw new LikeError('')
    }
    // 利用事务来完成
    return sequelize.transaction(async t => {
      await Favor.create({
        art_id,
        type,
        uid
      },{
        transaction: t
      })
      const art = await Art.getData(type, art_id)
      await art.increment('fav_nums', {
        by: 1,
        transaction: t
      })
    })
  }
}
// 喜欢的业务表
Favor.init({
  uid: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER
},{
  sequelize,
  tableName:'favor'
})
module.exports = {
  Favor
}
```

`v1/like.js`

```js
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

module.exports = router
```

**点赞及增加人数已经完成，利用事务来完成多个表格的操作**

## 取消点赞

取消点赞与点赞功能类似

`models/favor.js`

```js
const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')
const { LikeError, DislikeError} = require('../../core/http-execption')
const { Art } = require('./art')
class Favor extends Model {
  static async like(art_id, type, uid){
    // 数据库中存不存在
    // 首先插入favor一个数据
    // 更新对应表中的fav_nums
    const favor = await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    if (favor) {
      throw new LikeError('')
    }
    return sequelize.transaction(async t => {
      await Favor.create({
        art_id,
        type,
        uid
      },{
        transaction: t
      })
      const art = await Art.getData(type, art_id)
      await art.increment('fav_nums', {
        by: 1,
        transaction: t
      })
    })
  }
  static async disLike(art_id, type, uid){
    // 数据库中存不存在
    // 首先插入favor一个数据
    // 更新对应表中的fav_nums
    const favor = await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    if (!favor) {
      throw new DislikeError()
    }
    return sequelize.transaction(async t => {
      await favor.destroy({
        force: true,
        transaction: t
      })
      const art = await Art.getData(type, art_id)
      await art.decrement('fav_nums',{
        by: 1,
        transaction: t
      })
    })
  }
}
// 喜欢的业务表
Favor.init({
  uid: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER
},{
  sequelize,
  tableName:'favor'
})
module.exports = {
  Favor
}
```

`v1/like.js`

```js
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
```

## modules-alias使用
安装
```sh
npm install -D modules-alias
```

`package.json`

```js
"_moduleAliases": {
    "@root": ".",
    "@api": "./app/api/",
    "@models": "./app/models/",
    "@middle": "./middleware/",
    "@lib": "./lib/",
    "@core": "./core/",
    "@config": "./config/"
  }
```

`app.js`

```js
require('module-alias/register')
```

`v1/like.js`
```js
const {success} = require('@lib/helper.js')
const { Auth } = require('@middle/auth.js')
const { LikeValidator } = require('@lib/validator')
const { Favor }  = require('@models/favor') 
```

## 剔除没有必要的字段

[参考资料](https://demopark.github.io/sequelize-docs-Zh-CN/scopes.html)

`core/db.js`
```js
...
createdAt: 'created_at',
updatedAt: 'updated_at',
deletedAt: 'deleted_at',
underscored: true ,  // 吧所有驼峰转化为下划线
scopes:{
  'bh':{
    attributes: {
      exclude: ['updated_at',       'deleted_at','created_at']
    },
  }
}
```

`models/art.js`

```js
class Art {
  static async getData (type, id, useScope){
    const finder = {
      where:{
        id: id
      }
    }
    let art = null, scoped = useScope ? 'bh' : null
    switch(type){
      case 100:
        art = await Movie.scope(scoped).findOne(finder)
        break;
      case 200: 
        art = await Music.scope(scoped).findOne(finder)
        break;
      case 300:
        art = await Sentence.scope(scoped).findOne(finder)
        break;
      case 400:
        break;
      default:
        break;
    }
    return art
  }
}
```

使用`Art.getData()`传递第三个参数。标示是否使用`scope`

## 查询下一期

`v1/classic.js`
```js
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
  const art = await Art.getData(flow.type, flow.art_id, true)
  const likeBool = await Favor.likeIt(flow.art_id, flow.type, ctx.auth.uid)
  // 这里需要序列化，否则得不到想要的
  // 着一种方法不推荐art.dataValues.index= flow.index
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeBool)

  ctx.body = art
})
```

## 查询上一期

```js
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
  const art = await Art.getData(flow.type, flow.art_id, true)
  const likeBool = await Favor.likeIt(flow.art_id, flow.type, ctx.auth.uid)
  // 这里需要序列化，否则得不到想要的
  // 着一种方法不推荐art.dataValues.index= flow.index
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeBool)

  ctx.body = art
})
```
## 搜索

`models/book.js`

```js
static async searchBook (q, start = 0, count = 10, summary = 1) {
    const url = util.format(config.yushu.keywordUrl, encodeURI(q), count, start, summary)
    const result = await axios.get(url)
    return result.data
  }
```

`v1/book.js`

```js
router.get('/search', async ctx => {
  const v = await new SearchValidator().validate(ctx)
    const result = await Book.searchBook(
        v.get('query.q'), v.get('query.start'), v.get('query.count'))
    ctx.body = result
})
```

## 书籍点赞的个数

`models/book.js`

```js
static async getFavorCount (uid) {
    const count = await Favor.count({
      where:{
        type: 400,
        uid
      }
    })
    return count
  }
```

`v1/book.js`

```js
router.get('/favor/count', new Auth().m, async ctx => {
  const count = await Book.getFavorCount(ctx.auth.uid)
  ctx.body = {count}
})
```

## 获取书籍本人点赞情况

`models/favor.js`

```js
static async getBookFavor (id, uid) {
    const favorNums = await Favor.count({
      where: {
          art_id: id,
          type:400
      }
  })
  const myFavor = await Favor.findOne({
      where:{
          art_id:id,
          uid,
          type:400
      }
  })
  return {
      fav_nums:favorNums,
      like_status:myFavor?1:0
  }
  }
```

`v1/book.js`
```js
router.get('/:id/favor', new Auth().m, async ctx => {
  const v =await new PositiveIntegerValidator().validate(ctx)
  const favor = await Favor.getBookFavor(
      v.get('path.id'), ctx.auth.uid)
  ctx.body = favor
})
```

## 获取书籍相关评论

`models/book-comment.js`
```js
const {sequelize} = require('../../core/db')
const {
    Sequelize,
    Model
} = require('sequelize')

class Comment extends Model{
  static async getComments (id){
    const comments = await Comment.findAll({
      where: {
          book_id: id
      }
  })
  return comments
  }
}
Comment.init({
  content:Sequelize.STRING(12),
  nums:{
      type:Sequelize.INTEGER,
      defaultValue:0
  },
  book_id:Sequelize.INTEGER,
  // exclude:['book_id','id']
},{
  sequelize,
  tableName:'comment'
})
module.exports = {
  Comment
}
```

`v1/book.js`

```js
router.get('/:id/comments', new Auth().m, async ctx => {
  const v =await new PositiveIntegerValidator().validate(ctx)
  const comment = await Comment.getComments(
      v.get('path.id'))
  ctx.body = comment
})
```

## 去除返回数据不要的字段

`core/db.js`

```js
Model.prototype.toJSON = function(){
  // let data = this.dataValues
  let data = clone(this.dataValues)
  // unset(data, 'updated_at')
  // unset(data, 'created_at')
  // unset(data, 'deleted_at')

  if(isArray(this.exclude)){
      this.exclude.forEach(
          (value)=>{
              unset(data,value)
          }
      )
  }
  return data
}
```

循环删除`exclude`里面的包含字段，返回删除后的数据