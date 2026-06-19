import React from 'react';

export interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-[var(--co-separator)] rounded-[20px] bg-[var(--co-surface-1)]/30 ${className}`}>
      <div className="p-4 rounded-full bg-[var(--co-surface-2)] text-[var(--co-gray-1)] mb-4 shadow-[var(--co-shadow-1)]">
        <Icon size={36} className="text-[var(--co-gray-1)] shrink-0" />
      </div>
      <h3 className="text-[17px] font-bold text-[var(--apple-text)] tracking-[-0.1px]">
        {title}
      </h3>
      <p className="text-[15px] text-[var(--co-gray-1)] mt-2 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
