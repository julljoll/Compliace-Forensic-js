import React, { HTMLAttributes } from 'react';

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
    <div
      className={`
        bg-[var(--co-surface-1)] border border-[var(--co-separator)] rounded-[16px] p-5
        shadow-[var(--co-shadow-1)] transition-all duration-200
        ${hoverable ? 'hover:shadow-[var(--co-shadow-2)] hover:-translate-y-[1px]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
