"use client";

import { Avatar, Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { fetchEmployeeDetails } from "../../../../store/employeeSlice";
import { ContentPanel, PageIntro, StatList } from "../../_components/dashboard-ui";

type Attendance = {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
};

export default function EmployeeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { employee, attendance, loading, error } = useSelector((state: RootState) => state.employee);
  const id = params.id as string;

  useEffect(() => {
    dispatch(fetchEmployeeDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error === "unauthorized") {
      router.push("/login");
    }
  }, [error, router]);

  if (loading || !employee) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
        <CircularProgress />
      </Box>
    );
  }

  const attendanceCounts = attendance.reduce(
    (acc, item: Attendance) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Box>
      <PageIntro
        eyebrow="Employee Profile"
        title={employee.name}
        description="Detailed employee information with current month attendance insight and project assignments."
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => router.push("/employees")}
          >
            Back to Employees
          </Button>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.15fr 0.85fr" },
          gap: 2.2,
          mb: 3,
        }}
      >
        <ContentPanel
          title="Employee details"
          subtitle="Role, identity, and project summary."
          sx={{
            background:
              "linear-gradient(135deg, rgb(57, 71, 106) 0%, rgba(29,78,216,0.96) 100%)",
            color: "white",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ xs: "flex-start", sm: "center" }}>
            <Avatar
              sx={{
                width: 78,
                height: 78,
                bgcolor: "rgba(255,255,255,0.14)",
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              {employee.name ? employee.name.charAt(0) : "?"}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 28, fontWeight: 800 }}>{employee.name || "Deleted User"}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                <Chip icon={<MailOutlineOutlinedIcon />} label={employee.email} sx={lightChipSx} />
                <Chip icon={<BadgeOutlinedIcon />} label={employee.role} sx={lightChipSx} />
                <Chip icon={<CalendarMonthOutlinedIcon />} label={`Employee #${employee.id}`} sx={lightChipSx} />
              </Stack>
            </Box>
          </Stack>

          <Box sx={{ mt: 2.5 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", mb: 1.1 }}>Projects</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(employee.projects ?? []).map((project) => (
                <Chip key={project} label={project} sx={lightChipSx} />
              ))}
            </Stack>
          </Box>
        </ContentPanel>

        <ContentPanel
          title="Attendance summary"
          subtitle="Current month status counts."
        >
          <StatList
            items={[
              { label: "Present", value: attendanceCounts.present || 0, accent: "#15803d" },
              { label: "Absent", value: attendanceCounts.absent || 0, accent: "#dc2626" },
              { label: "Holiday", value: attendanceCounts.holiday || 0, accent: "#64748b" },
            ]}
          />
        </ContentPanel>
      </Box>

      <ContentPanel
        title="Attendance calendar"
        subtitle="Day-wise attendance status for the current month."
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 1,
            mb: 1.25,
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Typography key={day} align="center" sx={{ fontWeight: 700, color: "#475569" }}>
              {day}
            </Typography>
          ))}
        </Box>
        <AttendanceCalendar attendance={attendance} />
      </ContentPanel>
    </Box>
  );
}

function AttendanceCalendar({ attendance }: { attendance: Attendance[] }) {
  const attendanceMap: Record<string, Attendance> = {};

  attendance.forEach((item) => {
    attendanceMap[item.date] = item;
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const calendarDays: (string | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= lastDay; i++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    calendarDays.push(date);
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gap: 1,
      }}
    >
      {calendarDays.map((date, index) => {
        if (!date) {
          return <Box key={`empty-${index}`} />;
        }

        const data = attendanceMap[date];
        const day = date.split("-")[2];
        const bgColor =
          data?.status === "present" ? "#dcfce7" : data?.status === "absent" ? "#fee2e2" : "#f1f5f9";
        const textColor =
          data?.status === "present" ? "#15803d" : data?.status === "absent" ? "#dc2626" : "#64748b";

        return (
          <Box
            key={date}
            sx={{
              p: 1.2,
              borderRadius: 2.5,
              minHeight: 88,
              backgroundColor: bgColor,
            }}
          >
            <Typography sx={{ color: "#334155", fontSize: 12, fontWeight: 700 }}>{day}</Typography>
            <Typography sx={{ mt: 1, color: textColor, fontSize: 12, fontWeight: 800, textTransform: "capitalize" }}>
              {data?.status || "No Data"}
            </Typography>
            {data?.checkIn ? (
              <Typography sx={{ mt: 0.5, color: "#475569", fontSize: 11 }}>
                In: {data.checkIn}
              </Typography>
            ) : null}
            {data?.checkOut ? (
              <Typography sx={{ color: "#475569", fontSize: 11 }}>
                Out: {data.checkOut}
              </Typography>
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
}

const lightChipSx = {
  bgcolor: "rgba(255,255,255,0.14)",
  color: "white",
};
