import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthDispatch, logoutAction, useAuthState } from '../Contexts/AuthContext/Context';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authDispatch = useAuthDispatch();
  const user = useAuthState();
  console.log(user)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logoutAction(authDispatch);
    navigate('/login');
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    handleClose();
    if (user) {
      navigate(`/profile/${user.id}`);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "black", height: "10vh" }}>
      <Toolbar sx={{flexGrow : 1}}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Fake-Auth
        </Typography>
        {user?.authLevel === 'admin' && (
          <Button color="inherit" onClick={() => navigate('/user-list')}>
            User List
          </Button>
        )}
        {user?.id? (
          <div>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : location.pathname === '/login' ? (
          <Button color="inherit" onClick={() => navigate('/signup')}>
            Signup
          </Button>
        ) : location.pathname === '/signup' ? (
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
