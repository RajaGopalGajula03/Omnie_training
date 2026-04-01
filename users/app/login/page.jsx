"use client";
import { TextField, Button, Box } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function Login() {

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            username: 'emilys',
            password: 'emilyspass',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, "Too short")
                .required("Username is required"),

            password: Yup.string()
                .min(6, "Minimum 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values, { setErrors }) => {
            try {
                const res = await fetch("https://dummyjson.com/user/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...values, expiresInMins: 30,
                    }),
                })
                const data = await res.json();

                if (!res.ok) {
                    setErrors({ password: data.message || 'Login failed' });
                    return;
                }

                sessionStorage.setItem("accessToken", data.accessToken);
                sessionStorage.setItem("refreshToken", data.refreshToken);

                router.push("/dashboard");
            }
            catch {
                setErrors({ password: 'Something went wrong' });
            }
        }
    });


    return (
        <Box maxWidth={400} mx="auto" mt={5}>
            <h2>Login</h2>
            <form onSubmit={formik.handleSubmit} noValidate>
                <TextField
                    fullWidth
                    type="text"
                    label='Username'
                    name="username"
                    margin="normal"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    name="password"
                    margin="normal"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                >Login</Button>
            </form>

        </Box>
    )
}