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
import { alpha } from '@mui/material/styles';

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
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
    { field: 'type', headerName: 'Type', width: 140 },
    { field: 'address', headerName: 'Address', flex: 1, minWidth: 250 },
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
          <IconButton 
            size="small" 
            onClick={() => { setEditing(params.row); setOpen(true); }}
            sx={{ 
              color: 'primary.main',
              '&:hover': { backgroundColor: alpha('#1a365d', 0.1) }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => setConfirm({ open: true, id: params.id })}
            sx={{ 
              '&:hover': { backgroundColor: alpha('#dc2626', 0.1) }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
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
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
          Properties
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          Manage your real estate portfolio, track units, and monitor rental income
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained" 
            onClick={() => { setEditing(null); setOpen(true); }}
            sx={{ 
              px: 3, 
              py: 1.5,
              background: 'linear-gradient(135deg, #1a365d 0%, #2d5a87 100%)',
              boxShadow: '0 4px 12px rgba(26, 54, 93, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0f1f2e 0%, #1a365d 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(26, 54, 93, 0.4)',
              }
            }}
          >
            Add Property
          </Button>
        </Box>
      </Box>

      {/* DataGrid Section */}
      <Paper sx={{ 
        height: 500, 
        width: '100%', 
        mb: 4,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}>
        {loading ? (
          <Box sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skeleton variant="rounded" height={420} width="100%" />
          </Box>
        ) : (
          <DataGrid 
            rows={rows} 
            columns={columns} 
            getRowId={(row) => row.id || row._id}
            pagination 
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: alpha('#1a365d', 0.05),
                borderBottom: '2px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-columnHeader': {
                fontWeight: 600,
                color: 'primary.main',
              },
            }}
          />
        )}
      </Paper>

      {/* Summary Cards Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={140} />
          ) : (
            <SummaryCard 
              title="Rented Units" 
              value={rentedVacant?.rented ?? 0} 
              color="success" 
              icon={<CheckCircleIcon />} 
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={140} />
          ) : (
            <SummaryCard 
              title="Vacant Units" 
              value={rentedVacant?.vacant ?? 0} 
              color="warning" 
              icon={<HomeWorkIcon />} 
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={140} />
          ) : (
            <SummaryCard 
              title="Monthly Income" 
              value={formatCurrency(incomePortfolio?.monthlyIncome)} 
              color="primary" 
              icon={<HomeWorkIcon />} 
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rounded" height={140} />
          ) : (
            <SummaryCard 
              title="Portfolio Value" 
              value={formatCurrency(incomePortfolio?.portfolioValue)} 
              color="secondary" 
              icon={<HomeWorkIcon />} 
            />
          )}
        </Grid>
      </Grid>

      {/* Property Form Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          background: 'linear-gradient(135deg, #1a365d 0%, #2d5a87 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          {editing ? 'Edit Property' : 'Add Property'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <PropertyForm 
            initialValues={editing} 
            onSubmit={handleSubmit} 
            onCancel={() => setOpen(false)} 
            submitting={false} 
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog 
        open={confirm.open} 
        onCancel={() => setConfirm({ open: false, id: null })} 
        onConfirm={handleDelete} 
        title="Delete Property" 
        content="Are you sure you want to delete this property? This action cannot be undone." 
      />
    </Box>
  );
} 