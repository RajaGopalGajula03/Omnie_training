class Animal{
    constructor(name,age,color,legs)
    {
        this.name = name;
        this.age = age;
        this.color = color;
        this.legs = legs;
    }
    getInfo(){
        return `${this.name} is ${this.age} years old`;
    }
    makeSound(){
        return "some sound";
    }
}

let dog = new Animal('tommy',3,'red',4);
console.log(dog.getInfo());
console.log(dog.makeSound());

class Dog extends Animal{
    constructor(name,age,color,legs,breed){
        super(name,age,color,legs);
        this.breed = breed;
    }
    makeSound(){
        return 'Woof Woof'
    }
}

class Cat extends Animal{
    constructor(name,age,color,legs,breed){
        super(name,age,color,legs);
        this.breed = breed;
    }
    makeSound(){
        return "Meow Meow"
    }
}
let d = new Dog("Rocky", 4, "black", 4, "Labrador");

console.log(d.getInfo());
console.log(d.makeSound());

let c = new Cat("Kitty", 2, "white", 4, "Persian");

console.log(c.getInfo());
console.log(c.makeSound());

// /level 2
// class Dog extends Animal{
//     makeSound(){
//         return 'Woof Woof';
//     }
// }

// class Cat extends Animal{
//     makeSound(){
//         return "Meow Meow"
//     }
// }

// level 3
class PersonAccount{
    constructor(firstName,lastName){
        this.firstName = firstName;
        this.lastName = lastName;
        this.incomes = [];
        this.expenses = [];
    }
    addIncome(desc,amount){
        this.incomes.push({desc,amount});
    }
    addExpense(desc,amount)
    {
        this.expenses.push({desc,amount})
    }
    totalIncome(){
        return this.incomes.reduce((sum,i) => sum + i.amount,0);
    }
    totalExpense(){
        return this.expenses.reduce((sum,e) => sum + e.amount,0);
    }
    accountBalance(){
        return this.totalIncome() - this.totalExpense();
    }
    accountInfo(){
        return `${this.firstName} ${this.lastName} has balance ${this.accountBalance()}`;
    }
}

let p = new PersonAccount("Raja", "Gopal");

p.addIncome("salary", 50000);
p.addIncome("freelance", 10000);

p.addExpense("food", 5000);
p.addExpense("rent", 15000);

console.log(p.accountInfo());