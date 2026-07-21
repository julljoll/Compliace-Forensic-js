import React from 'react';

interface PlanillaSectionTitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function PlanillaSectionTitle({ children, style }: PlanillaSectionTitleProps) {
  return (
    <div className="section-title" style={style}>
      {children}
    </div>
  );
}
