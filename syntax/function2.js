console.log(Math.round(1.6));
console.log(Math.round(1.4));

function sum(first, second) {   //parameter
    console.log('a');
    return first + second;  // 즉시 함수 종료
    console.log('b');
}

console.log(sum(2,4));   // argument
