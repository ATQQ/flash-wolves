import { App } from 'flash-wolves'
import User from './controllers/user'

const app = new App({
  beforeRunRoute: (req, res) => {
    console.log(req.route)
  }
})

app.addController(User)

console.log(app.routes)

app.listen(+process.env.SERVER_PORT)
