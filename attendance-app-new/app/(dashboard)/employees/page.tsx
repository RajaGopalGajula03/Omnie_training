"use client";

import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, type Employee } from "../../../store/employeeSlice";
import { ContentPanel, MetricCard, PageIntro } from "../_components/dashboard-ui";

export default function EmployeesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [pageSize, setPageSize] = useState(5);
  const { employees, loading, error } = useSelector((state: RootState) => state.employee);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (error === "unauthorized") {
      router.push("/login");
    }
  }, [error, router]);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/employees/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      dispatch(fetchEmployees());
    }
  };

  const columns: GridColDef<Employee>[] = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "name",
      headerName: "Name",
      width: 220,
      renderCell: (params) => (
        <Stack justifyContent="center" sx={{ height: "100%" }}>
          <Typography sx={{ color: "#0f172a", fontWeight: 700 }}>{params.row.name}</Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: 12 }}>{params.row.role}</Typography>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 260,
    },
    {
      field: "role",
      headerName: "Role",
      width: 180,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.role}
          sx={{ bgcolor: "rgba(20,83,45,0.08)", color: "#14532d", fontWeight: 700 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%" }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => router.push(`/employees/${params.row.id}`)}
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() => router.push(`/employees/edit/${params.row.id}`)}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <PageIntro
        eyebrow="Employees"
        title="Employee directory"
        description="Manage employee records, review contact details, and open full employee profiles from one place."
        action={
          <Button
            variant="contained"
            startIcon={<PersonAddAltOutlinedIcon />}
            onClick={() => router.push("/employees/add")}
          >
            Add Employee
          </Button>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 3,
        }}
      >
        <MetricCard label="Total Employees" value={employees.length} icon={<GroupsOutlinedIcon />} hint="Current workforce count" color="#dbeafe" />
        <MetricCard label="Distinct Roles" value={new Set(employees.map((item) => item.role)).size} icon={<BadgeOutlinedIcon />} hint="Role coverage in the org" color="#dcfce7" />
        <MetricCard label="Active Emails" value={employees.length} icon={<MailOutlineOutlinedIcon />} hint="Reachable employee accounts" color="#ffedd5" />
      </Box>

      <ContentPanel
        title="Employee list"
        subtitle="Browse, edit, and inspect the team roster."
      >
        <Box sx={{ height: 560, width: "100%" }}>
          <DataGrid
            rows={employees}
            columns={columns}
            loading={loading}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10]}
            pagination
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid rgba(15, 23, 42, 0.05)",
              },
            }}
          />
        </Box>
      </ContentPanel>
    </Box>
  );
}
