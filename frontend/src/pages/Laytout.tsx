import { useCallback, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

import {
  Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Switch, useTheme, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PersonIcon from '@mui/icons-material/Person';import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Groups2Icon from '@mui/icons-material/Groups2';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import logo from '@/assets/logo.png';

const drawerWidth = 240;

const navItems = [
  { text: 'Home', icon: <HomeIcon />, link: "/"  },
  { text: 'Fixtures', icon: <SportsSoccerIcon />, link: "/fixtures" },
  { text: 'Players', icon: <PersonIcon />, link: "/players" },
  { text: 'Teams', icon: <Groups2Icon />, link: "/teams" },
];
interface LayoutProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// function getDate() {
//  const today = new Date();
//  const month = today.getMonth() + 1;
//  const year = today.getFullYear();
//  const date = today.getDate();
//  return `${date}/${month}/${year}`;
//}

export default function Layout({ darkMode, setDarkMode }: LayoutProps) {
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleDarkModeToggle = useCallback(() => {
    setDarkMode((prev: boolean) => !prev);
  }, [setDarkMode]);

  // const [currentDate] = React.useState(getDate());


  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Toolbar>
        <Typography variant="h6" noWrap>FC Tracker</Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map(({ text, icon, link }) => (
          <ListItem key={link} disablePadding>
            <ListItemButton component={Link} to={link} selected={location.pathname === link}>
              <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="fixed" color="default" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ minHeight: { xs: '64px', sm: '70px' } }}>
          {!isMdUp && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Logo */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mr: { xs: 2, sm: 3 },
              flexShrink: 0,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <img 
              src={logo} 
              alt="FC Tracker Logo" 
              style={{
                height: '60px',
                width: 'auto',
                maxWidth: '100px',
                objectFit: 'contain'
              }}
            />
            <Typography variant="h6" sx={{ ml: 2 }}>FC TRACKER</Typography>
          </Box>

          {/* Date */}
          <Box sx={{ flexGrow: 1 }} />


          {/*
          // User Avatar and Menu
          <IconButton color="inherit" onClick={handleMenuOpen} sx={{ mr: 2 }}>
            <Avatar src="/user-avatar.jpg" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
          */}

          {/* Dark Mode Toggle */}
          <IconButton color="inherit" onClick={handleDarkModeToggle}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Switch checked={darkMode} onChange={handleDarkModeToggle} color="default" />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMdUp ? "permanent" : "temporary"}
          open={isMdUp ? true : mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'background.paper' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      {/* main content */}
      <Box component="main" sx={{ flexGrow: 1, width: '100%', p: 0, m: 0, minHeight: '100vh', mt: { xs: '64px', sm: '70px' } }}>
        <Outlet />
      </Box>
    </Box>
  );
}

