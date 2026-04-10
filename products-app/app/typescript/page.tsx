

export default function TsPractice() {

    // let myName:string = "Raja";
    // console.log("Name : ", myName);


    let myName = "Raja";
    console.log("Name on 1st log :", myName);

    myName = "Raja Gopal";
    console.log("Name on 2nd log :", myName)

    function greet(name: string) {
        console.log("Hello ," + name.toUpperCase() + "!");
    }
    greet("Raja");
    greet("26");
    // greet(26);

    function getAge() {      //getAge type is strict number 
        return 12;
    }
    getAge();

    function getNumber(num) {        //num and getNumber type is any like string,number,void,boolean
        return num;
    }
    console.log(getNumber(26));

    async function getNum(): Promise<number> {
        return 18;
    }
    getNum().then((res) => console.log(res));

    const names = ["Raja", "Anil", 'Abhi'];

    names.forEach(function (s) {
        console.log(s.toUpperCase());
    })

    names.forEach((s) => {
        console.log(s.toLowerCase());
    })

    // object types

    function printCoord(pt: { x: number; y: number }) {
        console.log("The Coordinate's x value is :", pt.x);
        console.log("The Coordinate's y value is :", pt.y);
    }
    printCoord({ x: 3, y: 7 })

    function printName(obj: { first: string, last?: string }) {
        console.log("First Name : ", obj.first);
        console.log("Last Name : ", obj.last);
        // console.log(obj.last.toUpperCase());
        console.log(obj.last?.toUpperCase());
    }
    printName({ first: 'Raja' });
    printName({ first: "Raja", last: "Gopal" })

    // union types
    function printId(id: string | number) {
        console.log("your Id is ", id);
    }
    printId(21);
    printId("2")
    // printId({myid:2});
    function printIDUppercase(id: string | number) {
        if (typeof id === "string") {
            console.log("UpperCase id id:", id.toUpperCase());
        }
        else {
            console.log(id);
        }
    }
    printIDUppercase(21);
    printIDUppercase("2");
    printIDUppercase("raja");

    function welcomePeople(x: string[] | string) {
        if (Array.isArray(x)) {
            x.map((x) => {
                console.log("Hello", x)
            })
        }
        else {
            console.log("Welcome alone traveler : ", x);
        }
    }
    welcomePeople("John");
    welcomePeople(["Jon snow", "Tyrion", "Ser jora"])

    function getFirstThree(x: number[] | string) {
        console.log(x.slice(0, 3));
    }

    getFirstThree("Raja");
    getFirstThree([2, 5, 6, 7, 9]);

    // Type alias
    type point = { x: number, y: number };

    function printCoordeinator(pt: point) {
        console.log("The Coordinator x value is : ", pt.x);
        console.log("The Coordinator y value is : ", pt.y);

    }
    printCoordeinator({ x: 6, y: 2 });

    // interfaces
    interface Point {
        x: number,
        y: number
    }
    function printCoordeinators(pt: Point) {
        console.log("The Coordinator x value is : ", pt.x);
        console.log("The Coordinator y value is : ", pt.y);
    }

    printCoordeinators({ x: 10, y: 20 })

    interface animal {
        name: string
    };
    interface Bear extends animal {
        honey: boolean
    };

    function getBear():Bear {
        return{
            name:"Buntyy",
            honey:true
        }
    }
    const bear = getBear();
    console.log(bear.name);
    console.log(bear.honey);

    // interface Window{
    //     title:string
    // }

    // interface Window{
    //     ts: TypeScriptAPI;
    // }
    // const src = 'const a="Hello world"';
    // window.ts.transpileModule(src,{});

    // narrowing
    function padLeft(padding: number | string,input:string):string{
        if(typeof padding === "number")
        {
            return " " .repeat(padding) + input;
        }
        else
        {
            return padding + input;
        }
    }
    console.log(padLeft(4,"Hello"));
    console.log("Hello","This is narrowing Example");

    // typeof type gurds
    function printAll (strs : string | string [] | null){
        if(typeof strs === "object" && strs !== null){
            for(const s of strs)
            {
                console.log(s);
            }
        }
        else if( typeof strs === "string")
        {
            console.log(strs);
        }
        else
        {
            console.log(" you entered null object");
        }
    }

    printAll("Type of Example");
    printAll(['Type','of','example']);
    printAll(null);
    // printAll(false)
    // truthiness narrowing

    function multiplyAll(values: number[] | undefined, factor : number):number[] | undefined
    {
        if(!values)
        {
            return values;
        }
        else
        {
            return values.map((x)=> x * factor);
        }
    }

    console.log(multiplyAll([1,4,6,8,2],3));
    console.log(multiplyAll(undefined,1))

    // eqauality narrowing
    interface Container{
        value:number|null|undefined
    }
    
    function multiplyValue(container: Container, factor : number){
        if(container.value != null)
        {
            console.log(container.value);
            console.log(container.value *= factor);
        }       
        else{
            console.log("Null or undefined type")
        } 
    }
    multiplyValue({value:2},3)
    multiplyValue({value:undefined},3)
    // literal types

    let changingString = "Literal Example";
    console.log(changingString);
    changingString = "Can Modify";
    console.log(changingString);

    const constantString = "Can not change this string, this is literal type because of const ";
    console.log(constantString);

     function handleRequest(url:string,method: 'GET'|'POST'):void{
        console.log("Url is : ", url);
        console.log("Method is : ", method);
     }

    const req = {url:"https://example.com",method:"GET"} as const;
    handleRequest(req.url,req.method);

    // null and undefined
    function doSomething(x:string | null)
    {
        if(x === null){
            console.log("The value is null");
        }
        else{
            console.log("Hello",x.toUpperCase());
        }
    }
    doSomething(null);
    doSomething("Samwell")

    function nullAssertion(x?:number | null)
    {
        console.log(x!.toFixed());
    }
    nullAssertion(2000.00);
    // nullAssertion(undefined)
    // instanceof
    function logvalue(x:Date|string){
        if(x instanceof Date)
        {
            console.log(x.toUTCString());
        }
        else{
            console.log(x.toUpperCase());
        }
    }
    logvalue(new Date().toUTCString());

    // 


    return (
        <div>Type Script Examples - Check in console</div>
    )
}