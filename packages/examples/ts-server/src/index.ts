import {
  App, FWRequest, FWResponse, GetMapping, RouterController, FwController,
} from 'flash-wolves'

const app = new App()

@RouterController()
class User extends FwController {
  @GetMapping('abc/abc/:a', { power: 'ok' })
  hello(req:FWRequest, res:FWResponse) {
    console.log(req.query)
    console.log(req.params)
    res.success()
  }
}

const u = new User()

console.log(u.getRoutes())

app.addRoutes(u.getRoutes())

app.get('abc/123', (req, res) => {
  console.log(req.query)
  res.success()
})

app.get('/abc/456', (req, res) => {
  console.log(req.query)
  res.success()
})

app.listen()
