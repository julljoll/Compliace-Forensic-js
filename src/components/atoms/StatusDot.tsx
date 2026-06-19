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
  const statusColors = {
    online: 'bg-[var(--co-green)]',
    offline: 'bg-[var(--co-red)]',
    reconectando: 'bg-[var(--co-yellow)]',
    null: 'bg-[var(--co-gray-1)]'
  };

  const statusKey = status === null ? 'null' : status;

  return (
    <div className={`relative inline-flex ${className}`}>
      {(status === 'online' || status === 'reconectando') && (
        <span className={`absolute inline-flex h-full w-full rounded-full animate-ping opacity-75 ${statusColors[status]}`} />
      )}
      <span 
        className={`relative inline-flex rounded-full ${statusColors[statusKey]}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};

export default StatusDot;
