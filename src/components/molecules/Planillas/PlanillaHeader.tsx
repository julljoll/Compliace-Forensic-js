import React from 'react';
import { PlanillaHeaderLogo } from '../../atoms/Planillas/PlanillaHeaderLogo';

interface PlanillaHeaderProps {
  title: string;
  nroLabel?: string;
  nroValue?: string | React.ReactNode;
  fechaLabel?: string;
  fechaValue?: string | React.ReactNode;
}

export function PlanillaHeader({
  title,
  nroLabel = 'N° EXP:',
  nroValue = '[N° EXPEDIENTE]',
  fechaLabel = 'FECHA:',
  fechaValue = '[ FECHA Y HORA ]',
}: PlanillaHeaderProps) {
  return (
    <header className="planilla-header-root">
      <div className="header-top-row">
        <PlanillaHeaderLogo />
      </div>
      <div className="header-title-row">
        <h1 className="acta-title">{title}</h1>
        <div className="header-meta-slots" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="acta-nro" style={{ fontSize: '10pt', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {nroLabel}{' '}
            <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '140px', textAlign: 'center', fontWeight: 'bold', display: 'inline-block', borderBottom: '1.5px solid #000', padding: '0 6px' }}>
              {nroValue}
            </span>
          </div>
          <div className="acta-fecha" style={{ fontSize: '10pt', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {fechaLabel}{' '}
            <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '160px', textAlign: 'center', fontWeight: 'bold', display: 'inline-block', borderBottom: '1.5px solid #000', padding: '0 6px' }}>
              {fechaValue}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
