import React from 'react';

interface PlanillaFooterProps {
  leftText?: string;
  rightText?: string;
}

export function PlanillaFooter({
  leftText = 'SHA256.US — Laboratorio de Informática Forense | Consignación Privada y Cumplimiento Normativo (MUCC-2017 & ISO 27037)',
  rightText,
}: PlanillaFooterProps) {
  const defaultRightText = `Sello Inmutable SHA-256 · Impreso el ${new Date().toLocaleDateString('es-VE')}`;

  return (
    <footer
      role="contentinfo"
      aria-label="Pie de página legal e institucional del Laboratorio de Informática Forense SHA256.US"
      itemScope
      itemType="https://schema.org/Organization"
      className="planilla-official-footer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        borderTop: '1px solid var(--planilla-border-light, #CBD5E1)',
        paddingTop: '6px',
        marginTop: '16px',
        fontSize: '8pt',
        color: 'var(--planilla-text-muted, #475569)',
        lineHeight: 1.35,
        fontFamily: 'var(--font-ui, system-ui, -apple-system, sans-serif)',
      }}
    >
      <meta itemProp="name" content="SHA256.US — Lab. Informática Forense" />
      <meta itemProp="url" content="https://sha256.us" />

      {/* Fila Principal de Trazabilidad y Sello */}
      <div
        className="footer-meta-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          fontWeight: 600,
          color: '#1E293B',
          letterSpacing: '0.01em',
        }}
      >
        <span itemProp="description" style={{ fontSize: '7.5pt', color: '#334155' }}>
          {leftText}
        </span>
        <span style={{ fontSize: '7.5pt', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>
          {rightText || defaultRightText}
        </span>
      </div>

      {/* Dirección Fiscal e Institucional Semantic HTML <address> */}
      <address
        itemProp="address"
        itemScope
        itemType="https://schema.org/PostalAddress"
        style={{
          fontStyle: 'normal',
          fontSize: '7pt',
          textAlign: 'center',
          color: '#475569',
          letterSpacing: '0.015em',
          marginTop: '2px',
          opacity: 0.9,
        }}
      >
        <span itemProp="streetAddress">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8</span>,{' '}
        <span itemProp="addressLocality">Quíbor</span>,{' '}
        <span itemProp="addressRegion">Municipio Jiménez del Estado Lara</span>,{' '}
        <span itemProp="addressCountry">Venezuela</span>.
      </address>
    </footer>
  );
}
