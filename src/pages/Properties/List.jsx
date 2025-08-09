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
import { propertyService } from '../../services/propertyService';
import PropertyForm from './Form';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatCurrency } from '../../utils/formatters';
import SummaryCard from '../../components/cards/SummaryCard';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function PropertiesList() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [rentedVacant, setRentedVacant] = useState(null);
  const [incomePortfolio, setIncomePortfolio] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [list, rv, ip] = await Promise.all([
        propertyService.getAll(),
        propertyService.getRentedVacant(),
        propertyService.getIncomePortfolio(),
      ]);
      setRows(list);
      setRentedVacant(rv);
      setIncomePortfolio(ip);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Failed to load properties', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const columns = useMemo(() => [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'type', headerName: 'Type', width: 140 },
    { field: 'address', headerName: 'Address', flex: 1 },
    {
      field: 'unitsCount', headerName: 'Units', width: 100,
      valueGetter: (params) => {
        const units = Array.isArray(params?.row?.units) ? params.row.units : [];
        return units.length;
      },
    },
    {
      field: 'rentedUnits', headerName: 'Rented', width: 100,
      valueGetter: (params) => {
        const units = Array.isArray(params?.row?.units) ? params.row.units : [];
        return units.filter((u) => !!u?.isRented).length;
      },
    },
    {
      field: 'monthlyIncome', headerName: 'Monthly Income', width: 170,
      valueGetter: (params) => {
        const units = Array.isArray(params?.row?.units) ? params.row.units : [];
        const sum = units
          .filter((u) => !!u?.isRented)
          .reduce((acc, u) => acc + Number(u?.monthlyRent || 0), 0);
        return sum;
      },
      valueFormatter: ({ value }) => formatCurrency(value),
    },
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
      await propertyService.remove(confirm.id);
      enqueueSnackbar('Property deleted', { variant: 'success' });
      setConfirm({ open: false, id: null });
      load();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Delete failed', { variant: 'error' });
    }
  };

  const handleSubmit = async (values) => {
    try {
      const id = editing?._id || editing?.id;
      if (id) {
        await propertyService.update(id, values);
        enqueueSnackbar('Property updated', { variant: 'success' });
      } else {
        await propertyService.create(values);
        enqueueSnackbar('Property created', { variant: 'success' });
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
          <Typography variant="h5">Properties</Typography>
        </Grid>
        <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setEditing(null); setOpen(true); }}>
            Add Property
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
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={96} />
          ) : (
            <SummaryCard title="Rented Units" value={rentedVacant?.rented ?? 0} color="success" icon={<CheckCircleIcon />} />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={96} />
          ) : (
            <SummaryCard title="Vacant Units" value={rentedVacant?.vacant ?? 0} color="warning" icon={<HomeWorkIcon />} />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={96} />
          ) : (
            <SummaryCard title="Monthly Income" value={formatCurrency(incomePortfolio?.monthlyIncome)} color="primary" icon={<HomeWorkIcon />} />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={96} />
          ) : (
            <SummaryCard title="Portfolio Value" value={formatCurrency(incomePortfolio?.portfolioValue)} color="secondary" icon={<HomeWorkIcon />} />
          )}
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Property' : 'Add Property'}</DialogTitle>
        <DialogContent>
          <PropertyForm initialValues={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} submitting={false} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={confirm.open} onCancel={() => setConfirm({ open: false, id: null })} onConfirm={handleDelete} title="Delete Property" content="Are you sure you want to delete this property?" />
    </Box>
  );
} 