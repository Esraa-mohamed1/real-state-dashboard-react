import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

export default function SelectController({ name, control, label, children, rules, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          select
          fullWidth
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          {...props}
        >
          {children}
        </TextField>
      )}
    />
  );
} 