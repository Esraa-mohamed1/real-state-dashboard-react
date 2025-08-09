import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextFieldController from '../../components/forms/TextFieldController';
import DatePickerController from '../../components/forms/DatePickerController';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const schema = yup.object().shape({
  amount: yup.number().typeError('Amount is required').positive('Must be positive').required('Amount is required'),
  date: yup.string().required('Date is required'),
  payer: yup.string().required('Payer is required'),
  description: yup.string().nullable(),
});

export default function PaymentForm({ initialValues, onSubmit, onCancel, submitting }) {
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues || { amount: '', date: '', payer: '', description: '' },
  });

  useEffect(() => {
    reset(initialValues || { amount: '', date: '', payer: '', description: '' });
  }, [initialValues, reset]);

  const onError = (formErrors) => {
    const items = Object.values(formErrors).map((e) => e.message).filter(Boolean);
    if (items.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fix validation errors',
        html: `<ul style="text-align:left;margin:0;padding-left:18px;">${items.map((m) => `<li>${m}</li>`).join('')}</ul>`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextFieldController name="amount" control={control} label="Amount" type="number" />
        </Grid>
        <Grid item xs={12} md={6}>
          <DatePickerController name="date" control={control} label="Date" />
        </Grid>
        <Grid item xs={12}>
          <TextFieldController name="payer" control={control} label="Payer" />
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