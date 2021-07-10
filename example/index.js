const { Fw } = require('./../dist/index')
const app = new Fw()
app.get('abc/123', (req, res) => {
    console.log(req.query)
    res.success()
})

app.get('/abc/456', (req, res) => {
    console.log(req.query)
    res.success()
})

app.listen(3001)