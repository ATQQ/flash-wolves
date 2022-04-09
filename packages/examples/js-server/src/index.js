const { App } = require('flash-wolves')
const routes = require('./routes')

const app = new App()

app.get('/hello/world', (req, res) => {
  console.log(req.query)
  res.success()
})

app.addRouter(routes)

console.log(app.routes)
app.listen(3001)
