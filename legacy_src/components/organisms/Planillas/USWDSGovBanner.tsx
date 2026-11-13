'use client';

import React from 'react';

interface USWDSGovBannerProps {
  expediente?: string;
  normativa?: string;
}

export default function USWDSGovBanner({
  expediente = 'EXP-2026-SHA-0091',
  normativa = 'MUCC-2017 & ISO/IEC 27037:2012',
}: USWDSGovBannerProps) {
  return (
    <section className="usa-banner w-100" aria-label="Banda Oficial de Certificación Pericial SHA256.US">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-2 px-3">
        <div className="usa-banner__header">
          <span className="usa-banner__icon">✓</span>
          <span>SISTEMA INSTITUCIONAL DE CUMPLIMIENTO Y CUSTODIA FORENSE — SHA256.US</span>
        </div>
        <div className="d-flex align-items-center gap-3 text-monospace" style={{ fontSize: '10px' }}>
          <span className="text-warning">
            <strong>EXPEDIENTE:</strong> {expediente}
          </span>
          <span className="text-success d-none d-sm-inline">
            <strong>MARCO JURÍDICO:</strong> {normativa}
          </span>
          <span className="badge bg-dark border border-warning text-warning px-2 py-1">
            HAZ-256 HASH VERIFIED
          </span>
        </div>
      </div>
    </section>
  );
}
