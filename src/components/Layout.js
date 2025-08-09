import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  HomeWork as HomeWorkIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
  { text: 'Debts', icon: <AccountBalanceIcon />, path: '/debts' },
  { text: 'Properties', icon: <HomeWorkIcon />, path: '/properties' },
];

const logoSrc = (process.env.PUBLIC_URL || '') + '/logoo-real.png';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleColorMode } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)' }}>
            <img src={logoSrc} alt="App Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
            Crystal Power
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ mt: 1, opacity: 0.9, fontWeight: 500 }}>
          Financial Management
        </Typography>
      </Box>
      
      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 2, overflowY: 'auto', minHeight: 0, WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1, mx: 2 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                  color: isActive ? 'white' : theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: isActive 
                      ? theme.palette.primary.dark 
                      : theme.palette.action.hover,
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive ? 'white' : theme.palette.text.secondary,
                  },
                }}
                onClick={() => { if (isMobile) setMobileOpen(false); }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Info */}
      {isAuthenticated && (
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ 
              bgcolor: theme.palette.primary.main,
              width: 40,
              height: 40
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              {user?.isAdmin && (
                <Typography variant="caption" sx={{ 
                  bgcolor: theme.palette.warning.main, 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  Admin
                </Typography>
              )}
            </Box>
          </Box>
          <Button
            variant="outlined"
            fullWidth
            onClick={logout}
            sx={{ 
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              '&:hover': {
                borderColor: theme.palette.error.dark,
                backgroundColor: theme.palette.error.main,
                color: 'white'
              }
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Small logo on desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '6px', overflow: 'hidden' }}>
              <img src={logoSrc} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          </Box>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user?.name}
                </Typography>
                {user?.isAdmin && (
                  <Typography variant="caption" sx={{ 
                    bgcolor: theme.palette.warning.main, 
                    color: 'white', 
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1,
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>
                    Admin
                  </Typography>
                )}
              </Box>
            )}
            
            {isAuthenticated ? (
              <Button 
                color="inherit" 
                onClick={logout}
                sx={{ 
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Logout
              </Button>
            ) : (
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ 
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Login
              </Button>
            )}
            
            <IconButton 
              onClick={toggleColorMode} 
              color="inherit"
              sx={{ 
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '70px',
          minHeight: 'calc(100vh - 70px)',
          background: theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 