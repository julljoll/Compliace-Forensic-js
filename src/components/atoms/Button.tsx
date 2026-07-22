import React, { ButtonHTMLAttributes } from 'react';
import MuiButton from '@mui/material/Button';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'contained' | 'outlined';
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'inherit' | string;
  iconOnly?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  color,
  className = '',
  iconOnly = false,
  disabled,
  onClick,
  type,
  startIcon,
  endIcon,
  ...props
}) => {
  let muiVariant: 'contained' | 'outlined' | 'text' = 'contained';
  let muiColor: 'primary' | 'secondary' | 'error' | 'inherit' = 'primary';

  if (variant === 'primary' || variant === 'contained') {
    muiVariant = 'contained';
    muiColor = (color as any) || 'primary';
  } else if (variant === 'secondary') {
    muiVariant = 'contained';
    muiColor = 'secondary';
  } else if (variant === 'destructive') {
    muiVariant = 'contained';
    muiColor = 'error';
  } else if (variant === 'ghost' || variant === 'outlined') {
    muiVariant = variant === 'outlined' ? 'outlined' : 'text';
    muiColor = (color as any) || 'primary';
  }

  const normalizedSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : size === 'medium' ? 'md' : size;
  const paddingY = normalizedSize === 'sm' ? '4px' : normalizedSize === 'lg' ? '12px' : '8px';
  const paddingX = iconOnly ? (normalizedSize === 'sm' ? '8px' : normalizedSize === 'lg' ? '16px' : '12px') : (normalizedSize === 'sm' ? '14px' : normalizedSize === 'lg' ? '22px' : '18px');
  const minWidth = iconOnly ? (normalizedSize === 'sm' ? '32px' : normalizedSize === 'lg' ? '48px' : '40px') : 'auto';

  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        py: paddingY,
        px: paddingX,
        minWidth: minWidth,
        borderRadius: normalizedSize === 'sm' ? '8px' : normalizedSize === 'lg' ? '12px' : '10px',
        fontSize: normalizedSize === 'sm' ? '13px' : normalizedSize === 'lg' ? '17px' : '15px',
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
