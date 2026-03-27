function greet(name, date) {
    console.log("Hello ".concat(name, ", today is ").concat(date.toDateString()));
}
greet('Raja', new Date());
var obj = { x: 0 };
// obj.foo();
// obj();
obj.bar = 100;
// obj = "hello";
console.log(obj.x);
var n = obj;
console.log(n);
var myName = "Raja Gopal";
console.log(myName);
function getMyNumber() {
    return 26;
}
console.log(getMyNumber());
var names = ["Alice", "Bob", "Eve"];
names.forEach(function (s) {
    console.log(s.toUpperCase());
});
var myNames = ['Raja', 'Gopal', 'Gajula'];
var result = [];
myNames.forEach(function (s) {
    result.push(s.toUpperCase());
});
console.log(result);
