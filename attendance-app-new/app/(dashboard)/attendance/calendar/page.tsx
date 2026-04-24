"use client";

import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentPanel, PageIntro } from "../../_components/dashboard-ui";

type Employee = {
  id: number;
  name: string;
};

type Attendance = {
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status: string;
};

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AttendanceCalendarPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [user, setUser] = useState<SessionUser | null>(null);

  const isAdmin = user?.role === "Manager" || user?.role === "HR";

  useEffect(() => {
    const loadSessionAndEmployees = async () => {
      const authRes = await fetch("/api/auth/check", { credentials: "include" });

      if (!authRes.ok) {
        router.push("/login");
        return;
      }

      const authData = await authRes.json();
      setUser(authData.user);

      const employeeRes = await fetch("/api/employees", { credentials: "include" });
      const employeeData = await employeeRes.json();

      if (Array.isArray(employeeData)) {
        setEmployees(employeeData);
        if (authData.user.role === "Manager" || authData.user.role === "HR") {
          if (employeeData.length > 0) {
            setSelectedId(employeeData[0].id);
          }
        } else {
          setSelectedId(authData.user.id);
        }
      }
    };

    loadSessionAndEmployees();
  }, [router]);

  useEffect(() => {
    if (!selectedId) return;

    const fetchAttendance = async () => {
      const month = new Date().toISOString().slice(0, 7);
      const res = await fetch(`/api/attendance?userId=${selectedId}&month=${month}`, {
        credentials: "include",
      });

      const data = await res.json();
      setAttendance(data);
    };

    fetchAttendance();
  }, [selectedId]);

  const attendanceMap: Record<string, Attendance> = {};
  attendance.forEach((item) => {
    attendanceMap[item.date] = item;
  });

  const now = new Date();
  const year = now.getFullYear();
  const monthIndex = now.getMonth();
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const calendarDays: (string | null)[] = [];

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= lastDay; i++) {
    calendarDays.push(
      `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
    );
  }

  return (
    <Box>
      <Box sx={{display:'flex',justifyContent:'space-between'}}>
        <PageIntro
        eyebrow="Attendance Calendar"
        title="Monthly attendance calendar"
        description="Review daily presence, absences, and working-hour snapshots in a clear month view."
      />
      <Button variant="contained" sx={{height:50}} onClick={()=>router.push("/attendance")}>Back to Attendance</Button>
      </Box>

      <ContentPanel
        title="Calendar"
        subtitle="Choose an employee if you are an admin, or continue with your own attendance view."
      >
        {isAdmin ? (
          <TextField
            select
            label="Select Employee"
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            sx={{ mb: 3, width: { xs: "100%", md: 320 } }}
          >
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.name}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <Typography sx={{ mb: 3, color: "#64748b" }}>
            Viewing attendance for {user?.name || "your account"}
          </Typography>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 1,
            mb: 1.2,
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Typography key={day} align="center" sx={{ color: "#475569", fontWeight: 700 }}>
              {day}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          {calendarDays.map((date, index) => {
            if (!date) return <Box key={`empty-${index}`} />;

            const data = attendanceMap[date];
            const day = date.split("-")[2];

            return (
              <Box
                key={date}
                sx={{
                  p: 1.2,
                  borderRadius: 2.5,
                  minHeight: 92,
                  backgroundColor:
                    data?.status === "present"
                      ? "#dcfce7"
                      : data?.status === "leave"
                      ? "#fef3c7"
                      : data?.status === "absent"
                      ? "#fee2e2"
                      : data?.status === "holiday"
                      ? "#e0f2fe"
                      : "#f1f5f9",
                }}
              >
                <Typography sx={{ color: "#334155", fontSize: 12, fontWeight: 700 }}>{day}</Typography>
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 12,
                    fontWeight: 800,
                    color:
                      data?.status === "present"
                        ? "#15803d"
                        : data?.status === "leave"
                        ? "#b45309"
                        : data?.status === "absent"
                        ? "#dc2626"
                        : data?.status === "holiday"
                        ? "#0369a1"
                        : "#64748b",
                    textTransform: "capitalize",
                  }}
                >
                  {data?.status || "No Data"}
                </Typography>
                <Stack spacing={0.2} sx={{ mt: 0.6 }}>
                  {data?.checkIn ? (
                    <Typography sx={{ color: "#475569", fontSize: 11 }}>
                      In: {data.checkIn}
                    </Typography>
                  ) : null}
                  {data?.checkOut ? (
                    <Typography sx={{ color: "#475569", fontSize: 11 }}>
                      Out: {data.checkOut}
                    </Typography>
                  ) : null}
                </Stack>
              </Box>
            );
          })}
        </Box>
      </ContentPanel>
    </Box>
  );
}
