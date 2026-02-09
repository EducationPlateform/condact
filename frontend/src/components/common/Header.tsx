import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { AccountCircle, Logout, Notifications } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { studentStrings } from '../../studentStrings';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isStudent = user?.role === 'student';

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {isStudent ? studentStrings.platformTitle : 'Education Platform'}
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isStudent && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="body1">{user.name}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {studentStrings.studentGradePlaceholder}
                </Typography>
              </Box>
            )}
            {isStudent && (
              <Button color="inherit" sx={{ minWidth: 40 }}>
                <Notifications />
              </Button>
            )}
            {!isStudent && <Typography variant="body1">{user.name}</Typography>}
            <Button
              color="inherit"
              startIcon={!isStudent ? <AccountCircle /> : undefined}
              endIcon={isStudent ? <AccountCircle /> : undefined}
              onClick={handleMenu}
            >
              <Avatar sx={{ width: 32, height: 32, ml: isStudent ? 0 : 1, mr: isStudent ? 1 : 0 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                {isStudent ? studentStrings.logout : 'Logout'}
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
