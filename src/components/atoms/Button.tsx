import React, { ButtonHTMLAttributes } from 'react';

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
  type = 'button',
  startIcon,
  endIcon,
  style,
  ...props
}) => {
  let btnVariantClass = 'btn-primary';
  if (variant === 'secondary') btnVariantClass = 'btn-secondary';
  else if (variant === 'destructive') btnVariantClass = 'btn-danger';
  else if (variant === 'ghost') btnVariantClass = 'btn-link text-decoration-none';
  else if (variant === 'outlined') btnVariantClass = 'btn-outline-primary';

  let btnSizeClass = '';
  if (size === 'sm' || size === 'small') btnSizeClass = 'btn-sm';
  else if (size === 'lg' || size === 'large') btnSizeClass = 'btn-lg';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${btnVariantClass} ${btnSizeClass} fw-semibold d-inline-flex align-items-center justify-content-center gap-2 ${className}`}
      style={style}
      {...props}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
};

export default Button;
