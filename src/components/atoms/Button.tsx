import React, { ButtonHTMLAttributes } from 'react';

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
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-200 outline-none select-none active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:pointer-events-none gap-2";
  
  const variants = {
    primary: "bg-[var(--co-accent)] text-[var(--co-accent-fg)] border-none hover:brightness-[1.08] shadow-[0_1px_2px_rgba(0,0,0,0.1)]",
    secondary: "bg-[var(--co-surface-2)] text-[var(--apple-text)] border-none hover:bg-[var(--apple-surface-hover)] dark:hover:bg-[rgba(255,255,255,0.08)]",
    destructive: "bg-[var(--co-red)] text-white border-none hover:brightness-[1.08]",
    ghost: "bg-transparent text-[var(--co-accent)] hover:bg-[rgba(0,113,227,0.1)] border-none"
  };

  const sizes = {
    sm: "h-8 px-3.5 text-[13px] rounded-[8px]",
    md: "h-10 px-4.5 text-[15px] rounded-[10px]",
    lg: "h-12 px-5.5 text-[17px] rounded-[12px]"
  };

  // Adjust width if it's an icon-only button
  const iconSizeStyle = iconOnly ? (size === 'sm' ? 'w-8 p-0' : size === 'lg' ? 'w-12 p-0' : 'w-10 p-0') : '';

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${iconSizeStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
