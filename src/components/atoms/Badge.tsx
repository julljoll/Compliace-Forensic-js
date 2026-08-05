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
  const variantClass: Record<string, string> = {
    critica: 'usa-tag--error',
    alta: 'usa-tag--warning',
    media: 'usa-tag--info',
    baja: 'usa-tag--success',
    conforme: 'usa-tag--success',
    parcial: 'usa-tag--warning',
    no_conforme: 'usa-tag--error',
    neutro: 'usa-tag--muted',
  };

  const tagClass = variantClass[variant] || 'usa-tag--muted';

  return (
    <span className={`usa-tag ${tagClass} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
