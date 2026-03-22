const names = ['Asabeneh', 'Brook', 'David', 'John']
const countries = [
  ['Finland', 'Helsinki'],
  ['Sweden', 'Stockholm'],
  ['Norway', 'Oslo']
]
const user = {
  name: 'Asabeneh',
  title: 'Programmer',
  country: 'Finland',
  city: 'Helsinki',
  age: 250
}
const users = [
  {
    name: 'Asabeneh',
    title: 'Programmer',
    country: 'Finland',
    city: 'Helsinki',
    age: 250
  },
  {
    name: 'Eyob',
    title: 'Teacher',
    country: 'Sweden',
    city: 'London',
    age: 25
  },
  {
    name: 'Asab',
    title: 'Instructor',
    country: 'Norway',
    city: 'Oslo',
    age: 22
  },
  {
    name: 'Matias',
    title: 'Developer',
    country: 'Denmark',
    city: 'Copenhagen',
    age: 28
  }
]

console.table(countries);
console.table(user);
console.group("User Details");
console.log("name: Asab");
console.log("country: Norway");
console.groupEnd();

console.assert(10 > 2 * 10, "Asserton Failed: 10 is not greater");
console.warn("This is warning Message");
console.error("This is an error message");

const arr = Array.from({length:1000},(_,i) => i);

console.time("for");
for(let i = 0; i < arr.length; i++)
{
    let x = arr[i];
}
console.timeEnd("for");

console.time("while");
let i = 0;
while(i < arr.length)
{
    let x = arr[i];
    i++;
}
console.timeEnd("while");

console.time("forOf");
for(let val of arr)
{
    let x = val;
}
console.timeEnd("forOf");

console.time("forEach");
arr.forEach(val =>{
    let x = val;
})
console.timeEnd('forEach');