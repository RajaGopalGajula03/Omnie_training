"use client";

import { Card, CardContent, Typography, Grid, Avatar, Divider, Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDetails() {
    const router = useRouter();

    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`https://dummyjson.com/users/${id}`);
            const data = await res.json();
            console.log(data);
            setUser(data);
        }
        fetchUser();
    }, [id])

    if (!user) return <p>Loading...</p>
    
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar src={user.image} sx={{ width: 80, height: 80 }}></Avatar>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">{user.firstName}{user.lastName}</Typography>
                        <Typography color="text.secondary">@{user.username}</Typography>
                        <Typography>Age: {user.age}</Typography>
                    </Grid>
                </Grid>
                <Typography mt={3}>Role: {user.role}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Personal Details</Typography>
                <Typography>Email : {user.email}</Typography>
                <Typography>Phone : {user.phone}</Typography>
                <Typography>Date of Birth : {user.birthDate}</Typography>
                <Typography>Blood Group : {user.bloodGroup}</Typography>
                <Typography>University : {user.university}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Address</Typography>
                <Typography>{user.address.address}, {user.address.city}</Typography>
                <Typography>{user.address.state} - {user.address.postalCode}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Company</Typography>
                <Typography><b>Name:</b> {user.company.name}</Typography>
                <Typography><b>Department:</b> {user.company.department}</Typography>
                <Typography><b>Title:</b> {user.company.title}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Bank Details</Typography>
                <Typography><b>Card Number:</b> {user.bank.cardNumber}</Typography>
                <Typography><b>Card Type:</b> {user.bank.cardType}</Typography>
                <Typography><b>Currency:</b> {user.bank.currency}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Crypto Details</Typography>
                <Typography><b>Card Number:</b> {user.crypto.coin}</Typography>
                <Typography><b>Card Type:</b> {user.crypto.wallet}</Typography>
                <Typography><b>Currency:</b> {user.crypto.network}</Typography>
            </CardContent>
            <Button variant="contained" sx={{ mb: 3, ml: 5 }} onClick={() => router.push("/users")}>Users</Button>
        </Card>
    )
}