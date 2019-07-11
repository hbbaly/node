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

