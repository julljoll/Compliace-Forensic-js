import React from 'react';

interface PlanillaThumbBoxProps {
  label?: string;
}

export function PlanillaThumbBox({ label = 'PULGAR DER.' }: PlanillaThumbBoxProps) {
  return (
    <div className="thumb-wrapper">
      <div className="thumb-box" />
      <span className="thumb-label">{label}</span>
    </div>
  );
}
