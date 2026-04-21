"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { payrollItems } from "@/lib/dashboard-data";
import { ContentPanel, MetricCard, PageIntro } from "../_components/dashboard-ui";

export default function PayrollPage() {
  const pending = payrollItems.filter((item) => item.status === "pending");
  const processed = payrollItems.filter((item) => item.status === "processed");

  return (
    <Box>
      <PageIntro
        eyebrow="Payroll"
        title="Payroll operations"
        description="Review pending payroll runs, processed items, and the current monthly payout snapshot."
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 3,
        }}
      >
        <MetricCard label="Payroll Records" value={payrollItems.length} icon={<PaymentsOutlinedIcon />} hint="Total payroll items" color="#ede9fe" />
        <MetricCard label="Pending Payrolls" value={pending.length} icon={<HourglassBottomOutlinedIcon />} hint="Need review or release" color="#ffedd5" />
        <MetricCard label="Processed" value={processed.length} icon={<TaskAltOutlinedIcon />} hint="Already completed" color="#dcfce7" />
      </Box>

      <ContentPanel
        title="Monthly payroll list"
        subtitle="A compact payroll view with processing status and payout amounts."
      >
        <Stack spacing={1.25}>
          {payrollItems.map((item) => (
            <Stack
              key={item.id}
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={1}
              sx={{
                p: 1.7,
                borderRadius: 2.5,
                backgroundColor: "rgba(248,250,252,0.95)",
              }}
            >
              <Box>
                <Typography sx={{ color: "#0f172a", fontWeight: 700 }}>
                  Employee #{item.employeeId}
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                  Month: {item.month}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ color: "#0f172a", fontWeight: 800 }}>
                  ₹{item.amount.toLocaleString()}
                </Typography>
                <Chip
                  label={item.status}
                  color={item.status === "processed" ? "success" : "warning"}
                />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </ContentPanel>
    </Box>
  );
}
