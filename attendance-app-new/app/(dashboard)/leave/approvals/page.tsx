"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import { leaveRequests } from "@/lib/dashboard-data";
import { ContentPanel, MetricCard, PageIntro } from "../../_components/dashboard-ui";

export default function LeaveApprovalsPage() {
  const pending = leaveRequests.filter((item) => item.status === "pending");
  const approved = leaveRequests.filter((item) => item.status === "approved");
  const rejected = leaveRequests.filter((item) => item.status === "rejected");

  return (
    <Box>
      <PageIntro
        eyebrow="Approvals"
        title="Leave approval center"
        description="Review pending leave requests and keep team scheduling up to date with quick approval visibility."
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 3,
        }}
      >
        <MetricCard label="Pending Approvals" value={pending.length} icon={<PendingActionsOutlinedIcon />} hint="Waiting in the queue" color="#ffedd5" />
        <MetricCard label="Approved Requests" value={approved.length} icon={<TaskAltOutlinedIcon />} hint="Resolved successfully" color="#dcfce7" />
        <MetricCard label="Rejected Requests" value={rejected.length} icon={<EventBusyOutlinedIcon />} hint="Declined items" color="#fee2e2" />
      </Box>

      <ContentPanel
        title="Pending approval list"
        subtitle="Prioritize recent requests and review the request duration before final action."
      >
        <Stack spacing={1.4}>
          {pending.map((item) => (
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
                <Typography sx={{ color: "#0f172a", fontWeight: 800 }}>{item.reason}</Typography>
                <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                  Employee #{item.employeeId} · {item.fromDate} to {item.toDate}
                </Typography>
              </Box>
              <Chip label={`${item.days} day${item.days > 1 ? "s" : ""}`} color="warning" />
            </Stack>
          ))}
        </Stack>
      </ContentPanel>
    </Box>
  );
}
