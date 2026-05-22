"use client";

import { Alert, AppBar, Box, Button, Chip, Divider, Paper, Stack, TextField,Toolbar,Typography, } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function Login() {
    const [showLogin, setShowLogin] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const featureCards = [
        {
            icon: <Groups2OutlinedIcon sx={{ fontSize: 22 }} />,
            title: "Role Based Access",
            description: "Separate access for HR, managers, and employees.",
        },
        {
            icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 22 }} />,
            title: "Attendance Monitoring",
            description: "Track presence, working hours, and team activity.",
        },
        {
            icon: <ShieldOutlinedIcon sx={{ fontSize: 22 }} />,
            title: "Protected Routes",
            description: "Secure session handling for internal workflows.",
        },
    ];

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Email is Required"),
            password: Yup.string().min(4, "Minimum 4 characters").required("Password is Required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            setLoginError("");
            setIsSubmitting(true);

            try {
                const res = await fetch(`${API_URL}/api/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(values),
                });
                const data = await res.json();

                if (res.ok) {
                    router.push("/dashboard");
                    return;
                }

                setLoginError(data.message || "Login failed");
            } catch {
                setLoginError("Something went wrong while logging in");
            } finally {
                setIsSubmitting(false);
                resetForm();
            }
        },
    });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #f7fafc 0%, #eef6ff 45%, #fff7ed 100%)",
            }}
        >
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(18px)",
                    borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
                }}
            >
                <Toolbar
                    sx={{
                        width: "100%",
                        maxWidth: 1200,
                        mx: "auto",
                        px: { xs: 2, md: 3 },
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 2.5,
                                display: "grid",
                                placeItems: "center",
                                color: "white",
                                background: "linear-gradient(135deg, #14532d, #f97316)",
                                boxShadow: "0 14px 30px rgba(20, 83, 45, 0.2)",
                            }}
                        >
                            <ShieldOutlinedIcon fontSize="small" />
                        </Box>
                        <Box>
                            <Typography sx={{ color: "#0f172a", fontWeight: 800, fontSize: 20 }}>
                                Omniee
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontSize: 12 }}>
                                Attendance Management System
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1.2}
                        sx={{ display: { xs: "none", md: "flex" } }}
                    >
                        <Chip label="Employees" variant="outlined" />
                        <Chip label="Attendance" variant="outlined" />
                        <Chip label="Leave" variant="outlined" />
                    </Stack>

                    <Button
                        variant="outlined"
                        onClick={() => setShowLogin((prev) => !prev)}
                        sx={{
                            color: "#f97316",
                            borderColor: "rgba(249, 115, 22, 0.3)",
                            fontWeight: 700,
                        }}
                    >
                        {showLogin ? "Close" : "Login"}
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    flex: 1,
                    width: "100%",
                    maxWidth: 1200,
                    mx: "auto",
                    px: { xs: 2, md: 3 },
                    py: { xs: 5, md: 8 },
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1.08fr 0.92fr" },
                    gap: { xs: 4, md: 6 },
                    alignItems: "center",
                }}
            >
                <Box>
                    <Chip
                        label="Corporate Access Portal"
                        sx={{
                            mb: 2,
                            backgroundColor: "rgba(20, 83, 45, 0.1)",
                            color: "#14532d",
                            fontWeight: 700,
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: { xs: 34, md: 58 },
                            lineHeight: 1.03,
                            letterSpacing: "-0.04em",
                            fontWeight: 800,
                            color: "#0f172a",
                            maxWidth: 640,
                            mb: 2,
                        }}
                    >
                        Keep employee attendance and role based access beautifully organized.
                    </Typography>

                    <Typography
                        sx={{
                            color: "#475569",
                            fontSize: { xs: 16, md: 18 },
                            lineHeight: 1.75,
                            maxWidth: 560,
                            mb: 4,
                        }}
                    >
                        A cleaner workspace for HR teams, managers, and employees to review
                        attendance, manage records, and move through day-to-day operations with less friction.
                    </Typography>

                    <Stack spacing={2}>
                        {featureCards.map((item) => (
                            <Paper
                                key={item.title}
                                elevation={0}
                                sx={{
                                    p: 2.25,
                                    borderRadius: 3,
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "flex-start",
                                    border: "1px solid rgba(15, 23, 42, 0.08)",
                                    backgroundColor: "rgba(255,255,255,0.72)",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 2,
                                        display: "grid",
                                        placeItems: "center",
                                        color: "#14532d",
                                        backgroundColor: "rgba(20, 83, 45, 0.12)",
                                        flexShrink: 0,
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Box>
                                    <Typography sx={{ color: "#0f172a", fontWeight: 700, mb: 0.5 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{ color: "#64748b", lineHeight: 1.65 }}>
                                        {item.description}
                                    </Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 460,
                        justifySelf: { md: "end" },
                        borderRadius: 5,
                        p: { xs: 3, md: 4.5 },
                        backgroundColor: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(15, 23, 42, 0.08)",
                        boxShadow: "0 30px 70px rgba(15, 23, 42, 0.14)",
                    }}
                >
                    <Stack spacing={2.5}>
                        <Box>
                            <Typography sx={{ color: "#0f172a", fontSize: 28, fontWeight: 800, mb: 1 }}>
                                {showLogin ? "Welcome back" : "Ready to sign in?"}
                            </Typography>
                            <Typography sx={{ color: "#64748b", lineHeight: 1.7 }}>
                                {showLogin
                                    ? "Enter your account details to continue to your workspace."
                                    : "Open the login form to access your personalized dashboard."}
                            </Typography>
                        </Box>

                        {!showLogin ? (
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<LoginOutlinedIcon />}
                                onClick={() => setShowLogin(true)}
                                sx={{
                                    py: 1.4,
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    background: "linear-gradient(135deg, #14532d, #1d4ed8)",
                                }}
                            >
                                Open Login Form
                            </Button>
                        ) : (
                            <>
                                <Divider />
                                <Box component="form" onSubmit={formik.handleSubmit}>
                                    <Stack spacing={2.2}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                        />

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

                                        {loginError && <Alert severity="error">{loginError}</Alert>}

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            type="submit"
                                            disabled={isSubmitting}
                                            sx={{
                                                py: 1.4,
                                                borderRadius: 3,
                                                fontWeight: 700,
                                                background: "linear-gradient(135deg, #f97316, #ea580c)",
                                            }}
                                        >
                                            {isSubmitting ? "Signing In..." : "Login"}
                                        </Button>
                                    </Stack>
                                </Box>
                            </>
                        )}
                    </Stack>
                </Paper>
            </Box>

            <Box
                sx={{
                    textAlign: "center",
                    px: 2,
                    py: 2.5,
                    borderTop: "1px solid rgba(15, 23, 42, 0.08)",
                    backgroundColor: "rgba(255,255,255,0.72)",
                }}
            >
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                    © 2026 Omniee Attendance Platform
                </Typography>
            </Box>
        </Box>
    );
}
