"use client";

import { Box, Typography, Grid, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import * as Yup from "yup"

export default function EditUser() {
    const { id } = useParams();
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            address: "",
            state: "",
            postalCode: "",
            phone: "",
            height: "",
            weight: "",
            country: "",
            cardExpire: "",
            cardNumber: "",
            cardType: '',
            department: '',
            name: '',
            title: '',
            coin: '',
            wallet: '',
            network: '',
            city: "",
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("First Name Required"),
            lastName: Yup.string().required("Last Name Required"),
            email: Yup.string().email().required("Email is Required"),
            username: Yup.string().min(3, "Required minimum 3 charcters").required("User Name Required"),
            postalCode: Yup.string()
                .matches(/^[0-9]{5,6}$/, "Postal code must be 5 or 6 digits")
                .required("Postal Code Required"),
            phone: Yup.string().required("Phone number required"),

        }),
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log("Submitting", values);
            try {
                await fetch(`https://dummyjson.com/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });
                router.push("/users");
            }
            catch(error) {
                console.log(error)
            }
        },
    })

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`https://dummyjson.com/users/${id}`);
            const data = await res.json();

            formik.setValues({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || "",
                username: data.username || "",
                address: data.address.address || "",
                state: data.address.state || "",
                postalCode: data.address.postalCode || "",
                phone: data.phone || "",
                height: data.height || '',
                weight: data.weight || "",
                country: data.address.country || "",
                cardExpire: data.bank.cardExpire || "",
                cardNumber: data.bank.cardNumber || "",
                cardType: data.bank.cardType || "",
                department: data.company.department || "",
                name: data.company.name || "",
                title: data.company.title || "",
                coin: data.crypto.coin || "",
                wallet: data.crypto.wallet || "",
                network: data.crypto.network || "",
                city: data.address.city || "",
            })
        }
        fetchUser();
    }, [id])

    return (
        <Box maxWidth={600} mx="auto" mt={4}>
            <Typography variant="h5">Edit User</Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="State"
                            name="state"
                            value={formik.values.state}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.state && Boolean(formik.errors.state)}
                            helperText={formik.touched.state && formik.errors.state}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Postal Code"
                            name="postalCode"
                            value={formik.values.postalCode}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                            helperText={formik.touched.postalCode && formik.errors.postalCode}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Country"
                            name="country"
                            value={formik.values.country}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.country && Boolean(formik.errors.country)}
                            helperText={formik.touched.country && formik.errors.country}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.city && Boolean(formik.errors.city)}
                            helperText={formik.touched.city && formik.errors.city}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Height"
                            name="height"
                            value={formik.values.height}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.height && Boolean(formik.errors.height)}
                            helperText={formik.touched.height && formik.errors.height}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Weight"
                            name="weight"
                            value={formik.values.weight}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.weight && Boolean(formik.errors.weight)}
                            helperText={formik.touched.weight && formik.errors.weight}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Card Expiry"
                            name="cardExpire"
                            value={formik.values.cardExpire}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.cardExpire && Boolean(formik.errors.cardExpire)}
                            helperText={formik.touched.cardExpire && formik.errors.cardExpire}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Card Number"
                            name="cardNumber"
                            value={formik.values.cardNumber}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
                            helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Card Type"
                            name="cardType"
                            value={formik.values.cardType}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.cardType && Boolean(formik.errors.cardType)}
                            helperText={formik.touched.cardType && formik.errors.cardType}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Department"
                            name="department"
                            value={formik.values.department}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.department && Boolean(formik.errors.department)}
                            helperText={formik.touched.department && formik.errors.department}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Coin"
                            name="coin"
                            value={formik.values.coin}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.coin && Boolean(formik.errors.coin)}
                            helperText={formik.touched.coin && formik.errors.coin}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Wallet"
                            name="wallet"
                            value={formik.values.wallet}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.wallet && Boolean(formik.errors.wallet)}
                            helperText={formik.touched.wallet && formik.errors.wallet}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Network"
                            name="network"
                            value={formik.values.network}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.network && Boolean(formik.errors.network)}
                            helperText={formik.touched.network && formik.errors.network}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained">
                            Update User
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}