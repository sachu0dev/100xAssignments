const express = require('express');
const app = express();
const users = [{
  name: 'abhi',
  kidneys: [{
    healthy: false
  }]
}];

app.use(express.json());
app.get('/',  (req, res)=>{
  const userKidneys = users[0].kidneys;
  const numberofKidneys = userKidneys.length;
  let numberofHealthyKidneys = 0;
  for (let i = 0; i<userKidneys.length; i++){
    if(userKidneys[i].healthy){
      numberofHealthyKidneys++;
    }
  }
  const numberofUnhealthyKidneys = numberofKidneys - numberofHealthyKidneys;
  res.send(`<h1>${users[0].name} medical recored</h1>
  <p>the number of kidneys is ${numberofKidneys}</p>
  <p> the numberofHealthyKidneys is ${numberofHealthyKidneys}</p>
  <p> the numberofUnhealthyKidneys is ${numberofUnhealthyKidneys}
  `);
})

app.post("/", (req, res)=>{
  const isHealthy = req.body.isHealthy;
  users[0].kidneys.push({
    healthy: isHealthy
  })
  res.json({
    msg: "Done!"
  })
})

app.put('/', (req,res)=>{
  // 411 status
  let atleastonekidneyishealthy = isThereUnhealthyKidney();
  if(atleastonekidneyishealthy){
    for(let i = 0; i<users[0].kidneys.length; i++){
      users[0].kidneys[i].healthy = req.body.isHealthy;
    }
    res.json({
      "message": "Done!"
    })
  }else{
    res.status(411).send({
      msg : "No unhealthy Kidney"
    });
  }
})

app.delete('/', (req, res)=>{
  // you should return a 411 status
  // only if atleast one unhealthy kidney is there do this , else return 411
  let atleastonekidneyishealthy = isThereUnhealthyKidney();
  if(atleastonekidneyishealthy){
    const newkidneys = [];
    for(let i = 0; i<users[0].kidneys.length; i++){
      if(users[0].kidneys[i].healthy){
        newkidneys.push(users[0].kidneys[i]);
      }
    }
    users[0].kidneys = newkidneys;
    res.json({
      "message": "Done!"
    })
  } else {
    res.status(411).send({
      msg : "No unhealthy Kidney"
    });
  }
  
})

function isThereUnhealthyKidney(){
  let atleastonekidneyishealthy = false;
  for(let i = 0; i<users[0].kidneys.length; i++){
    if(!users[0].kidneys[i].healthy){
      atleastonekidneyishealthy = true;
    }
  }
  return atleastonekidneyishealthy;
}

app.listen(3001);