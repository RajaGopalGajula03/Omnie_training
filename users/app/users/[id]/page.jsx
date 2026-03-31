"use client";

import { Card, CardContent, Typography, Grid, Avatar, Divider } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function UserDetails() {

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
                        <Typography variant="h5">
                            {user.firstName}{user.lastName}
                        </Typography>
                        <Typography color="text.secondary">
                            @{user.username}
                        </Typography>
                        <Typography>
                            Age: {user.age}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Address</Typography>
                <Typography>
                    {user.address.address}, {user.address.city}
                </Typography>
                <Typography>
                    {user.address.state} - {user.address.postalCode}
                </Typography>

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

            </CardContent>
        </Card>
    )
}