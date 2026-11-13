import React from 'react';

export interface StatusDotProps {
  status: 'online' | 'offline' | 'busy' | 'away' | null;
  size?: number;
}

export function StatusDot({ status, size = 8 }: StatusDotProps) {
  const isOnline = status === 'online';
  const color = isOnline ? '#008837' : status === 'offline' ? '#D9381E' : '#71767A';

  return (
    <span
      className="usa-status-dot"
      style={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color,
      }}
    >
      <span style={{ display: 'none' }}>{status || 'unknown'}</span>
    </span>
  );
}
