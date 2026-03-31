"use client";
import { Box, Button, TextField, Typography, MenuItem, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";



export default function UserTable() {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    const [filterKey, setFilterKey] = useState("");
    const [filterValue, setFilterValue] = useState("");

    const [rowCount, setRowCount] = useState(0);

    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5, });


    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const { page, pageSize } = paginationModel;
                const skip = page * pageSize;

                let baseUrl = "https://dummyjson.com/users";

                if (filterKey && filterValue) {
                    baseUrl = `https://dummyjson.com/users/filter?key=${filterKey}&value=${filterValue}`;
                }
                else if (search) {
                    baseUrl = `https://dummyjson.com/users/search?q=${search}`;
                }

                const separator = baseUrl.includes("?") ? "&" : "?";

                const url = `${baseUrl}${separator}limit=${pageSize}&skip=${skip}&select=id,firstName,lastName,email,username,phone`;

                const res = await fetch(url);
                const data = await res.json();
                console.log(data.users)
                setUsers(data.users);
                setRowCount(data.total);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, [search, filterKey, filterValue, paginationModel])

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`https://dummyjson.com/users/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            console.log(data);

            setUsers((prev) => prev.filter((user) => user.id !== id));
        }
        catch (error) {
            console.log(error);
        }
    }

    const columns = [
        { field: "id", headerName: 'Id', width: 70 },
        {
            field: "name",
            headerName: "Name",
            width: 200,
            valueGetter: (value, row) =>
                `${row.firstName} ${row.lastName}`,
            sortable: true
        },
        { field: "username", headerName: "Username", width: 150, sortable: true },
        { field: "email", headerName: "Email", width: 220, sortable: true },
        { field: "phone", headerName: "Phone", width: 160 },
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
                        onClick={() => router.push(`/users/${params.row.id}`)}
                    >
                        View
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => router.push(`/users/${params.row.id}/edit`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>

            )
        }

    ]

    return (
        <Box sx={{ height: 450, width: "100%" }} mx="auto">
            <Typography textAlign="center">All Users</Typography>
            <TextField
                fullWidth
                label="Search users..."
                margin="normal"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
            ></TextField>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Filter Key (e.g. gender, hair.color)"
                        value={filterKey}
                        onChange={(e) => setFilterKey(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Filter Value"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
            </Grid>
            <DataGrid
                rows={users}
                columns={columns}
                pagination
                paginationMode="server"
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 20]}
            ></DataGrid>
            <Button
                variant="contained"
                onClick={() => { router.push("/users/create") }}
            >Create User</Button>
        </Box>
    )
} 