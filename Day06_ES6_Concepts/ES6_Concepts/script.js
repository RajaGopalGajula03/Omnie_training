// Arrow functions
const add = (a,b) => a + b;
console.log(add(2,3));

// Destructuring 
const user = {name:'Raja',age:26}
const {name,age} = user;
console.log(name,age);

// Template Literals

console.log(`Hello ${name}`);

// map()

const numbers = [1,2,3,4,5];
const doubled = numbers.map(num => num * 2);
console.log(doubled);