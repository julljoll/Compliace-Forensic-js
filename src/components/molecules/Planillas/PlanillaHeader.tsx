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
    <header>
      <div className="header-top-row">
        <PlanillaHeaderLogo />
        <div className="header-lab-info">
          <div className="lab-title">LABORATORIO DE INFORMÁTICA FORENSE Y CIBERSEGURIDAD</div>
          <div className="lab-address">
            Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quíbor, Municipio Jiménez del Estado Lara.
          </div>
        </div>
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
