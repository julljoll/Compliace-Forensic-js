import React, { InputHTMLAttributes } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AlertCircle } from './AppleIcon';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helpText,
  className = '',
  id,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {label && (
        <Typography
          component="label"
          htmlFor={inputId}
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#AEAEB2',
            mb: '6px',
            userSelect: 'none',
          }}
        >
          {label}
        </Typography>
      )}
      <TextField
        inputRef={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange as any}
        disabled={disabled}
        error={Boolean(error)}
        variant="outlined"
        fullWidth
        className={className}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '10px',
            fontSize: '15px',
            color: '#FFFFFF',
            '& fieldset': {
              borderColor: error ? '#FF3B30' : 'rgba(254, 207, 6, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: error ? '#FF3B30' : 'rgba(254, 207, 6, 0.45)',
            },
            '&.Mui-focused fieldset': {
              borderColor: error ? '#FF3B30' : '#FECF06',
            },
          },
          '& .MuiInputBase-input': {
            py: '10px',
            px: '14px',
          },
        }}
        {...(props as Record<string, unknown>)}
      />
      {error ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '6px' }}>
          <AlertCircle size={12} className="text-[#FF3B30] shrink-0" />
          <Typography sx={{ fontSize: '13px', color: '#FF3B30', fontWeight: 500 }}>
            {error}
          </Typography>
        </Box>
      ) : helpText ? (
        <Typography sx={{ fontSize: '12px', color: '#AEAEB2', mt: '6px' }}>
          {helpText}
        </Typography>
      ) : null}
    </Box>
  );
});

Input.displayName = 'Input';

export default Input;
