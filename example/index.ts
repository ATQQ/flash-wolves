import {
  Fw, FWRequest, FWResponse, GetMapping, RouterController, iRouter,
} from '../dist'

const app = new Fw()
app.get('abc/123', (req, res) => {
  console.log(req.query)
  res.success()
})

app.get('/abc/456', (req, res) => {
  console.log(req.query)
  res.success()
})

@RouterController('user')
class User extends iRouter {
  @GetMapping('abc/:a', { power: 'ok' })
  hello(req:FWRequest, res:FWResponse) {
    console.log(req.query)
  }
}

const u = new User()
app.addRoutes(u.getRoutes())
console.log(app.getRoutes())

app.listen()
