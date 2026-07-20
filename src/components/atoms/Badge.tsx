import React, { HTMLAttributes } from 'react';
import Chip from '@mui/material/Chip';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'critica' | 'alta' | 'media' | 'baja' | 'conforme' | 'parcial' | 'no_conforme' | 'neutro';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutro',
  className = '',
  ...props
}) => {
  const variantStyles: Record<string, { bg: string; color: string; border: string }> = {
    critica: { bg: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30', border: 'rgba(255, 59, 48, 0.3)' },
    alta: { bg: 'rgba(255, 149, 0, 0.1)', color: '#FF9500', border: 'rgba(255, 149, 0, 0.3)' },
    media: { bg: 'rgba(254, 207, 6, 0.1)', color: '#FECF06', border: 'rgba(254, 207, 6, 0.3)' },
    baja: { bg: 'rgba(0, 255, 65, 0.1)', color: '#00FF41', border: 'rgba(0, 255, 65, 0.3)' },
    conforme: { bg: 'rgba(0, 255, 65, 0.1)', color: '#00FF41', border: 'rgba(0, 255, 65, 0.3)' },
    parcial: { bg: 'rgba(255, 149, 0, 0.1)', color: '#FF9500', border: 'rgba(255, 149, 0, 0.3)' },
    no_conforme: { bg: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30', border: 'rgba(255, 59, 48, 0.3)' },
    neutro: { bg: 'rgba(255, 255, 255, 0.06)', color: '#AEAEB2', border: 'rgba(255, 255, 255, 0.12)' },
  };

  const style = variantStyles[variant] || variantStyles.neutro;

  return (
    <Chip
      label={children}
      size="small"
      className={className}
      sx={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        height: '22px',
        borderRadius: '6px',
        '& .MuiChip-label': {
          px: '8px',
        },
      }}
      {...(props as Record<string, unknown>)}
    />
  );
};

export default Badge;
