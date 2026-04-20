"use client";

import { Box, Card, Button, CardContent, Chip, CircularProgress, Typography, } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { fetchEmployeeDetails } from "../../../../store/employeeSlice";

// type Employee = {
//     id: number;
//     name: string;
//     email: string;
//     role: string;
//     projects: string[];
// };

type Attendance = {
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    status: string;
};


export default function EmployeeDetails() {
    const params = useParams();
    const id = params.id;
    const dispacth = useDispatch();
    const router = useRouter();

    const { employee, attendance, loading, error } = useSelector((state: RootState) => state.employee);

    useEffect(() => {
        // async function fetchData() {
        //     const empRes = await fetch(`/api/employees/${id}`);
        //     const empData = await empRes.json();

        //     const month = new Date().toISOString().slice(0, 7);
        //     const attRes = await fetch(`/api/attendance?userId=${id}&month=${month}`);
        //     const attData = await attRes.json();

        //     console.log(empData);

        //     setEmployee(empData);
        //     setAttendance(attData);
        //     setLoading(false);
        // }
        // fetchData();

        dispacth(fetchEmployeeDetails(id as string) as any);
    }, [id, dispacth])

    useEffect(() => {
        if (error === "unauthorized") {
            router.push("/login");
        }
    }, [error, router]);



    const attendanceMap: Record<string, Attendance> = {};

    attendance.forEach((a) => {
        attendanceMap[a.date] = a;
    })

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const lastDay = new Date(year, month + 1, 0).getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const calendarDays: (string | null)[] = []

    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }

    for (let i = 1; i <= lastDay; i++) {
        const y = year;
        const m = String(month + 1).padStart(2, "0");
        const d = String(i).padStart(2, "0");

        const date = `${y}-${m}-${d}`;
        calendarDays.push(date);
    }

    // const days: string[] = [];

    // for (let i = 1; i <= lastDay; i++) {
    //     const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    //     days.push(date);
    // }

    if (loading) {
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
        </Box>
    }

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5">Employee Id:{id}</Typography>
                <Button variant="contained" onClick={() => router.push("/employees")}>Employees List</Button>
            </Box>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ fontSize: "18px", fontWeight: 500, fontFamily: 'sans-serif' }}>Employee Name : <Typography component="span" sx={{ color: "black", ml: 1 }}>{employee?.name}</Typography></Typography>
                    <Typography variant="h5" sx={{ fontSize: "18px", fontWeight: 500, fontFamily: 'sans-serif' }}>Employee Mail : <Typography component="span" sx={{ color: "black", ml: 1 }}>{employee?.email}</Typography></Typography>
                    <Typography variant="h5" sx={{ fontSize: "18px", fontWeight: 500, fontFamily: 'sans-serif' }}>Employee Role : <Typography component="span" sx={{ color: "black", ml: 1 }}>{employee?.role}</Typography></Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Projects : </Typography>
                        {employee?.projects?.map((proj, index) => (
                            <Chip key={index} label={proj} sx={{ mr: 1, mt: 1 }}></Chip>
                        ))}
                    </Box>
                </CardContent>
            </Card>

            {/* <Typography variant="h6"> Attendance (Current Month)</Typography> */}
            {/* <Grid container spacing={1} sx={{ mb: 4 }}>
                {attendance.map((day, index) => (
                    <Grid key={index} xs={2}>
                        <Box sx={{
                            p: 1,
                            border: "1px solid #ccc",
                            textAlign: "center",
                            borderRadius: 1
                        }}>
                            <Typography variant="body2">{day.date}</Typography>
                            <Typography variant="caption"
                                sx={{ color: day.status === "present" ? "green" : "red", fontWeight: 600 }}
                            >{day.status}</Typography>
                            <Typography variant="body2">Check In : {day.checkIn}</Typography>
                            <Typography variant="body2"> Check Out : {day.checkOut}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid> */}

            {/* <Typography variant="h6">Check-in / Check-out</Typography> */}

            {/* <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Check In</TableCell>
                        <TableCell>Check Out</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {attendance.map((a, i) => (
                        <TableRow key={i}>
                            <TableCell>{a.date}</TableCell>
                            <TableCell>{a.checkIn}</TableCell>
                            <TableCell>{a.checkOut}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table> */}
            <Typography variant="h6" sx={{ mb: 1 }}>Attendance Calender</Typography>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: "repeat(7,1fr)",
                mb: 1,
            }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <Typography key={d} align="center" fontWeight={600}>{d}</Typography>
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
                    if (!date) {
                        return <Box key={index} />
                    }
                    const data = attendanceMap[date];
                    const day = date.split("-")[2];
                    return (
                        <Box key={date}
                            sx={{
                                p: 1,
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                textAlign: 'center',
                                minHeight: 60,
                                backgroundColor:
                                    data?.status === "present" ? "#dcfce7" : data?.status === "absent" ? "#fee2e2" : "#f3f4f6",
                            }}
                        >
                            <Typography variant="caption">
                                {day}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    fontWeight: 600,
                                    mt: 1,
                                    color:
                                        data?.status === "present" ? "green" : data?.status === "absent" ? "red" : "gray",
                                    fontSize: "14px",
                                }}
                            >
                                {data?.status || "No Data"}
                            </Typography>
                            {data?.checkIn && (
                                <Typography variant="caption">Check In : {data?.checkIn}</Typography>
                            )}
                            <br></br>
                            {data?.checkOut && (
                                <Typography variant="caption">Check Out : {data?.checkOut}</Typography>
                            )}
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}