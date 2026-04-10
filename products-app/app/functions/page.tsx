export default function FunctionExamples(){

    // funtion type expressions
    function greeter(fn:(a:string)=>void){
        fn("Hello world");
    }
    function printConsole(s:string){
        console.log(s);
    }
    greeter(printConsole);
    // call signatures
    type DescribableFunction={
        description:string,
        (someArg:number):boolean;
    }
    function doSomething(fn:DescribableFunction){
        console.log(fn.description,"Returned",fn(6));
    }

    function myFunc(someArg:number){
        return someArg > 3;
    }
    myFunc.description="Default Description";

    doSomething(myFunc);

    // 
    
    return(
        <div>Type Script Function Examples</div>
    )
}