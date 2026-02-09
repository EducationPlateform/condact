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
import { studentStrings } from "../../studentStrings";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    if (!user) return [];

    if (user.role === "student") {
      return [
        { text: studentStrings.dashboard, icon: <Dashboard />, path: "/student" },
        { text: studentStrings.lectures, icon: <School />, path: "/student/lectures" },
        { text: studentStrings.homework, icon: <Assignment />, path: "/student/homework" },
        { text: studentStrings.exams, icon: <Quiz />, path: "/student/exams" },
        { text: studentStrings.scores, icon: <Assessment />, path: "/student/scores" },
        { text: studentStrings.profile, icon: <Person />, path: "/student/profile" },
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
        width: 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <SidebarToolbar isStudent={user?.role === "student"} />
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

const SidebarToolbar: React.FC<{ isStudent: boolean }> = ({ isStudent }) => (
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
      {isStudent ? studentStrings.menu : "Menu"}
    </Typography>
  </Box>
);

export default Sidebar;
