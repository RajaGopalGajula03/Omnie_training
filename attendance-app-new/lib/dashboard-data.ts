import { employees, generateAttendance, type AttendanceRecord } from "@/lib/data";

export type LeaveRequest = {
  id: number;
  employeeId: number;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
};

export type Announcement = {
  id: number;
  title: string;
  description: string;
  audience: "all" | "admin" | "employee";
  date: string;
};

export type Department = {
  id: number;
  name: string;
  lead: string;
  members: number;
};

export type PayrollItem = {
  id: number;
  employeeId: number;
  month: string;
  status: "pending" | "processed";
  amount: number;
};

export const departments: Department[] = [
  { id: 1, name: "Engineering", lead: "Anita Sharma", members: 12 },
  { id: 2, name: "Human Resources", lead: "Ravi Kumar", members: 4 },
  { id: 3, name: "Operations", lead: "John Snow", members: 6 },
  { id: 4, name: "Customer Success", lead: "Jane Smith", members: 5 },
];

export const announcements: Announcement[] = [
  {
    id: 1,
    title: "Quarterly review window",
    description: "Managers should complete team reviews by Friday evening.",
    audience: "all",
    date: "2026-04-18",
  },
  {
    id: 2,
    title: "Updated leave policy",
    description: "HR published the revised compensatory leave guidelines.",
    audience: "all",
    date: "2026-04-15",
  },
  {
    id: 3,
    title: "Payroll verification",
    description: "Please verify bank details before month-end processing.",
    audience: "employee",
    date: "2026-04-12",
  },
  {
    id: 4,
    title: "Leadership sync",
    description: "Admin leads have a planning sync tomorrow at 11:00 AM.",
    audience: "admin",
    date: "2026-04-20",
  },
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employeeId: 1,
    fromDate: "2026-04-24",
    toDate: "2026-04-25",
    days: 2,
    reason: "Family function",
    status: "pending",
  },
  {
    id: 2,
    employeeId: 2,
    fromDate: "2026-04-10",
    toDate: "2026-04-12",
    days: 3,
    reason: "Medical leave",
    status: "approved",
  },
  {
    id: 3,
    employeeId: 3,
    fromDate: "2026-04-21",
    toDate: "2026-04-21",
    days: 1,
    reason: "Personal work",
    status: "pending",
  },
  {
    id: 4,
    employeeId: 4,
    fromDate: "2026-04-08",
    toDate: "2026-04-09",
    days: 2,
    reason: "Travel",
    status: "approved",
  },
  {
    id: 5,
    employeeId: 5,
    fromDate: "2026-04-22",
    toDate: "2026-04-23",
    days: 2,
    reason: "Conference attendance",
    status: "pending",
  },
];

export const payrollItems: PayrollItem[] = employees.map((employee, index) => ({
  id: index + 1,
  employeeId: employee.id,
  month: "2026-04",
  status: index % 3 === 0 ? "pending" : "processed",
  amount: 28000 + employee.id * 6500,
}));

export function getEmployeeById(id: number) {
  return employees.find((employee) => employee.id === id) ?? null;
}

export function getVisibleAnnouncements(isAdmin: boolean) {
  return announcements.filter((item) =>
    item.audience === "all" || (isAdmin ? item.audience === "admin" : item.audience === "employee")
  );
}

export function getEmployeeLeaves(employeeId: number) {
  return leaveRequests.filter((leave) => leave.employeeId === employeeId);
}

export function getEmployeeAttendanceSummary(employeeId: number) {
  const records = generateAttendance(employeeId);

  return {
    records,
    presentCount: records.filter((item) => item.status === "present").length,
    absentCount: records.filter((item) => item.status === "absent").length,
    holidayCount: records.filter((item) => item.status === "holiday").length,
  };
}

export function getAdminStats() {
  const allAttendance = employees.flatMap((employee) => generateAttendance(employee.id));
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayAttendance = allAttendance.filter((item) => item.date === todayKey);

  return {
    totalEmployees: employees.length,
    totalDepartments: departments.length,
    pendingApprovals: leaveRequests.filter((item) => item.status === "pending").length,
    approvedLeaves: leaveRequests.filter((item) => item.status === "approved").length,
    onLeaveToday: leaveRequests.filter(
      (item) => item.status !== "rejected" && todayKey >= item.fromDate && todayKey <= item.toDate
    ).length,
    presentToday: todayAttendance.filter((item) => item.status === "present").length,
    totalAnnouncements: announcements.length,
    pendingPayrolls: payrollItems.filter((item) => item.status === "pending").length,
  };
}

export function getEmployeeDashboardData(employeeId: number) {
  const employee = getEmployeeById(employeeId);
  const leaveItems = getEmployeeLeaves(employeeId);
  const attendanceSummary = getEmployeeAttendanceSummary(employeeId);

  return {
    employee,
    leaves: leaveItems,
    attendanceSummary,
    pendingLeaves: leaveItems.filter((item) => item.status === "pending").length,
    approvedLeaves: leaveItems.filter((item) => item.status === "approved").length,
    announcements: getVisibleAnnouncements(false),
  };
}

export function getRoleLabelFromRoute(isAdmin: boolean) {
  return isAdmin ? "Admin Workspace" : "Employee Workspace";
}

export function getRecentAttendance(records: AttendanceRecord[]) {
  return [...records].slice(-7).reverse();
}
