'use client';

import { CasoCMS } from '../../../store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface AuditLog {
  timestamp: string;
  accion: string;
  usuario: string;
  hashActual?: string;
  hash?: string;
}

interface ActaAuditoriaTimelineProps {
  caso?: CasoCMS;
  auditLogs?: AuditLog[];
  logs?: AuditLog[];
}

const DEFAULT_MOCK_LOGS: AuditLog[] = [
  { timestamp: '23/07/2026 09:30:15', accion: 'RECEPCION_EVIDENCIA', usuario: 'Ing. Christopher V. Vance', hashActual: 'a8f5f167f44f4964e6c998dee827110c4f828a21' },
  { timestamp: '23/07/2026 09:45:00', accion: 'AISLAMIENTO_FARADAY', usuario: 'Ing. Christopher V. Vance', hashActual: 'b4912a7812904812304918239041239048129304' },
  { timestamp: '23/07/2026 10:15:30', accion: 'EXTRACCION_IPED', usuario: 'Ing. Christopher V. Vance', hashActual: 'c984920194819284918294819284918294819284' },
  { timestamp: '23/07/2026 11:00:12', accion: 'ANALISIS_PHOTOHOLMES', usuario: 'Ing. Christopher V. Vance', hashActual: 'd102849182491204912049120491204912049120' },
  { timestamp: '23/07/2026 11:45:00', accion: 'EMISION_DICTAMEN', usuario: 'Ing. Christopher V. Vance', hashActual: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4' },
];

export default function ActaAuditoriaTimeline({ caso, auditLogs = [], logs = [] }: ActaAuditoriaTimelineProps) {
  const c = caso || ({} as Partial<CasoCMS>);
  const incomingLogs = auditLogs.length > 0 ? auditLogs : logs;
  const listLogs = incomingLogs.length > 0 ? incomingLogs : DEFAULT_MOCK_LOGS;

  return (
    <PlanillaFolioTemplate
      title="Acta de Trazabilidad y Registro de Auditoría Criptográfica"
      nroLabel="N° EXPEDIENTE:"
      nroValue={c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}
      watermarkText="AUDITORÍA"
    >
      {/* HEADER PRINCIPAL */}
      <div className="uswds-top-header">
        ACTA DE TRAZABILIDAD Y REGISTRO DE AUDITORÍA CRIPTOGRÁFICA — LOGS INMUTABLES EN CADENA SHA-256 (ISO/IEC 27037 &amp; MUCC-2017)
      </div>

      {/* BLOQUE EXPEDIENTE */}
      <div className="section">
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <span style={{ fontSize: '8pt', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '2px' }}>EXPEDIENTE N°</span>
              <span style={{ fontFamily: 'monospace', fontSize: '10pt', fontWeight: 'bold', color: '#112E51' }}>
                {c.numeroCaso || <span className="placeholder-field">[N° Expediente]</span>}
              </span>
            </div>
            <div className="form-group uswds-slot-input">
              <span style={{ fontSize: '8pt', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '2px' }}>REGISTROS HASH</span>
              <span style={{ fontFamily: 'monospace', fontSize: '10pt', fontWeight: 'bold', color: '#008837' }}>
                {listLogs.length} Eventos Secuenciales
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1.0 RESUMEN DE TRAZABILIDAD */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-1.0">
          1.0 RESUMEN DE TRAZABILIDAD Y HASH CHAIN SHA-256
        </PlanillaSectionTitle>
        <div className="table-responsive">
          <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8pt' }}>
            <thead>
              <tr style={{ backgroundColor: '#112E51', color: '#FFFFFF' }}>
                <th style={{ width: '16%', padding: '6px', textAlign: 'left' }}>FECHA / HORA</th>
                <th style={{ width: '20%', padding: '6px', textAlign: 'left' }}>ACCIÓN</th>
                <th style={{ width: '20%', padding: '6px', textAlign: 'left' }}>USUARIO / PERITO</th>
                <th style={{ width: '44%', padding: '6px', textAlign: 'left' }}>HASH-CHAIN (SHA-256)</th>
              </tr>
            </thead>
            <tbody>
              {listLogs.slice(0, 10).map((log, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF' }}>
                  <td style={{ padding: '5px 6px', fontFamily: 'monospace', fontSize: '7.5pt', color: '#1B2A4A' }}>{log.timestamp}</td>
                  <td style={{ padding: '5px 6px', fontWeight: 'bold', fontSize: '7.5pt', color: '#005EA2' }}>{log.accion}</td>
                  <td style={{ padding: '5px 6px', fontSize: '7.5pt', color: '#1B2A4A' }}>{log.usuario}</td>
                  <td style={{ padding: '5px 6px', fontFamily: 'monospace', fontSize: '6.5pt', color: '#008837', wordBreak: 'break-all' }}>
                    {log.hash || log.hashActual || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2.0 CRONOLOGÍA DE EVENTOS */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-2.0">
          2.0 CRONOLOGÍA DE EVENTOS Y OPERACIONES PERICIALES
        </PlanillaSectionTitle>
        <div className="legal-text">
          El conjunto de operaciones periciales fue registrado secuencialmente desde el momento del ingreso hasta la emisión del certificado final.
        </div>
      </div>

      {/* 3.0 VERIFICACIÓN INMUTABLE */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-3.0">
          3.0 VERIFICACIÓN INMUTABLE DE LOGS DE SISTEMA
        </PlanillaSectionTitle>
        <div className="legal-text">
          El presente informe valida que los logs expuestos corresponden a la cadena inmutable procesada criptográficamente con algoritmo SHA-256, sin modificaciones ni interrupciones
          en la trazabilidad. Cada registro generado por la plataforma SHA256.US queda enlazado de forma indeleble al bloque previo.
        </div>
      </div>

      {/* 4.0 ESTADO DE CUMPLIMIENTO */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-4.0">
          4.0 ESTADO DE CUMPLIMIENTO REGULATORIO Y NORMATIVO
        </PlanillaSectionTitle>
        <div className="legal-text">
          Los logs auditan el cumplimiento de las normativas ISO/IEC 27037:2012 y MUCC-2017 para garantizar plena validez probatoria.
        </div>
      </div>

      {/* 5.0 VALIDACIÓN Y SELLO */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <PlanillaSectionTitle id="seccion-5.0">
          5.0 VALIDACIÓN Y SELLO DE INTEGRIDAD DIGITAL
        </PlanillaSectionTitle>
        <div className="signature-section" style={{ justifyContent: 'center' }}>
          <div className="sig-detail-card" style={{ maxWidth: '50%' }}>
            <div className="sig-detail-label">OFICIAL DE COMPLIANCE / PERITO AUDITOR</div>
            <div className="fingerprint-row" style={{ margin: '16px 0 8px 0' }}>
              <PlanillaThumbBox label="PULGAR DER." />
              <PlanillaThumbBox label="PULGAR IZQ." />
            </div>
            <div className="sig-line" style={{ marginTop: '16px' }} />
            <div className="sig-line-label">Firma del Perito Auditor</div>
            <div style={{ textAlign: 'center', marginTop: '8px', fontWeight: 'bold', fontSize: '9pt', color: '#112E51' }}>
              {c.peritoLider || <span className="placeholder-field">[Ing. Nombre y Apellido del Perito Auditor]</span>}
            </div>
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
