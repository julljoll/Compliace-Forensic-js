import React from 'react';

export interface CheckboxOption {
  id: string;
  label: string;
  checked?: boolean;
}

interface PlanillaCheckboxGroupProps {
  options: CheckboxOption[];
  onToggle?: (id: string) => void;
  style?: React.CSSProperties;
  fontSize?: string;
}

export function PlanillaCheckboxGroup({
  options,
  onToggle,
  style,
  fontSize = '8.5pt',
}: PlanillaCheckboxGroupProps) {
  return (
    <div className="checkbox-group" style={{ fontSize, ...style }}>
      {options.map(opt => (
        <div
          key={opt.id}
          className="check-item"
          onClick={() => onToggle && onToggle(opt.id)}
        >
          <span className="box">{opt.checked ? 'X' : ''}</span>
          <span>{opt.label}</span>
        </div>
      ))}
    </div>
  );
}
