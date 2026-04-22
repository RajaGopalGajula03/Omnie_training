"use client";

import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CancelScheduleSendOutlinedIcon from "@mui/icons-material/CancelScheduleSendOutlined";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {getEmployeeById,type LeaveRequest,} from "@/lib/dashboard-data";
import { ContentPanel, MetricCard, PageIntro } from "../_components/dashboard-ui";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type LeaveFilter = "all" | "pending" | "approved" | "rejected";

export default function LeavePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const authRes = await fetch("/api/auth/check", { credentials: "include" });

      if (!authRes.ok) {
        router.push("/login");
        return;
      }

      const authData = await authRes.json();
      setUser(authData.user);

      const leaveRes = await fetch("/api/leave", { credentials: "include" });
      const leaveData = await leaveRes.json();
      setLeaves(Array.isArray(leaveData) ? leaveData : []);
      setLoading(false);
    };

    loadData();
  }, [router]);

  const isAdmin = user?.role === "Manager" || user?.role === "HR";
  const isManager = user?.role === "Manager";
  const activeFilter: LeaveFilter =
    searchParams.get("filter") === "pending" ||
    searchParams.get("filter") === "approved" ||
    searchParams.get("filter") === "rejected"
      ? (searchParams.get("filter") as LeaveFilter)
      : "all";

  const pending = useMemo(() => leaves.filter((item) => item.status === "pending"), [leaves]);
  const approved = useMemo(() => leaves.filter((item) => item.status === "approved"), [leaves]);
  const rejected = useMemo(() => leaves.filter((item) => item.status === "rejected"), [leaves]);
  const activeToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return leaves.filter(
      (item) => item.status === "approved" && today >= item.fromDate && today <= item.toDate
    );
  }, [leaves]);
  const filteredItems = useMemo(
    () => {
      const view = searchParams.get("view");

      if (view === "active") {
        return activeToday;
      }

      return activeFilter === "all" ? leaves : leaves.filter((item) => item.status === activeFilter);
    },
    [activeFilter, activeToday, leaves, searchParams]
  );

  const refreshLeaves = async () => {
    const leaveRes = await fetch("/api/leave", { credentials: "include" });
    const leaveData = await leaveRes.json();
    setLeaves(Array.isArray(leaveData) ? leaveData : []);
  };

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    const res = await fetch(`/api/leave/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      setMessage("Unable to update leave request right now.");
      return;
    }

    setMessage(`Leave request ${status}.`);
    await refreshLeaves();
  };

  const toggleFilter = (filter: LeaveFilter) => {
    const current = activeFilter;
    const next = current === filter ? "all" : filter;

    if (next === "all") {
      router.push("/leave");
      return;
    }

    router.push(`/leave?filter=${next}`);
  };

  if (loading || !user) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageIntro
        eyebrow="Leave Management"
        title={isAdmin ? "Leave operations" : "My leave requests"}
        description={
          isAdmin
            ? "Review requests, approve or reject them, and track active members across departments."
            : "Track applied leaves, view leave history, and monitor pending, approved, and rejected requests."
        }
        action={
          !isAdmin ? (
            <Button variant="contained" onClick={() => router.push("/leave/applyleave")}>
              Apply Leave
            </Button>
          ) : undefined
        }
      />

      {message ? (
        <Alert severity="success" sx={{ mb: 2.5 }}>
          {message}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 3,
        }}
      >
        <MetricCard
          label={isAdmin ? "All Requests" : "Applied Leaves"}
          value={leaves.length}
          icon={<AddTaskOutlinedIcon />}
          hint={isAdmin ? "All tracked items" : "All submitted requests"}
          color="#dbeafe"
          onClick={isManager ? () => toggleFilter("all") : undefined}
        />
        <MetricCard
          label="Pending"
          value={pending.length}
          icon={<PendingActionsOutlinedIcon />}
          hint={isAdmin ? "Awaiting decision" : "Still under review"}
          color="#ffedd5"
          onClick={isManager ? () => toggleFilter("pending") : undefined}
        />
        <MetricCard
          label="Approved"
          value={approved.length}
          icon={<TaskAltOutlinedIcon />}
          hint="Accepted requests"
          color="#dcfce7"
          onClick={isManager ? () => toggleFilter("approved") : undefined}
        />
        <MetricCard
          label="Rejected"
          value={rejected.length}
          icon={<CancelScheduleSendOutlinedIcon />}
          hint="Declined requests"
          color="#fee2e2"
          onClick={isManager ? () => toggleFilter("rejected") : undefined}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: isAdmin ? "1.3fr 0.7fr" : "1fr" },
          gap: 2.2,
          mt:6,
        }}
      >
        <ContentPanel
          title={isAdmin ? "Leave request queue" : "Leave history"}
        subtitle={
          isAdmin
              ? searchParams.get("view") === "active"
                ? "Showing approved leave requests active today."
                : activeFilter !== "all"
                ? `Showing ${activeFilter} requests. Click the same card again to reset.`
                : "Approve or reject requests directly from the queue."
              : "A history of your leave applications with current status."
        }
        >
          <Stack spacing={1.4}>
            {filteredItems.map((item) => {
              const employee = getEmployeeById(item.employeeId);

              return (
                <Stack
                  key={item.id}
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={1.2}
                  sx={{
                    p: 1.7,
                    borderRadius: 2.5,
                    backgroundColor: "rgba(248,250,252,0.95)",
                  }}
                >
                  <Box>
                    <Typography sx={{ color: "#0f172a", fontWeight: 800 }}>{item.reason}</Typography>
                    <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                      {item.leaveType} · {item.fromDate} to {item.toDate} · {item.days} day
                      {item.days > 1 ? "s" : ""}
                    </Typography>
                    {isAdmin ? (
                      <Typography sx={{ color: "#94a3b8", fontSize: 13, mt: 0.4 }}>
                        {employee?.name || `Employee #${item.employeeId}`}
                      </Typography>
                    ) : null}
                  </Box>

                  {isAdmin ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={item.status}
                        color={
                          item.status === "approved"
                            ? "success"
                            : item.status === "pending"
                            ? "warning"
                            : "default"
                        }
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        disabled={item.status === "approved"}
                        onClick={() => updateStatus(item.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={item.status === "rejected"}
                        onClick={() => updateStatus(item.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </Stack>
                  ) : (
                    <Chip
                      label={item.status}
                      color={
                        item.status === "approved"
                          ? "success"
                          : item.status === "pending"
                          ? "warning"
                          : "default"
                      }
                    />
                  )}
                </Stack>
              );
            })}

            {filteredItems.length === 0 ? (
              <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                No leave requests found for the selected filter.
              </Typography>
            ) : null}
          </Stack>
        </ContentPanel>
      </Box>
    </Box>
  );
}
