"use client";

import {Alert,Box,Button,CircularProgress,MenuItem,Stack,TextField,Typography,} from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentPanel, MetricCard, PageIntro } from "../_components/dashboard-ui";

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

type AttendanceRecord = {
  userId: number;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status: "present" | "absent" | "holiday" | "leave";
};

export default function AttendancePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editRows, setEditRows] = useState<Record<string, AttendanceRecord>>({});

  const isAdmin = user?.role === "Manager" || user?.role === "HR";
  const currentMonth = new Date().toISOString().slice(0, 7);
  const todayKey = new Date().toISOString().slice(0, 10);

  const loadAttendance = useCallback(async (employeeId: number) => {
    const res = await fetch(`/api/attendance?userId=${employeeId}&month=${currentMonth}`, {
      credentials: "include",
    });
    const data = await res.json();
    const records = Array.isArray(data) ? data : [];
    setAttendance(records);
    setEditRows(
      records.reduce<Record<string, AttendanceRecord>>((accumulator, item) => {
        accumulator[item.date] = { ...item };
        return accumulator;
      }, {})
    );
  }, [currentMonth]);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const authRes = await fetch("/api/auth/check", { credentials: "include" });

      if (!authRes.ok) {
        router.push("/login");
        return;
      }

      const authData = await authRes.json();

      if (!active) {
        return;
      }

      setUser(authData.user);

      if (authData.user.role === "Manager" || authData.user.role === "HR") {
        const employeeRes = await fetch("/api/employees", { credentials: "include" });
        const employeeData = await employeeRes.json();

        if (!active) {
          return;
        }

        const employeeList = Array.isArray(employeeData) ? employeeData : [];
        setEmployees(employeeList);

        const firstId = employeeList[0]?.id ?? null;
        setSelectedId(firstId);

        if (firstId) {
          await loadAttendance(firstId);
        }
      } else {
        setSelectedId(authData.user.id);
        setEmployees([authData.user]);
        await loadAttendance(authData.user.id);
      }

      if (active) {
        setLoading(false);
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [loadAttendance, router]);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedId) ?? user,
    [employees, selectedId, user]
  );

  const presentCount = attendance.filter((item) => item.status === "present").length;
  const absentCount = attendance.filter((item) => item.status === "absent").length;
  const leaveCount = attendance.filter((item) => item.status === "leave").length;
  const holidayCount = attendance.filter((item) => item.status === "holiday").length;

  const todayRecord =
    attendance.find((item) => item.date === todayKey) ??
    ({
      userId: selectedId || user?.id || 0,
      date: todayKey,
      checkIn: null,
      checkOut: null,
      status: "absent",
    } as AttendanceRecord);

  const orderedAttendance = useMemo(
    () => [...attendance].sort((left, right) => right.date.localeCompare(left.date)),
    [attendance]
  );

  const handleCheckAction = async (action: "check-in" | "check-out") => {
    setSavingId(action);

    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ action }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setMessage({ type: "error", text: data?.message || "Unable to update attendance." });
      setSavingId(null);
      return;
    }

    if (selectedId) {
      await loadAttendance(selectedId);
    }

    setSavingId(null);
    setMessage({
      type: "success",
      text: action === "check-in" ? "Checked in successfully." : "Checked out successfully.",
    });
  };

  const handleAdminSave = async (date: string) => {
    const record = editRows[date];

    if (!selectedId || !record) {
      return;
    }

    setSavingId(date);

    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "admin-update",
        userId: selectedId,
        date: record.date,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        status: record.status,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setMessage({ type: "error", text: data?.message || "Unable to save attendance changes." });
      setSavingId(null);
      return;
    }

    await loadAttendance(selectedId);
    setSavingId(null);
    setMessage({ type: "success", text: "Attendance updated." });
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
        eyebrow="Attendance"
        title={isAdmin ? "Attendance management" : "My attendance"}
        description={
          isAdmin
            ? "Edit employee login time, logout time, and daily status for the current month."
            : "Check in, check out, and review your attendance records with the latest status."
        }
        action={
          <Button
            variant="contained"
            startIcon={<CalendarMonthOutlinedIcon />}
            onClick={() => router.push("/attendance/calendar")}
          >
            Open Calendar
          </Button>
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
        }}
      >
        <MetricCard
          label="Present Days"
          value={presentCount}
          icon={<EventAvailableOutlinedIcon />}
          hint="Marked present this month"
          color="#dcfce7"
        />
        <MetricCard
          label="Absent Days"
          value={absentCount}
          icon={<EventBusyOutlinedIcon />}
          hint="Marked absent this month"
          color="#fee2e2"
        />
        <MetricCard
          label="Leaves"
          value={leaveCount}
          icon={<BeachAccessOutlinedIcon />}
          hint="Approved leave days this month"
          color="#fef3c7"
        />
        <MetricCard
          label="Holidays"
          value={holidayCount}
          icon={<CalendarMonthOutlinedIcon />}
          hint="Weekend or holiday count"
          color="#e0f2fe"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "minmax(320px, 0.8fr) minmax(0, 1.2fr)" },
          gap: 2.4,
        }}
      >
        <ContentPanel
          title={isAdmin ? "Selected employee" : "Today"}
          subtitle={
            isAdmin
              ? "Choose an employee and edit the current month attendance below."
              : "Use the buttons below to mark your current check-in and check-out time."
          }
        >
          <Stack spacing={2}>
            {isAdmin ? (
              <TextField
                select
                label="Employee"
                value={selectedId ?? ""}
                onChange={async (event) => {
                  const employeeId = Number(event.target.value);
                  setSelectedId(employeeId);
                  setLoading(true);
                  await loadAttendance(employeeId);
                  setLoading(false);
                }}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}

            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                backgroundColor: "#f8fafc",
                border: "1px solid rgba(15, 23, 42, 0.08)",
              }}
            >
              <Typography sx={{ color: "#0f172a", fontWeight: 800 }}>
                {selectedEmployee?.name || "Employee"}
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.6 }}>
                Date: {todayRecord.date}
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.6 }}>
                Status: <Box component="span" sx={{ textTransform: "capitalize" }}>{todayRecord.status}</Box>
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.6 }}>
                Check In: {todayRecord.checkIn || "-"}
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.6 }}>
                Check Out: {todayRecord.checkOut || "-"}
              </Typography>
            </Box>

            {!isAdmin ? (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                <Button
                  variant="contained"
                  startIcon={<LoginOutlinedIcon />}
                  disabled={
                    savingId !== null ||
                    todayRecord.status === "leave" ||
                    todayRecord.status === "holiday" ||
                    Boolean(todayRecord.checkIn)
                  }
                  onClick={() => void handleCheckAction("check-in")}
                >
                  Check In
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LogoutOutlinedIcon />}
                  disabled={
                    savingId !== null ||
                    todayRecord.status === "leave" ||
                    todayRecord.status === "holiday" ||
                    !todayRecord.checkIn ||
                    Boolean(todayRecord.checkOut)
                  }
                  onClick={() => void handleCheckAction("check-out")}
                >
                  Check Out
                </Button>
              </Stack>
            ) : null}

            {!isAdmin && (todayRecord.status === "leave" || todayRecord.status === "holiday") ? (
              <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                Attendance actions are disabled because today is marked as {todayRecord.status}.
              </Typography>
            ) : null}
          </Stack>
        </ContentPanel>

        <ContentPanel
          title={isAdmin ? "Monthly records" : "Recent records"}
          subtitle={
            isAdmin
              ? "Admin can adjust login time, logout time, and daily status. Leave days come from approved leave requests."
              : "Your latest attendance records for the current month."
          }
        >
          <Stack spacing={1.2}>
            {orderedAttendance.map((item) => {
              const editItem = editRows[item.date] || item;
              const isLeaveRecord = item.status === "leave";

              return (
                <Stack
                  key={item.date}
                  direction={{ xs: "column", xl: "row" }}
                  spacing={1.2}
                  alignItems={{ xs: "stretch", xl: "center" }}
                  justifyContent="space-between"
                  sx={{
                    p: 1.6,
                    borderRadius: 2.5,
                    backgroundColor: "#f8fafc",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <Box sx={{ minWidth: 120 }}>
                    <Typography sx={{ color: "#0f172a", fontWeight: 700 }}>{item.date}</Typography>
                    <Typography sx={{ color: "#64748b", fontSize: 12, textTransform: "capitalize" }}>
                      {item.status}
                    </Typography>
                  </Box>

                  {isAdmin ? (
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1.1} sx={{ flex: 1 }}>
                      <TextField
                        size="small"
                        type="time"
                        label="Check In"
                        value={editItem.checkIn || ""}
                        disabled={isLeaveRecord}
                        onChange={(event) =>
                          setEditRows((current) => ({
                            ...current,
                            [item.date]: {
                              ...editItem,
                              checkIn: event.target.value || null,
                            },
                          }))
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        size="small"
                        type="time"
                        label="Check Out"
                        value={editItem.checkOut || ""}
                        disabled={isLeaveRecord}
                        onChange={(event) =>
                          setEditRows((current) => ({
                            ...current,
                            [item.date]: {
                              ...editItem,
                              checkOut: event.target.value || null,
                            },
                          }))
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        select
                        size="small"
                        label="Status"
                        value={editItem.status}
                        disabled={isLeaveRecord}
                        onChange={(event) =>
                          setEditRows((current) => ({
                            ...current,
                            [item.date]: {
                              ...editItem,
                              status: event.target.value as AttendanceRecord["status"],
                            },
                          }))
                        }
                        sx={{ minWidth: 140 }}
                      >
                        {["present", "absent", "holiday"].map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "#64748b", fontSize: 13, flex: 1 }}>
                      Check In: {item.checkIn || "-"} | Check Out: {item.checkOut || "-"}
                    </Typography>
                  )}

                  {isAdmin ? (
                    <Stack alignItems={{ xs: "flex-start", xl: "flex-end" }} spacing={0.6}>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={Boolean(savingId) || isLeaveRecord}
                        onClick={() => void handleAdminSave(item.date)}
                      >
                        {savingId === item.date ? "Saving..." : "Save"}
                      </Button>
                      {isLeaveRecord ? (
                        <Typography sx={{ color: "#64748b", fontSize: 12 }}>
                          Managed by leave approval
                        </Typography>
                      ) : null}
                    </Stack>
                  ) : (
                    <Typography
                      sx={{
                        color:
                          item.status === "present"
                            ? "#15803d"
                            : item.status === "leave"
                            ? "#b45309"
                            : item.status === "absent"
                            ? "#dc2626"
                            : "#64748b",
                        fontWeight: 800,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.status}
                    </Typography>
                  )}
                </Stack>
              );
            })}

            {orderedAttendance.length === 0 ? (
              <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                No attendance records found for this month.
              </Typography>
            ) : null}
          </Stack>
        </ContentPanel>
      </Box>
    </Box>
  );
}
