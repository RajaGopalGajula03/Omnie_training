"use client";

import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CancelScheduleSendOutlinedIcon from "@mui/icons-material/CancelScheduleSendOutlined";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmployeeLeaves, leaveRequests } from "@/lib/dashboard-data";
import { ContentPanel, MetricCard, PageIntro } from "../_components/dashboard-ui";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function LeavePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch("/api/auth/check", { credentials: "include" });
      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    };

    loadUser();
  }, [router]);

  if (!user) return null;

  const isAdmin = user.role === "Manager" || user.role === "HR";
  const items = isAdmin ? leaveRequests : getEmployeeLeaves(user.id);
  const pending = items.filter((item) => item.status === "pending");
  const approved = items.filter((item) => item.status === "approved");
  const rejected = items.filter((item) => item.status === "rejected");

  return (
    <Box>
      <PageIntro
        eyebrow="Leave Management"
        title={isAdmin ? "Leave operations" : "My leave requests"}
        description={
          isAdmin
            ? "Track incoming leave requests, review approval queues, and understand the current leave landscape."
            : "Review your submitted leave requests, current approvals, and recent leave history."
        }
        action={
          !isAdmin ? (
            <Button variant="contained" onClick={() => router.push("/leave/applyleave")}>
              Apply Leave
            </Button>
          ) : undefined
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 3,
        }}
      >
        <MetricCard label="Total Requests" value={items.length} icon={<AddTaskOutlinedIcon />} hint="All tracked items" color="#dbeafe" />
        <MetricCard label="Pending" value={pending.length} icon={<PendingActionsOutlinedIcon />} hint="Waiting for action" color="#ffedd5" />
        <MetricCard label="Approved" value={approved.length} icon={<TaskAltOutlinedIcon />} hint="Accepted requests" color="#dcfce7" />
        <MetricCard label="Rejected" value={rejected.length} icon={<CancelScheduleSendOutlinedIcon />} hint="Declined requests" color="#fee2e2" />
      </Box>

      <ContentPanel
        title={isAdmin ? "Leave request queue" : "Request history"}
        subtitle={
          isAdmin
            ? "A compact operational view of all submitted leave requests."
            : "Your personal leave activity with current statuses."
        }
      >
        <Stack spacing={1.4}>
          {items.map((item) => (
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
                  {item.fromDate} to {item.toDate} · {item.days} day{item.days > 1 ? "s" : ""}
                </Typography>
              </Box>
              <Chip
                label={item.status}
                color={item.status === "approved" ? "success" : item.status === "pending" ? "warning" : "default"}
              />
            </Stack>
          ))}
        </Stack>
      </ContentPanel>
    </Box>
  );
}
