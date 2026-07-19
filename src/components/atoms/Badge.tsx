import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'critica' | 'alta' | 'media' | 'baja' | 'conforme' | 'parcial' | 'no_conforme' | 'neutro';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutro',
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-[0.04em] select-none border";
  
  const variants = {
    critica: "bg-[var(--co-red)]/10 text-[var(--co-red)] border-[var(--co-red)]/20",
    alta: "bg-[var(--co-orange)]/10 text-[var(--co-orange)] border-[var(--co-orange)]/20",
    media: "bg-[var(--co-yellow)]/10 text-[#A0830F] border-[var(--co-yellow)]/20",
    baja: "bg-[var(--co-green)]/10 text-[var(--co-green)] border-[var(--co-green)]/20",
    conforme: "bg-[var(--co-green)]/10 text-[var(--co-green)] border-[var(--co-green)]/20",
    parcial: "bg-[var(--co-orange)]/10 text-[var(--co-orange)] border-[var(--co-orange)]/20",
    no_conforme: "bg-[var(--co-red)]/10 text-[var(--co-red)] border-[var(--co-red)]/20",
    neutro: "bg-[var(--co-surface-3)] text-[var(--co-gray-1)] border-[var(--co-gray-3)]/20"
  };

  return (
    <span
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
