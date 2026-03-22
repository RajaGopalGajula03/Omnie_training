import { countries } from "./countries.js"
// const countries = ['Finland', 'Sweden', 'Denmark', 'Norway', 'IceLand']
const names = ['Asabeneh', 'Mathias', 'Elias', 'Brook']
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const products = [
  { product: 'banana', price: 3 },
  { product: 'mango', price: 6 },
  { product: 'potato', price: ' ' },
  { product: 'avocado', price: 8 },
  { product: 'coffee', price: 10 },
  { product: 'tea', price: '' },
]

function print(item)
{
    console.log(item);
}

countries.forEach(print);

// forEach
countries.forEach(c => console.log(c));
names.forEach(n => console.log(n));
numbers.forEach(num => console.log(num));

// map()
let upperCountry = countries.map(c => c.name.toUpperCase());
console.log(upperCountry);
let countryLength = countries.map(c => c.length);
console.log(countryLength);
let squares = numbers.map(num => num * num);
console.log(squares);
let upperNames = names.map(n => n.toUpperCase());
console.log(upperNames);
let prices = products.map(p => p.price);
console.log(prices);

// filter
let land = countries.filter(c => c.name.includes("land"));
console.log(land);
let sixcharacters = countries.filter(c => c.name.length === 6);
console.log(sixcharacters);
let aboveSixChars = countries.filter(c => c.name.length >= 6);
console.log(aboveSixChars);
let startWithE = countries.filter(c => c.name.startsWith('E'));
console.log(startWithE);
let priceValues = products.filter(p => p.price !== "" && p.price !== " ");
console.log(priceValues);

function getStringLists(arr)
{
    return arr.filter(a => typeof a === "string");
}

console.log(getStringLists([1,2,'a','f','t',4]));

let sum = numbers.reduce((a,b) => a + b,0);
console.log(sum);

let sentence = countries.reduce((acc,curr,i) => {
    if( i === countries.length - 1)
    {
        return acc + " and " + curr;
    }
    else
        return acc + " , " + curr;
})

console.log(sentence + "are north European countries");

console.log(names.some(n => n.length > 7));
console.log(countries.every(c => c.name.includes("land")));

// find
let firstCountryWith6chars = countries.find(c => c.length === 6);
console.log(firstCountryWith6chars);
let firstIndexof6chars = countries.findIndex(c => c.length === 6);
console.log(firstIndexof6chars);

let norawyIndex = countries.findIndex(c => c === "Norway");
console.log(norawyIndex);

let russiaIndex = countries.findIndex(c => c === "Russia");
console.log(russiaIndex);

// level 2
let totalPrice = products.filter(p => p.price !== "" && p.price !== " ").map(p => p.price).reduce((a,b) => a + b, 0);
console.log(totalPrice);

let reducePrice = products.reduce((total,p) =>{
    if(p.price !== "" && p.price !== " ")
        return total+p.price;
    return total;
},0)
console.log(reducePrice);

function categorizeCountries(countries,pattern)
{
    return countries.filter(c => c.name.includes(pattern));
}

console.log(categorizeCountries(countries,'land'))

function countInitials(arr)
{
    let obj = {};

    arr.forEach(c =>{
        let first = c.name[0];
        obj[first] = (obj[first] || 0) + 1;
    });
    return obj;
}

console.log(countInitials(countries));

const getFirstTenCountries = arr => arr.slice(0,10);
console.log(getFirstTenCountries(countries));
const getLastTenCountries = arr => arr.slice(-10);
console.log(getLastTenCountries(countries));

function mostCommonLetter(arr)
{
    let obj = countInitials(arr);

    let max = 0;
    let letter = "";

    for(let key in obj)
    {
        if(obj[key] > max)
        {
            max = obj[key];
            letter = key;
        }
    }
    return letter
}
console.log(mostCommonLetter(countries));

function mostPopulatedCountries(arr, n) {
  return arr
    .sort((a, b) => b.population - a.population)
    .slice(0, n)
    .map(c => ({
      country: c.name,
      population: c.population
    }));
}

console.log(mostPopulatedCountries(countries,10))

function mostSpokenLanguages(arr, n) {
  let langCount = {};

  arr.forEach(c => {
    c.languages.forEach(l => {
      langCount[l] = (langCount[l] || 0) + 1;
    });
  });

  return Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([lang, count]) => ({
      country: lang,
      count
    }));
}

console.log(mostSpokenLanguages(countries,10));

