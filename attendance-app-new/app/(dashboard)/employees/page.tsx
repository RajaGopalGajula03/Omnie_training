"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../../store/employeeSlice";


export default function Dashboard() {
    // const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const router = useRouter();

    const { employees, loading, error } = useSelector((state: RootState) => state.employee)

    console.log("loading in employees:", loading);
    useEffect(() => {
        // async function fetchData() {
        //     const res = await fetch("/api/employees");
        //     if (res.status === 401) {
        //         router.push("/login");
        //         return;
        //     }

        //     if (!res.ok) {
        //         alert("Error fetching data");
        //         return;
        //     }

        //     const data = await res.json();
        //     setData(data);
        //     console.log(data)
        // }
        // fetchData();
        dispatch(fetchEmployees() as any);
    }, [dispatch])

    useEffect(() => {
        if (error === "unauthorized") {
            router.push("/login")
        }
    }, [error, router])

    const columns = [
        { field: "id", headerName: 'Id', width: 70 },
        {
            field: "name",
            headerName: "Name",
            width: 200,
        },
        { field: "email", headerName: "Email", width: 220, sortable: true },
        { field: "role", headerName: "Role", width: 160 },
        {
            field: 'actions',
            headerName: "Actions",
            width: 250,
            renderCell: (params) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => router.push(`/employees/${params.row.id}`)}
                    >
                        View
                    </Button>
                </Box>

            )
        }

    ]

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h5" >Employees</Typography>

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={employees}
                    columns={columns}
                    loading={loading}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                />
            </Box>
        </Box>
    )
}