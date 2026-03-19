import { countries } from "./countries.js";
import { webTechs } from "./web_techs.js";

console.log(countries);
console.log(webTechs);

let text =
'I love teaching and empowering people. I teach HTML, CSS, JS, React, Python.';

let words = text.replace(/[.,]/g,"").split(" ");
console.log(words);
console.log(words.length);

let shoppingCart = ['Milk', 'Coffee', 'Tea', 'Honey'];

if(!shoppingCart.includes("Meat"))
{
    shoppingCart.unshift("Meat");
}
console.log(shoppingCart)

if(!shoppingCart.includes("Sugar"))
{
    shoppingCart.push("Sugar");
}
console.log(shoppingCart);

shoppingCart = shoppingCart.filter(item => item !== "Honey");
console.log(shoppingCart);

let index = shoppingCart.indexOf("Tea");
if(index !== -1)
{
    shoppingCart[index] ="Green Tea";
}

console.log(shoppingCart);

if(countries.includes("Ethiopia"))
{
    console.log("ETHIOPIA")
}
else
{
    countries.push("Ethiopia");
}

if(webTechs.includes("SaaS"))
{
    console.log("SaaS  is a CSS preprocess")
}
else
{
    webTechs.push("SaaS");
    console.log(webTechs);
}

const frontend = ["HTML",'CSS',"JS",'React','Redux'];
const backend = ["Node","Express","MongoDB"];

const fullstack = [...frontend,...backend];

console.log(fullstack);

const ages = [19, 22, 19, 24, 20, 25, 26, 24, 25, 24];
ages.sort((a,b)=>a-b);

let min = ages[0];
let max = ages[ages.length-1];

console.log(min,max)

let mid = Math.floor(ages.length / 2);

let median = ages.length % 2 === 0
  ? (ages[mid - 1] + ages[mid]) / 2
  : ages[mid];

console.log(median);


let sum = ages.reduce((acc,val) => acc + val,0);
let avg = sum/ages.length;

console.log(avg);

console.log(max - min);

console.log(Math.abs(min - avg));
console.log(Math.abs(max - avg));

console.log(countries.slice(0,10));

let midIndex = Math.floor(countries.length / 2);

if (countries.length % 2 === 0) {
  console.log(countries.slice(midIndex - 1, midIndex + 1));
} else {
  console.log(countries[midIndex]);
}


let midSplit = Math.ceil(countries.length / 2);

let firstHalf = countries.slice(0, midSplit);
let secondHalf = countries.slice(midSplit);

console.log(firstHalf);
console.log(secondHalf);
