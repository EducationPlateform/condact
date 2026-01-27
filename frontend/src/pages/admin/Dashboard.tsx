import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { People, School, Assessment, VpnKey } from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import api from '../../services/api';

interface Stats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalGroups: number;
  totalLectures: number;
  totalScores: number;
  totalAccessCodes: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        if (response.data.success && response.data.data) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
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

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: <People />, color: '#1976d2' },
    { title: 'Teachers', value: stats?.totalTeachers || 0, icon: <People />, color: '#2e7d32' },
    { title: 'Students', value: stats?.totalStudents || 0, icon: <People />, color: '#ed6c02' },
    { title: 'Groups', value: stats?.totalGroups || 0, icon: <School />, color: '#9c27b0' },
    { title: 'Lectures', value: stats?.totalLectures || 0, icon: <School />, color: '#d32f2f' },
    { title: 'Scores', value: stats?.totalScores || 0, icon: <Assessment />, color: '#0288d1' },
    { title: 'Access Codes', value: stats?.totalAccessCodes || 0, icon: <VpnKey />, color: '#7b1fa2' },
  ];

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: card.color, fontSize: 48 }}>{card.icon}</Box>
                  <Box>
                    <Typography variant="h4">{card.value}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Dashboard;
