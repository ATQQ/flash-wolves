# flash-wolves⚡️

Abbreviation FW (LOL Flash Wolves)

A very simple Node Web framework

* ⚡️ Fast Start
* 😊 very simple 
* 🌟 support Decorators
* 🔑 Fully Typed APIs
* 📦 Optimized Build

# Language
* English
* [简体中文](./README-zh.md)

# Quick Start
## Installing Dependencies
```sh
npm install flash-wolves
# or
pnpm add flash-wolves
# or
yarn add flash-wolves
```

## Usage

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

Run
```sh
node index.js
```

# Advanced Usage
## Router
Using `Router` makes it easier to write routes modularly
```js
const { App, Router } = require('flash-wolves')
const app = new App()

// Router without public prefix
const user = new Router()

// GET /user/login
user.get('/user/login',(req,res)=>{
    res.success()
})

// Router with public prefix
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

## Decorator
Here the direct use of `typescript`

Using decorators is a much clearer structure of the code

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
    getUserInfo(@ReqParams() params, @ReqParams('id') id:string) {
      console.log(params,id)
      return params
    }

    check(@ReqQuery() query, @ReqQuery('search') search:string){
      console.log(query, search)
      return query
    }

    @Post('login')
    login(@ReqBody() body) {
      console.log(body)
      return body
    }
}

app.addController(User)
// support array
// app.addController([User,Task])
// or 
// if constructor have some params
// app.addController(new User(...params))

app.listen(3000)
```
* [ts-node](https://www.npmjs.com/package/ts-node) usage documentation
* [esno](https://www.npmjs.com/package/esno) usage documentation
* [tsup](https://www.npmjs.com/package/tsup) usage documentation

```sh
esno index.ts

# or
ts-node index.ts

# or 
npx tsup index.ts
node dist/index.js
```

## More Example
see [packages/examples](./packages/examples)

see [node-server](https://github.com/atqq/node-server) get the template project
# Planning
* [x] All basic operations of Router are plugged into the decorator
* [x] Direct return content 
* [x] auto load `.env` files 
* [x] Template project
* [x] Add res.xxx methods (like res.html(str)) 'res.plain' supports the return of text
* [ ] Improve the usage documentation (VitePress)
* [ ] Support static sources
* [ ] Auto API
* [ ] . Stay tuned!