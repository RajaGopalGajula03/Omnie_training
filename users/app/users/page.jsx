"use client";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";



export default function UserTable() {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5, });



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("https://dummyjson.com/users");
                const data = await res.json();
                console.log(data.users)
                setUsers(data.users);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, [])

    const filteredUsers = users.filter((user) =>
        `${user.firstName} ${user.lastName} ${user.username}`.toLowerCase().includes(search.toLowerCase())
    )

    const columns = [
        { field: "id", headerName: 'Id', width: 70 },
        {
            field: "name",
            headerName: "Name",
            width: 200,
            valueGetter: (value, row) =>
                `${row.firstName} ${row.lastName}`,
            sortable:true
        },
        { field: "username", headerName: "Username", width: 150, sortable: true },
        { field: "email", headerName: "Email", width: 220, sortable: true },
        { field: "phone", headerName: "Phone", width: 160 },
        {
            field: 'actions',
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => router.push(`/users/${params.row.id}`)}
                >
                    View
                </Button>
            )
        }

    ]



    return (
        <Box sx={{ height: 500, width: "100%" }} mx="auto">
            <Typography textAlign="center">All Users</Typography>
            <TextField
                fullWidth
                label="Search users..."
                margin="normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            ></TextField>
            <DataGrid
                rows={filteredUsers}
                columns={columns}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 20]}
            ></DataGrid>
        </Box>
    )
} 