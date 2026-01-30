import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import api from "../../services/api";

interface Stats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalGroups: number;
  totalLectures: number;
  totalScores: number;
  totalAccessCodes: number;
}

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        if (response.data.success && response.data.data) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        System Analytics
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Statistics
              </Typography>
              <Typography variant="body1">
                Total Users: {stats?.totalUsers || 0}
              </Typography>
              <Typography variant="body1">
                Teachers: {stats?.totalTeachers || 0}
              </Typography>
              <Typography variant="body1">
                Students: {stats?.totalStudents || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Content Statistics
              </Typography>
              <Typography variant="body1">
                Groups: {stats?.totalGroups || 0}
              </Typography>
              <Typography variant="body1">
                Lectures: {stats?.totalLectures || 0}
              </Typography>
              <Typography variant="body1">
                Scores: {stats?.totalScores || 0}
              </Typography>
              <Typography variant="body1">
                Access Codes: {stats?.totalAccessCodes || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Analytics;
