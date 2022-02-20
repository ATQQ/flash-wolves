import { App } from 'flash-wolves'
import User from './controllers/user'

const app = new App()

app.registerController(User)

console.log(app.routes)

app.listen(3000)
