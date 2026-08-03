import React from 'react';
import { PlanillaHeaderLogo } from '../../atoms/Planillas/PlanillaHeaderLogo';

interface PlanillaHeaderProps {
  title: string;
  nroLabel?: string;
  nroValue?: string | React.ReactNode;
}

export function PlanillaHeader({
  title,
  nroLabel = 'N° EXP:',
  nroValue = '[N° EXPEDIENTE]',
}: PlanillaHeaderProps) {
  return (
    <header className="planilla-header-root">
      <div className="header-top-row">
        <PlanillaHeaderLogo />
      </div>
      <div className="header-title-row">
        <h1 className="acta-title">{title}</h1>
        <div className="acta-nro">
          {nroLabel}{' '}
          <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>
            {nroValue}
          </span>
        </div>
      </div>
    </header>
  );
}
