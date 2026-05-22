"use client";

import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmployeeById, type LeaveRequest } from "@/lib/dashboard-data";
import { ContentPanel, MetricCard, PageIntro } from "../../_components/dashboard-ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function LeaveApprovalsPage() {
  const router = useRouter();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const loadLeaves = async () => {
    const res = await fetch(`${API_URL}/api/leaves`, { credentials: "include" });
    if (!res.ok) {
      router.push(`/login`);
      return;
    }

    const data = await res.json();
    setLeaves(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      const res = await fetch(`${API_URL}/api/leaves`, { credentials: "include" });
      if (!res.ok) {
        router.push(`/login`);
        return;
      }

      const data = await res.json();
      if (!active) return;
      setLeaves(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    run();

    return () => {
      active = false;
    };
  }, [router]);

  const pending = useMemo(() => leaves.filter((item) => item.status === "pending"), [leaves]);
  const approved = useMemo(() => leaves.filter((item) => item.status === "approved"), [leaves]);
  const rejected = useMemo(() => leaves.filter((item) => item.status === "rejected"), [leaves]);

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    const res = await fetch(`${API_URL}/api/leaves/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      setMessage("Unable to update leave request.");
      return;
    }

    setMessage(`Leave request ${status}.`);
    await loadLeaves();
  };

  const filteredLeaves = useMemo(() => {
    if (filter === "pending") return leaves.filter((i) => i.status === "pending");
    if (filter === "approved") return leaves.filter((i) => i.status === "approved");
    if (filter === "rejected") return leaves.filter((i) => i.status === "rejected");
    return leaves;
  }, [leaves, filter]);

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageIntro
        eyebrow="Approvals"
        title="Leave approval center"
        description="Review pending requests and take action directly from the approval queue."
      />

      {message ? (
        <Alert severity="success" sx={{ mb: 2.5 }}>
          {message}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 6,
        }}
      >
        <MetricCard
          label="Pending Approvals" value={pending.length}
          icon={<PendingActionsOutlinedIcon />} hint="Waiting in the queue" color="#ffedd5"
          onClick={() => setFilter("pending")}
        />
        <MetricCard
          label="Approved Requests" value={approved.length}
          icon={<TaskAltOutlinedIcon />} hint="Resolved successfully" color="#dcfce7"
          onClick={() => setFilter("approved")}
        />
        <MetricCard 
        label="Rejected Requests" value={rejected.length} 
        icon={<EventBusyOutlinedIcon />} hint="Declined items" color="#fee2e2" 
        onClick={() => setFilter("rejected")}
        />
      </Box>

      <ContentPanel
        title="Pending approval list"
        subtitle="Approve or reject requests without leaving this page."
      >
        <Stack spacing={1.4}>
          {filteredLeaves.map((item) => {
            const employee = getEmployeeById(item.employeeId);

            return (
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
                    {employee?.name || `Employee #${item.employeeId}`} · {item.leaveType} · {item.fromDate} to {item.toDate}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" color="success" onClick={() => updateStatus(item.id, "approved")}>
                    Approve
                  </Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => updateStatus(item.id, "rejected")}>
                    Reject
                  </Button>
                  <Chip label={`${item.days} day${item.days > 1 ? "s" : ""}`} color="warning" />
                </Stack>
              </Stack>
            );
          })}
          {pending.length === 0 ? (
            <Typography sx={{ color: "#64748b", fontSize: 14 }}>
              No pending approvals right now.
            </Typography>
          ) : null}
        </Stack>
      </ContentPanel>
    </Box>
  );
}
