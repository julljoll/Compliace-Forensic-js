import React from 'react';

interface PlanillaWatermarkProps {
  text?: string;
}

export function PlanillaWatermark({ text = 'CONSIGNACIÓN' }: PlanillaWatermarkProps) {
  return <div className="watermark">{text}</div>;
}
