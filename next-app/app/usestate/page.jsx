"use client";
import { useState } from "react";

export default function UseState(){

    const[name,setName] = useState("");
    const[age,setAge] = useState(26);
    const[form,setForm] = useState({
        firstName:'Raja',
        lastName:'Gopal',
        email:'raja@gmail.com'
    });

    function handleNameChange(e)
    {
        setName(e.target.value);
    }
    function increment(){
        setAge(a => a + 1);
    }
    return(
        <div className="container">
            <h2>React UseState Hook</h2>
            <input type="text" value={name} onChange={handleNameChange}></input>
            <p>Your Name : {name} you are : {age}</p>
            <button onClick={()=>{increment();increment();increment();}}>+3</button>
            <button onClick={()=>{increment();}}>+1</button>
            <hr></hr>
            <label>
                First Name :
                <input type="text" value={form.firstName} onChange={(e)=>{
                    setForm({...form,firstName:e.target.value});
                }}></input>
            </label>
            <label>
                Last Name :
                <input type="text" value={form.lastName} onChange={(e)=>{
                    setForm({...form,lastName:e.target.value});
                }}></input>
            </label>
            <label>
                Email : 
                <input type="email" value={form.email} onChange={(e)=>{
                    setForm({...form,email:e.target.value});
                }}></input>
            </label>
            <p>Hello {form.firstName} {form.lastName} your mail id : {form.email}</p>
        </div>
    )
}