"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import "./login.css";

export default function Login(){
    const router = useRouter();
    const validate = (values)=>{
        const errors = {};

        if(!values.UserEmail)
        {
            errors.UserEmail = "Email is required";
        }
        if(!values.password)
        {
            errors.password = "Password is required";
        }
        return errors;
    }


    const formik = useFormik({
        initialValues: {
            "UserEmail": '',
            "password": '',
        },
        validate,
        onSubmit: (values, { resetForm, setErrors }) => {
            setErrors({});
            const storedData = JSON.parse(sessionStorage.getItem('UserData'));
            
            if(!storedData)
            {
                setErrors({data: "No User found. please sign up first."});
                return;
            }
            if(values.UserEmail === storedData.UserEmail && values.password === storedData.password)
            {
                alert("Login Successful");
                resetForm();
                router.push("/dashboard");
            }
            else
            {
                setErrors({data :"Invalid email or password"})
            }
        }
    })
    return (
        <div className="container-fluid">
            <h2 className="heading">Login Page</h2>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="UserEmail">Email Id</label>
                <input type="email" id="UserEmail"
                    name="UserEmail"
                    onChange={formik.handleChange}
                    value={formik.values.UserEmail}></input>
                {formik.errors.UserEmail ? (<div className="errors">{formik.errors.UserEmail}</div>) : null}
                <label htmlFor="password">Create your Password</label>
                <input type="password" id="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}></input>
                {formik.errors.password ? (<div className="errors">{formik.errors.password}</div>) : null}
                <button type="submit">Login</button>
                {formik.errors.data ? (<div className="errors">{formik.errors.data}</div>):null}
                <p>Not Registred? <span onClick={()=> router.push("/signup")}>signup</span></p>
            </form>
        </div>
    )
}