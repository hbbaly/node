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
