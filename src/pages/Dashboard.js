import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import { dashboardService } from '../services/dashboardService';
import { paymentService } from '../services/paymentService';
import SummaryCard from '../components/cards/SummaryCard';
import AreaChartCard from '../components/charts/AreaChartCard';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [overview, payments] = await Promise.all([
          dashboardService.getOverview(),
          paymentService.getAll(),
        ]);
        
        setData(overview);
        
        // Process payments for chart data
        const monthlyData = {};
        payments.forEach(payment => {
          const date = new Date(payment.date);
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyData[monthYear] = (monthlyData[monthYear] || 0) + payment.amount;
        });
        
        const sortedMonths = Object.keys(monthlyData).sort();
        const chartDataProcessed = sortedMonths.map(month => ({
          name: month,
          value: monthlyData[month]
        }));
        
        setChartData(chartDataProcessed);
        setChartLoading(false);
      } catch (err) {
        enqueueSnackbar(err?.response?.data?.message || 'Failed to load dashboard data', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [enqueueSnackbar]);

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {[0, 1, 2].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rounded" height={140} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards - Fixed Size */}
        <Grid item xs={12} md={4}>
          <SummaryCard 
            title="Total Payments" 
            value={formatCurrency(data?.totalPayments)} 
            color="primary" 
            icon={<PaidIcon />} 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard 
            title="Outstanding Debt" 
            value={formatCurrency(data?.outstandingDebt)} 
            color="warning" 
            icon={<AccountBalanceIcon />} 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard 
            title="Net Position" 
            value={formatCurrency(data?.netPosition)} 
            color="success" 
            icon={<TrendingUpIcon />} 
          />
        </Grid>

        {/* Chart Card - Full Width */}
        <Grid item xs={12}>
          {chartLoading ? (
            <Paper sx={{ height: 400, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Skeleton variant="rounded" height={320} width="100%" />
            </Paper>
          ) : (
            <AreaChartCard 
              title="Monthly Payments" 
              data={chartData} 
              dataKey="value" 
              xKey="name" 
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
} 