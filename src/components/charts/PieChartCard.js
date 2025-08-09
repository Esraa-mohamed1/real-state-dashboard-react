import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { alpha } from '@mui/material/styles';

const COLORS = ['#1a365d', '#0d9488', '#d97706', '#059669', '#dc2626', '#0891b2'];

export default function PieChartCard({ title, data, nameKey = 'name', valueKey = 'value' }) {
  return (
    <Card sx={{ width: '100%', height: 420, border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.1)}` }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main', textAlign: 'center' }}>{title}</Typography>
        <Box sx={{ flexGrow: 1, minHeight: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey={valueKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={120} label>
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Amount']} />
              <Legend verticalAlign="bottom" height={24} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
} 