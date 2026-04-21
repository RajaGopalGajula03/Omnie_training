"use client";

import {AppBar,Avatar, Box, Button, Chip, Collapse, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography,} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ApprovalOutlinedIcon from "@mui/icons-material/ApprovalOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AddIcon from "@mui/icons-material/Add";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const drawerWidth = 286;

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: Array<{ label: string; href: string; icon: React.ReactNode }>;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLeave, setOpenLeave] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const res = await fetch("/api/auth/check", {
        credentials: "include",
      });

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    };

    loadSession();
  }, [router]);

  const isAdmin = user?.role === "Manager" || user?.role === "HR";

  const employeeNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <DashboardOutlinedIcon /> },
    {
      label: "Leave Management",
      icon: <EventNoteOutlinedIcon />,
      children: [
        { label: "My Requests", href: "/leave", icon: <ApprovalOutlinedIcon /> },
        { label: "Apply Leave", href: "/leave/applyleave", icon: <AddTaskOutlinedIcon /> },
      ],
    },
    { label: "Payroll", href: "/payroll", icon: <PaymentsOutlinedIcon /> },
    { label: "Attendance", href: "/attendance", icon: <CalendarMonthOutlinedIcon /> },
    { label: "Announcements", href: "/announcements", icon: <CampaignOutlinedIcon /> },
  ];

  const adminNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <DashboardOutlinedIcon /> },
    { label: "Employee Details", href: "/employees", icon: <GroupsOutlinedIcon /> },
    { label: "Departments", href: "/departments", icon: <DomainOutlinedIcon /> },
    {
      label: "Leave Management",
      icon: <EventNoteOutlinedIcon />,
      children: [
        { label: "Leave Overview", href: "/leave", icon: <ApprovalOutlinedIcon /> },
        { label: "Pending Approvals", href: "/leave/approvals", icon: <AddTaskOutlinedIcon /> },
      ],
    },
    { label: "Payroll", href: "/payroll", icon: <PaymentsOutlinedIcon /> },
    { label: "Attendance", href: "/attendance", icon: <CalendarMonthOutlinedIcon /> },
    { label: "Announcements", href: "/announcements", icon: <CampaignOutlinedIcon /> },
  ];

  const navItems = isAdmin ? adminNav : employeeNav;

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/login");
  };

  const sidebar = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "white",
        color: "#0f172a",
      }}
    >
      <Box sx={{ px: 2.2, py: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: "#f1f5f9",
              color: "#0f172a",
              width: 48,
              height: 48,
              fontWeight: 800,
            }}
          >
            {user?.name?.charAt(0) || "O"}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Omniee</Typography>
            <Typography sx={{ color: "#64748b", fontSize: 13 }}>
              Employee Management System
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            p: 1.6,
            borderRadius: 2,
            backgroundColor: "#f8fafc",
            border: "1px solid rgba(15, 23, 42, 0.06)",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>{user?.name || "Loading..."}</Typography>
          <Typography sx={{ color: "#64748b", fontSize: 13, mt: 0.4 }}>
            {user?.email || ""}
          </Typography>
          <Chip
            icon={<BadgeOutlinedIcon />}
            label={isAdmin ? "Admin Workspace" : "Employee Workspace"}
            size="small"
            sx={{
              mt: 1.3,
              bgcolor: "white",
              color: "#0f172a",
              border: "1px solid rgba(15, 23, 42, 0.08)",
            }}
          />
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {navItems.map((item) => {
          const selected = item.href ? pathname === item.href : item.children?.some((child) => pathname === child.href);

          if (item.children) {
            return (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() => setOpenLeave((prev) => !prev)}
                  sx={navButtonSx(selected)}
                >
                  <ListItemIcon sx={navIconSx}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                  {openLeave ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openLeave} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ mt: 0.5 }}>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.href}
                        onClick={() => {
                          router.push(child.href);
                          setMobileOpen(false);
                        }}
                        sx={subNavButtonSx(pathname === child.href)}
                      >
                        <ListItemIcon sx={navIconSx}>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItemButton
              key={item.href}
              onClick={() => {
                if (item.href) {
                  router.push(item.href);
                }
                setMobileOpen(false);
              }}
              sx={navButtonSx(Boolean(selected))}
            >
              <ListItemIcon sx={navIconSx}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 1.5 }}>
        <ListItemButton onClick={handleLogout} sx={navButtonSx(false)}>
          <ListItemIcon sx={navIconSx}>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          backgroundColor: "rgba(248,250,252,0.84)",
          backdropFilter: "blur(10px)",
          color: "#0f172a",
          borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: 80 }}>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen((prev) => !prev)}
            sx={{ mr: 1.5, display: { lg: "none" } }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 22 }}>
              {pathname === "/dashboard" ? "Dashboard" : pathname.replace("/", "").replace("-", " ")}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 14 }}>
              {isAdmin ? "Admin operations overview" : "Employee self-service workspace"}
            </Typography>
          </Box>
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1.5 }}>
            {!isAdmin ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/leave/applyleave")}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  backgroundColor: "#f97316",
                  boxShadow: "none",
                  "&:hover": { backgroundColor: "#ea580c", boxShadow: "none" },
                }}
              >
                Apply Leave
              </Button>
            ) : null}
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                backgroundColor: "#ef4444",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#dc2626", boxShadow: "none" },
              }}
            >
              Logout
            </Button>
            <IconButton>
              <NotificationsNoneOutlinedIcon />
            </IconButton>
            <Avatar sx={{ bgcolor: "#e2e8f0", color: "#475569", width: 40, height: 40 }}>
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {sidebar}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid rgba(15, 23, 42, 0.08)",
            },
          }}
        >
          {sidebar}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 3.5 },
          py: { xs: 11, md: 12 },
          maxWidth: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function navButtonSx(selected: boolean) {
  return {
    mb: 0.6,
    borderRadius: 2,
    color: "#0f172a",
    backgroundColor: selected ? "#fff7ed" : "transparent",
    borderRight: selected ? "3px solid #fb923c" : "3px solid transparent",
    "&:hover": {
      backgroundColor: "#f8fafc",
    },
  };
}

function subNavButtonSx(selected: boolean) {
  return {
    ml: 1.5,
    mb: 0.4,
    borderRadius: 2,
    color: "#334155",
    backgroundColor: selected ? "#f8fafc" : "transparent",
    "&:hover": {
      backgroundColor: "#f8fafc",
    },
  };
}

const navIconSx = {
  minWidth: 38,
  color: "inherit",
};
