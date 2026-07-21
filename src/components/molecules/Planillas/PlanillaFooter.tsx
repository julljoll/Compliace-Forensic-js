import React from 'react';

interface PlanillaFooterProps {
  leftText?: string;
  rightText?: string;
}

export function PlanillaFooter({
  leftText = 'SHA256.US — Laboratorio de Informática Forense y Ciberseguridad',
  rightText,
}: PlanillaFooterProps) {
  const defaultRightText = `Sello Inmutable SHA-256 · Impreso el ${new Date().toLocaleDateString('es-VE')}`;
  return (
    <footer>
      <span>{leftText}</span>
      <span>{rightText || defaultRightText}</span>
    </footer>
  );
}
