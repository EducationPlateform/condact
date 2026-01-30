import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { School, Assignment, Quiz, Assessment } from "@mui/icons-material";
import Layout from "../../components/common/Layout";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Lectures",
      icon: <School />,
      path: "/student/lectures",
      color: "#1976d2",
    },
    {
      title: "Homework",
      icon: <Assignment />,
      path: "/student/homework",
      color: "#2e7d32",
    },
    {
      title: "Exams",
      icon: <Quiz />,
      path: "/student/exams",
      color: "#ed6c02",
    },
    {
      title: "Scores",
      icon: <Assessment />,
      path: "/student/scores",
      color: "#9c27b0",
    },
  ];

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
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
