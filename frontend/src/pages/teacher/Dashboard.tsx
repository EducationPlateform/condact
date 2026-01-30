import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import {
  Group,
  School,
  Assignment,
  Quiz,
  Assessment,
} from "@mui/icons-material";
import Layout from "../../components/common/Layout";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Groups",
      icon: <Group />,
      path: "/teacher/groups",
      color: "#1976d2",
    },
    {
      title: "Lectures",
      icon: <School />,
      path: "/teacher/lectures",
      color: "#2e7d32",
    },
    {
      title: "Upload Video",
      icon: <School />,
      path: "/teacher/video/upload",
      color: "#ed6c02",
    },
    {
      title: "Homework",
      icon: <Assignment />,
      path: "/teacher/homework",
      color: "#9c27b0",
    },
    {
      title: "Exams",
      icon: <Quiz />,
      path: "/teacher/exams",
      color: "#d32f2f",
    },
    {
      title: "Student Scores",
      icon: <Assessment />,
      path: "/teacher/scores",
      color: "#0288d1",
    },
  ];

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card
              sx={{
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.2s",
                },
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Box sx={{ color: card.color, mb: 2, fontSize: 48 }}>
                  {card.icon}
                </Box>
                <Typography variant="h6">{card.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Dashboard;
