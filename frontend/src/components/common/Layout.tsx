import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} dir={isStudent ? 'rtl' : undefined}>
      <Header />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
        }}
      >
        <Sidebar />
        <Box
          component="main"
          className={isStudent ? 'font-notoSansArabic' : undefined}
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: 'auto',
            bgcolor: 'background.default',
            p: 3,
            pt: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
