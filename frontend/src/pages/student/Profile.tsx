import React from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            value={user?.name || ''}
            disabled
            fullWidth
          />
          <TextField
            label="Email"
            value={user?.email || ''}
            disabled
            fullWidth
          />
          <TextField
            label="Role"
            value={user?.role || ''}
            disabled
            fullWidth
          />
          <Button variant="contained" disabled>
            Update Profile (Coming Soon)
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
};

export default Profile;
