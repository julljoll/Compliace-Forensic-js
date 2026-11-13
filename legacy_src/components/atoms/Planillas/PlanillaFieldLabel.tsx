import React from 'react';

interface PlanillaFieldLabelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function PlanillaFieldLabel({ children, style }: PlanillaFieldLabelProps) {
  return (
    <div className="label" style={style}>
      {children}
    </div>
  );
}
