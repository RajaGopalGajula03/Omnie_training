"use client";

import { useEffect, useState } from "react";




export default function Dashboard(){

    const [data,setData]=useState({})
    useEffect(()=>{
        async function fetchData(){

            const res = await fetch("/api/dashboard")
            const data = await res.json();
            console.log(data);
            setData(data);
        }
        fetchData();
    },[])

    return(
        <div>
            <h6>Dash board page</h6>
            <p>{data.user?.name}</p>
            <p>{data.user?.userId}</p>
        </div>
    )
}