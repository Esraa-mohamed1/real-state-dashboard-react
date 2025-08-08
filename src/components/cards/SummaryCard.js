import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function SummaryCard({ title, value, icon = null, color = 'primary' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          {icon && (
            <Box sx={{
              bgcolor: (t) => t.palette[color].main,
              color: (t) => t.palette.getContrastText(t.palette[color].main),
              width: 44,
              height: 44,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
} 