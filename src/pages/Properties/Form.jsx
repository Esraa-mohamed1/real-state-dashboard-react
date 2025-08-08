import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextFieldController from '../../components/forms/TextFieldController';
import UnitsEditor from './UnitsEditor';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Type is required'),
  address: yup.string().required('Address is required'),
  units: yup.array().of(yup.object({
    number: yup.string().required('Unit number is required'),
    tenant: yup.string().nullable(),
    monthlyRent: yup.number().typeError('Monthly rent is required').min(0).required('Monthly rent is required'),
    isRented: yup.boolean(),
  })),
});

export default function PropertyForm({ initialValues, onSubmit, onCancel, submitting }) {
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues || { name: '', type: '', address: '', units: [] },
  });

  useEffect(() => {
    reset(initialValues || { name: '', type: '', address: '', units: [] });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextFieldController name="name" control={control} label="Name" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextFieldController name="type" control={control} label="Type" />
        </Grid>
        <Grid item xs={12}>
          <TextFieldController name="address" control={control} label="Address" />
        </Grid>
        <Grid item xs={12}>
          <UnitsEditor control={control} name="units" />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>Save</Button>
        </Grid>
      </Grid>
    </form>
  );
} 