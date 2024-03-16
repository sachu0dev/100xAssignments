const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000


app.use(bodyParser.json());
app.post('/', (req, res) => {
  res.send(`geting from post request: ${req.body.message}`);
})
app.get('/news', (req, res)=>{
  let a = req.query.message
  res.send(`geting from get request: ${a}`);
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
