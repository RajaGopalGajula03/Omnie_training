"use client";

import { Alert, Box, Button, CircularProgress, MenuItem, Stack, TextField } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ContentPanel, PageIntro } from "../../../_components/dashboard-ui";

const roles = [
  "Trainee",
  "Jr Developer",
  "Software Engineer",
  "Senior Developer",
  "Manager",
  "HR",
];

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function EditEmployee() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/employees`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          setEmployees([]);
        }
      });
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadEmployee = async () => {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/employees/${id}`, { credentials: "include" });
      const data = await res.json();
      setEmployee(data);
      setLoading(false);
    };

    loadEmployee();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: employee?.name || "",
      email: employee?.email || "",
      role: employee?.role || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      setSubmitError("");

      const res = await fetch(`${API_URL}/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        router.push("/employees");
        return;
      }

      const data = await res.json();
      setSubmitError(data.message || "Failed to update employee");
    },
  });

  if (loading || !employee) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageIntro
        eyebrow="Employees"
        title="Edit employee"
        description="Update the employee profile details and role assignment with a clean, simple form."
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
        title="Update employee record"
        subtitle="Choose the employee and edit only the fields that need to change."
        sx={{ maxWidth: 720 }}
      >
        <Stack spacing={2.2}>
          <TextField
            select
            label="Select Employee"
            value={Number(id)}
            onChange={(e) => {
              router.push(`/employees/edit/${e.target.value}`);
            }}
            sx={{ maxWidth: 320 }}
          >
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.name}
              </MenuItem>
            ))}
          </TextField>

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
                select
                fullWidth
                label="Role"
                name="role"
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

              {submitError ? <Alert severity="error">{submitError}</Alert> : null}

              <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => router.push("/employees")}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" startIcon={<EditOutlinedIcon />}>
                  Update Employee
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </ContentPanel>
    </Box>
  );
}
