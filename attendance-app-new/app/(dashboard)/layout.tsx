"use client";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Toolbar,
  AppBar,
  Typography,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const drawerWidth = 240;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [openEmployee, setOpenEmployee] = useState(false);
  const [openLeave, setOpenLeave] = useState(false);
  const [openAttendance, setOpenAttendance] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6">Employee Management</Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, mt: 8 },
        }}
      >
        <List>

          {/* Employees */}
          <ListItemButton onClick={() => setOpenEmployee(!openEmployee)}>
            <ListItemText primary="Employees" />
            {openEmployee ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openEmployee} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItemButton sx={{ pl: 4 }} onClick={() => router.push("/employees")}>
                <ListItemText primary="Employee List" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }} onClick={() => router.push("/employees/add")}>
                <ListItemText primary="Add Employee" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }} onClick={() => router.push("/employees/edit/1")}>
                <ListItemText primary="Edit Employee" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }} onClick={() => router.push("/employees/delete/1")}>
                <ListItemText primary="Delete Employee" />
              </ListItemButton>

            </List>
          </Collapse>

          {/* Leave */}
          <ListItemButton onClick={() => setOpenLeave(!openLeave)}>
            <ListItemText primary="Leave" />
            {openLeave ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openLeave} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItemButton sx={{ pl: 4 }} onClick={() => router.push("/leave")}>
                <ListItemText primary="Apply Leave" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }} onClick={() => router.push("/leave/approvals")}>
                <ListItemText primary="Approvals" />
              </ListItemButton>

            </List>
          </Collapse>

          {/* Attendance */}
          <ListItemButton onClick={() => setOpenAttendance(!openAttendance)}>
            <ListItemText primary="Attendance" />
            {openAttendance ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openAttendance} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItemButton sx={{ pl: 4 }} onClick={() => router.push("/attendance")}>
                <ListItemText primary="Add Attendance" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }} onClick={() => router.push("/attendance/calendar")}>
                <ListItemText primary="Calendar" />
              </ListItemButton>

            </List>
          </Collapse>

        </List>
      </Drawer>

      {/* Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}