import React from 'react';
import Box from '@mui/material/Box';

export interface StatusDotProps {
  status: 'online' | 'offline' | 'reconectando' | null;
  className?: string;
  size?: number;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  className = '',
  size = 8
}) => {
  const colors: Record<string, string> = {
    online: '#00FF41',
    offline: '#FF3B30',
    reconectando: '#FECF06',
    null: '#AEAEB2',
  };

  const statusKey = status === null ? 'null' : status;
  const color = colors[statusKey];

  return (
    <Box className={className} sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {(status === 'online' || status === 'reconectando') && (
        <Box
          sx={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.75,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            '@keyframes ping': {
              '75%, 100%': {
                transform: 'scale(2)',
                opacity: 0,
              },
            },
          }}
        />
      )}
      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    </Box>
  );
};

export default StatusDot;
