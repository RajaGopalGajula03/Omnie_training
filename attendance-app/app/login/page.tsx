"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleLogin = async () => {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        console.log(data);
        console.log(res.status);

        if (res.ok) {
            window.location.href = "/employees";
        }
        else {
            alert(data.message);
        }
        setEmail("");
        setPassword("");
    }
    return (
        <div>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
            ></input>
            <br/>
            <br/>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                type="password"
            ></input>
            <br/>
            <br/>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}