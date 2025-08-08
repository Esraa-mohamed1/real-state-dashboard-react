import React from 'react';
import { Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

export default function DatePickerController({ name, control, label, rules, ...props }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <DatePicker
            {...props}
            value={field.value ? dayjs(field.value) : null}
            onChange={(val) => field.onChange(val ? val.toISOString() : '')}
            label={label}
            slotProps={{ textField: { fullWidth: true, error: !!fieldState.error, helperText: fieldState.error?.message } }}
          />
        )}
      />
    </LocalizationProvider>
  );
} 