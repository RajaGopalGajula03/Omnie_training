import { countries } from "./countries.js";

let emptySet = new Set();
console.log(emptySet);

let set = new Set();

for(let i = 1; i <= 10; i++)
{
    set.add(i);
}
console.log(set);

set.delete(5);
console.log(set);

set.clear();
console.log(set);

let arr = ["India","Russia","Iran","USA","UK"];

let setFromArr = new Set(arr);
console.log(setFromArr);

const countries1 = ['Finland', 'Sweden', 'Norway']

let map = new Map();
countries1.forEach(c => {
    map.set(c,c.length);
});
console.log(map);

// level 2

const a = [4, 5, 8, 9]
const b = [3, 4, 5, 7]

let union = new Set([...a, ...b]);
console.log(union);

let intersection = new Set(
    [...a].filter(x => b.includes(x))
);
console.log(intersection);

let difference = new Set(
    [...a].filter(x => !b.includes(x))
);
console.log(difference);

// level 3

function countLanguages(countries)
{
    let set = new Set();

    countries.forEach(c =>{
        c.languages.forEach(lang =>{
            set.add(lang);
        })
    })
    return set.size;
}
console.log(countLanguages(countries));

function mostSpokenLanguages(countries,n)
{
    let langCount = {};

    countries.forEach(c =>{
        c.languages.forEach(lang=>{
            langCount[lang] = (langCount[lang] || 0) + 1;
        })
    });

    return Object.entries(langCount).sort((a,b) => b[1] - a[1])
    .slice(0,n).map(([lang,count])=>({[lang]: count}));
}

console.log(mostSpokenLanguages(countries,10));
console.log(mostSpokenLanguages(countries,3));