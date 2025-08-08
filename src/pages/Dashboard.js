import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import SummaryCard from '../components/cards/SummaryCard';
import AreaChartCard from '../components/charts/AreaChartCard';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getOverview } from '../services/dashboardService';
import { useSnackbar } from 'notistack';
import { formatCurrency } from '../utils/formatters';

const mockChartData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 14500 },
  { name: 'Mar', value: 13800 },
  { name: 'Apr', value: 16000 },
  { name: 'May', value: 15500 },
  { name: 'Jun', value: 17000 },
];

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getOverview();
        setData(res);
      } catch (err) {
        enqueueSnackbar(err?.response?.data?.message || 'Failed to load dashboard overview', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [enqueueSnackbar]);

  return (
    <Grid container spacing={3}>
      {[0, 1, 2].map((i) => (
        <Grid item xs={12} md={4} key={i}>
          {loading ? (
            <Skeleton variant="rounded" height={96} />
          ) : i === 0 ? (
            <SummaryCard title="Total Payments" value={formatCurrency(data?.totalPayments)} color="primary" icon={<PaidIcon />} />
          ) : i === 1 ? (
            <SummaryCard title="Outstanding Debt" value={formatCurrency(data?.outstandingDebt)} color="warning" icon={<AccountBalanceIcon />} />
          ) : (
            <SummaryCard title="Net Position" value={formatCurrency(data?.netPosition)} color="success" icon={<TrendingUpIcon />} />
          )}
        </Grid>
      ))}

      <Grid item xs={12}>
        <AreaChartCard title="Monthly Inflows" data={mockChartData} dataKey="value" xKey="name" />
      </Grid>
    </Grid>
  );
} 