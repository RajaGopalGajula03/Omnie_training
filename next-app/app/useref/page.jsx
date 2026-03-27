"use client";

import { useRef } from "react";

export default function Counter(){
    let ref = useRef(0);


    function handleClick(){
        ref.current = ref.current + 1;
        alert("You clicked " + ref.current + " times!")
    }

    return(
        <div>
            <button onClick={handleClick}>Click me!</button>
            {/* <h2>{ref.current}</h2> */}
        </div>
    )
}