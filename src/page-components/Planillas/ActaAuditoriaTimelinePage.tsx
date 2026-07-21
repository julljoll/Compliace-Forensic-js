'use client';

import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { useCMSStore } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import './Planillas.css';
import PlanillaDocumentViewer from '../../components/organisms/Planillas/PlanillaDocumentViewer';

const ActaAuditoriaTimelinePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const storeLogs = useAuditStore(state => state.logs);
  const loadStoreLogs = useAuditStore(state => state.loadLogs);

  const handleCaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value ? `/planillas/acta-auditoria-timeline?casoId=${e.target.value}` : '/planillas/acta-auditoria-timeline');
  };

  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadStoreLogs();
  }, [loadStoreLogs]);

  const SESSION_ACTIONS = new Set(['INICIO_SESION', 'SISTEMA_INICIADO', 'SESION_CERRADA']);

  const logsDelCaso = useMemo(() => {
    return storeLogs
      .filter(log => {
        if (SESSION_ACTIONS.has(log.accion)) return false;
        return !casoId || log.casoId === casoId;
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [storeLogs, casoId]);

  const hashFinalCadena = logsDelCaso.length > 0 
    ? logsDelCaso[logsDelCaso.length - 1].hashActual 
    : 'GENESIS_HASH_0000000000000000000000000000000000000000000000000000000000000000';

  const fechaGeneracion = new Date().toLocaleDateString('es-VE', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const fallbackCaso = {
    numeroCaso: '',
    titulo: '',
    peritoLider: '',
  };

  const c = caso || fallbackCaso;

  return (
    <div className="planilla-container">
      {/* SELECTOR DE CASO (NO IMPRIMIBLE) */}
      <Box className="no-print" sx={{ width: '100%', maxWidth: '216mm', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <label htmlFor="caso-selector" style={{ fontSize: '12px', fontWeight: '600', color: '#FECF06' }}>
          Expediente:
        </label>
        <select
          id="caso-selector"
          value={casoId}
          onChange={handleCaseChange}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(254, 207, 6, 0.4)',
            backgroundColor: '#2A2100',
            color: '#FFFFFF',
            fontSize: '12px',
            outline: 'none',
            minWidth: '240px',
            cursor: 'pointer',
          }}
        >
          <option value="">-- Todos los registros globales --</option>
          {casos.map(el => (
            <option key={el.id} value={el.id}>
              {el.numeroCaso || 'Sin Nro'} - {el.titulo}
            </option>
          ))}
        </select>
      </Box>

      <PlanillaDocumentViewer
        title={`Acta de Auditoría y Hash Chain — Caso #${c.numeroCaso || 'GLOBAL'}`}
        filenamePrefix={`Acta_Auditoria_${c.numeroCaso || 'EXP'}`}
      >
        <div className="page">
          {/* ENCABEZADO */}
          <header>
            <div className="logo-container">
              <div className="logo-branding">
                <img src="/logo.png" alt="SHA256.US Logo" className="logo-img" />
                <span className="logo-text">SHA256.US</span>
              </div>
              <span className="logo-subtext">Laboratorio de Informática Forense & Ciberseguridad</span>
              <span className="address-text">
                Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Municipio Jiménez del Estado Lara.
              </span>
            </div>

            <div className="acta-header">
              <h1 className="acta-title">ACTA DE TRAZABILIDAD Y CADENA DE CUSTODIA DIGITAL</h1>
              <div className="acta-subtitle">CERTIFICACIÓN DE REGISTROS DE AUDITORÍA CRIPTOGRÁFICA INMUTABLE</div>
              <div className="acta-nro">
                N° EXPEDIENTE: <span className="box-inline" style={{ minWidth: '140px', fontWeight: 'bold' }}>{c.numeroCaso || '[EXPEDIENTE]'}</span>
              </div>
            </div>
          </header>

          {/* DATOS DEL EXPEDIENTE */}
          <div className="section">
            <div className="section-title">I. DATOS DE IDENTIFICACIÓN DEL CASO AUDITADO</div>
            <table className="tabla-datos">
              <tbody>
                <tr>
                  <td style={{ width: '30%', fontWeight: 'bold' }}>N° Expediente / Caso:</td>
                  <td style={{ fontWeight: 'bold' }}>{c.numeroCaso || 'GENERAL / GLOBAL'}</td>
                </tr>
                <tr>
                  <td>Título del Expediente:</td>
                  <td>{c.titulo || 'Múltiples Casos Auditados'}</td>
                </tr>
                <tr>
                  <td>Perito Responsable:</td>
                  <td>{c.peritoLider || '—'}</td>
                </tr>
                <tr>
                  <td>Fecha de Emisión del Acta:</td>
                  <td>{fechaGeneracion}</td>
                </tr>
                <tr>
                  <td>Total de Eventos Auditados:</td>
                  <td style={{ fontWeight: 'bold' }}>{logsDelCaso.length} Eventos Registrados</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SECCIÓN II: RESUMEN Y SELLO DE CADENA */}
          <div className="section">
            <div className="section-title">II. CERTIFICADO DE INMUTABILIDAD Y SELLO CRIPTOGRÁFICO SHA-256</div>
            <p className="texto-legal" style={{ marginBottom: '10px' }}>
              Se hace constar que los siguientes registros representan el historial íntegro, secuencial e inalterable de las operaciones ejecutadas dentro del sistema <strong>SHA256.US Compliance CMS</strong>. Cada evento fue firmado criptográficamente en un esquema de <strong>Hash Chain SHA-256 (Append-Only)</strong> conforme al estándar ISO/IEC 27037:2012 y el Manual Único de Cadena de Custodia de Evidencias Físicas (MUCCEF-2017).
            </p>
            
            <div style={{
              background: '#f8f9fa',
              border: '1px solid #1d1d1f',
              padding: '10px 14px',
              borderRadius: '4px',
              margin: '10px 0 16px 0',
              fontFamily: 'monospace',
              fontSize: '9.5px',
              lineHeight: '1.4'
            }}>
              <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '4px', marginBottom: '4px', color: '#1d1d1f' }}>
                SELLO FINAL DE LA CADENA DE CUSTODIA (SHA-256):
              </div>
              <div style={{ wordBreak: 'break-all', color: '#000', fontWeight: 'bold' }}>
                {hashFinalCadena}
              </div>
            </div>
          </div>

          {/* SECCIÓN III: TIMELINE DE EVENTOS */}
          <div className="section">
            <div className="section-title">III. LÍNEA DE TIEMPO Y REGISTRO DE TRANSACCIONES AUDITADAS</div>
            
            {logsDelCaso.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontStyle: 'italic', fontSize: '11px', border: '1px dashed #ccc' }}>
                No se encontraron registros de auditoría asociados a este expediente.
              </div>
            ) : (
              <table className="tabla-datos" style={{ fontSize: '9px' }}>
                <thead>
                  <tr style={{ background: '#f2f2f7', textAlign: 'left' }}>
                    <th style={{ width: '40px', padding: '6px' }}>#</th>
                    <th style={{ width: '110px', padding: '6px' }}>Fecha / Hora</th>
                    <th style={{ width: '90px', padding: '6px' }}>Usuario</th>
                    <th style={{ width: '100px', padding: '6px' }}>Acción</th>
                    <th style={{ padding: '6px' }}>Detalles de la Operación</th>
                    <th style={{ width: '120px', padding: '6px', fontFamily: 'monospace' }}>Hash Evento (SHA-256)</th>
                  </tr>
                </thead>
                <tbody>
                  {logsDelCaso.map((log, index) => {
                    const fechaStr = new Date(log.timestamp).toLocaleString('es-VE', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', second: '2-digit'
                    });
                    return (
                      <tr key={log.id || index} style={{ borderBottom: '1px solid #e5e5ea' }}>
                        <td style={{ fontWeight: 'bold', textAlign: 'center' }}>{index + 1}</td>
                        <td>{fechaStr}</td>
                        <td><strong>{log.usuario || 'Sistema'}</strong></td>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            background: log.nivel === 'error' ? '#ffeeee' : log.nivel === 'warning' ? '#fff8e6' : '#eef9ff',
                            color: log.nivel === 'error' ? '#cc0000' : log.nivel === 'warning' ? '#b37400' : '#0066cc',
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}>
                            {log.accion}
                          </span>
                        </td>
                        <td>{log.detalle}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '8px', wordBreak: 'break-all' }}>
                          {log.hashActual ? log.hashActual.substring(0, 16) + '...' : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* SECCIÓN IV: FIRMAS Y VALIDACIÓN PERICIAL */}
          <div className="section" style={{ pageBreakInside: 'avoid', marginTop: '30px' }}>
            <div className="section-title">IV. DECLARACIÓN Y FIRMAS DE CERTIFICACIÓN PERICIAL</div>
            <p className="texto-legal" style={{ marginBottom: '40px' }}>
              El presente documento certifica la validez técnica de los datos expuestos. Cualquier alteración física o digital invalidará el sello de verificación SHA-256. Se firma en constancia a los efectos de su presentación ante la representación fiscal u organismos judiciales pertinentes.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1px solid #1d1d1f', height: '40px', marginBottom: '6px' }} />
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{c.peritoLider || '__________________________'}</div>
                <div style={{ fontSize: '9px', color: '#515154' }}>PERITO INFORMÁTICO FORENSE / RESPONSABLE</div>
                <div style={{ fontSize: '8px', color: '#8e8e93' }}>Firma y Sello Digital</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1px solid #1d1d1f', height: '40px', marginBottom: '6px' }} />
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>AUDITORÍA DE CUMPLIMIENTO / COMPLIANCE</div>
                <div style={{ fontSize: '9px', color: '#515154' }}>VALORACIÓN DE INTEGRIDAD SHA-256</div>
                <div style={{ fontSize: '8px', color: '#8e8e93' }}>Certificación Conforme</div>
              </div>
            </div>
          </div>

          {/* Pie de página institucional */}
          <footer style={{ marginTop: '30px', borderTop: '1px solid #d2d2d7', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#8e8e93' }}>
            <span>SHA256.US — Laboratorio de Informática Forense y Ciberseguridad</span>
            <span>Sello Inmutable SHA-256 · Impreso el {new Date().toLocaleDateString('es-VE')}</span>
          </footer>
        </div>
      </PlanillaDocumentViewer>
    </div>
  );
};

export default ActaAuditoriaTimelinePage;
