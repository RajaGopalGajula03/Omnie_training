"use client";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
export default function Login() {


    const router = useRouter();

    const formik = useFormik({
        initialValues:{
            email:'',
            password:"",
        },
        validationSchema: Yup.object({
            email:Yup.string().required("Email is Required"),
            password:Yup.string().min(4,"Minimum 4 characters").required("Password is Required"),
        }),
        onSubmit: async(values,{resetForm})=>{
            const res = await fetch("/api/login",{
                method:"POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify(values),
            })
            const data = await res.json();

            if(res.ok)
            {
                router.push("/employees");
                router.refresh();
            }
            else
            {
                alert(data.message);
            }
            resetForm();
        }
    })
    return (
        <Box sx={{
            width:300,
            margin: "100px auto",
            display:'flex',
            flexDirection:'column',
            gap:2,
        }}>
            <Typography variant="h5">Login</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                fullWidth
                sx={{mb:2}}
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                />
                <br></br>
                <TextField
                fullWidth
                sx={{mb:2}}
                type="password"
                label="Password"
                name="password"
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
    )
}