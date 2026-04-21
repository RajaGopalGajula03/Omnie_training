"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmployeeAttendanceSummary } from "@/lib/dashboard-data";
import { ContentPanel, MetricCard, PageIntro } from "../_components/dashboard-ui";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AttendancePage() {
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

  const attendance = useMemo(() => (user ? getEmployeeAttendanceSummary(user.id) : null), [user]);

  if (!user || !attendance) return null;

  return (
    <Box>
      <PageIntro
        eyebrow="Attendance"
        title="Attendance overview"
        description="Monitor your current month attendance, understand present and absent days, and open the detailed calendar when needed."
        action={
          <Button variant="contained" onClick={() => router.push("/attendance/calendar")}>
            Open Calendar
          </Button>
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
        <MetricCard label="Present Days" value={attendance.presentCount} icon={<EventAvailableOutlinedIcon />} hint="Recorded this month" color="#dcfce7" />
        <MetricCard label="Absent Days" value={attendance.absentCount} icon={<EventBusyOutlinedIcon />} hint="Marked absent" color="#fee2e2" />
        <MetricCard label="Holidays" value={attendance.holidayCount} icon={<BeachAccessOutlinedIcon />} hint="Weekend and holiday count" color="#e0f2fe" />
        <MetricCard label="Calendar View" value="View" icon={<CalendarMonthOutlinedIcon />} hint="Open detailed day-wise view" color="#ede9fe" onClick={() => router.push("/attendance/calendar")} />
      </Box>

      <ContentPanel
        title="Recent attendance"
        subtitle="A quick look at the latest daily records from this month."
      >
        <Stack spacing={1.3}>
          {[...attendance.records].slice(-7).reverse().map((item) => (
            <Stack
              key={item.date}
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
                <Typography sx={{ color: "#0f172a", fontWeight: 700 }}>{item.date}</Typography>
                <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                  Check-in: {item.checkIn || "-"} · Check-out: {item.checkOut || "-"}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color:
                    item.status === "present" ? "#15803d" : item.status === "absent" ? "#dc2626" : "#64748b",
                  fontWeight: 800,
                  textTransform: "capitalize",
                }}
              >
                {item.status}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </ContentPanel>
    </Box>
  );
}
