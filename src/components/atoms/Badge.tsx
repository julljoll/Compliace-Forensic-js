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
  const baseStyle = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.04em] select-none border";
  
  const variants = {
    critica: "bg-[var(--co-red)]/10 text-[var(--co-red)] border-[var(--co-red)]/20 dark:bg-[var(--co-red)]/15 dark:border-[var(--co-red)]/30",
    alta: "bg-[var(--co-orange)]/10 text-[var(--co-orange)] border-[var(--co-orange)]/20 dark:bg-[var(--co-orange)]/15 dark:border-[var(--co-orange)]/30",
    media: "bg-[var(--co-yellow)]/10 text-[#A0830F] border-[var(--co-yellow)]/20 dark:bg-[var(--co-yellow)]/15 dark:text-[var(--co-yellow)] dark:border-[var(--co-yellow)]/30",
    baja: "bg-[var(--co-green)]/10 text-[var(--co-green)] border-[var(--co-green)]/20 dark:bg-[var(--co-green)]/15 dark:border-[var(--co-green)]/30",
    conforme: "bg-[var(--co-green)]/10 text-[var(--co-green)] border-[var(--co-green)]/20 dark:bg-[var(--co-green)]/15 dark:border-[var(--co-green)]/30",
    parcial: "bg-[var(--co-orange)]/10 text-[var(--co-orange)] border-[var(--co-orange)]/20 dark:bg-[var(--co-orange)]/15 dark:border-[var(--co-orange)]/30",
    no_conforme: "bg-[var(--co-red)]/10 text-[var(--co-red)] border-[var(--co-red)]/20 dark:bg-[var(--co-red)]/15 dark:border-[var(--co-red)]/30",
    neutro: "bg-[var(--co-surface-3)] text-[var(--co-gray-1)] border-[var(--co-gray-3)]/20 dark:bg-[var(--co-surface-2)] dark:border-[var(--co-separator)]"
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
