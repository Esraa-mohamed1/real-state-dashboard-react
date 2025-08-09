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
import { useTheme, alpha } from '@mui/material/styles';
import { debtService } from '../../services/debtService';
import DebtForm from './Form.jsx';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import PieChartCard from '../../components/charts/PieChartCard';
import SummaryCard from '../../components/cards/SummaryCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function DebtsList() {
  const theme = useTheme();
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
      const normalized = (Array.isArray(list) ? list : []).map((d) => ({
        ...d,
        amount: Number(d?.amount ?? 0),
        date: d?.date ? new Date(d.date).toISOString() : null,
      }));
      setRows(normalized);
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
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body2" textAlign="center">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 140, 
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      valueGetter: (params) => Number(params?.row?.amount ?? 0),
      valueFormatter: (params) => formatCurrency(params?.value),
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500} textAlign="center">
          {formatCurrency(Number(params?.row?.amount ?? 0))}
        </Typography>
      ),
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 160,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params?.row?.date || params?.row?.createdAt || null,
      valueFormatter: (params) => formatDate(params?.value),
      renderCell: (params) => (
        <Typography variant="body2" textAlign="center">
          {formatDate(params?.row?.date || params?.row?.createdAt)}
        </Typography>
      ),
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: params.value === 'Settled' ? 
              alpha(theme.palette.success.main, 0.1) : 
              alpha(theme.palette.warning.main, 0.1),
            color: params.value === 'Settled' ? 
              theme.palette.success.dark : 
              theme.palette.warning.dark,
            fontWeight: 500,
            fontSize: '0.75rem',
            width: '100%',
            textAlign: 'center'
          }}
        >
          {params.value}
        </Box>
      )
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body2" textAlign="center">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'actions', 
      headerName: 'Actions', 
      width: 120, 
      sortable: false, 
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" width="100%">
          <IconButton 
            size="small" 
            onClick={() => { setEditing(params.row); setOpen(true); }}
            sx={{ color: theme.palette.text.secondary }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => setConfirm({ open: true, id: params.id })}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    },
  ], [theme]);

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
      const id = editing?._id || editing?.id;
      const payload = {
        ...values,
        amount: Number(values.amount),
        date: values?.date ? new Date(values.date).toISOString() : undefined,
      };
      if (id) {
        await debtService.update(id, payload);
        enqueueSnackbar('Debt updated', { variant: 'success' });
      } else {
        await debtService.create(payload);
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
    <Box sx={{ 
      p: 3,
      maxWidth: 1200,
      margin: '0 auto'
    }}>
      {/* Main Header Section */}
      <Box sx={{ 
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <Typography 
          variant="h4" 
          fontWeight={700}
          sx={{ 
            mb: 2,
            color: theme.palette.primary.main,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}
        >
          Debt Management
        </Typography>
        <Button 
          startIcon={<AddIcon />} 
          variant="contained" 
          onClick={() => { setEditing(null); setOpen(true); }}
          sx={{
            textTransform: 'none',
            px: 4,
            py: 1,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Add New Debt
        </Button>
      </Box>

      {/* Centered Table */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 4
      }}>
        <Box sx={{ 
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {loading ? (
            <Skeleton variant="rounded" height={500} />
          ) : (
            <Paper sx={{ 
              height: 500,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: theme.shadows[2]
            }}>
              <DataGrid 
                rows={rows} 
                columns={columns} 
                getRowId={(row) => row.id || row._id}
                pagination 
                pageSizeOptions={[5, 10, 25]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                sx={{
                  '& .MuiDataGrid-columnHeaders': { 
                    backgroundColor: theme.palette.grey[100],
                    fontWeight: 600,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 700,
                      color: theme.palette.text.primary
                    }
                  },
                  '& .MuiDataGrid-cell': { 
                    py: 1.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none'
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              />
            </Paper>
          )}
        </Box>
      </Box>

      {/* Cards Section Below Table */}
      <Grid container spacing={3} justifyContent="center">
        {/* Summary Cards */}
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={120} />
          ) : (
            <SummaryCard 
              title="Pending" 
              value={formatCurrency(summary?.pending)} 
              color="warning" 
              icon={<AccountBalanceWalletIcon />} 
              sx={{ height: '100%' }}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={120} />
          ) : (
            <SummaryCard 
              title="Settled" 
              value={formatCurrency(summary?.settled)} 
              color="success" 
              icon={<CheckCircleIcon />} 
              sx={{ height: '100%' }}
            />
          )}
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12}>
          {loading ? (
            <Skeleton variant="rounded" height={420} />
          ) : (
            <PieChartCard 
              title="Debt Breakdown" 
              data={breakdown} 
              nameKey="name" 
              valueKey="value" 
            />
          )}
        </Grid>
      </Grid>

      {/* Form Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[10]
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 2,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText
        }}>
          {editing ? 'Edit Debt' : 'Add New Debt'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <DebtForm 
            initialValues={editing} 
            onSubmit={handleSubmit} 
            onCancel={() => setOpen(false)} 
            submitting={false} 
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog 
        open={confirm.open} 
        onCancel={() => setConfirm({ open: false, id: null })} 
        onConfirm={handleDelete} 
        title="Delete Debt" 
        content="Are you sure you want to delete this debt?" 
      />
    </Box>
  );
}