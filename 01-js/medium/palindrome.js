/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.
*/

function isPalindrome(str) {
  str = str.replace(/[^a-z]/gi, '').toLowerCase();
  if(str === ""){
    return true;
  }
  let j = 0;
  let isTrue = false;
  for(let i = str.length - 1; i >= 0; i--) {
    if (str[i] === str[j]){
      isTrue = true;
      j++;
    } else {
      isTrue = false;
      break;
    }
  }
  return isTrue;
}

module.exports = isPalindrome;
