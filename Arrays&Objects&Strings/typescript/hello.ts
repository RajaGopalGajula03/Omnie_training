function greet(name:string,date:Date)
{
    console.log(`Hello ${name}, today is ${date.toDateString()}`)
}
greet('Raja',new Date());

let obj : any = {x:0};

// obj.foo();
// obj();
obj.bar = 100;
// obj = "hello";
console.log(obj.x);
const n:number = obj;
console.log(n);

let myName = "Raja Gopal";
console.log(myName);

function getMyNumber():number{
    return 26;
}
console.log(getMyNumber());

const names = ["Alice", "Bob", "Eve"];
names.forEach(function(s){
    console.log(s.toUpperCase());
})

const myNames = ['Raja','Gopal','Gajula'];

let result = [];
myNames.forEach((s)=>{
    result.push(s.toUpperCase());
});

console.log(result);

