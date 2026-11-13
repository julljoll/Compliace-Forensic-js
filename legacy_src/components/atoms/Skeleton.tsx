import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  width,
  height,
}) => {
  return (
    <div
      className={`placeholder-glow ${className}`}
      style={{ width: width || '100%', height: height || '20px' }}
    >
      <span
        className={`placeholder w-100 h-100 bg-secondary opacity-25 ${
          variant === 'circle' ? 'rounded-circle' : 'rounded-2'
        }`}
      />
    </div>
  );
};

export default Skeleton;
