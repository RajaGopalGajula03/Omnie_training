"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import "./style.css"

export default function SignUp() {
    const router = useRouter();

    const validate = (values) => {
        const errors = {};

        if (!values.UserName) {
            errors.UserName = "User Name Required";
        }
        else if (values.UserName.length <= 5) {
            errors.UserName = "User Name required Minimum 6 characters";
        }
        if (!values.UserEmail) {
            errors.UserEmail = "Email is Required";
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.UserEmail)) {
            errors.UserEmail = "Invalid email id";
        }
        if (!values.password) {
            errors.password = "Password Required";
        }
        else if (values.password.length < 8 || values.password.length > 20) {
            errors.password = "Password length should be 8 to 20 charcters"
        }
        return errors;
    }



    const formik = useFormik({
        initialValues: {
            "UserName": '',
            "UserEmail": '',
            "password": '',

        },
        validate,
        onSubmit: (values, { resetForm }) => {
            sessionStorage.setItem('UserData',JSON.stringify(values));
            console.log(JSON.parse(sessionStorage.getItem("UserData")));
            alert("User Details Saved in Session storage");

            resetForm();
            router.push("/login");
        }
    })
    return (
        <div className="container-fluid">
            <h2 className="heading">SignUp Form</h2>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="UserName">User Name</label>
                <input type="text" id="UserName"
                    name="UserName"
                    onChange={formik.handleChange}
                    value={formik.values.UserName}></input>
                {formik.errors.UserName ? (<div className="errors">{formik.errors.UserName}</div>) : null}
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
                <button type="submit">SignUp</button>
                <p>Alredy Registred? <span onClick={()=> router.push("/login")}>Login</span></p>
            </form>
        </div>
    )
}