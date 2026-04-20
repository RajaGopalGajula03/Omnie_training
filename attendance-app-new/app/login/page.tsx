"use client";
import { TextField, Button, Box, Typography, AppBar, Toolbar } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
export default function Login() {

    const [showLogin, setShowLogin] = useState(false);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Email is Required"),
            password: Yup.string().min(4, "Minimum 4 characters").required("Password is Required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(values),
            })
            const data = await res.json();

            if (res.ok) {
                router.push("/employees");
                router.refresh();
            }
            else {
                alert(data.message);
            }
            resetForm();
        }
    })
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}>
            <AppBar position="static">
                <Toolbar sx={{ display: 'flex', justifyContent: "space-between", background: 'white', }}>
                    <Typography variant="h6" sx={{ color: 'blue', fontWeight: 600 }}>Omniee</Typography>
                    <Box sx={{ color: 'black', display: 'flex', gap: 2, }}>
                        <Typography>Home</Typography>
                        <Typography>About</Typography>
                        <Typography>Contact</Typography>
                    </Box>
                    <Button sx={{ color: 'orange', fontWeight: 600 }} color="inherit" onClick={() => setShowLogin((prev) => !prev)}>
                        {showLogin ? "Close" : "Login"}
                    </Button>
                </Toolbar>
            </AppBar>

            {!showLogin ? (<Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                    Welcome to Omniee  Solution
                </Typography>

                <Typography variant="body1" sx={{ maxWidth: 500, mb: 3, color: "gray" }}>
                    Manage employee attendance, track working hours, and monitor performance
                    all in one place. A simple and efficient solution for your organization.
                </Typography>

                <Button
                    variant="contained"
                    size="medium"
                    onClick={() => setShowLogin((prev) => !prev)}
                >
                    Login
                </Button>
            </Box>
            ) : (
                <Box sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",

                }}>

                    <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '18px', mb: 3 }}>Login to your corporate Account</Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
                            label="Email"
                            name="email"
                            size="small"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <br></br>
                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
                            type="password"
                            label="Password"
                            name="password"
                            size="small"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <br>
                        </br>
                        <Button
                            variant="contained"
                            fullWidth
                            type="submit"
                        >Login</Button>
                    </form>
                </Box>
            )}
            <Box
                sx={{
                    textAlign: "center",
                    p: 2,
                    bgcolor: "#eee",
                }}
            >
                <Typography variant="body2">
                    © 2026 My App
                </Typography>
            </Box>
        </Box>
    )
}