const { Router } = require('flash-wolves')

const userRouter = new Router('user')

userRouter.post('login', (req, res) => {
  console.log(req.body)
  res.success()
})

module.exports = userRouter
