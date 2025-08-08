import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextFieldController from '../../components/forms/TextFieldController';
import DatePickerController from '../../components/forms/DatePickerController';
import SelectController from '../../components/forms/SelectController';

const schema = yup.object().shape({
  amount: yup.number().typeError('Amount is required').positive('Must be positive').required('Amount is required'),
  date: yup.string().nullable(),
  category: yup.mixed().oneOf(['Restaurants', 'Offices', 'Other']).required('Category is required'),
  status: yup.mixed().oneOf(['pending', 'settled']).required('Status is required'),
  description: yup.string().nullable(),
});

export default function DebtForm({ initialValues, onSubmit, onCancel, submitting }) {
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues || { amount: '', date: '', category: 'Restaurants', status: 'pending', description: '' },
  });

  useEffect(() => {
    reset(initialValues || { amount: '', date: '', category: 'Restaurants', status: 'pending', description: '' });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextFieldController name="amount" control={control} label="Amount" type="number" />
        </Grid>
        <Grid item xs={12} md={6}>
          <DatePickerController name="date" control={control} label="Date" />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectController name="category" control={control} label="Category">
            <MenuItem value="Restaurants">Restaurants</MenuItem>
            <MenuItem value="Offices">Offices</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </SelectController>
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectController name="status" control={control} label="Status">
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="settled">Settled</MenuItem>
          </SelectController>
        </Grid>
        <Grid item xs={12}>
          <TextFieldController name="description" control={control} label="Description" multiline rows={3} />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>Save</Button>
        </Grid>
      </Grid>
    </form>
  );
} 