"use client";

import { Alert, Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ContentPanel, PageIntro } from "../../_components/dashboard-ui";

const roles = [
  "Trainee",
  "Jr Developer",
  "Software Engineer",
  "Senior Developer",
  "Manager",
  "HR",
];

const roleDepartmentMap: Record<string, number> = {
  "Trainee": 1,
  "Jr Developer": 1,
  "Software Engineer": 1,
  "Senior Developer": 1,
  "Manager": 3,
  "HR": 2,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function AddEmployee() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      department_id: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(4, "Minimum 4 characters").required("Password is required"),
      role: Yup.string().required("Role is required"),
      department_id: Yup.number().typeError("Department Id required").required("Department Id required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setSubmitError("");

      const res = await fetch(`${API_URL}/api/employees`, {
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
        return;
      }

      setSubmitError(data.message || "Failed to add employee");
      resetForm();
    },
  });

  return (
    <Box>
      <PageIntro
        eyebrow="Employees"
        title="Add employee"
        description="Create a new employee record with basic profile details and role access."
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => router.push("/employees")}
          >
            Back
          </Button>
        }
      />

      <ContentPanel
        title="Employee form"
        subtitle="Keep the details clean and simple so the record is easy to manage later."
        sx={{ maxWidth: 720 }}
      >
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Stack spacing={2.2}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

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

            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={formik.values.role}
              onChange={(e) => {
                const selectedRole = e.target.value;
                formik.setFieldValue("role", selectedRole);
                formik.setFieldValue("department_id", roleDepartmentMap[selectedRole] || 0);
              }}
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
            <TextField
              fullWidth
              label="Department Id"
              name="department_id"
              value={formik.values.department_id}
              InputProps={{ readOnly: true }}
            >
            </TextField>

            {submitError ? <Alert severity="error">{submitError}</Alert> : null}

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => router.push("/employees")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" startIcon={<PersonAddAltOutlinedIcon />}>
                Add Employee
              </Button>
            </Stack>
          </Stack>
        </Box>
      </ContentPanel>
    </Box>
  );
}
