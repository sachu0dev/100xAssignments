const fs = require('fs');


fs.readFile("a.txt", 'utf-8', (error,data)=>{
  console.log(data);
});
let sum = 0;
for(let i = 0; i < 1000000000; i++){
  sum = sum + i;
}
console.log(sum);