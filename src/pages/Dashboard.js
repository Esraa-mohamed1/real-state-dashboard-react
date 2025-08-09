import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import SummaryCard from '../components/cards/SummaryCard';
import AreaChartCard from '../components/charts/AreaChartCard';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getOverview } from '../services/dashboardService';
import { paymentService } from '../services/paymentService';
import { useSnackbar } from 'notistack';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [overviewRes, payments] = await Promise.all([
          getOverview(),
          paymentService.getAll(),
        ]);
        setData(overviewRes);
        // Aggregate payments by month (YYYY-MM)
        const byMonth = payments.reduce((acc, p) => {
          const d = new Date(p.date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          acc[key] = (acc[key] || 0) + Number(p.amount || 0);
          return acc;
        }, {});
        const sortedKeys = Object.keys(byMonth).sort();
        const aggregated = sortedKeys.map((k) => {
          const [y, m] = k.split('-');
          const monthLabel = new Date(Number(y), Number(m) - 1).toLocaleString(undefined, { month: 'short' });
          return { name: `${monthLabel} ${y.slice(2)}`, value: byMonth[k] };
        });
        setChartData(aggregated);
      } catch (err) {
        enqueueSnackbar(err?.response?.data?.message || 'Failed to load dashboard data', { variant: 'error' });
      } finally {
        setLoading(false);
        setChartLoading(false);
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
        {chartLoading ? (
          <Skeleton variant="rounded" height={320} />
        ) : (
          <AreaChartCard title="Monthly Payments" data={chartData} dataKey="value" xKey="name" />
        )}
      </Grid>
    </Grid>
  );
} 