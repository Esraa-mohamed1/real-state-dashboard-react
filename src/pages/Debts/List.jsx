import React, { useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useSnackbar } from 'notistack';
import { debtService } from '../../services/debtService';
import DebtForm from './Form';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import PieChartCard from '../../components/charts/PieChartCard';
import SummaryCard from '../../components/cards/SummaryCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function DebtsList() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [breakdown, setBreakdown] = useState([]);
  const [summary, setSummary] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [list, bd, sum] = await Promise.all([
        debtService.getAll(),
        debtService.getBreakdown(),
        debtService.getSummary(),
      ]);
      setRows(list);
      setBreakdown(bd?.map(b => ({ name: b.category, value: b.totalAmount })) || []);
      setSummary(sum);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Failed to load debts', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const columns = useMemo(() => [
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 140, valueFormatter: ({ value }) => formatCurrency(value) },
    { field: 'date', headerName: 'Date', width: 140, valueFormatter: ({ value }) => formatDate(value) },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false, filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => { setEditing(params.row); setOpen(true); }}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => setConfirm({ open: true, id: params.row.id })}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      )
    },
  ], []);

  const handleDelete = async () => {
    try {
      await debtService.remove(confirm.id);
      enqueueSnackbar('Debt deleted', { variant: 'success' });
      setConfirm({ open: false, id: null });
      load();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Delete failed', { variant: 'error' });
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editing?.id) {
        await debtService.update(editing.id, values);
        enqueueSnackbar('Debt updated', { variant: 'success' });
      } else {
        await debtService.create(values);
        enqueueSnackbar('Debt created', { variant: 'success' });
      }
      setOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Save failed', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={9}>
          <Typography variant="h5">Debts</Typography>
        </Grid>
        <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setEditing(null); setOpen(true); }}>
            Add Debt
          </Button>
        </Grid>
        <Grid item xs={12} md={8}>
          {loading ? (
            <Skeleton variant="rounded" height={420} />
          ) : (
            <Paper sx={{ height: 500, width: '100%' }}>
              <DataGrid rows={rows} columns={columns} pagination pageSizeOptions={[5, 10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {loading ? (
            <Skeleton variant="rounded" height={420} />
          ) : (
            <PieChartCard title="Debt Breakdown" data={breakdown} nameKey="name" valueKey="value" />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={96} />
          ) : (
            <SummaryCard title="Pending" value={formatCurrency(summary?.pending)} color="warning" icon={<AccountBalanceWalletIcon />} />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={96} />
          ) : (
            <SummaryCard title="Settled" value={formatCurrency(summary?.settled)} color="success" icon={<CheckCircleIcon />} />
          )}
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Debt' : 'Add Debt'}</DialogTitle>
        <DialogContent>
          <DebtForm initialValues={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} submitting={false} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={confirm.open} onCancel={() => setConfirm({ open: false, id: null })} onConfirm={handleDelete} title="Delete Debt" content="Are you sure you want to delete this debt?" />
    </Box>
  );
} 