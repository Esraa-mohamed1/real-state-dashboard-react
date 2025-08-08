import React from 'react';
import ThemeProvider, { useColorMode } from './components/ThemeProvider';
import { IconButton, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import Debts from './pages/Debts';
import Properties from './pages/Properties';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function DarkModeToggle() {
  const { mode, toggleColorMode } = useColorMode();
  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

function NavBar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Real Estate Dashboard
        </Typography>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/payments">Payments</Button>
        <Button color="inherit" component={Link} to="/debts">Debts</Button>
        <Button color="inherit" component={Link} to="/properties">Properties</Button>
        <Button color="inherit" component={Link} to="/login">Login</Button>
        <DarkModeToggle />
      </Toolbar>
    </AppBar>
  );
}

function AppContent() {
  return (
    <Router>
      <NavBar />
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/debts" element={<Debts />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
} 