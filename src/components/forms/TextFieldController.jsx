import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

export default function TextFieldController({ name, control, label, type = 'text', rules, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          type={type}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          {...props}
        />
      )}
    />
  );
} 