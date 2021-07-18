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
yarn add flash-wolves
```

## 编码
index.js
```js
const { Fw } = require('flash-wolves')
const app = new Fw()

app.get('/a/b', (req, res) => {
    console.log(req.query)
    res.success()
})

app.listen(3000)
```
```sh
node index.js
```

# 高级

## Router
使用`Router`更方便模块化书写路由
```js
const { Fw, Router } = require('flash-wolves')
const app = new Fw()

// 不带公共前缀Router
const user = new Router()

// GET /user/login
user.get('/user/login',(req,res)=>{
    res.success()
})

app.addRoutes(user.getRoutes())

// 带前缀Router
const task = new Router('task')

// GET /task/list
task.get('/list',(req,res)=>{
    res.success()
})
app.addRoutes(task.getRoutes())

app.get('/',(req,res)=>{
    res.json(app.getRoutes())
})
app.listen(3000)
```

## 装饰器
这里直接使用typescript

使用装饰器，是代码结构更加清晰

index.ts
```ts
import { Fw, FwController, FWRequest, FWResponse, GetMapping, RouterController } from 'flash-wolves'

const app = new Fw()

@RouterController()
class User extends FwController {

    @GetMapping('/user/login')
    login(req: FWRequest, res: FWResponse) {
        res.success()
    }
}

app.addRoutes(new User().getRoutes())
app.listen()

```
ts-node 使用请参看[文档](https://www.npmjs.com/package/ts-node)

```sh
ts-node index.ts
```
# 规划
* [ ] Router的所有基本操作都接入装饰器
* [ ] 路由内部函数this上注入request与response
* [ ] 完善使用文档（VitePress）
* [ ] 直接返回的内容 
* [ ] 添加res.xxx方法 (如res.html(str))
* [ ] 。。。敬请期待