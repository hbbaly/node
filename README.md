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