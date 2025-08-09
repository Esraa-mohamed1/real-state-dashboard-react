import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

export default function SummaryCard({ title, value, icon, color = 'primary' }) {
  return (
    <Card 
      sx={{ 
        height: 140,
        background: `linear-gradient(135deg, ${alpha(color === 'primary' ? '#1a365d' : color === 'secondary' ? '#0d9488' : color === 'success' ? '#059669' : color === 'warning' ? '#d97706' : color === 'error' ? '#dc2626' : '#0891b2', 0.05)} 0%, ${alpha(color === 'primary' ? '#2d5a87' : color === 'secondary' ? '#14b8a6' : color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4', 0.1)} 100%)`,
        border: `1px solid ${alpha(color === 'primary' ? '#1a365d' : color === 'secondary' ? '#0d9488' : color === 'success' ? '#059669' : color === 'warning' ? '#d97706' : color === 'error' ? '#dc2626' : '#0891b2', 0.2)}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${alpha(color === 'primary' ? '#1a365d' : color === 'secondary' ? '#0d9488' : color === 'success' ? '#059669' : color === 'warning' ? '#d97706' : color === 'error' ? '#dc2626' : '#0891b2', 0.15)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem'
            }}
          >
            {title}
          </Typography>
          <Box sx={{ 
            p: 1.5,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${color === 'primary' ? '#1a365d' : color === 'secondary' ? '#0d9488' : color === 'success' ? '#059669' : color === 'warning' ? '#d97706' : color === 'error' ? '#dc2626' : '#0891b2'} 0%, ${color === 'primary' ? '#2d5a87' : color === 'secondary' ? '#14b8a6' : color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4'} 100%)`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${alpha(color === 'primary' ? '#1a365d' : color === 'secondary' ? '#0d9488' : color === 'success' ? '#059669' : color === 'warning' ? '#d97706' : color === 'error' ? '#dc2626' : '#0891b2', 0.3)}`
          }}>
            {icon}
          </Box>
        </Box>
        
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: color === 'primary' ? '#1a365d' : color === 'secondary' ? '#0d9488' : color === 'success' ? '#059669' : color === 'warning' ? '#d97706' : color === 'error' ? '#dc2626' : '#0891b2',
            mt: 'auto',
            fontSize: '2rem'
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
} 