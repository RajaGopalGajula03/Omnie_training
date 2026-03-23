function outer(){
    let count = 0;

    function inner(){
        count++;
        return count;
    }
    return inner;
}

const counter = outer();
console.log(counter());
console.log(counter());

function counTer(){
    
    let count = 0;

    function increment(){
        count++;
        return count;
    }
    function decrement(){
        count--;
        return count;
    }
    function reset(){
        count = 0;
        return count;
    }
    return{
        increment,decrement,reset
    }
}

const counterNum = counTer();
console.log(counterNum.increment());
console.log(counterNum.increment());
console.log(counterNum.decrement());
console.log(counterNum.reset());

function personAccount(firstName,lastName){

    let incomes = [];
    let expenses = [];

    function addIncome(desc,amount)
    {
        incomes.push({desc,amount})
    }

    function addExpense(desc,amount)
    {
        expenses.push({desc,amount})
    }

    function totalIncome()
    {
        return incomes.reduce((sum,i)=> sum + i.amount,0);
    }
    function totalExpense(){
        return expenses.reduce((sum,i)=> sum + i.amount,0);
    }
    function accountBalance(){
        return totalIncome() - totalExpense();
    }
    function accountInfo(){
        return `${firstName} ${lastName} balance : ${accountBalance()}`;
    }
    return{
        addIncome,addExpense,totalIncome,totalExpense,accountBalance,accountInfo
    }
}

const account = personAccount('Raja','Gopal');

account.addIncome("Salary",50000);
account.addExpense("Foos",5000);

console.log(account.totalIncome());
console.log(account.totalExpense());
console.log(account.accountBalance());
console.log(account.accountInfo());