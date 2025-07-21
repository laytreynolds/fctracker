// src/pages/HomePage.tsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

import {
  Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Avatar, Menu, MenuItem, Switch, useTheme, useMediaQuery, Button, TextField, InputAdornment, 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PeopleIcon from '@mui/icons-material/People';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const drawerWidth = 240;

const navItems = [
  { text: 'Home', icon: <HomeIcon />, link: "/"  },
  { text: 'Fixtures', icon: <SportsSoccerIcon />, link: "/fixtures" },
  { text: 'Players', icon: <PeopleIcon />, link: "/players" },
];

interface LayoutProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Layout({ darkMode, setDarkMode }: LayoutProps) {
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDarkModeToggle = () => setDarkMode((prev: boolean) => !prev);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Toolbar>
        <Typography variant="h6" noWrap>FC Tracker</Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map(({ text, icon, link }) => (
          <ListItem key={text} disablePadding>
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
        <Toolbar>
          {!isMdUp && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          {/* Search */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search…"
            sx={{ mr: 2, width: 200, bgcolor: 'background.default', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          {/* Date and Notification */}
          <Button startIcon={<CalendarTodayIcon />} sx={{ color: 'text.secondary', mr: 2 }}>
            Apr 17, 2023
          </Button>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <NotificationsNoneIcon />
          </IconButton>
          {/* User Avatar and Menu */}
          <IconButton color="inherit" onClick={handleMenuOpen} sx={{ mr: 2 }}>
            <Avatar src="/user-avatar.jpg" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
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
      <Box component="main" sx={{ flexGrow: 1, width: '100%', p: 0, m: 0, minHeight: '100vh', mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
