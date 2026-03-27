"use client";
import { useEffect, useState } from "react";

export default function Counter(){
    const [count,setCount] = useState(0);

    useEffect(()=>{
        const intervalId = setInterval(()=>{
            setCount(prev => prev + 1);
        },1000)
        return ()=> clearInterval(intervalId);
    },[]);

    return(
        <div>
            <h1>Count : {count}</h1>
        </div>
    )
}