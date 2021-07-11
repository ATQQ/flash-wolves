import {
  Fw, FWRequest, FWResponse, GetMapping, RouterController, FwController,
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
app.addRoutes(u.getRoutes())
console.log(app.getRoutes())

app.listen()
