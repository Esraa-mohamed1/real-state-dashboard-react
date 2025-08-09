import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { alpha } from '@mui/material/styles';

export default function AreaChartCard({ title, data, dataKey, xKey, color = 'primary' }) {
  const chartColor = color === 'primary' ? '#1a365d' : color === 'secondary' ? '#0d9488' : color === 'success' ? '#059669' : color === 'warning' ? '#d97706' : color === 'error' ? '#dc2626' : '#0891b2';
  
  return (
    <Card sx={{ 
      width: '100%',
      height: 400,
      background: `linear-gradient(135deg, ${alpha(chartColor, 0.02)} 0%, ${alpha(chartColor, 0.05)} 100%)`,
      border: `1px solid ${alpha(chartColor, 0.1)}`,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${alpha(chartColor, 0.1)}`,
      }
    }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3, 
            fontWeight: 600, 
            color: chartColor,
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ flexGrow: 1, minHeight: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={alpha(chartColor, 0.1)}
                vertical={false}
              />
              <XAxis 
                dataKey={xKey} 
                stroke={alpha(chartColor, 0.6)}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={alpha(chartColor, 0.6)}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: `1px solid ${alpha(chartColor, 0.2)}`,
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: chartColor, fontWeight: 600 }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={chartColor} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#color-${color})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
} 