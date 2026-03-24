function greet(name, date) {
    console.log("Hello ".concat(name, ", today is ").concat(date.toDateString()));
}
greet('Raja', new Date());
