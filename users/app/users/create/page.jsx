"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Box, TextField, Button, Grid, Typography, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function CreateUser() {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            maidenName: '',
            age: '',
            gender: '',
            email: '',
            phone: '',
            username: '',
            password: '',
            birthDate: '',
            bloodGroup: '',
            height: '',
            weight: '',

            address: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',

            department: '',
            name: '',
            title: '',

            cardExpire: '',
            cardNumber: '',
            cardType: '',

            coin: '',
            wallet: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("First Name is Required"),
            lastName: Yup.string().required("Last Name is Required"),
            maidenName: Yup.string(),
            age: Yup.number().typeError("Age must be number").min(18, "Age Must be 18").required("Age is Required"),
            gender: Yup.string(),
            email: Yup.string().email("Invalid Email").required("Email is required"),
            phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required("Phone is required"),
            username: Yup.string().min(3, "Minimum 3 Characters").required("User Name is required"),
            password: Yup.string().min(6, "Minimum 6 characters").required("Password is Required"),
            birthDate: Yup.date().typeError("Invalid date").required("Birthdate is required"),
            bloodGroup: Yup.string(),

            height: Yup.number().typeError("Must be Nunmber"),
            weight: Yup.number().typeError("Must be Number"),

            address: Yup.string().required("Address required"),
            city: Yup.string(),
            state: Yup.string().required("State required"),
            postalCode: Yup.string().matches(/^[0-9]{5,6}$/, "Invalid postal code").required("Postal code required"),
            country: Yup.string().required("Country required"),

            department: Yup.string(),
            name: Yup.string(),
            title: Yup.string(),

            cardExpire: Yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/YY"),
            cardNumber: Yup.string().length(16, "Card number must be 16 digits").matches(/^[0-9]+$/, "Only numbers allowed"),
            cardType: Yup.string(),

            coin: Yup.string(),
            wallet: Yup.string(),
        }),
        onSubmit: async (values) => {
            const payload = {
                ...values,
                address: {
                    address: values.address,
                    city: values.city,
                    state: values.state,
                    postalCode: values.postalCode,
                    country: values.country,
                },
                company: {
                    department: values.department,
                    name: values.name,
                    title: values.title,
                },

                bank: {
                    cardExpire: values.cardExpire,
                    cardNumber: values.cardNumber,
                    cardType: values.cardType,
                },

                crypto: {
                    coin: values.coin,
                    wallet: values.wallet,
                },
            }
            await fetch("https://dummyjson.com/users/add", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(payload),
            });
            router.push("/users");
        },
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box maxWidth={900} mx="auto" mt={4} mb={4}>
                <Typography variant="h4" mb={2}>
                    Create User
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>Personal Information</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Middle Name"
                                name="maidenName"
                                value={formik.values.maidenName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.maidenName && Boolean(formik.errors.maidenName)}
                                helperText={formik.touched.maidenName && formik.errors.maidenName}
                            ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Enter Age"
                                name="age"
                                value={formik.values.age}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.age && Boolean(formik.errors.age)}
                                helperText={formik.touched.age && formik.errors.age}
                            ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                select
                                fullWidth
                                label="Gender"
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                                helperText={formik.touched.gender && formik.errors.gender}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <DatePicker
                                label="Birth Date"
                                value={formik.values.birthDate ? dayjs(formik.values.birthDate) : null}
                                onChange={(value) =>
                                    formik.setFieldValue(
                                        "birthDate",
                                        value ? value.format("YYYY-MM-DD") : ""
                                    )
                                }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: formik.touched.birthDate && Boolean(formik.errors.birthDate),
                                        helperText: formik.touched.birthDate && formik.errors.birthDate,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                select
                                fullWidth
                                label="Blood Group"
                                name="bloodGroup"
                                value={formik.values.bloodGroup}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.bloodGroup && Boolean(formik.errors.bloodGroup)}
                                helperText={formik.touched.bloodGroup && formik.errors.bloodGroup}
                            >
                                <MenuItem value="O+">O+</MenuItem>
                                <MenuItem value="O-">O-</MenuItem>
                                <MenuItem value="A+">A+</MenuItem>
                                <MenuItem value="A-">A-</MenuItem>
                                <MenuItem value="B+">B+</MenuItem>
                                <MenuItem value="B-">B-</MenuItem>
                                <MenuItem value="AB+">AB+</MenuItem>
                                <MenuItem value="AB-">AB-</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={4}>
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

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Weight"
                                name="weight"
                                value={formik.values.weight}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.weight && Boolean(formik.errors.weight)}
                                helperText={formik.touched.weight && formik.errors.weight}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Address</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                alue={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.city && Boolean(formik.errors.city)}
                                helperText={formik.touched.city && formik.errors.city}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={formik.values.state}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.country && Boolean(formik.errors.country)}
                                helperText={formik.touched.country && formik.errors.country}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Company</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={formik.values.department}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.department && Boolean(formik.errors.department)}
                                helperText={formik.touched.department && formik.errors.department}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Company Name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Bank</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Card Expiry (MM/YY)"
                                name="cardExpire"
                                value={formik.values.cardExpire}
                                inputProps={{ maxLength: 16 }}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.cardType && Boolean(formik.errors.cardType)}
                                helperText={formik.touched.cardType && formik.errors.cardType}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Crypto</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Coin"
                                name="coin"
                                value={formik.values.coin}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.coin && Boolean(formik.errors.coin)}
                                helperText={formik.touched.coin && formik.errors.coin}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Wallet"
                                name="wallet"
                                value={formik.values.wallet}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.wallet && Boolean(formik.errors.wallet)}
                                helperText={formik.touched.wallet && formik.errors.wallet}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Button type="submit" variant="contained" fullWidth>
                                Create User
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </LocalizationProvider>
    )
}