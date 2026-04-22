"use client";

import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {announcements,departments,getEmployeeAttendanceSummary,getEmployeeById,getRoleLabelFromRoute,payrollItems,type LeaveRequest,} from "@/lib/dashboard-data";
import { generateAttendance } from "@/lib/data";
import { ContentPanel, MetricCard, PageIntro } from "../_components/dashboard-ui";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type EmployeeLite = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AdminDetailKey =
  | "employees"
  | "onLeave"
  | "departments"
  | "pendingApprovals"
  | "presentToday"
  | "announcements"
  | "approvedLeaves"
  | "pendingPayrolls";

type EmployeeDetailKey = "pending" | "approved" | "attendance" | "announcements";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [employees, setEmployees] = useState<EmployeeLite[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminDetail, setAdminDetail] = useState<AdminDetailKey>("employees");
  const [employeeDetail, setEmployeeDetail] = useState<EmployeeDetailKey>("pending");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const authRes = await fetch("/api/auth/check", { credentials: "include" });

      if (!authRes.ok) {
        router.push("/login");
        return;
      }

      const authData = await authRes.json();
      if (!active) return;
      setUser(authData.user);

      const [employeeRes, leaveRes] = await Promise.all([
        fetch("/api/employees", { credentials: "include" }),
        fetch("/api/leave", { credentials: "include" }),
      ]);

      const employeeData = await employeeRes.json();
      const leaveData = await leaveRes.json();

      if (!active) return;
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
      setLeaves(Array.isArray(leaveData) ? leaveData : []);
      setLoading(false);
    };

    loadDashboard();

    const handleFocus = () => {
      loadDashboard();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);

  const isAdmin = user?.role === "Manager" || user?.role === "HR";

  const todayKey = new Date().toISOString().slice(0, 10);

  const adminStats = useMemo(() => {
    const todayPresent = employees.filter((employee) =>
      generateAttendance(employee.id).some((item) => item.date === todayKey && item.status === "present")
    );

    return {
      totalEmployees: employees.length,
      onLeaveToday: leaves.filter(
        (item) => item.status === "approved" && todayKey >= item.fromDate && todayKey <= item.toDate
      ),
      pendingApprovals: leaves.filter((item) => item.status === "pending"),
      approvedLeaves: leaves.filter((item) => item.status === "approved"),
      presentToday: todayPresent,
      pendingPayrolls: payrollItems.filter((item) => item.status === "pending"),
    };
  }, [employees, leaves, todayKey]);

  const employeeAttendance = useMemo(
    () => (user ? getEmployeeAttendanceSummary(user.id) : null),
    [user]
  );
  const employeeLeaves = useMemo(
    () => (user ? leaves.filter((item) => item.employeeId === user.id) : []),
    [leaves, user]
  );

  if (loading || !user) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAdmin) {
    return (
      <Box>
        <PageIntro
          eyebrow={getRoleLabelFromRoute(true)}
          title="Operations dashboard"
          description="Track workforce activity, approvals, departments, payroll progress, and communication from one high-signal admin overview."
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} xl={3} sx={{ height: 180 }}>
            <MetricCard
              label="Total Employees"
              value={employees.length}
              icon={<GroupsOutlinedIcon />}
              hint="Show employee details below"
              color="#fde68a"
              onClick={() => setAdminDetail("employees")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3} sx={{ height: 180 }}>
            <MetricCard
              label="On Leave Today"
              value={adminStats.onLeaveToday.length}
              icon={<BeachAccessOutlinedIcon />}
              hint="Show active leave list below"
              color="#c7d2fe"
              onClick={() => setAdminDetail("onLeave")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3} sx={{ height: 180 }}>
            <MetricCard
              label="Total Departments"
              value={departments.length}
              icon={<DomainOutlinedIcon />}
              hint="Show department details below"
              color="#99f6e4"
              onClick={() => setAdminDetail("departments")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3} sx={{ height: 180 }}>
            <MetricCard
              label="Pending Approvals"
              value={adminStats.pendingApprovals.length}
              icon={<MarkEmailUnreadOutlinedIcon />}
              hint="Show pending requests below"
              color="#93c5fd"
              onClick={() => setAdminDetail("pendingApprovals")}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt:2,mb:5 }}>
          <Grid item xs={12} sm={6} xl={3} sx={{ height: 180 }}>
            <MetricCard
              label="Present Today"
              value={adminStats.presentToday.length}
              icon={<EventAvailableOutlinedIcon />}
              hint="Show present members below"
              color="#dcfce7"
              onClick={() => setAdminDetail("presentToday")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3} sx={{ height: 180 }}>
            <MetricCard
              label="Total Announcements"
              value={announcements.length}
              icon={<CampaignOutlinedIcon />}
              hint="Show announcement feed below"
              color="#dbeafe"
              onClick={() => setAdminDetail("announcements")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3} sx={{ height: 180 }}>
            <MetricCard
              label="Approved Leaves"
              value={adminStats.approvedLeaves.length}
              icon={<ChecklistOutlinedIcon />}
              hint="Show approved leaves below"
              color="#fef3c7"
              onClick={() => setAdminDetail("approvedLeaves")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3} sx={{ height: 180 }}>
            <MetricCard
              label="Pending Payrolls"
              value={adminStats.pendingPayrolls.length}
              icon={<PaymentsOutlinedIcon />}
              hint="Show pending payrolls below"
              color="#fee2e2"
              onClick={() => setAdminDetail("pendingPayrolls")}
            />
          </Grid>
        </Grid>

        <DashboardAdminDetails
          selected={adminDetail}
          employees={employees}
          onLeaveToday={adminStats.onLeaveToday}
          pendingApprovals={adminStats.pendingApprovals}
          approvedLeaves={adminStats.approvedLeaves}
          presentToday={adminStats.presentToday}
        />
      </Box>
    );
  }

  const employeePending = employeeLeaves.filter((item) => item.status === "pending");
  const employeeApproved = employeeLeaves.filter((item) => item.status === "approved");

  return (
    <Box>
      <PageIntro
        eyebrow={getRoleLabelFromRoute(false)}
        title={`Welcome, ${user.name}!`}
        description="Here's a summary of your activities."
        action={
          <Button
            variant="outlined"
            startIcon={<CalendarMonthOutlinedIcon />}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Button>
        }
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} xl={3} sx={{ display: "flex" }}>
          <MetricCard
            label="Pending Leave Requests"
            value={employeePending.length}
            icon={<AssignmentTurnedInOutlinedIcon />}
            hint="Show pending requests below"
            color="#fde68a"
            onClick={() => setEmployeeDetail("pending")}
          />
        </Grid>
        <Grid item xs={12} sm={6} xl={3} sx={{ display: "flex" }}>
          <MetricCard
            label="Approved Leaves"
            value={employeeApproved.length}
            icon={<ChecklistOutlinedIcon />}
            hint="Show approved requests below"
            color="#86efac"
            onClick={() => setEmployeeDetail("approved")}
          />
        </Grid>
        <Grid item xs={12} sm={6} xl={3} sx={{ display: "flex" }}>
          <MetricCard
            label="Attendance This Month"
            value={`${employeeAttendance?.presentCount ?? 0} Days`}
            icon={<EventAvailableOutlinedIcon />}
            hint="Show recent attendance below"
            color="#93c5fd"
            onClick={() => setEmployeeDetail("attendance")}
          />
        </Grid>
        <Grid item xs={12} sm={6} xl={3} sx={{ display: "flex" }}>
          <MetricCard
            label="Announcements"
            value={announcements.length}
            icon={<CampaignOutlinedIcon />}
            hint="Show announcement feed below"
            color="#d8b4fe"
            onClick={() => setEmployeeDetail("announcements")}
          />
        </Grid>
      </Grid>

      <DashboardEmployeeDetails
        selected={employeeDetail}
        pendingLeaves={employeePending}
        approvedLeaves={employeeApproved}
        attendance={employeeAttendance?.records ?? []}
      />
    </Box>
  );
}

function DashboardAdminDetails({
  selected,
  employees,
  onLeaveToday,
  pendingApprovals,
  approvedLeaves,
  presentToday,
}: {
  selected: AdminDetailKey;
  employees: EmployeeLite[];
  onLeaveToday: LeaveRequest[];
  pendingApprovals: LeaveRequest[];
  approvedLeaves: LeaveRequest[];
  presentToday: EmployeeLite[];
}) {
  const titles: Record<AdminDetailKey, { title: string; subtitle: string }> = {
    employees: {
      title: "Employee details",
      subtitle: "Current employee list from the live dashboard data.",
    },
    onLeave: {
      title: "Members on leave today",
      subtitle: "Approved leave requests active for today.",
    },
    departments: {
      title: "Department details",
      subtitle: "Department names, leads, and total members.",
    },
    pendingApprovals: {
      title: "Pending approvals",
      subtitle: "Requests currently waiting for approval.",
    },
    presentToday: {
      title: "Present today",
      subtitle: "Members with attendance marked present today.",
    },
    announcements: {
      title: "Announcements",
      subtitle: "Latest company updates available in the dashboard.",
    },
    approvedLeaves: {
      title: "Approved leaves",
      subtitle: "Requests that have already been approved.",
    },
    pendingPayrolls: {
      title: "Pending payrolls",
      subtitle: "Payroll records still pending action.",
    },
  };

  return (
    <ContentPanel title={titles[selected].title} subtitle={titles[selected].subtitle} sx={{ mt: 3 }}>
      {selected === "employees" ? (
        <SimpleList
          items={employees.map((employee) => ({
            title: employee.name,
            subtitle: `${employee.email} · ${employee.role}`,
            tag: `ID ${employee.id}`,
          }))}
        />
      ) : null}

      {selected === "onLeave" ? (
        <SimpleList
          items={onLeaveToday.map((leave) => ({
            title: getEmployeeById(leave.employeeId)?.name || `Employee #${leave.employeeId}`,
            subtitle: `${leave.leaveType} · ${leave.fromDate} to ${leave.toDate}`,
            tag: leave.status,
          }))}
          emptyLabel="No active leave records for today."
        />
      ) : null}

      {selected === "departments" ? (
        <SimpleList
          items={departments.map((department) => ({
            title: department.name,
            subtitle: `Lead: ${department.lead}`,
            tag: `${department.members} members`,
          }))}
        />
      ) : null}

      {selected === "pendingApprovals" ? (
        <SimpleList
          items={pendingApprovals.map((leave) => ({
            title: leave.reason,
            subtitle: `${getEmployeeById(leave.employeeId)?.name || `Employee #${leave.employeeId}`} · ${leave.fromDate} to ${leave.toDate}`,
            tag: "pending",
          }))}
          emptyLabel="No pending approvals."
        />
      ) : null}

      {selected === "presentToday" ? (
        <SimpleList
          items={presentToday.map((employee) => ({
            title: employee.name,
            subtitle: `${employee.email} · ${employee.role}`,
            tag: "present",
          }))}
          emptyLabel="No present members found for today."
        />
      ) : null}

      {selected === "announcements" ? (
        <SimpleList
          items={announcements.map((item) => ({
            title: item.title,
            subtitle: `${item.description} · ${item.date}`,
            tag: item.audience,
          }))}
        />
      ) : null}

      {selected === "approvedLeaves" ? (
        <SimpleList
          items={approvedLeaves.map((leave) => ({
            title: leave.reason,
            subtitle: `${getEmployeeById(leave.employeeId)?.name || `Employee #${leave.employeeId}`} · ${leave.fromDate} to ${leave.toDate}`,
            tag: "approved",
          }))}
          emptyLabel="No approved leaves yet."
        />
      ) : null}

      {selected === "pendingPayrolls" ? (
        <SimpleList
          items={payrollItems
            .filter((item) => item.status === "pending")
            .map((item) => ({
              title: getEmployeeById(item.employeeId)?.name || `Employee #${item.employeeId}`,
              subtitle: `${item.month} · ₹${item.amount.toLocaleString()}`,
              tag: item.status,
            }))}
          emptyLabel="No pending payrolls."
        />
      ) : null}
    </ContentPanel>
  );
}

function DashboardEmployeeDetails({
  selected,
  pendingLeaves,
  approvedLeaves,
  attendance,
}: {
  selected: EmployeeDetailKey;
  pendingLeaves: LeaveRequest[];
  approvedLeaves: LeaveRequest[];
  attendance: Array<{
    date: string;
    checkIn?: string | null;
    checkOut?: string | null;
    status: string;
  }>;
}) {
  const details = {
    pending: {
      title: "Pending leave requests",
      subtitle: "Requests waiting for review.",
    },
    approved: {
      title: "Approved leaves",
      subtitle: "Requests already approved.",
    },
    attendance: {
      title: "Attendance details",
      subtitle: "Recent attendance records from this month.",
    },
    announcements: {
      title: "Announcement feed",
      subtitle: "Latest company updates relevant to your workspace.",
    },
  };

  return (
    <ContentPanel title={details[selected].title} subtitle={details[selected].subtitle} sx={{ mt: 3 }}>
      {selected === "pending" ? (
        <SimpleList
          items={pendingLeaves.map((leave) => ({
            title: leave.reason,
            subtitle: `${leave.leaveType} · ${leave.fromDate} to ${leave.toDate}`,
            tag: leave.status,
          }))}
          emptyLabel="No pending leave requests."
        />
      ) : null}

      {selected === "approved" ? (
        <SimpleList
          items={approvedLeaves.map((leave) => ({
            title: leave.reason,
            subtitle: `${leave.leaveType} · ${leave.fromDate} to ${leave.toDate}`,
            tag: leave.status,
          }))}
          emptyLabel="No approved leaves yet."
        />
      ) : null}

      {selected === "attendance" ? (
        <SimpleList
          items={[...attendance].slice(-7).reverse().map((item) => ({
            title: item.date,
            subtitle: `Check-in: ${item.checkIn || "-"} · Check-out: ${item.checkOut || "-"}`,
            tag: item.status,
          }))}
          emptyLabel="No attendance records."
        />
      ) : null}

      {selected === "announcements" ? (
        <SimpleList
          items={announcements.map((item) => ({
            title: item.title,
            subtitle: `${item.description} · ${item.date}`,
            tag: item.audience,
          }))}
        />
      ) : null}
    </ContentPanel>
  );
}

function SimpleList({
  items,
  emptyLabel = "No records found.",
}: {
  items: Array<{ title: string; subtitle: string; tag: string }>;
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return <Typography sx={{ color: "#64748b" }}>{emptyLabel}</Typography>;
  }

  return (
    <Stack spacing={1.2}>
      {items.map((item) => (
        <Stack
          key={`${item.title}-${item.subtitle}`}
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1}
          sx={{
            p: 1.6,
            borderRadius: 2.5,
            backgroundColor: "#f8fafc",
          }}
        >
          <Box>
            <Typography sx={{ color: "#0f172a", fontWeight: 700 }}>{item.title}</Typography>
            <Typography sx={{ color: "#64748b", fontSize: 13 }}>{item.subtitle}</Typography>
          </Box>
          <Chip label={item.tag} size="small" />
        </Stack>
      ))}
    </Stack>
  );
}
