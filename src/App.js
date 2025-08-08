import React from 'react';
import ThemeProvider, { useColorMode } from './components/ThemeProvider';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function DarkModeToggle() {
  const { mode, toggleColorMode } = useColorMode();
  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

function AppContent() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DarkModeToggle />
      </div>
      <h1>Real Estate Financial Management Dashboard</h1>
      {/* Router and main layout will be added here */}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
} 