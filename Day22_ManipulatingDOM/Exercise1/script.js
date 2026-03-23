const container = document.getElementById("container");

function isPrime(num)
{
    if(num < 2) return false;

    for(let i = 0; i < num; i++)
    {
        if(num % i === 0) return false;
    }
    return true;
}

for(let i = 0; i <= 100; i++){
    const div = document.createElement("div");
    div.className = 'number';
    div.textContent = i;

    if(isPrime(i))
    {
        div.style.background = 'red';
    }
    else if(i % 2 === 0){
        div.style.background = "green";
    }
}

let text = "Raja Gopal";
let reversed = text.split(" ").map(word => word === 'Gopal'? word.split("").reverse().join(""):word).join(" ");

console.log(reversed);

let reversed1 = text.split(" ").map(word =>{
    if(word === "Gopal")
    {
        return word.split("").reverse().join(""); 
    }
    else
    {
        return word
    }
}).join(" ");
console.log(reversed1);