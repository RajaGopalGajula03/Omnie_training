

let dog = {};
console.log(dog);

dog.name = "Ghost";
dog.legs = 4;
dog.color = "white";
dog.age = 5;
dog.bark = function () {
    return "woof woof";
}

const { name, legs, color, age, bark } = dog;
console.log(name, legs, color, age, bark());

dog.breed = "Husky";
dog.getDogInfo = function () {
    return `${this.name} is a ${this.breed} breed and his color is ${this.color}.`
};
console.log(dog.getDogInfo());

// level 2
const users = {
    Alex: {
        email: 'alex@alex.com',
        skills: ['HTML', 'CSS', 'JavaScript'],
        age: 20,
        isLoggedIn: false,
        points: 30
    },
    Asab: {
        email: 'asab@asab.com',
        skills: ['HTML', 'CSS', 'JavaScript', 'Redux', 'MongoDB', 'Express', 'React', 'Node'],
        age: 25,
        isLoggedIn: false,
        points: 50
    },
    Brook: {
        email: 'daniel@daniel.com',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Redux'],
        age: 30,
        isLoggedIn: true,
        points: 50
    },
    Daniel: {
        email: 'daniel@alex.com',
        skills: ['HTML', 'CSS', 'JavaScript', 'Python'],
        age: 20,
        isLoggedIn: false,
        points: 40
    },
    John: {
        email: 'john@john.com',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Redux', 'Node.js'],
        age: 20,
        isLoggedIn: true,
        points: 50
    },
    Thomas: {
        email: 'thomas@thomas.com',
        skills: ['HTML', 'CSS', 'JavaScript', 'React'],
        age: 20,
        isLoggedIn: false,
        points: 40
    },
    Paul: {
        email: 'paul@paul.com',
        skills: ['HTML', 'CSS', 'JavaScript', 'MongoDB', 'Express', 'React', 'Node'],
        age: 20,
        isLoggedIn: false,
        points: 40
    }
}

let maxSkills = 0;
let bestUser = "";

for (let user in users) {
    if (users[user].skills.length > maxSkills) {
        maxSkills = users[user].skills.length;
        bestUser = user;
    }
}
console.log(bestUser);

let loggedIn = 0;
let highPoints = 0;

for (let user in users) {
    if (users[user].isLoggedIn)
        loggedIn++;
    if (users[user].points >= 50)
        highPoints++;
}
console.log('Logged in user count : ', loggedIn);
console.log('Users with points above and equal to 50 : ', highPoints);

let mernDevelopers = [];

for (let user in users) {
    let skills = users[user].skills;
    if (skills.includes("MongoDB") && skills.includes("Express") && skills.includes("React") && skills.includes("Node")) {
        mernDevelopers.push(user)
    }
}
console.log(mernDevelopers)

let newUser = { ...users };

newUser.Raja = {
    email: 'raja@gmail.com',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    age: 26,
    isLoggedIn: false,
    points: 30
}
console.log(newUser);

console.log(Object.keys(users));

console.log(Object.values(users));

let countries = {
    India: {
        capital: 'Delhi',
        population: "1.4B",
        languages: ['Hindi', 'English', 'Telugu']
    },
    USA: {
        capital: 'New York',
        population: "335M",
        languages: ['English', 'Spanish']
    }
}

for (let country in countries) {
    let { capital, population, languages } = countries[country];

    console.log([country, capital, population, languages]);
}

// level 3

let personAccount = {
    firstName: "Raja",
    lastName: "Gopal",
    incomes: [],
    expenses: [],
    addIncome(desc, amount) {
        this.incomes.push({ desc, amount })
    },
    addExpense(desc, amount) {
        this.expenses.push({ desc, amount });
    },
    totalIncome() {
        return this.incomes.reduce((a, b) => a + b.amount, 0);
    },
    totalExpense() {
        return this.expenses.reduce((a, b) => a + b.amount, 0);
    },
    accountBalance() {
        return this.totalIncome() - this.totalExpense();
    },
    accountInfo() {
        return `${this.firstName} ${this.lastName} - Balance : ${this.accountBalance()}`;
    }
}

personAccount.addIncome("Salary", 15000);
personAccount.addIncome("Freelance", 1000);

personAccount.addExpense("Food", 2000);
personAccount.addExpense("Rent", 10000);

console.log(personAccount.totalIncome());
console.log(personAccount.totalExpense());
console.log(personAccount.accountBalance());
console.log(personAccount.accountInfo());


const users1 = [
    {
        _id: 'ab12ex',
        username: 'Alex',
        email: 'alex@alex.com',
        password: '123123',
        createdAt: '08/01/2020 9:00 AM',
        isLoggedIn: false
    },
    {
        _id: 'fg12cy',
        username: 'Asab',
        email: 'asab@asab.com',
        password: '123456',
        createdAt: '08/01/2020 9:30 AM',
        isLoggedIn: true
    },
    {
        _id: 'zwf8md',
        username: 'Brook',
        email: 'brook@brook.com',
        password: '123111',
        createdAt: '08/01/2020 9:45 AM',
        isLoggedIn: true
    },
    {
        _id: 'eefamr',
        username: 'Martha',
        email: 'martha@martha.com',
        password: '123222',
        createdAt: '08/01/2020 9:50 AM',
        isLoggedIn: false
    },
    {
        _id: 'ghderc',
        username: 'Thomas',
        email: 'thomas@thomas.com',
        password: '123333',
        createdAt: '08/01/2020 10:00 AM',
        isLoggedIn: false
    }
];

const products = [
    {
        _id: 'eedfcf',
        name: 'mobile phone',
        description: 'Huawei Honor',
        price: 200,
        ratings: [
            { userId: 'fg12cy', rate: 5 },
            { userId: 'zwf8md', rate: 4.5 }
        ],
        likes: []
    },
    {
        _id: 'aegfal',
        name: 'Laptop',
        description: 'MacPro: System Darwin',
        price: 2500,
        ratings: [],
        likes: ['fg12cy']
    },
    {
        _id: 'hedfcg',
        name: 'TV',
        description: 'Smart TV:Procaster',
        price: 400,
        ratings: [{ userId: 'fg12cy', rate: 5 }],
        likes: ['fg12cy']
    }
]

function signUp(newUser) {
    let exists = users1.some(u => u.email === newUser.email);

    if (exists) {
        console.log("User already exists");
    }
    else {
        users1.push(newUser);
        console.log("User Added");
    }
}
signUp({ email: 'test@gmail.com', name: 'Raja' });
signUp({ email: 'test@gmail.com', name: 'Raja' });

function signIn(email, password) {
    let user = users1.find(u => u.email === email && u.password === password);

    if (user) {
        user.isLoggedIn = true;
        console.log("Login Successful");
    }
    else {
        console.log("Invalid credentials")
    }
};

signIn('asab@asab.com','123456');

function rateProduct(productId, userId, rate)
{
    let product = products.find(p => p._id === productId);

    if(!product)
    {
        console.log("Product Not Found");
        return;
    }

    product.ratings.push({userId,rate});

    console.log("Rating added");
}

rateProduct("eedfcf", "user1", 5);
rateProduct("hedfcg", "user2", 4);
console.log(products);

function averageRating(productId) {
  let product = products.find(p => p._id === productId);

  let total = 0;

  for (let r of product.ratings) {
    total += r.rate;
  }

  return total / product.ratings.length;
}
averageRating("eedfcf");

