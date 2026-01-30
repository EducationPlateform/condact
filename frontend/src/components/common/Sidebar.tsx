import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  School,
  Assignment,
  Quiz,
  Assessment,
  Person,
  Group,
  Upload,
  ManageAccounts,
  Settings,
  Analytics,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    if (!user) return [];

    if (user.role === "student") {
      return [
        { text: "Dashboard", icon: <Dashboard />, path: "/student" },
        { text: "Lectures", icon: <School />, path: "/student/lectures" },
        { text: "Homework", icon: <Assignment />, path: "/student/homework" },
        { text: "Exams", icon: <Quiz />, path: "/student/exams" },
        { text: "Scores", icon: <Assessment />, path: "/student/scores" },
        { text: "Profile", icon: <Person />, path: "/student/profile" },
      ];
    }

    if (user.role === "teacher") {
      return [
        { text: "Dashboard", icon: <Dashboard />, path: "/teacher" },
        { text: "Groups", icon: <Group />, path: "/teacher/groups" },
        { text: "Lectures", icon: <School />, path: "/teacher/lectures" },
        {
          text: "Upload Video",
          icon: <Upload />,
          path: "/teacher/video/upload",
        },
        { text: "Homework", icon: <Assignment />, path: "/teacher/homework" },
        { text: "Exams", icon: <Quiz />, path: "/teacher/exams" },
        {
          text: "Student Scores",
          icon: <Assessment />,
          path: "/teacher/scores",
        },
        {
          text: "Access Management",
          icon: <ManageAccounts />,
          path: "/teacher/access",
        },
      ];
    }

    if (user.role === "admin") {
      return [
        { text: "Dashboard", icon: <Dashboard />, path: "/admin" },
        { text: "Users", icon: <Person />, path: "/admin/users" },
        {
          text: "Access Extension",
          icon: <ManageAccounts />,
          path: "/admin/access",
        },
        { text: "Settings", icon: <Settings />, path: "/admin/settings" },
        { text: "Analytics", icon: <Analytics />, path: "/admin/analytics" },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

const Toolbar = () => (
  <Box
    sx={{
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderBottom: 1,
      borderColor: "divider",
    }}
  >
    <Typography variant="h6" noWrap component="div">
      Menu
    </Typography>
  </Box>
);

export default Sidebar;
