import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import Layout from '../../components/common/Layout';

const SystemSettings: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          System settings will be available in a future update.
        </Typography>
        <Button variant="contained" disabled sx={{ mt: 2 }}>
          Save Settings
        </Button>
      </Paper>
    </Layout>
  );
};

export default SystemSettings;
