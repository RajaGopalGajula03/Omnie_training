"use client";

import { Alert, Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { ContentPanel, PageIntro } from "../../_components/dashboard-ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ApplyLeavePage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      leaveType: "Casual Leave",
      fromDate: "",
      toDate: "",
      reason: "",
    },
    validationSchema: Yup.object({
      leaveType: Yup.string().required("Leave type is required"),
      fromDate: Yup.string().required("Start date is required"),
      toDate: Yup.string().required("End date is required"),
      reason: Yup.string().min(5, "Add a short reason").required("Reason is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setSubmitError("");

      const res = await fetch(`${API_URL}/api/leaves`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        setSubmitError("Unable to submit leave request right now.");
        return;
      }

      setSubmitted(true);
      resetForm();
      setTimeout(() => {
        router.push("/leave");
      }, 900);
    },
  });

  return (
    <Box>
      <PageIntro
        eyebrow="Apply Leave"
        title="Submit a leave request"
        description="Fill in your leave details and share the reason clearly so the approval flow can move quickly."
      />

      <ContentPanel
        title="Leave request form"
        
        sx={{ maxWidth: 760 }}
      >
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Stack spacing={2.2}>
            <TextField
              select
              name="leaveType"
              label="Leave Type"
              value={formik.values.leaveType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.leaveType && Boolean(formik.errors.leaveType)}
              helperText={formik.touched.leaveType && formik.errors.leaveType}
            >
              {["Casual Leave", "Sick Leave", "Comp Off", "Work From Home"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                type="date"
                name="fromDate"
                label="From Date"
                value={formik.values.fromDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fromDate && Boolean(formik.errors.fromDate)}
                helperText={formik.touched.fromDate && formik.errors.fromDate}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                name="toDate"
                label="To Date"
                value={formik.values.toDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.toDate && Boolean(formik.errors.toDate)}
                helperText={formik.touched.toDate && formik.errors.toDate}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <TextField
              multiline
              minRows={4}
              name="reason"
              label="Reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.reason && Boolean(formik.errors.reason)}
              helperText={formik.touched.reason && formik.errors.reason}
            />

            {submitError ? <Alert severity="error">{submitError}</Alert> : null}

            {submitted ? (
              <Alert severity="success">
                Leave request submitted successfully.
              </Alert>
            ) : null}

            <Stack direction="row" justifyContent="flex-end">
              <Button type="submit" variant="contained" startIcon={<SendOutlinedIcon />}>
                Submit Request
              </Button>
            </Stack>
          </Stack>
        </Box>
      </ContentPanel>
    </Box>
  );
}
