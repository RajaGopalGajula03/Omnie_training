"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Dashboard(){
    const router = useRouter();
    const[user,setUser] = useState(null);
    
    useEffect(()=>{
        const token = localStorage.getItem("accessToken");
        if(!token){
            router.push("/login");
        }
        const fetchUser = async()=>{
            try{
                const res = await fetch("https://dummyjson.com/user/me",{
                    method:"GET",
                    headers:{Authorization: `Bearer ${token}`,}
                });
                const data = await res.json();
                if(!res.ok){
                    console.log("Invalid Token");
                    router.push("/login");
                    return;
                }

                setUser(data);
            }
            catch(error){
                console.log(error);
            }
        }
        fetchUser();
    },[])
    const handleLogout = () =>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem("refreshToken");
        router.push("/login");
    }
    return(
        <Box maxWidth={600} mx="auto"  mt={5}>
            <Typography variant="h4" mb={2}>
                Dashboard
            </Typography>
            {!user ? (
                <Typography variant="h4" mt={2}>Loading User...</Typography>
            ):(
                <Box boxShadow={3} p={3} borderRadius={2}>
                    <Box textAlign="center" mb={3}>
                        <img src={user.image}
                        alt="profile"
                        style={{borderRadius:"50%", width : 100}}></img>
                        <p>Name : {user.firstName} {user.lastName}</p>
                        <p>User Name : {user.username}</p>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="h6">Address</Typography>
                        <p>{user.address.address} {user.address.city}</p>
                        <p>{user.address.state} {user.address.stateCode}</p>
                        <p>{user.address.country}</p>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="h6">Company</Typography>
                        <p>{user.company.name}</p>
                        <p>{user.address.title}</p>
                        <p>{user.address.department}</p>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="h6">Bank</Typography>
                        <p>Card Type : {user.bank.cardType}</p>
                        <p>Currency : {user.bank.currency}</p>
                    </Box>
                </Box>
            )}
            <Button variant="contained" color="error" onClick={handleLogout} sx={{mt:3}}>Logout</Button>
        </Box>
    )
}