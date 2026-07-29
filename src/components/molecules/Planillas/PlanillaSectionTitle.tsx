import React from 'react';

interface PlanillaSectionTitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  id?: string;
}

export function PlanillaSectionTitle({ children, style, id }: PlanillaSectionTitleProps) {
  return (
    <div id={id} className="section-title" style={style}>
      {children}
    </div>
  );
}
