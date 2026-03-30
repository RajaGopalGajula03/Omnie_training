"use client";

import { useReducer } from "react";


function reducer(state,action)
{
    switch(action.type)
    {
        case "increment_age":{
            return{
                name:state.name,
                age:state.age+1
            };
        }
        case 'name_change':{
            return{
                name:action.nextName,
                age:state.age
            }
        }
    }
    throw Error("Unknow action : " +action.type )
}

const initialState = {name:'Raja',age:26}
export default function Form(){
    const [state,dispatch] = useReducer(reducer,initialState);


    function handleIncrement(){
        dispatch({type:'increment_age'});
    }
    function handleInputChange(e){
        dispatch({
            type:'name_change',
            nextName:e.target.value
        })
    }

    return(
        <div>
            <h1>Use Reducer Example</h1>
            <input type="text" style={{marginBottom: "10px"}} value={state.nane} onChange={handleInputChange}></input><br></br>
            <button onClick={handleIncrement}>Increment Age</button>
            <p>Hello, {state.name}. You are {state.age}</p>
        </div>
    )
}