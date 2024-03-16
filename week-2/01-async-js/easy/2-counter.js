let count = 0;
function setTimeoutFun(){
  setTimeout(() => {
    console.log(count);
    main();
  }, 1000);
}

function main() {
  count++;
  setTimeoutFun();
}

main();