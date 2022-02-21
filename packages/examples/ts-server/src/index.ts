import { App } from 'flash-wolves'
import User from './controllers/user'

const app = new App()

app.addController(User)

console.log(app.routes)

app.listen(3000)
