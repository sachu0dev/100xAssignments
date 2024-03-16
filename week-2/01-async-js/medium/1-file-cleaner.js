const fs = require('fs');

fs.readFile("a.txt", 'utf-8', (error,data)=>{
  let newData = data.replace(/\s+/g, ' ');
  fs.writeFile("a.txt", newData, 'utf-8', (error)=>{
    console.log("file writing Done!")
  })
})