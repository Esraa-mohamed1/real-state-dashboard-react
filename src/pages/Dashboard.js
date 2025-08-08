import React from 'react';
import Grid from '@mui/material/Grid';
import SummaryCard from '../components/cards/SummaryCard';
import AreaChartCard from '../components/charts/AreaChartCard';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const mockOverview = {
  totalPayments: 125000,
  outstandingDebt: 42000,
  netPosition: 83000,
};

const mockChartData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 14500 },
  { name: 'Mar', value: 13800 },
  { name: 'Apr', value: 16000 },
  { name: 'May', value: 15500 },
  { name: 'Jun', value: 17000 },
];

export default function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <SummaryCard title="Total Payments" value={`$${mockOverview.totalPayments.toLocaleString()}`} color="primary" icon={<PaidIcon />} />
      </Grid>
      <Grid item xs={12} md={4}>
        <SummaryCard title="Outstanding Debt" value={`$${mockOverview.outstandingDebt.toLocaleString()}`} color="warning" icon={<AccountBalanceIcon />} />
      </Grid>
      <Grid item xs={12} md={4}>
        <SummaryCard title="Net Position" value={`$${mockOverview.netPosition.toLocaleString()}`} color="success" icon={<TrendingUpIcon />} />
      </Grid>

      <Grid item xs={12}>
        <AreaChartCard title="Monthly Inflows" data={mockChartData} dataKey="value" xKey="name" />
      </Grid>
    </Grid>
  );
} 