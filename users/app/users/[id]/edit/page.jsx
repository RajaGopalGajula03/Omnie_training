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
            height:"",
            weight:"",
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("First Name Required"),
            lastName: Yup.string().required("Last Name Required"),
            username: Yup.string().required("User Name required"),
            email: Yup.string().email().required("Email is Required"),
        }),
        enableReinitialize: true,
        onSubmit: async (values) => {
            await fetch(`https://dummyjson.com/users/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            router.push("/users");
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
                height:data.height || '',
                weight:data.weight || "",
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
                            onChange={formik.handleChange}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.address}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="State"
                            name="State"
                            value={formik.values.state}
                            onChange={formik.state}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Postal Code"
                            name="postalCode"
                            value={formik.values.postalCode}
                            onChange={formik.postalCode}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.phone}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Height"
                            name="height"
                            value={formik.values.height}
                            onChange={formik.height}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Weight"
                            name="weight"
                            value={formik.values.weight}
                            onChange={formik.weight}
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