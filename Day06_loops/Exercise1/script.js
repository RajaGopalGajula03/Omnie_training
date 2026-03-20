const countries = [
    'Albania',
    'Bolivia',
    'Canada',
    'Denmark',
    'Ethiopia',
    'Finland',
    'Germany',
    'Hungary',
    'Ireland',
    'Japan',
    'Kenya'
]

const webTechs = [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Redux',
    'Node',
    'MongoDB'
]

const mernStack = ['MongoDB', 'Express', 'React', 'Node']

// iterate 0 to 10
for (let i = 0; i <= 10; i++) {
    console.log(i);
}

let i = 0;
while (i <= 10) {
    console.log(i);
    i++;
}

let j = 0;
do {
    console.log(j);
    j++;
}
while (j <= 10);

// iterate 10 to 0
for (let i = 10; i >= 0; i--) {
    console.log(i);
}

let i1 = 10;
while (i1 >= 0) {
    console.log(i1);
    i1--;
}

let j1 = 10;
do {
    console.log(j1);
    j1--;
}
while (j1 >= 0);

// iterate 0 to n
let n = 5;
for (let i = 0; i <= n; i++) {
    console.log(i);
}

// pattern #

for (let i = 1; i <= 7; i++) {
    let pattern = ""

    for (let j = 1; j <= i; j++) {
        pattern += "#";
    }
    console.log(pattern)
}

// Square pattern
for (let i = 0; i <= 10; i++) {
    console.log(`${i} * ${i} = ${i * i}`);
}

// Square and cube pattern
console.log("i  i^2 i^3");
for (let i = 0; i <= 10; i++) {
    console.log(`${i}   ${i * i}  ${i * i * i}`);
}

// Even numbers upto 100
for (i = 0; i <= 100; i++) {
    if (i % 2 === 0)
        console.log(i)
}

// Odd numbers up to 100
for (i = 0; i <= 100; i++) {
    if (i % 2 !== 0)
        console.log(i)
}

// prime numbers up to 100
for (let i = 2; i <= 100; i++) {
    let isPrime = true;

    for (let j = 2; j < i; j++) {
        if (i % j === 0) {
            isPrime = false;
            break;
        }
    }
    if (isPrime)
        console.log(i);
}

// sum 0 to 100
let sum = 0;
for (let i = 0; i <= 100; i++) {
    sum += i;
}
console.log(sum);

// sum of even & odd numbers up to 100

let evenSum = 0;
let oddSum = 0;
for (let i = 0; i <= 100; i++) {
    if (i % 2 === 0) {
        evenSum += i;
    }
    else {
        oddSum += i;
    }
}

console.log(evenSum, oddSum);

console.log([evenSum], [oddSum])

// 5 random numbers
let arr = [];
for (let i = 0; i < 5; i++) {
    arr.push(Math.floor(Math.random() * 100))
}
console.log(arr);

// random unique number

let uniqueArr = [];

while (uniqueArr.length < 5) {
    let num = Math.floor(Math.random() * 100)

    if (!uniqueArr.includes(num)) {
        uniqueArr.push(num);
    }
}
console.log(uniqueArr)
// random id with 6 characters
let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
let id = '';

for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
}
console.log(id)

// level2 Genarate random id with n number of charcters

function genarateId(length) {
    let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';

    for(let i = 0; i < length; i++)
    {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}
console.log(genarateId(13))

// hexa colors
let hex = "#";

let hexNums = "0123456789abcdef";
for(let i = 0; i < 6; i++)
{
    hex += hexNums[Math.floor(Math.random() * 16)];
}
console.log(hex);

// Random RGB colors
let r = Math.floor(Math.random() * 256);
let g = Math.floor(Math.random() * 256);
let b = Math.floor(Math.random() * 256);

console.log(`rgb(${r},${g},${b})`);

// upper case countries

let upper = countries.map(c => c.toUpperCase());
console.log(upper);

// country length

let lengths = countries.map(c => c.length);
console.log(lengths);

// country details

let result = countries.map(c => [
    c,
    c.slice(0,3).toUpperCase(),
    c.length
])
console.log(result)

// countries with land

let land = countries.filter(c => c.includes('land'));
if(land.length !== 0)
{
    console.log(land);
}
else
{
    console.log("All these  countries  are without land");
}

// ends with ia
let ia = countries.filter(c => c.endsWith('ia'));
if(ia.length !== 0)
{
    console.log(ia);
}
else
{
    console.log("These are countries ends without ia");
}
// longest country
let longest = countries[0];

for(let i = 1; i < countries.length; i++)
{
    if(countries[i].length > longest.length)
    {
        longest = countries[i];
    }
}
console.log(longest);

// country with 5 character
let char5 = [];
for(let i = 1; i < countries.length; i++)
{
    if(countries[i].length === 5)
    {
        char5.push(countries[i]);
    }
}
console.log(char5);

// longest in webtech array
let webLongest = [];
for(let i = 1; i < webTechs.length; i++)
{
    if(webTechs[i].length > webLongest.length)
    {
        webLongest = webTechs[i];
    }
}
console.log(webLongest);

// webtech format

let webFormat = webTechs.map(w => [w,w.length]);
console.log(webFormat)

// mern acronym

let mern = mernStack.map(m => m[0]).join('');
console.log(mern);

// reverse fruit array without reverse method
let fruits = ['banana', 'orange', 'mango', 'lemon'];
let reversed = [];

for(let i = fruits.length-1; i >= 0; i-- )
{
    reversed.push[fruits[i]];
}
console.log(reversed);

// nested array
const fullStack = [
  ['HTML', 'CSS', 'JS', 'React'],
  ['Node', 'Express', 'MongoDB']
];

for(let arr of fullStack){
    for(let tech of arr)
    {
        console.log(tech.toUpperCase());
    }
}

// copy of countries array
 let copy = [...countries];

//  sort the countries array

let sortedCountries = [...countries].sort();
console.log(sortedCountries);

let webSorted = [...webTechs].sort();
console.log(webSorted);

let mernSorted = [...mernStack].sort();
console.log(mernSorted);

// countries with land
let land1 = countries.filter(c => c.includes("land"));
console.log(land1);

// country with highest characters 
let highest = countries[0];

for(let i = 1; i < countries.length; i++)
{
    if(countries[i].length > highest.length)
    {
        highest = countries[i];
    }
}

console.log(highest);

// 4 charcter countries

let char4 = countries.filter(c => c.length === 4);
console.log(char4);

// reverse and capitalize

let revCap = [];
for(let i = countries.length-1; i >= 0; i--)
{
    revCap.push(countries[i].toUpperCase());
}
console.log(revCap);