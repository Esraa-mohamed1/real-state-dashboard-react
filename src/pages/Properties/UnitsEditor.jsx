import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UnitsEditor({ control, name = 'units' }) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <Grid container spacing={2}>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <Grid item xs={12} md={2}>
            <Controller name={`${name}.${index}.number`} control={control} render={({ field }) => (
              <TextField {...field} label="Unit #" fullWidth />
            )} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller name={`${name}.${index}.tenant`} control={control} render={({ field }) => (
              <TextField {...field} label="Tenant" fullWidth />
            )} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Controller name={`${name}.${index}.monthlyRent`} control={control} render={({ field }) => (
              <TextField {...field} label="Monthly Rent" type="number" fullWidth />
            )} />
          </Grid>
          <Grid item xs={12} md={2}>
            <Controller name={`${name}.${index}.isRented`} control={control} render={({ field }) => (
              <FormControlLabel control={<Checkbox checked={field.value || false} onChange={(e) => field.onChange(e.target.checked)} />} label="Rented" />
            )} />
          </Grid>
          <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="error" onClick={() => remove(index)}><DeleteIcon /></IconButton>
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <IconButton color="primary" onClick={() => append({ number: '', tenant: '', monthlyRent: 0, isRented: false })}><AddIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
} 