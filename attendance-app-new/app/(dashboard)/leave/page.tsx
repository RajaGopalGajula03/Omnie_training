"use client";

import { Alert, Box, Button, Chip, CircularProgress, MenuItem, Stack, TextField, Typography, } from "@mui/material";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CancelScheduleSendOutlinedIcon from "@mui/icons-material/CancelScheduleSendOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { departments, type LeaveRequest } from "@/lib/dashboard-data";
import { ContentPanel, MetricCard, PageIntro, StatList } from "../_components/dashboard-ui";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Employee = {
  id: number;
  name: string;
  role: string;
};

type LeaveFilter = "all" | "pending" | "approved" | "rejected";

type LeaveEditForm = {
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveRequest["status"];
  adminRemark: string;
};

const leaveTypeOptions = ["Casual Leave", "Sick Leave", "Comp Off", "Work From Home"];

function getDepartmentName(role: string) {
  if (role === "HR") {
    return "Human Resources";
  }

  if (role === "Manager") {
    return "Operations";
  }

  if (["Senior Developer", "Software Engineer", "Jr Developer", "Trainee"].includes(role)) {
    return "Engineering";
  }

  return "Customer Success";
}

function getStatusColor(status: LeaveRequest["status"]) {
  if (status === "approved") {
    return "success" as const;
  }

  if (status === "pending") {
    return "warning" as const;
  }

  return "default" as const;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function LeavePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<LeaveFilter>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<LeaveEditForm>({
    leaveType: leaveTypeOptions[0],
    fromDate: "",
    toDate: "",
    reason: "",
    status: "pending",
    adminRemark: "",
  });

  const isAdmin = user?.role === "Manager" || user?.role === "HR";

  const loadLeaves = async () => {
    const leaveRes = await fetch(`${API_URL}/api/leaves`, { credentials: "include" });
    const leaveData = await leaveRes.json();
    setLeaves(Array.isArray(leaveData) ? leaveData : []);
  };

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const authRes = await fetch(`${API_URL}/api/auth/check`, { credentials: "include" });

      if (!authRes.ok) {
        router.push(`/login`);
        return;
      }

      const authData = await authRes.json();

      if (!active) {
        return;
      }

      setUser(authData.user);

      const requests: Promise<Response>[] = [fetch(`${API_URL}/api/leaves`, { credentials: "include" })];

      if (authData.user.role === "Manager" || authData.user.role === "HR") {
        requests.push(fetch(`${API_URL}/api/employees`, { credentials: "include" }));
      }

      const [leaveRes, employeeRes] = await Promise.all(requests);
      const leaveData = await leaveRes.json();

      if (!active) {
        return;
      }

      setLeaves(Array.isArray(leaveData) ? leaveData : []);

      if (employeeRes) {
        const employeeData = await employeeRes.json();

        if (!active) {
          return;
        }

        setEmployees(Array.isArray(employeeData) ? employeeData : []);
      }

      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [router]);

  const pending = useMemo(() => leaves.filter((item) => item.status === "pending"), [leaves]);
  const approved = useMemo(() => leaves.filter((item) => item.status === "approved"), [leaves]);
  const rejected = useMemo(() => leaves.filter((item) => item.status === "rejected"), [leaves]);

  const filteredLeaves = useMemo(() => {
    const base = activeFilter === "all" ? leaves : leaves.filter((item) => item.status === activeFilter);
    return [...base].sort((left, right) => {
      const leftDate = left.fromDate || "";
      const rightDate = right.fromDate || "";
      return rightDate.localeCompare(leftDate);
    });
  }, [activeFilter, leaves]);

  const todayKey = new Date().toISOString().slice(0, 10);

  const departmentSummary = useMemo(() => {
    return departments.map((department) => {
      const departmentEmployees = employees.filter(
        (employee) => getDepartmentName(employee.role) === department.name
      );

      const memberIds = departmentEmployees.map((employee) => employee.id);
      const departmentLeaves = leaves.filter((leave) => memberIds.includes(leave.employeeId));
      const activeMembers = departmentEmployees.filter(
        (employee) =>
          !leaves.some(
            (leave) =>
              leave.employeeId === employee.id &&
              leave.status === "approved" &&
              leave.fromDate <= todayKey &&
              leave.toDate >= todayKey
          )
      ).length;

      return {
        label: department.name,
        value: `${departmentLeaves.filter((leave) => leave.status === "pending").length} pending / ${activeMembers} active`,
      };
    });
  }, [employees, leaves, todayKey]);

  const activeLeaveEmployees = useMemo(() => {
    return employees
      .filter((employee) =>
        leaves.some(
          (leave) =>
            leave.employeeId === employee.id &&
            leave.status === "approved" &&
            leave.fromDate <= todayKey &&
            leave.toDate >= todayKey
        )
      )
      .map((employee) => ({
        label: employee.name,
        value: getDepartmentName(employee.role),
      }));
  }, [employees, leaves, todayKey]);

  const startEdit = (leave: LeaveRequest) => {
    setEditingId(leave.id);
    setEditForm({
      leaveType: leave.leaveType || leaveTypeOptions[0],
      fromDate: leave.fromDate?.slice(0,10) || "",
      toDate: leave.toDate?.slice(0,10) || "",
      reason: leave.reason || "",
      status: leave.status || "pending",
      adminRemark: leave.adminRemark || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setMessage(null);
  };

  const updateLeave = async (id: number, payload: Partial<LeaveEditForm>) => {
    const res = await fetch(`${API_URL}/api/leaves/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMessage({ type: "error", text: data?.message || "Unable to update leave request." });
      return;
    }

    await loadLeaves();
    setEditingId(null);
    setMessage({ type: "success", text: "Leave request updated." });
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
            ? "Review requests, edit leave details, and keep approvals updated from one clean screen."
            : "Track your applied leave, pending requests, approvals, and rejected requests in one place."
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
        <Alert severity={message.type} sx={{ mb: 2.5 }}>
          {message.text}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 6,
          alignItems: "stretch",
          "& > *": {
            height: "100%",
          },
        }}
      >
        <MetricCard
          label={isAdmin ? "All Leaves" : "Applied Leaves"}
          value={leaves.length}
          icon={<AddTaskOutlinedIcon />}
          hint="Show all leave records"
          color="#dbeafe"
          onClick={() => setActiveFilter("all")}
        />
        <MetricCard
          label="Pending"
          value={pending.length}
          icon={<PendingActionsOutlinedIcon />}
          hint="Waiting for action"
          color="#ffedd5"
          onClick={() => setActiveFilter("pending")}
        />
        <MetricCard
          label="Approved"
          value={approved.length}
          icon={<TaskAltOutlinedIcon />}
          hint="Approved leave requests"
          color="#dcfce7"
          onClick={() => setActiveFilter("approved")}
        />
        <MetricCard
          label="Rejected"
          value={rejected.length}
          icon={<CancelScheduleSendOutlinedIcon />}
          hint="Declined leave requests"
          color="#fee2e2"
          onClick={() => setActiveFilter("rejected")}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: isAdmin ? "minmax(0, 1.65fr) minmax(320px, 0.95fr)" : "1fr" },
          gap: 2.4,
        }}
      >
        <ContentPanel
          title={isAdmin ? "Leave request queue" : "Leave history"}
          subtitle={
            activeFilter === "all"
              ? isAdmin
                ? "Showing every leave request across the team."
                : "Showing your full leave history."
              : `Showing ${activeFilter} requests.`
          }
        >
          <Stack spacing={1.4}>
            {filteredLeaves.map((item) => {
              const employee = employees.find((entry) => entry.id === item.employeeId);
              const isEditing = editingId === item.id;

              return (
                <Stack
                  key={item.id}
                  spacing={1.3}
                  sx={{
                    p: 1.8,
                    borderRadius: 2.5,
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={1.2}
                  >
                    <Box>
                      <Typography sx={{ color: "#0f172a", fontWeight: 800 }}>
                        {employee?.name || user.name}
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: 13, mt: 0.4 }}>
                        {item.leaveType} - {item.fromDate} to {item.toDate} - {item.days} day
                        {item.days > 1 ? "s" : ""}
                      </Typography>
                    </Box>
                    <Chip label={item.status} color={getStatusColor(item.status)} />
                  </Stack>

                  {isEditing ? (
                    <Stack spacing={1.2}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Leave Type"
                        value={editForm.leaveType}
                        onChange={(event) =>
                          setEditForm((current) => ({ ...current, leaveType: event.target.value }))
                        }
                      >
                        {leaveTypeOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>

                      <Stack direction={{ xs: "column", md: "row" }} spacing={1.2}>
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          label="From Date"
                          value={editForm.fromDate}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, fromDate: event.target.value }))
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          label="To Date"
                          value={editForm.toDate}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, toDate: event.target.value }))
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Stack>

                      <TextField
                        fullWidth
                        size="small"
                        label="Reason"
                        value={editForm.reason}
                        onChange={(event) =>
                          setEditForm((current) => ({ ...current, reason: event.target.value }))
                        }
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Admin Remark"
                        value={editForm.adminRemark}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            adminRemark: event.target.value,
                          }))
                        }
                      />

                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Status"
                        value={editForm.status}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            status: event.target.value as LeaveRequest["status"],
                          }))
                        }
                      >
                        {["pending", "approved", "rejected"].map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "#475569", fontSize: 14 }}>{item.reason}</Typography>
                  )}

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {isAdmin ? (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => void updateLeave(item.id, { status: "approved" })}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => void updateLeave(item.id, { status: "rejected" })}
                        >
                          Reject
                        </Button>
                        {isEditing ? (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => void updateLeave(item.id, editForm)}
                            >
                              Save
                            </Button>
                            <Button size="small" variant="text" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button size="small" variant="text" onClick={() => startEdit(item)}>
                            Edit Details
                          </Button>
                        )}
                      </>
                    ) : null}
                  </Stack>
                </Stack>
              );
            })}

            {filteredLeaves.length === 0 ? (
              <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                No leave requests found for the selected filter.
              </Typography>
            ) : null}
          </Stack>
        </ContentPanel>

        {isAdmin ? (
          <Stack spacing={2.4}>
            <ContentPanel
              title="Department leave snapshot"
              subtitle="Track active members and pending requests across departments."
            >
              <StatList items={departmentSummary} />
            </ContentPanel>

            <ContentPanel
              title="Active approved leaves"
              subtitle="Employees currently on approved leave today."
            >
              {activeLeaveEmployees.length > 0 ? (
                <StatList items={activeLeaveEmployees} />
              ) : (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ color: "#64748b", fontSize: 14 }}
                >
                  <GroupsOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                    No employees are on approved leave today.
                  </Typography>
                </Stack>
              )}
            </ContentPanel>

            <ContentPanel
              title="Department coverage"
              subtitle="Quick reference for team spread."
            >
              <StatList
                items={departments.map((department) => ({
                  label: department.name,
                  value: `${department.members} members`,
                  accent: "#0f172a",
                }))}
              />
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, color: "#64748b" }}>
                <DomainOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                  Team lead information stays available on the departments page.
                </Typography>
              </Stack>
            </ContentPanel>
          </Stack>
        ) : null}
      </Box>
    </Box>
  );
}
