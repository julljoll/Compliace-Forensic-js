import React from 'react';

interface PlanillaEditableValueProps {
  value?: string | React.ReactNode;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function PlanillaEditableValue({
  value,
  placeholder = '[Información requerida]',
  className = 'value',
  style,
}: PlanillaEditableValueProps) {
  return (
    <div
      className={className}
      contentEditable
      suppressContentEditableWarning
      style={style}
    >
      {value ? value : <span className="placeholder-field">{placeholder}</span>}
    </div>
  );
}
