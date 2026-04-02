"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Box, TextField, Button, Grid, Typography, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const FormInput = ({ formik, name, label, options, ...props }) => {


    const numberFields = ["age", "height", "weight", "postalCode", "cardNumber","phone"];

    const formatExpiry = (value) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 4);
        if (cleaned.length >= 3) {
            return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
        }
        return cleaned;
    };


    if (options) {
        return (
            <TextField
                select
                fullWidth
                label={label}
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched[name] && Boolean(formik.errors[name])}
                helperText={formik.touched[name] && formik.errors[name]}
            >
                {options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
            </TextField>
        )
    }
    return (
        <TextField
            fullWidth
            label={label}
            name={name}
            value={formik.values[name]}
            onBlur={formik.handleBlur}
            error={formik.touched[name] && Boolean(formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
            onChange={(e) => {
                let value = e.target.value;

                if (name === "cardExpire") {
                    value = formatExpiry(value);
                    return formik.setFieldValue(name, value);
                }

                if (numberFields.includes(name)) {
                    value = value.replace(/[^0-9]/g, "");
                    if(name === "cardNumber"){
                        value = value.slice(0,16);
                    }
                    return formik.setFieldValue(name, value);
                }

                formik.handleChange(e);

            }}
            {...props}
        ></TextField>
    )
}

export default function CreateUser() {
    const router = useRouter();

    const personalFields = [
        { name: 'firstName', label: "First Name" },
        { name: "lastName", label: "Last Name" },
        { name: "maidenName", label: "Middle Name" },
        { name: "age", label: "Age" },
        {
            name: "gender",
            label: "Gender",
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
            ],
        },
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
        { name: "username", label: "Username" },
        { name: "password", label: "Password", type: "password" },
        {
            name: "bloodGroup", label: "Blood Group",
            options: [
                { label: "O+", value: "O+" },
                { label: "O-", value: "O-" },
                { label: "A+", value: "A+" },
                { label: "A-", value: "A-" },
                { label: "B+", value: "B+" },
                { label: "B-", value: "B-" },
                { label: "AB+", value: "AB+" },
                { label: "AB-", value: "AB-" },
            ]
        },
        { name: 'height', label: "Height" },
        { name: "weight", label: "Weight" },
    ]

    const addressFields = [
        { name: "address", label: "Address" },
        { name: "city", label: "City" },
        { name: "state", label: "State" },
        { name: "postalCode", label: "Postal Code" },
        { name: "country", label: "Country" },
    ];

    const companyFields = [
        { name: "department", label: "Department" },
        { name: "name", label: "Company Name" },
        { name: "title", label: "Title" },
    ];

    const bankFields = [
        { name: "cardExpire", label: "Expiry Date MM/YY" },
        { name: "cardNumber", label: "Card Number" },
        { name: "cardType", label: "Card Type" },
    ];

    const cryptoFields = [
        { name: "coin", label: "Coin" },
        { name: "wallet", label: "Wallet" },
    ];

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
            postalCode: Yup.string().matches(/^[0-9]{5,6}$/, "Postal code must be 5 or 6 digits").required("Postal code required"),
            country: Yup.string().required("Country required"),

            department: Yup.string(),
            name: Yup.string(),
            title: Yup.string(),

            cardExpire: Yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/YY"),
            cardNumber: Yup.string().matches(/^[0-9]{16}$/, "Card number must be 16 digits"),
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
                        {personalFields.map((field) => (
                            <Grid item xs={4} key={field.name}>
                                <FormInput formik={formik} {...field}></FormInput>
                            </Grid>
                        ))}
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
                                maxDate={dayjs()}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: formik.touched.birthDate && Boolean(formik.errors.birthDate),
                                        helperText: formik.touched.birthDate && formik.errors.birthDate,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6">Address</Typography>
                        </Grid>

                        {addressFields.map((field) => (
                            <Grid item xs={4} key={field.name}>
                                <FormInput formik={formik} {...field}></FormInput>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Typography variant="h6">Company</Typography>
                        </Grid>

                        {companyFields.map((field) => (
                            <Grid item xs={4} key={field.name}>
                                <FormInput formik={formik} {...field}></FormInput>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Typography variant="h6">Bank</Typography>
                        </Grid>

                        {bankFields.map((field) => (
                            <Grid item xs={4} key={field.name}>
                                <FormInput formik={formik} {...field}></FormInput>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Typography variant="h6">Crypto</Typography>
                        </Grid>

                        {cryptoFields.map((field) => (
                            <Grid item xs={6} key={field.name}>
                                <FormInput formik={formik} {...field}></FormInput>
                            </Grid>
                        ))}

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