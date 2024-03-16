const express =require('express')
const port = 3000;
const app = express();

function calculateSum(n){
  let ans = 0;
  for (let i = 1; i<n; i++){
    ans = ans + i;
  }
  return ans;
}


app.get("/", (req, res)=>{
  const n = req.query.n;
  const ans = calculateSum(n)
  res.send(`The sum of 1 to ${n} is ${ans}`);
})

app.listen(port)