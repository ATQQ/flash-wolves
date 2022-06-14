import { App } from 'flash-wolves'
import User from './controllers/user'
import User2 from './routers/user'

const app = new App({
  beforeRunRoute: (req, res) => {
    console.log('meta:', req.route.meta)
  }
})

app.addController(User)
app.addRouter(User2)

console.log(app.routes)

app.listen(+process.env.SERVER_PORT)
