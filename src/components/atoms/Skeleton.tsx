import React from 'react';
import MuiSkeleton from '@mui/material/Skeleton';

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
  const muiVariant = variant === 'rect' ? 'rectangular' : variant === 'circle' ? 'circular' : 'text';

  return (
    <MuiSkeleton
      variant={muiVariant}
      width={width}
      height={height}
      className={className}
      sx={{
        backgroundColor: 'rgba(254, 207, 6, 0.08)',
        borderRadius: variant === 'circle' ? '50%' : variant === 'text' ? '6px' : '10px',
      }}
    />
  );
};

export default Skeleton;
