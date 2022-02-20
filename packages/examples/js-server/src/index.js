const { App, Router } = require('flash-wolves')

const app = new App()

app.get('/hello/world', (req, res) => {
  console.log(req.query)
  res.success()
})

const userRouter = new Router('user')

userRouter.post('login', (req, res) => {
  console.log(req.body)
  res.success()
})

app.addRouter(userRouter)

console.log(app.routes)
app.listen(3001)
