let arr = [];

let numbers = [1,2,3,4,5,6];

console.log(numbers.length);

let first = numbers[0];
let middle = numbers[Math.floor(numbers.length / 2)]
let last = numbers[numbers.length-1];

console.log(first,middle,last)

let mixedDataTypes = [1,"JS",{name:"raja"},[1,2,3],true,null];
console.log(mixedDataTypes.length);

let itCompanies = ["Facebook", "Google", "Microsoft", "Apple", "IBM", "Oracle", "Amazon"];
console.log(itCompanies);
console.log(itCompanies.length);

let firstCompany = itCompanies[0];
let middleCompany = itCompanies[Math.floor(itCompanies.length / 2)];
let lastCompany = itCompanies[itCompanies.length-1];

console.log(firstCompany,middleCompany,lastCompany);

for(let company of itCompanies)
{
    console.log(company)
}

for(let company of itCompanies)
{
    console.log(company.toUpperCase())
}

console.log(itCompanies.join(',') + " are big IT companies.");

let existsCompany = "Facebook";
if(itCompanies.includes(existsCompany))
{
    console.log(existsCompany);
}
else{
    console.log("Company Not Found");
}

for (let company of itCompanies)
{
    let count = 0;

    for (let char of company.toLowerCase())
    {
        if(char === "o")
            count++;
    }
    if(count > 1)
    {
        console.log(company)
    }
}

itCompanies.sort();
console.log(itCompanies)

itCompanies.reverse();
console.log(itCompanies);

console.log(itCompanies.slice(0,3));

console.log(itCompanies.slice(-3))

let mid = Math.floor(itCompanies.length / 2);

if(itCompanies.length % 2 === 0)
{
    console.log(itCompanies.slice(mid-1,mid+1));
}
else
{
    console.log(itCompanies[mid]);
}

itCompanies.shift();
console.log(itCompanies);

if(itCompanies.length % 2 === 0)
{
    itCompanies.splice(mid-1,2)
}
else
{
    itCompanies.splice(mid,1)
}

console.log(itCompanies);

itCompanies.pop();
console.log(itCompanies);

itCompanies = [];
console.log(itCompanies);