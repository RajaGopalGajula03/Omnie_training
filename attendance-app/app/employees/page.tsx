"use client";

import { useEffect, useState } from "react";

export default function Dashboard(){
    const[data,setData] = useState([]);

    useEffect(()=>{
        async function fetchData(){
            const res = await fetch("/api/employees");
            if(res.status === 401)
            {
                window.location.href = "/login";
                return;
            }

            const data = await res.json();
            setData(data);
        }
        fetchData();
    },[])
    return(
        <div>
            <h4>Employees</h4>
            {data.length === 0?<p>Loading...</p>:(
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Emp Id</th>
                            <th>Emp Name</th>
                            <th>Emp Email</th>
                            <th>Emp Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((emp:any)=>(
                            <tr key={emp.id}>
                                <td>{emp.id}</td>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.role}</td>
                                <td>
                                    <button>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}