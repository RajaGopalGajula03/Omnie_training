"use client";

import { useReducer } from "react";


function reducer(state,action)
{
    if(action.type === 'incremented_age')
    {
        return{
            age: state.age+1
        };
    }
    throw Error("Unknown action.")
}

export default function Counter(){
    const[state,dispatch] = useReducer(reducer,{age:26});

    return(
        <div>
            <button onClick={()=>{
                dispatch({type:'incremented_age'})
            }}>Increase Age</button>
            <p>Hello! You are {state.age}</p>
        </div>
    )
}