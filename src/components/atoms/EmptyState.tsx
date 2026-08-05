import React from 'react';

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
    <div className="d-flex flex-column align-items-center justify-content-center text-center p-4 border border-dashed rounded-3 bg-white">
      <div className="p-3 rounded-circle bg-light mb-3">
        <Icon size={36} style={{ color: '#D9A700' }} />
      </div>
      <h3 className="h6 fw-bold text-navy mb-1" style={{ color: '#112E51' }}>
        {title}
      </h3>
      <p className="text-muted small mb-0 max-w-360">
        {description}
      </p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
};

export default EmptyState;
