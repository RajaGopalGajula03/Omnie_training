const employees = [{ name: 'Alice', dept: 'Engineering' }, {
    name: 'Bob',
    dept: 'Marketing'
}, { name: 'Carol', dept: 'Engineering' }, {
    name: 'Dave',
    dept: 'Marketing'
}, { name: 'Eve', dept: 'HR' }];

// 1
const group = Object.groupBy(employees, emp => emp.dept)
console.log(group);

let grouped = {};
for (let key in group) {
    grouped[key] = group[key].map(e => e.name);
}
console.log(grouped);

// 2
const nums = [12, 35, 1, 10, 34, 1];

let unique = [...new Set(nums)];
console.log(unique)

let largest = 0;
let second = 0;

for (let num of unique) {
    if (num > largest) {
        second = largest;
        largest = num;
    }
    else if (num > second && num < largest) {
        second = num
    }
}
console.log(second);

// 3
const deep = [1, [2, [3, [4, [5]]]]];

let flattend = deep.flat(Infinity);
console.log(flattend);

// let flatten = deep.reduce((acc,cur) => acc.concat(cur),[]);
// console.log(flatten);

const flatten = (deep) =>
    deep.reduce((acc, cur) =>
        Array.isArray(cur) ? acc.concat(flatten(cur)) : acc.concat(cur), [])
console.log(flatten(deep));

// 4
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function chunk(arr, size) {
    let result = [];

    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
console.log(chunk(arr, 3));

// 5
const a = [1,2,3,4,5]; 
const b = [3,4,5,6,7];

let aIntersectionb = [];

for(let i = 0; i < a.length; i++){
    if(b.includes(a[i]))
        aIntersectionb.push(a[i]);
}
console.log(aIntersectionb);

let result = a.filter(item => b.includes(item));
console.log(result);

// 6
const array = [1,2,3,4,5];
const k = 2;

const rotated = [...array.slice(-k),...array.slice(0,-k)];
console.log(rotated);

// 7
const people = [ { name:'Charlie', age:25 }, { name:'Alice', age:30 }, { name:'Bob',
age:25 }, { name:'Dave', age:30 } ];

const sorted = people.sort((a,b)=>{
    if(a.age === b.age)
    {
        return a.name.localeCompare(b.name);
    }
    return a.age - b.age;
})
console.log(sorted);

// 8


// 9
const arr1 = [0, 'hello', false, 42, '', null, 'world', undefined, NaN, true];
const cleaned = arr1.filter(item => item !== false && item !== null && item !== undefined && item !== "" && item !== 0 && !Number.isNaN(item));
console.log(cleaned);

// 10 
const names = ['Alice','Bob','Carol']; 
const scores = [95, 80, 88];

const zippedArrays = names.map((name,i)=> ({name : name, score : scores[i]}));
console.log(zippedArrays);

// 12 
const map = { a:'apple', b:'banana', c:'cherry' };

let inverted = {};

for(let key in map)
{
    let value = map[key];
    inverted[value] = key;
}
console.log(inverted);

// 14

const user = { id:1, name:'Alice', email:'alice@mail.com', password:'secret',
role:'admin' };

const pick = (obj,keys) =>(
    Object.fromEntries(keys.map(k=> [k,obj[k]]))
)
console.log(pick(user,['name','email']));

// 15
const omit = (obj,keys) =>(
    Object.fromEntries(Object.entries(obj).filter(([key])=> !keys.includes(key)))
)
console.log(omit(user, ['password','role']));

// 16
const nested = { name: 'Alice', address: { city:'Delhi', zip:'110001' }, scores: {
math:90, science:85 } };

const flattenObj = (obj) =>(
    Object.entries(obj).reduce((acc,[key,value])=>{
        if(value && typeof value === 'object' && !Array.isArray(value))
        {
            Object.assign(acc,value);
        }
        else
        {
            acc[key] = value;
        }
        return acc;
    },{})
)

console.log(flattenObj(nested));

// 17
const fruits = ['apple','banana','apple','cherry','banana','apple'];

const count = fruits.reduce((acc,fruit)=>{
    acc[fruit] = (acc[fruit] || 0) + 1;
    return acc;
},{});

console.log(count);

// 19
const config = { db:{ host:'localhost', port:5432 }, debug:true };

function deepFreeze(obj)
{
    Object.freeze(obj);

    for(let key in obj)
    {
        const value = obj[key];
        if(value && typeof value === 'object' && !Object.isFrozen(value))
        {
            deepFreeze(value);
        }
    }
    return obj;
}

console.log(deepFreeze(config));

// 20
const users = [ { _id:'u1', name:'Alice' }, { _id:'u2', name:'Bob' }, { _id:'u3',
name:'Carol' } ];

const lookup = users.reduce((acc,user)=>{
    acc[user._id] = user;
    return acc;
},{});
console.log(lookup['u1']);
console.log(lookup['u2']);

// 21
const s1 = 'A man a plan a canal Panama';
const s2 = 'hello';

function isPalindrome(str)
{
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g,'');

    return cleaned === cleaned.split('').reverse().join('');
}

console.log(isPalindrome(s1));
console.log(isPalindrome(s2));

// 22
const str = 'hello world, welcome to javascript';
let countl = 0;
for(let ch of str)
{
    if(ch === 'l')
        countl++;
}
console.log(countl);

// 23
const sentence = 'the quick brown fox jumps over the lazy dog';

const capitalize = sentence.replace(/\b\w/g, ch => ch.toUpperCase());
console.log(capitalize);

// 24
const text = 'JavaScript is a versatile and powerful programming language';
function turncate(text,maxLen)
{
    if(text.length <= maxLen)
        return text;
    return text.slice(0,maxLen - 3) + "...";
}
console.log(turncate(text,20));

// 25
const str2 = 'Order 3 items at $45 each, total $135 for 1 customer';
const numbers = str2.match(/\d+/g).map(Number);
console.log(numbers);

// 26
const str3 = 'listen'; 
const str4 = 'silent'; 

function isAnagram(str3,str4){
    const cleaned = str => str.toLowerCase().replace(/[^a-z0-9]/g,'');

    return cleaned(s1).split('').sort().join('') === cleaned(s2).split('').sort().join('');
}

// 29
const sentence1 = 'The quick brown fox jumps over the lazy dog';

const longestWord = sentence1.split(" ").reduce((a,b)=>(b.length > a.length ? b : a));

console.log(longestWord);

// 27
const stren = 'aaabbbccddddee';

function compress(stren)
{
    let compresed = '';
    let count = 1;

    for(let i = 0; i < stren.length; i++){
        if(stren[i] === stren[i + 1]){
            count++;
        }
        else
        {
            compresed += stren[i]+count;
            count = 1;
        }
    }
    return compresed;
}
console.log(compress(stren));