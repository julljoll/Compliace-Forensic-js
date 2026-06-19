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
  const shapeClass = {
    text: 'rounded-[6px] h-4 w-full',
    rect: 'rounded-[10px]',
    circle: 'rounded-full'
  };

  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        bg-[var(--co-surface-3)] dark:bg-[var(--co-surface-2)]
        relative overflow-hidden animate-pulse
        before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]
        before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.06)] dark:before:via-[rgba(255,255,255,0.03)] before:to-transparent
        ${shapeClass[variant]}
        ${className}
      `}
      style={style}
    />
  );
};

export default Skeleton;
