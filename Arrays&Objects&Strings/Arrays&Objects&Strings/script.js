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
