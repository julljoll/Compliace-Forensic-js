import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        border: '1px dashed rgba(254, 207, 6, 0.3)',
        borderRadius: '16px',
        backgroundColor: '#1E1800',
      }}
    >
      <Box sx={{ p: 2, borderRadius: '50%', backgroundColor: 'rgba(254, 207, 6, 0.1)', mb: 2 }}>
        <Icon size={36} style={{ color: '#FECF06' }} />
      </Box>
      <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: '14px', color: '#AEAEB2', mt: 1, maxWidth: '360px' }}>
        {description}
      </Typography>
      {action && <Box sx={{ mt: 3 }}>{action}</Box>}
    </Box>
  );
};

export default EmptyState;
