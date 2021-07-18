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
yarn add flash-wolves
```

## Code
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

# Advanced Usage
## Router
Using `Router` makes it easier to write routes modularly
```js
const { Fw, Router } = require('flash-wolves')
const app = new Fw()

// Router without public prefix
const user = new Router()

// GET /user/login
user.get('/user/login',(req,res)=>{
    res.success()
})

app.addRoutes(user.getRoutes())

// Router with public prefix
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

## Decorator
Here the direct use of `typescript`

Using decorators is a much clearer structure of the code

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
See [documentation](https://www.npmjs.com/package/ts-node) for ts-node usage

```sh
ts-node index.ts
```
# Planning
* [ ] All basic operations of Router are plugged into the decorator
* [ ] Inject request and response on the internal function this for routing
* [ ] Improve the usage documentation (VitePress)
* [ ] Direct return content 
* [ ] Add res.xxx methods (like res.html(str))
* [ ] . Stay tuned!