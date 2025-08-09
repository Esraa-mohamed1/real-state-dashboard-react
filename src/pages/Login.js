import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import { alpha } from '@mui/material/styles';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required();

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = React.useState('');

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      enqueueSnackbar('Login successful!', { variant: 'success' });
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed';
      setError(message);
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, #1a365d 0%, #0d9488 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Logo Header */}
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1a365d 0%, #2d5a87 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 32px rgba(251, 191, 36, 0.4)'
            }}>
              <Typography variant="h2" sx={{ fontWeight: 700, color: '#1a365d' }}>
                R
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '1px', mb: 1 }}>
              RealC
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
              Financial Management Dashboard
            </Typography>
          </Box>

          {/* Login Form */}
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: 'primary.main' }}>
              Welcome Back
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
              Sign in to access your financial dashboard
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 3 }}
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{ mb: 4 }}
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      },
                    }}
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1a365d 0%, #2d5a87 100%)',
                  boxShadow: '0 4px 12px rgba(26, 54, 93, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0f1f2e 0%, #1a365d 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(26, 54, 93, 0.4)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
                    transform: 'none',
                    boxShadow: 'none',
                  }
                }}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Demo Credentials: admin@example.com / password123
              </Typography>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
} 