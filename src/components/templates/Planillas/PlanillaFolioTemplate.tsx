import React from 'react';
import { PlanillaWatermark } from '../../atoms/Planillas/PlanillaWatermark';
import { PlanillaHeader } from '../../molecules/Planillas/PlanillaHeader';
import { PlanillaFooter } from '../../molecules/Planillas/PlanillaFooter';

interface PlanillaFolioTemplateProps {
  title: string;
  nroLabel?: string;
  nroValue?: string | React.ReactNode;
  watermarkText?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  footerRightText?: string;
}

export function PlanillaFolioTemplate({
  title,
  nroLabel,
  nroValue,
  watermarkText = 'CONSIGNACIÓN',
  children,
  onClick,
  footerRightText,
}: PlanillaFolioTemplateProps) {
  return (
    <div className="page" onClick={onClick}>
      <PlanillaWatermark text={watermarkText} />
      <PlanillaHeader title={title} nroLabel={nroLabel} nroValue={nroValue} />
      {children}
      <PlanillaFooter rightText={footerRightText} />
    </div>
  );
}
