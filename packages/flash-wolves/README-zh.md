# flash-wolves⚡️
简称FW(LOL闪电狼战队)

一个非常简单的Node Web框架

* ⚡️ 启动快
* 😊 非常简单 
* 🌟 支持装饰器
* 🔑 完整的类型定义
* 📦 打包进行了压缩（非常小）

# 语言
* [English](./README.md)
* 简体中文

# 快速开始
## 安装依赖
```sh
npm install flash-wolves
# or
pnpm add flash-wolves
# or
yarn add flash-wolves
```

## 简单使用

index.js
```js
const { App } = require('flash-wolves')
const app = new App()

app.get('/hello/world', (req, res) => {
    console.log(req.query)
    res.success()
})

app.listen(3000)
```

运行
```sh
node index.js
```

# 高级用法

## Router
使用`Router`更方便模块化书写路由
```js
const { App, Router } = require('flash-wolves')
const app = new App()

// 不带公共前缀Router
const user = new Router()

// GET /user/login
user.get('/user/login',(req,res)=>{
    res.success()
})

// 带前缀Router
const task = new Router('task')

// GET /task/list
task.get('/list',(req,res)=>{
    res.success()
})

app.addRouter([user,task])

app.get('/',(req,res)=>{
    res.json(app.getRoutes())
})
app.listen(3000)
```

## 装饰器
这里直接使用typescript

使用装饰器，使代码结构更加清晰

index.ts
```ts
import { FWRequest, FWResponse, Get, RouterController, App, ReqQuery, ReqParams } from 'flash-wolves'

const app = new App()

@RouterController()
class User {

    @Get('/user/login')
    login(req: FWRequest, res: FWResponse) {
        res.success()
    }
    
    @Get('info/:id', { power: 'ok' })
    getUserInfo(@ReqQuery query, @ReqParams params) {
      console.log(query, params)
      return query
    }
}

app.addController(User)

// 支持传递数组
// app.addController([User,Task])
// or 
// 支持构造函数实例化
// app.addController(new User())

app.listen(3000)

```
* [ts-node](https://www.npmjs.com/package/ts-node) 使用文档
* [esno](https://www.npmjs.com/package/esno) 使用文档
* [tsup](https://www.npmjs.com/package/tsup) 使用文档

```sh
ts-node index.ts
```
## 更多示例
查看 [packages/examples](./packages/examples)

# 规划
* [x] Router的所有基本操作都接入装饰器
* [ ] 完善使用文档（VitePress）
* [x] 直接返回的内容 
* [ ] 添加res.xxx方法 (如res.html(str))
* [ ] 。。。敬请期待