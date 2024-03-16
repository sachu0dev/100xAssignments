const fs = require('fs');

let data ="this is writen using callback";
fs.writeFile("a.txt",data, 'utf-8', (error)=>{
  console.log("file writen successfully");
});
let sum = 0;
for(let i = 0; i < 1000000000; i++){
  sum = sum + i;
}
console.log(sum);