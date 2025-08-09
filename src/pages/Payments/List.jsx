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
import { paymentService } from '../../services/paymentService';
import PaymentForm from './Form.jsx';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function PaymentsList() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [summary, setSummary] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [list, sum] = await Promise.all([
        paymentService.getAll(),
        paymentService.getSummary(),
      ]);
      const normalized = (Array.isArray(list) ? list : []).map((p) => ({
        ...p,
        amount: Number(p?.amount ?? 0),
        date: p?.date ? new Date(p.date).toISOString() : null,
      }));
      setRows(normalized);
      setSummary(sum);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Failed to load payments', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const columns = useMemo(() => [
    { field: 'payer', headerName: 'Payer', flex: 1 },
    { field: 'amount', headerName: 'Amount', width: 140, valueFormatter: ({ value }) => formatCurrency(value) },
    { field: 'date', headerName: 'Date', width: 140, valueFormatter: ({ value }) => formatDate(value) },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false, filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => { setEditing(params.row); setOpen(true); }}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => setConfirm({ open: true, id: params.id })}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      )
    },
  ], []);

  const handleDelete = async () => {
    try {
      await paymentService.remove(confirm.id);
      enqueueSnackbar('Payment deleted', { variant: 'success' });
      setConfirm({ open: false, id: null });
      load();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Delete failed', { variant: 'error' });
    }
  };

  const handleSubmit = async (values) => {
    try {
      const id = editing?._id || editing?.id;
      const payload = {
        ...values,
        amount: Number(values.amount),
        date: values?.date ? new Date(values.date).toISOString() : undefined,
      };
      if (id) {
        await paymentService.update(id, payload);
        enqueueSnackbar('Payment updated', { variant: 'success' });
      } else {
        await paymentService.create(payload);
        enqueueSnackbar('Payment created', { variant: 'success' });
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
          <Typography variant="h5">Payments</Typography>
        </Grid>
        <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setEditing(null); setOpen(true); }}>
            Add Payment
          </Button>
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <Skeleton variant="rounded" height={420} />
          ) : (
            <Paper sx={{ height: 500, width: '100%' }}>
              <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id || row._id}
                pagination pageSizeOptions={[5, 10, 25]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
            </Paper>
          )}
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <Skeleton variant="rounded" height={60} />
          ) : (
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Total Paid: {formatCurrency(summary?.totalPaid)}</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
        <DialogContent>
          <PaymentForm initialValues={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} submitting={false} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={confirm.open} onCancel={() => setConfirm({ open: false, id: null })} onConfirm={handleDelete} title="Delete Payment" content="Are you sure you want to delete this payment?" />
    </Box>
  );
} 