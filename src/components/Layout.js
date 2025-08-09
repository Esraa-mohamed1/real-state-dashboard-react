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
  Divider,
  Badge,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  HomeWork as HomeWorkIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', badge: 3 },
  { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
  { text: 'Debts', icon: <AccountBalanceIcon />, path: '/debts', badge: 5 },
  { text: 'Properties', icon: <HomeWorkIcon />, path: '/properties' },
];

const logoSrc = (process.env.PUBLIC_URL || '') + '/logoo-real.png';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleColorMode } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`
    }}>
      {/* Logo Section */}
      <Box sx={{ 
        p: sidebarCollapsed ? 2 : 3, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        minHeight: '70px',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        {!sidebarCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: theme.shadows[1]
            }}>
              <img 
                src={logoSrc} 
                alt="App Logo" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }} 
              />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              FinTrack
            </Typography>
          </Box>
        )}
        {sidebarCollapsed && (
          <Box sx={{ width: 36, height: 36 }}>
            <img 
              src={logoSrc} 
              alt="Logo" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: '8px'
              }} 
            />
          </Box>
        )}
        {!isMobile && !sidebarCollapsed && (
          <IconButton 
            size="small" 
            onClick={toggleSidebar}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      {/* Navigation Menu */}
      <List sx={{ 
        flexGrow: 1, 
        pt: 1,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.divider,
          borderRadius: '4px',
        }
      }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItem 
              key={item.text} 
              disablePadding 
              sx={{ 
                mb: 0.5,
                mx: sidebarCollapsed ? 1 : 2,
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  px: sidebarCollapsed ? 1.5 : 2,
                  py: 1.25,
                  minHeight: '48px',
                  backgroundColor: isActive 
                    ? alpha(theme.palette.primary.main, 0.1) 
                    : 'transparent',
                  color: isActive 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: isActive 
                      ? alpha(theme.palette.primary.main, 0.15)
                      : theme.palette.action.hover,
                  },
                  '& .MuiListItemIcon-root': {
                    minWidth: sidebarCollapsed ? 'auto' : 40,
                    color: isActive 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary,
                  },
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                }}
                onClick={() => { if (isMobile) setMobileOpen(false); }}
              >
                {item.badge ? (
                  <Badge 
                    badgeContent={item.badge} 
                    color="error" 
                    overlap="circular"
                    sx={{ 
                      mr: sidebarCollapsed ? 0 : 2,
                      '& .MuiBadge-badge': {
                        fontSize: '0.6rem',
                        height: 16,
                        minWidth: 16,
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                  </Badge>
                ) : (
                  <ListItemIcon sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: sidebarCollapsed ? 0 : 2
                  }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                {!sidebarCollapsed && (
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.875rem'
                    }}
                  />
                )}
                {isActive && !sidebarCollapsed && (
                  <Box sx={{
                    width: 4,
                    height: 20,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '2px',
                    ml: 'auto'
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Section */}
      <Box sx={{ p: sidebarCollapsed ? 1.5 : 2 }}>
        {!sidebarCollapsed && (
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<SettingsIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                py: 1,
                fontWeight: 500
              }}
            >
              Settings
            </Button>
          </Box>
        )}
        
        {/* User Info */}
        {isAuthenticated && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: sidebarCollapsed ? 0 : 1.5,
              p: sidebarCollapsed ? 1 : 1.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.success.main,
                    border: `2px solid ${theme.palette.background.paper}`
                  }}
                />
              }
            >
              <Avatar 
                sx={{ 
                  width: sidebarCollapsed ? 36 : 40,
                  height: sidebarCollapsed ? 36 : 40,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '1rem'
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </Badge>
            
            {!sidebarCollapsed && (
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user?.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
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
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        <Toolbar sx={{ minHeight: '70px', px: { xs: 2, md: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              color: theme.palette.text.primary
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Small logo on desktop */}
          {sidebarCollapsed && !isMobile && (
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              mr: 2 
            }}>
              <Box sx={{ 
                width: 28, 
                height: 28, 
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: theme.shadows[1]
              }}>
                <img 
                  src={logoSrc} 
                  alt="Logo" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </Box>
            </Box>
          )}

          <Typography 
            variant="h6" 
            noWrap 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              fontSize: '1.25rem'
            }}
          >
            {menuItems.find(item => location.pathname.startsWith(item.path))?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              size="medium"
              color="inherit"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
            
            <IconButton 
              onClick={toggleColorMode} 
              color="inherit"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>

            {isAuthenticated && !isMobile && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                ml: 2,
                gap: 1.5,
                px: 1.5,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '0.875rem'
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ 
          width: { 
            md: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth 
          }, 
          flexShrink: { md: 0 } 
        }}
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
              width: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth,
              border: 'none',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden'
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
          p: { xs: 2, md: 3 },
          width: { 
            md: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)` 
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          mt: '70px',
          minHeight: 'calc(100vh - 70px)',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}