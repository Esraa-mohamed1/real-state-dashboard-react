import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { alpha, useTheme } from '@mui/material/styles';

const COLORS = ['#1a365d', '#0d9488', '#d97706', '#059669', '#dc2626', '#0891b2', '#7c3aed', '#db2777'];

export default function PieChartCard({ title, data, nameKey = 'name', valueKey = 'value' }) {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      width: 420, // Set fixed width to match height
      height: 420, 
      borderRadius: 3,
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
      border: 'none',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 24px 0 rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        '&:last-child': {
          pb: 3
        }
      }}>
        <Typography variant="h6" sx={{ 
          mb: 3, 
          fontWeight: 600, 
          color: theme.palette.text.primary,
          textAlign: 'center',
          letterSpacing: 0.5
        }}>
          {title}
        </Typography>
        
        <Box sx={{ 
          flexGrow: 1, 
          minHeight: 0, // Changed from 300 to 0 for better flex behavior
          display: 'flex',
          alignItems: 'center'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                dataKey={valueKey} 
                nameKey={nameKey} 
                cx="50%" 
                cy="50%" 
                innerRadius={60}
                outerRadius={80} // Slightly reduced to fit better in square
                paddingAngle={2}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                contentStyle={{
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: theme.shadows[3],
                  backgroundColor: alpha(theme.palette.background.default, 0.95)
                }}
              />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                height={48}
                wrapperStyle={{
                  paddingTop: 20
                }}
                formatter={(value, entry, index) => (
                  <span style={{
                    color: theme.palette.text.secondary,
                    fontSize: 12,
                    fontWeight: 500
                  }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}