import { useCallback, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

import {
  Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Switch, useTheme, useMediaQuery, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PersonIcon from '@mui/icons-material/Person';
import Groups2Icon from '@mui/icons-material/Groups2';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '@/assets/logo.png';
import { useAuth } from '@/context/AuthContext';

const drawerWidth = 260;

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

export default function Layout({ darkMode, setDarkMode }: LayoutProps) {
  const theme = useTheme();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleDarkModeToggle = useCallback(() => {
    setDarkMode((prev: boolean) => !prev);
  }, [setDarkMode]);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2.5 }}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            gap: 1.5,
          }}
        >
          <img
            src={logo}
            alt="FC Tracker"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FC TRACKER
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ px: 1, pt: 2, overflowY: 'auto', flexGrow: 1 }}>
        <Typography
          variant="overline"
          sx={{ px: 2, mb: 1, display: 'block', color: 'text.secondary' }}
        >
          Navigation
        </Typography>
        <List disablePadding>
          {navItems.map(({ text, icon, link }) => (
            <ListItem key={link} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={link}
                selected={location.pathname === link}
                onClick={() => !isMdUp && setMobileOpen(false)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.925rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          {darkMode ? 'Dark' : 'Light'} Mode
        </Typography>
        <Switch
          checked={darkMode}
          onChange={handleDarkModeToggle}
          size="small"
          color="primary"
        />
      </Box>
      {user && (
        <>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.email}
              </Typography>
            </Box>
            <Tooltip title="Sign out">
              <IconButton size="small" onClick={logout} sx={{ ml: 1 }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{ zIndex: theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' } }}>
          {!isMdUp && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1.5 }}>
              <MenuIcon />
            </IconButton>
          )}

          {!isMdUp && (
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                gap: 1,
              }}
            >
              <img
                src={logo}
                alt="FC Tracker"
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                FC TRACKER
              </Typography>
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

         
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMdUp ? "permanent" : "temporary"}
          open={isMdUp || mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          mt: { xs: '56px', sm: '64px' },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
