import React from 'react';

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
    online: '#008837',
    offline: '#D9381E',
    reconectando: '#D9A700',
    null: '#475569',
  };

  const statusKey = status === null ? 'null' : status;
  const color = colors[statusKey];

  return (
    <span
      className={`d-inline-block rounded-circle ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        boxShadow: status === 'online' ? `0 0 6px ${color}` : 'none',
      }}
    />
  );
};

export default StatusDot;
