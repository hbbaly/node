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