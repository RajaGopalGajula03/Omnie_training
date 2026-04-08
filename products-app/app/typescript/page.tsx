
export default function TsPrcatice(){

    // let myName:string = "Raja";
// console.log("Name : ", myName);


let myName = "Raja";
console.log("Name on 1st log :",myName);

myName = "Raja Gopal";
console.log("Name on 2nd log :", myName)

function greet(name:string){
    console.log("Hello ," + name.toUpperCase() + "!");
}
greet("Raja");
greet("26");
// greet(26);

function getAge(){      //getAge type is strict number 
    return 12;
}
getAge();

function getNumber(num){        //num and getNumber type is any like string,number,void,boolean
    return num;
}
console.log(getNumber(26));

async function  getNum():Promise<number> {
    return 18;
}
getNum().then((res)=> console.log(res));

const names = ["Raja","Anil",'Abhi'];

names.forEach(function(s){
    console.log(s.toUpperCase());
})

names.forEach((s)=>{
    console.log(s.toLowerCase());
})

return(
    <div>Type Script Examples - Check in console</div>
)
}