function fullName() {
    return "Raja Gopal Gajula";
}
console.log(fullName());

function fullNameParameter(firstName, lastName) {
    return firstName + " " + lastName;
}
console.log(fullNameParameter("Raja Gopal", "Gajula"));

function addNumber(a, b) {
    return a + b;
}
console.log(addNumber(23, 34));

function areaOfRectangle(length, width) {
    return length * width;
}
console.log(areaOfRectangle(60, 22));

function perimeterOfRectangle(length, width) {
    return 2 * (length + width);
}
console.log(perimeterOfRectangle(60, 22));

function volumeOfRectPrism(length, width, height) {
    return length * width * height;
}
console.log(volumeOfRectPrism(60, 22, 30));

function areaOfCircle(r) {
    return Math.PI * r * r;
}
console.log(areaOfCircle(22));

function circumOfCircle(r) {
    return 2 * Math.PI * r;
}
console.log(circumOfCircle(10));

function density(mass, volume) {
    return mass / volume;
}
console.log(density(255, 12));

function speed(distance, time) {
    return distance / time;
}
console.log(speed(421, 7));

function weight(mass, gravity) {
    return mass * gravity;
}
console.log(weight(36, 12));

function convertCelsiusToFahrenheit(oC) {
    return (oC * 9 / 5) + 32;
}
console.log(convertCelsiusToFahrenheit(35));

function bmi(weight, height) {
    let bmi = weight / (height * height);

    if (bmi < 18.5) return "Underweight";
    else if (bmi <= 24.9) return "Normal weight";
    else if (bmi <= 29.9) return "Over weight";
    else return "Obese";
}
console.log(bmi(90, 1.85));

function checkSeason(month) {
    month = month.toLowerCase();

    if (['september', 'october', 'november'].includes(month))
        return "Autumn";
    else if (['december', 'january', 'february'].includes(month))
        return "Winter";
    else if (['march', 'april', 'may'].includes(month))
        return "Spring";
    else if (['june', 'july,august'].includes(month))
        return "Summer";
    else
        return "Invalid Month";
}
console.log(checkSeason("march"));

function findMax(a, b, c) {
    let max = a;

    if (b > max) max = b;
    if (c > max) max = c;

    return max;
}
console.log(findMax(0, 10, 5));
console.log(findMax(0, -10, -2));

// level2
function solveLinEquation(a, b, c, x) {
    let y = (-c - a * x) / b;
    return y;
}
console.log(solveLinEquation(5, 3, 1, 6));

function solveQuadratic(a, b, c) {
    let discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return "No real roots";
    }

    if (discriminant === 0) {
        let root = -b / (2 * a);
        return [root];
    }

    let root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    let root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    return [root1, root2];
}
console.log(solveQuadratic())
console.log(solveQuadratic(1, 4, 4))
console.log(solveQuadratic(1, -1, -2))
console.log(solveQuadratic(1, 7, 12))
console.log(solveQuadratic(1, 0, -4))
console.log(solveQuadratic(1, -1, 0))

function printArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}
printArray([1, 4, 2, 4, 6, 7, 6, 9, 0]);

function showDateTime() {
    let now = new Date();

    let day = String(now.getDate()).padStart(2, "0");
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let year = now.getFullYear();

    let hours = String(now.getHours()).padStart(2, "0");
    let mins = String(now.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${mins}`;
}
console.log(showDateTime());

function swapValues(x, y) {
    return [y, x];
}
console.log(swapValues(3, 4));

function reverseArray(arr) {
    let reversed = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        reversed.push(arr[i]);
    }
    return reversed;
}
console.log(reverseArray([1, 2, 3, 4, 5]));

function capitalizeArray(arr) {
    let capitalized = [];
    for (let i = 0; i < arr.length; i++) {
        capitalized.push(arr[i].toUpperCase());
    }
    return capitalized;
}
console.log(capitalizeArray(['raja', 'gajula', 'gopal']));

let arr = [];
function addItem(item) {
    arr.push(item);
    return arr;
}
console.log(addItem(1));
console.log(addItem(2));
console.log(addItem(3));
console.log(addItem(4));

function removeItem(index) {
    arr.splice(index, 1);
    return arr;
}
console.log(removeItem(2));

function sumOfNumbers(n) {
    let sum = 0;
    for (let i = 0; i <= n; i++) {
        sum += i;
    }
    return sum;
}
console.log(sumOfNumbers(10))

function sumOfOdds(n) {
    let sumofOdds = 0;
    for (let i = 0; i <= n; i++) {
        if (i % 2 !== 0) {
            sumofOdds += i;
        }
    }
    return sumofOdds;
}
console.log(sumOfOdds(10));

function sumOfEven(n) {
    let evenSum = 0;
    for (let i = 0; i <= n; i++) {
        if (i % 2 === 0)
            evenSum += i;
    }
    return evenSum;
}
console.log(sumOfEven(100));

function evensAndOdds(n) {
    let even = 0;
    let odd = 0;

    for (let i = 0; i <= n; i++) {
        if (i % 2 === 0) {
            even++;
        }
        else {
            odd++;
        }
    }
    return [even, odd]
}
console.log(evensAndOdds(100));

function sum(...args) {
    let total = 0;

    for (let num of args) {
        total += num;
    }
    return total;
}
console.log(sum(1, 2, 3, 4, 5));

function randomHexaNumberGenerator() {
    let hex = '#';
    let chars = '0123456789abcdef';

    for (let i = 0; i < 6; i++) {
        hex += chars[Math.floor(Math.random() * 16)];
    }
    return hex;
}
console.log(randomHexaNumberGenerator());

function userIdGenerator() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";

    for(let i = 0; i < 7;i++)
    {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}
console.log(userIdGenerator());

function rgbColorGenerator()
{
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`;
}
console.log(rgbColorGenerator());

function arrayOfHexaColors(num)
{
    let result = [];
    
    for(let i = 0; i < num; i++)
    {
        result.push(randomHexaNumberGenerator());
    }
    return result;
}
console.log(arrayOfHexaColors(3));

function arrayOfRgbColors(n)
{
    let result = [];

    for(let i = 0; i < n; i++)
    {
        result.push(rgbColorGenerator());
    }
    return result;
}
console.log(arrayOfRgbColors(4));

function shuffleArray(arr)
{
    let newArr = [...arr];

    for(let i = newArr.length-1; i > 0; i--)
    {
        let j = Math.floor(Math.random() * (i + 1));

        let temp = newArr[i];
        newArr[i] = newArr[j];
        newArr[j] = temp;
    }
    return newArr;  
}
console.log(shuffleArray([1,2,3,4,5,6]));

function factorial(n)
{
    let result = 1;

    for(let i = 1; i <= n; i++)
    {
        result *= i;
    }
    return result;
}
console.log(factorial(4));

function isEmpty(val) {
  if(val === null || val === undefined)
    return true;
  
  if(val === "string" && val.trim() === "")
    return true;

  return false;
}
console.log(isEmpty());

function sumOfArrayItems(arr)
{
    let sum = 0;
    for(let item of arr)
    {
        if(typeof item !== "number")
        {
            return " Not all numbers";
        }
        else
        {
            sum += item;
        }
    }
    return sum;
}
console.log(sumOfArrayItems([1,2,3,4]));

function average(arr)
{
    let average = 0;
    average = sumOfArrayItems(arr) / arr.length;

    return average;
}
console.log(average([1,2,3,4,5]))

function modifyArray(arr)
{
    if(arr.length < 5) return "Not Found";

    arr[4] = arr[4].toUpperCase();  
    return arr;
}
console.log(modifyArray(['Avocado', 'Tomato', 'Potato','Mango', 'Lemon','Carrot']));
console.log(modifyArray(['Google', 'Facebook','Apple', 'Amazon','Microsoft',  'IBM']));
console.log(modifyArray(['Google', 'Facebook','Apple', 'Amazon']));

function isPrime(n)
{
    if(n < 2) 
        return false;

    for(let i = 2; i < n; i++)
    {
        if(n % i === 0)
            return false;
    }
    return true;
}
console.log(isPrime(7));
console.log(isPrime(9));

function sevenRandomNumber()
{
    let arr = [];

    for(let i = 0; arr.length < 7; i++)
    {
        let num = Math.floor(Math.random() * 10);

        if(!arr.includes(num))
        {
            arr.push(num)
        }
    }
    return arr;
}
console.log(sevenRandomNumber());

function reverseCountries(countries)
{
    let copy = [...countries];
    return copy.reverse();
}
console.log(reverseCountries(['Albania','Bolivia','Canada','Denmark','Ethiopia','Finland','Germany','Hungary','Ireland','Japan','Kenya']));
