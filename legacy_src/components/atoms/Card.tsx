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
      className={`card p-3 bg-white border shadow-sm rounded-3 ${hoverable ? 'hover-border-primary transition-all' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
