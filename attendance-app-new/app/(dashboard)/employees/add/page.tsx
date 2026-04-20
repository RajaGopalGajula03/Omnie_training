"use client";

import {Box,TextField,Button,Typography,MenuItem,} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const roles = [
  "Trainee",
  "Jr Developer",
  "Software Engineer",
  "Senior Developer",
  "Manager",
  "HR",
];

export default function AddEmployee() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      password: Yup.string()
        .min(4, "Minimum 4 characters")
        .required("Password is required"),
      role: Yup.string().required("Role is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/employees");
      } else {
        alert(data.message || "Failed to add employee");
      }

      resetForm();
    },
  });

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Add Employee
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          size="small"
          sx={{ mb: 2 }}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          size="small"
          sx={{ mb: 2 }}
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
          size="small"
          sx={{ mb: 2 }}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <TextField
          select
          fullWidth
          label="Role"
          name="role"
          size="small"
          sx={{ mb: 3 }}
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.role && Boolean(formik.errors.role)}
          helperText={formik.touched.role && formik.errors.role}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>

        <Button fullWidth variant="contained" type="submit" size="medium">
          Add Employee
        </Button>
      </form>
    </Box>
  );
}