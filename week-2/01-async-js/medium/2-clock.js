
function clock(){
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  if(hours < 12){
    console.log(`${hours}:${minutes}:${seconds} AM`);
  } else {
    console.log(`${hours-12}:${minutes}:${seconds} PM`);

  }
}

setInterval(clock, 1000);