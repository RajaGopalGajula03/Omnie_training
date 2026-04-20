"use client";

import { Box, Typography, TextField, MenuItem, CircularProgress, } from "@mui/material";
import { useEffect, useState } from "react";

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

export default function AttendanceCalendar() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedId, setSelectedId] = useState<number | "">("");
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetch("/api/employees", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setEmployees(data)
                if (data.length > 0) {
                    setSelectedId(data[0].id);
                }
            });
    }, []);

    useEffect(() => {
        if (!selectedId) return;

        const fetchAttendance = async () => {
            setLoading(true);

            const month = new Date().toISOString().slice(0, 7);

            const res = await fetch(
                `/api/attendance?userId=${selectedId}&month=${month}`,
                { credentials: "include" }
            );

            const data = await res.json();
            setAttendance(data);
            setLoading(false);
        };

        fetchAttendance();
    }, [selectedId]);


    const attendanceMap: Record<string, Attendance> = {};
    attendance.forEach((a) => {
        attendanceMap[a.date] = a;
    });


    const now = new Date();
    const year = now.getFullYear();
    const monthIndex = now.getMonth();

    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const firstDay = new Date(year, monthIndex, 1).getDay();

    const calendarDays: (string | null)[] = [];

    for (let i = 0; i < firstDay; i++) calendarDays.push(null);

    for (let i = 1; i <= lastDay; i++) {
        const y = year;
        const m = String(monthIndex + 1).padStart(2, "0");
        const d = String(i).padStart(2, "0");
        calendarDays.push(`${y}-${m}-${d}`);
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Attendance Calendar
            </Typography>


            <TextField
                select
                label="Select Employee"
                value={selectedId}
                onChange={(e) => setSelectedId(Number(e.target.value))}
                sx={{ mb: 3, width: 300 }}
            >
                {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                        {emp.name}
                    </MenuItem>
                ))}
            </TextField>


            {loading && <CircularProgress />}

            {!loading && selectedId && (
                <>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7,1fr)",
                            mb: 1,
                        }}
                    >
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <Typography key={d} align="center" fontWeight={600}>
                                {d}
                            </Typography>
                        ))}
                    </Box>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7,1fr)",
                            gap: 1,
                        }}
                    >
                        {calendarDays.map((date, index) => {
                            if (!date) return <Box key={index} />;

                            const data = attendanceMap[date];
                            const day = date.split("-")[2];

                            return (
                                <Box
                                    key={date}
                                    sx={{
                                        p: 1,
                                        border: "1px solid #ddd",
                                        borderRadius: 2,
                                        textAlign: "center",
                                        minHeight: 70,
                                        backgroundColor:
                                            data?.status === "present"
                                                ? "#dcfce7"
                                                : data?.status === "absent"
                                                    ? "#fee2e2"
                                                    : "#f3f4f6",
                                    }}
                                >
                                    <Typography variant="caption">{day}</Typography>

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: "block",
                                            fontWeight: 600,
                                            mt: 1,
                                            color:
                                                data?.status === "present"
                                                    ? "green"
                                                    : data?.status === "absent"
                                                        ? "red"
                                                        : "gray",
                                        }}
                                    >
                                        {data?.status || "No Data"}
                                    </Typography>

                                    {data?.checkIn && (
                                        <Typography variant="caption">
                                            In: {data.checkIn}
                                        </Typography>
                                    )}

                                    <br />

                                    {data?.checkOut && (
                                        <Typography variant="caption">
                                            Out: {data.checkOut}
                                        </Typography>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </>
            )}
        </Box>
    );
}