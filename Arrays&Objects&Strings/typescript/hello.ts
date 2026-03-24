function greet(name:string,date:Date)
{
    console.log(`Hello ${name}, today is ${date.toDateString()}`)
}
greet('Raja',new Date());