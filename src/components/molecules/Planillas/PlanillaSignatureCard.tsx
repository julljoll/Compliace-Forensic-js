import React from 'react';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaSigLine } from '../../atoms/Planillas/PlanillaSigLine';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface PlanillaSignatureCardProps {
  title: string;
  nameValue?: string;
  placeholder?: string;
}

export function PlanillaSignatureCard({
  title,
  nameValue,
  placeholder = '[Nombre del Perito / Custodio]',
}: PlanillaSignatureCardProps) {
  return (
    <div className="sig-card">
      <PlanillaFieldLabel>{title}</PlanillaFieldLabel>
      <PlanillaEditableValue
        value={nameValue}
        placeholder={placeholder}
        style={{ minHeight: '18px', fontWeight: 'bold', padding: '2px 5px' }}
      />
      <div className="sig-row">
        <PlanillaSigLine />
        <PlanillaThumbBox />
      </div>
    </div>
  );
}
