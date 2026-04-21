"use client";

import {Box,Button, Grid, } from "@mui/material";
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
import { getAdminStats,getEmployeeDashboardData,getRoleLabelFromRoute,} from "@/lib/dashboard-data";
import {  MetricCard, PageIntro, } from "../_components/dashboard-ui";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
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

  const isAdmin = user?.role === "Manager" || user?.role === "HR";

  const employeeData = useMemo(() => {
    return user ? getEmployeeDashboardData(user.id) : null;
  }, [user]);

  const adminStats = useMemo(() => getAdminStats(), []);

  if (!user) {
    return null;
  }

  if (isAdmin) {
    return (
      <Box>
      <PageIntro
        eyebrow={getRoleLabelFromRoute(true)}
        title="Operations dashboard"
        description="Track workforce activity, approvals, departments, payroll progress, and communication from one high-signal admin overview."
      />

        <Grid container spacing={2} sx={{height:200 }} >
          <Grid item xs={12} sm={6} xl={3} sx={{height:150}}>
            <MetricCard
              label="Total Employees"
              value={adminStats.totalEmployees}
              icon={<GroupsOutlinedIcon />}
              hint="Open the employee directory"
              color="#fde68a"
              onClick={() => router.push("/employees")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3} sx={{height:150}}>
            <MetricCard
              label="On Leave Today"
              value={adminStats.onLeaveToday}
              icon={<BeachAccessOutlinedIcon />}
              hint="People currently away"
              color="#c7d2fe"
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3} sx={{height:150}}>
            <MetricCard
              label="Total Departments"
              value={adminStats.totalDepartments}
              icon={<DomainOutlinedIcon />}
              hint="Cross-team structure"
              color="#99f6e4"
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3} sx={{height:150}}>
            <MetricCard
              label="Pending Approvals"
              value={adminStats.pendingApprovals}
              icon={<MarkEmailUnreadOutlinedIcon />}
              hint="Leave items waiting"
              color="#93c5fd"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2.2} sx={{ mt: 3,}}>
          <Grid item xs={12} sm={6} xl={3} >
            <MetricCard
              label="Present Today"
              value={adminStats.presentToday}
              icon={<EventAvailableOutlinedIcon />}
              hint="People checked in today"
              color="#dcfce7"
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3}>
            <MetricCard
              label="Total Announcements"
              value={adminStats.totalAnnouncements}
              icon={<CampaignOutlinedIcon />}
              hint="Internal updates published"
              color="#dbeafe"
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3}>
            <MetricCard
              label="Approved Leaves"
              value={adminStats.approvedLeaves}
              icon={<ChecklistOutlinedIcon />}
              hint="Processed and completed"
              color="#fef3c7"
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={3}>
            <MetricCard
              label="Pending Payrolls"
              value={adminStats.pendingPayrolls}
              icon={<PaymentsOutlinedIcon />}
              hint="Payroll items awaiting action"
              color="#fee2e2"
            />
          </Grid>
        </Grid>
      </Box>
    );
  }

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
        <Grid item xs={12} sm={6} xl={3}>
          <MetricCard
            label="Pending Leave Requests"
            value={employeeData?.pendingLeaves ?? 0}
            icon={<AssignmentTurnedInOutlinedIcon />}
            hint="Requests waiting for approval"
            color="#fde68a"
          />
        </Grid>
        <Grid item xs={12} sm={6} xl={3}>
          <MetricCard
            label="Approved Leaves"
            value={employeeData?.approvedLeaves ?? 0}
            icon={<ChecklistOutlinedIcon />}
            hint="Requests already approved"
            color="#86efac"
          />
        </Grid>
        <Grid item xs={12} sm={6} xl={3}>
          <MetricCard
            label="Attendance This Month"
            value={`${employeeData?.attendanceSummary.presentCount ?? 0} Days`}
            icon={<EventAvailableOutlinedIcon />}
            hint="Days marked present"
            color="#93c5fd"
          />
        </Grid>
        <Grid item xs={12} sm={6} xl={3}>
          <MetricCard
            label="Announcements"
            value={employeeData?.announcements.length ?? 0}
            icon={<CampaignOutlinedIcon />}
            hint="Internal updates for you"
            color="#d8b4fe"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
