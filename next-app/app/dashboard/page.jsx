"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const router = useRouter();
    const user = JSON.parse(sessionStorage.getItem("UserData"));

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [])

    function handleLogout() {
        sessionStorage.removeItem("UserData");
        alert("Logged out");
        router.push("/login");
    }

    return (
        <div>
            <h2>Dash Board</h2>
            <p>Welcome {user.UserName}</p>

            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}