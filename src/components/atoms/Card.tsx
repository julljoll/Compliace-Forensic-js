import React, { HTMLAttributes } from 'react';
import MuiCard from '@mui/material/Card';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = true,
  className = '',
  ...props
}) => {
  return (
    <MuiCard
      className={className}
      sx={{
        backgroundColor: '#121412',
        border: '1px solid rgba(254, 207, 6, 0.2)',
        borderRadius: '16px',
        p: '20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        transition: 'all 0.2s ease',
        ...(hoverable && {
          '&:hover': {
            borderColor: 'rgba(254, 207, 6, 0.45)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          },
        }),
      }}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </MuiCard>
  );
};

export default Card;
