import { createTheme } from '@mui/material/styles';

const realEstatePalette = {
  primary: {
    main: '#1976d2', // blue
  },
  secondary: {
    main: '#43a047', // green
  },
  background: {
    default: '#f4f6f8',
    paper: '#fff',
  },
  error: {
    main: '#d32f2f',
  },
  warning: {
    main: '#ffa000',
  },
  info: {
    main: '#0288d1',
  },
  success: {
    main: '#388e3c',
  },
};

const darkPalette = {
  ...realEstatePalette,
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#fff',
    secondary: '#b0b0b0',
  },
};

export const getTheme = (mode = 'light') =>
  createTheme({
    palette: mode === 'dark' ? { ...darkPalette, mode } : { ...realEstatePalette, mode },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
  }); 