"use client";

import { Alert,Box, Button,Chip, CircularProgress, MenuItem, Stack, TextField, Typography, } from "@mui/material";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect, useMemo, useState } from "react";
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
};

type PayrollItem = {
  id: number;
  employeeId: number;
  month: string;
  status: "pending" | "processed";
  amount: number;
};

type PayrollForm = {
  employeeId: number | "";
  month: string;
  status: PayrollItem["status"];
  amount: string;
};

const defaultPayrollForm: PayrollForm = {
  employeeId: "",
  month: new Date().toISOString().slice(0, 7),
  status: "pending",
  amount: "",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function PayrollPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "processed">("all");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [createForm, setCreateForm] = useState<PayrollForm>(defaultPayrollForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<PayrollForm>(defaultPayrollForm);

  const isAdmin = user?.role === "Manager" || user?.role === "HR";

  const loadPayroll = async () => {
    const res = await fetch(`${API_URL}/api/payroll`, { credentials: "include" });
    const data = await res.json();
    setPayrollItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [authRes, payrollRes, employeeRes] = await Promise.all([
        fetch(`${API_URL}/api/auth/check`, { credentials: "include" }),
        fetch(`${API_URL}/api/payroll`, { credentials: "include" }),
        fetch(`${API_URL}/api/employees`, { credentials: "include" }),
      ]);

      if (!authRes.ok) {
        router.push(`/login`);
        return;
      }

      const authData = await authRes.json();
      const payrollData = await payrollRes.json();
      const employeeData = await employeeRes.json();

      if (!active) {
        return;
      }

      setUser(authData.user);
      setPayrollItems(Array.isArray(payrollData) ? payrollData : []);
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [router]);

  const pending = useMemo(
    () => payrollItems.filter((item) => item.status === "pending"),
    [payrollItems]
  );
  const processed = useMemo(
    () => payrollItems.filter((item) => item.status === "processed"),
    [payrollItems]
  );

  const visibleItems = useMemo(() => {
    if (statusFilter === "pending") {
      return pending;
    }

    if (statusFilter === "processed") {
      return processed;
    }

    return payrollItems;
  }, [payrollItems, pending, processed, statusFilter]);

  const employeeName = (employeeId: number) =>
    employees.find((employee) => employee.id === employeeId)?.name || `Employee #${employeeId}`;

  const startEdit = (item: PayrollItem) => {
    setEditingId(item.id);
    setEditForm({
      employeeId: item.employeeId || "",
      month: item.month || new Date().toISOString().slice(0, 7),
      status: item.status || "pending",
      amount: String(item.amount ?? ""),
    });
  };

  const savePayroll = async (id: number, payload: PayrollForm) => {
    const res = await fetch(`${API_URL}/api/payroll/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        employeeId: payload.employeeId,
        month: payload.month,
        status: payload.status,
        amount: Number(payload.amount),
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setMessage({ type: "error", text: data?.message || "Unable to update payroll item." });
      return;
    }

    await loadPayroll();
    setEditingId(null);
    setMessage({ type: "success", text: "Payroll item updated." });
  };

  const createPayroll = async () => {
    const res = await fetch(`${API_URL}/api/payroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        employeeId: createForm.employeeId,
        month: createForm.month,
        status: createForm.status,
        amount: Number(createForm.amount),
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setMessage({ type: "error", text: data?.message || "Unable to create payroll item." });
      return;
    }

    await loadPayroll();
    setCreateForm(defaultPayrollForm);
    setMessage({ type: "success", text: "Payroll item created." });
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
        eyebrow="Payroll"
        title="Payroll management"
        description="Create, edit, and manage monthly payroll records with a simple clean admin workflow."
      />

      {message ? (
        <Alert severity={message.type} sx={{ mb: 2.5 }}>
          {message.text}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 6,
          alignItems: "stretch",
          "& > *": { height: "100%" },
        }}
      >
        <MetricCard
          label="Payroll Records"
          value={payrollItems.length}
          icon={<PaymentsOutlinedIcon />}
          hint="Show all payroll items"
          color="#ede9fe"
          onClick={() => setStatusFilter("all")}
        />
        <MetricCard
          label="Pending Payrolls"
          value={pending.length}
          icon={<HourglassBottomOutlinedIcon />}
          hint="Need review or release"
          color="#ffedd5"
          onClick={() => setStatusFilter("pending")}
        />
        <MetricCard
          label="Processed"
          value={processed.length}
          icon={<TaskAltOutlinedIcon />}
          hint="Already completed"
          color="#dcfce7"
          onClick={() => setStatusFilter("processed")}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "minmax(320px, 0.85fr) minmax(0, 1.15fr)" },
          gap: 2.4,
        }}
      >
        {isAdmin ? (
          <ContentPanel
            title="Create payroll item"
            subtitle="Add a new payroll record for an employee."
          >
            <Stack spacing={1.4}>
              <TextField
                select
                label="Employee"
                value={createForm.employeeId}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    employeeId: Number(event.target.value),
                  }))
                }
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="month"
                label="Month"
                value={createForm.month}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, month: event.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Amount"
                type="number"
                value={createForm.amount}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, amount: event.target.value }))
                }
              />
              <TextField
                select
                label="Status"
                value={createForm.status}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    status: event.target.value as PayrollItem["status"],
                  }))
                }
              >
                {["pending", "processed"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={() => void createPayroll()}
              >
                Create Payroll Item
              </Button>
            </Stack>
          </ContentPanel>
        ) : null}

        <ContentPanel
          title="Monthly payroll list"
          subtitle={
            statusFilter === "pending"
              ? "Showing pending payroll items."
              : statusFilter === "processed"
              ? "Showing processed payroll items."
              : "Showing all payroll items."
          }
          sx={!isAdmin ? undefined : { gridColumn: { xl: "2 / 3" } }}
        >
          <Stack spacing={1.25}>
            {visibleItems.map((item) => {
              const isEditing = editingId === item.id;

              return (
                <Stack
                  key={item.id}
                  spacing={1.2}
                  sx={{
                    p: 1.7,
                    borderRadius: 2.5,
                    backgroundColor: "#f8fafc",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                  }}
                >
                  {isEditing ? (
                    <Stack spacing={1.2}>
                      <TextField
                        select
                        label="Employee"
                        value={editForm.employeeId}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            employeeId: Number(event.target.value),
                          }))
                        }
                      >
                        {employees.map((employee) => (
                          <MenuItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Stack direction={{ xs: "column", md: "row" }} spacing={1.2}>
                        <TextField
                          fullWidth
                          type="month"
                          label="Month"
                          value={editForm.month}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, month: event.target.value }))
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          fullWidth
                          label="Amount"
                          type="number"
                          value={editForm.amount}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, amount: event.target.value }))
                          }
                        />
                      </Stack>
                      <TextField
                        select
                        label="Status"
                        value={editForm.status}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            status: event.target.value as PayrollItem["status"],
                          }))
                        }
                      >
                        {["pending", "processed"].map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  ) : (
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", md: "center" }}
                      spacing={1}
                    >
                      <Box>
                        <Typography sx={{ color: "#0f172a", fontWeight: 700 }}>
                          {employeeName(item.employeeId)}
                        </Typography>
                        <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                          Month: {item.month}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ color: "#0f172a", fontWeight: 800 }}>
                          Rs {item.amount.toLocaleString()}
                        </Typography>
                        <Chip
                          label={item.status}
                          color={item.status === "processed" ? "success" : "warning"}
                        />
                      </Stack>
                    </Stack>
                  )}

                  {isAdmin ? (
                    <Stack direction="row" spacing={1}>
                      {isEditing ? (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => void savePayroll(item.id, editForm)}
                          >
                            Save
                          </Button>
                          <Button size="small" variant="text" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </Button>
                      )}
                    </Stack>
                  ) : null}
                </Stack>
              );
            })}

            {visibleItems.length === 0 ? (
              <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                No payroll records found for the selected view.
              </Typography>
            ) : null}
          </Stack>
        </ContentPanel>
      </Box>
    </Box>
  );
}
