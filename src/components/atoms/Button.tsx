import React, { ButtonHTMLAttributes } from 'react';
import MuiButton from '@mui/material/Button';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  iconOnly = false,
  disabled,
  onClick,
  type,
  ...props
}) => {
  let muiVariant: 'contained' | 'outlined' | 'text' = 'contained';
  let muiColor: 'primary' | 'secondary' | 'error' | 'inherit' = 'primary';

  if (variant === 'primary') {
    muiVariant = 'contained';
    muiColor = 'primary';
  } else if (variant === 'secondary') {
    muiVariant = 'contained';
    muiColor = 'secondary';
  } else if (variant === 'destructive') {
    muiVariant = 'contained';
    muiColor = 'error';
  } else if (variant === 'ghost') {
    muiVariant = 'text';
    muiColor = 'primary';
  }

  const paddingY = size === 'sm' ? '4px' : size === 'lg' ? '12px' : '8px';
  const paddingX = iconOnly ? (size === 'sm' ? '8px' : size === 'lg' ? '16px' : '12px') : (size === 'sm' ? '14px' : size === 'lg' ? '22px' : '18px');
  const minWidth = iconOnly ? (size === 'sm' ? '32px' : size === 'lg' ? '48px' : '40px') : 'auto';

  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
      sx={{
        py: paddingY,
        px: paddingX,
        minWidth: minWidth,
        borderRadius: size === 'sm' ? '8px' : size === 'lg' ? '12px' : '10px',
        fontSize: size === 'sm' ? '13px' : size === 'lg' ? '17px' : '15px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:active': {
          transform: 'scale(0.97)',
        },
      }}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
