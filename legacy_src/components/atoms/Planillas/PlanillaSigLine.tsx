import React from 'react';

interface PlanillaSigLineProps {
  label?: string;
}

export function PlanillaSigLine({ label = 'FIRMA' }: PlanillaSigLineProps) {
  return (
    <div className="sig-firma-col">
      <div className="sig-box" />
      <span className="sig-label">{label}</span>
    </div>
  );
}
