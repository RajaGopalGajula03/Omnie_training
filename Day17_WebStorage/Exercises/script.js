localStorage.setItem("firstName", 'Raja');
localStorage.setItem("lastName", 'Gopal');
localStorage.setItem("age", 26);
localStorage.setItem("country", 'India');
localStorage.setItem("city", 'Tenali');

console.log(localStorage.getItem('firstName'));
console.log(localStorage.getItem('lastName'));
console.log(localStorage.getItem('age'));
console.log(localStorage.getItem('country'));
console.log(localStorage.getItem('city'));

const student = {
    firstName: "Raja",
    lastName: "Gopal",
    age: 25,
    skills: ["HTML", "CSS", "JS"],
    country: "India"
}

localStorage.setItem("studen", JSON.stringify(student));

const data = JSON.parse(localStorage.getItem("student"));
console.log(data);

class PersonAccount {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.incomes = [];
        this.expenses = [];
    }

    addIncome(desc, amount) {
        this.incomes.push({ desc, amount });
        this.save();
    }

    addExpense(desc, amount) {
        this.expenses.push({ desc, amount });
        this.save();
    }

    totalIncome() {
        return this.incomes.reduce((sum, i) => sum + i.amount, 0);
    }

    totalExpense() {
        return this.expenses.reduce((sum, e) => sum + e.amount, 0);
    }

    accountBalance() {
        return this.totalIncome() - this.totalExpense();
    }

    accountInfo() {
        return `${this.firstName} ${this.lastName} balance: ${this.accountBalance()}`;
    }

    save() {
        localStorage.setItem("account", JSON.stringify(this));
    }

    static load() {
        const data = JSON.parse(localStorage.getItem("account"));
        if (!data) return null;

        let acc = new PersonAccount(data.firstName, data.lastName);
        acc.incomes = data.incomes;
        acc.expenses = data.expenses;

        return acc;
    }
}

let account = new PersonAccount("Raja", "Gopal");

account.addIncome("Salary", 50000);
account.addExpense("Food", 5000);

console.log(account.accountBalance());

