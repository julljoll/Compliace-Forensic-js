'use client';

import React from 'react';

const FORENSIC_STEPS = [
  'Recepción & Identificación (MUCC-2017 § 4)',
  'Fijación Fotográfica de Estado Físico',
  'Aislamiento Electromagnético (Bolsa Faraday RF)',
  'Generación de Hash SHA-256 Inicial',
  'Adquisición & Imagen Forense (DEFR ISO 27037)',
  'Verificación de Integridad Binaria MATCH',
  'Análisis Técnico Especializado (DES ISO 27042)',
  'Emisión de Dictamen Pericial (COPP Art. 225)',
  'Entrega de Resultados & Sanitización Final',
];

interface USWDSStepIndicatorProps {
  currentStep?: number;
}

export default function USWDSStepIndicator({ currentStep = 1 }: USWDSStepIndicatorProps) {
  return (
    <div className="usa-alert usa-alert--info w-100 my-2">
      <div className="usa-alert__heading mb-2">
        <span>⚙️</span> SECUENCIA PROCESAL DE CADENA DE CUSTODIA (ISO 27037 / MUCC-2017)
      </div>

      {/* Visual step indicator bar */}
      <div className="usa-step-indicator w-100 mb-2">
        {FORENSIC_STEPS.map((_, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={idx}
              className={`usa-step-indicator__segment ${
                isDone
                  ? 'usa-step-indicator__segment--complete'
                  : isCurrent
                  ? 'usa-step-indicator__segment--current'
                  : ''
              }`}
              title={FORENSIC_STEPS[idx]}
            />
          );
        })}
      </div>

      {/* Step chips grid */}
      <div className="d-flex flex-wrap gap-1 align-items-center">
        {FORENSIC_STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <span
              key={idx}
              className={`usa-tag ${
                isCurrent
                  ? 'usa-tag--info'
                  : isDone
                  ? 'usa-tag--success'
                  : 'usa-tag--muted'
              }`}
              style={{ fontSize: '9px', cursor: 'help' }}
              title={step}
            >
              {stepNum}. {step.split(' ')[0]} {isDone ? '✓' : isCurrent ? '▶' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
}
