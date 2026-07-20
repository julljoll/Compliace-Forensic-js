import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PrintIcon from '@mui/icons-material/Print';
import { useCMSStore } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import './Planillas.css';

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

    const handleCheckboxClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const box = target.closest('.check-item .box, .check-item');
      if (box) {
        const spanBox = box.classList.contains('box') ? box : box.querySelector('.box');
        if (spanBox) {
          if (spanBox.textContent === 'X') {
            spanBox.textContent = '';
          } else {
            spanBox.textContent = 'X';
          }
        }
      }
    };

    document.addEventListener('click', handleCheckboxClick);
    return () => {
      document.removeEventListener('click', handleCheckboxClick);
    };
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

  const camposRequeridos = [
    { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
    { valor: caso?.titulo, nombre: 'Título del Caso' },
    { valor: caso?.peritoLider, nombre: 'Nombre del Perito Responsable' },
  ];

  const handlePrint = () => {
    const faltantes = camposRequeridos.filter(f => !f.valor || f.valor === 'N/A' || !f.valor.trim());
    if (faltantes.length > 0) {
      const confirmar = window.confirm(
        `Campos incompletos en el expediente:\n${faltantes.map(f => `• ${f.nombre}`).join('\n')}\n\n¿Desea proceder con la impresión para llenarla a mano?`
      );
      if (!confirmar) return;
    }
    const container = document.querySelector('.planilla-container');
    if (container) {
      container.classList.add('modo-vista-previa');
    }
    window.print();
  };

  return (
    <div className="planilla-container">
      {/* ─── SELECTOR DE CASO (NO PRINT) ─── */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '16px 24px',
        background: 'var(--co-surface-1)',
        borderBottom: '1px solid var(--apple-border)',
        width: '100%',
        maxWidth: '215mm',
        margin: '0 auto 20px auto',
        borderRadius: '12px',
        boxShadow: 'var(--apple-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="caso-selector" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--apple-text)' }}>
            Seleccionar Expediente:
          </label>
          <select
            id="caso-selector"
            value={casoId}
            onChange={handleCaseChange}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid var(--apple-border)',
              backgroundColor: 'var(--co-surface-2)',
              color: 'var(--apple-text)',
              fontSize: '13px',
              outline: 'none',
              minWidth: '220px',
              cursor: 'pointer'
            }}
          >
            <option value="">-- Seleccione un caso/expediente --</option>
            {casos.map(el => (
              <option key={el.id} value={el.id}>
                {el.numeroCaso || 'Sin Nro'} - {el.titulo}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handlePrint} className="print-button" style={{ margin: 0, padding: '6px 16px', fontSize: '12px', borderRadius: '8px' }}>
          🖨️ Imprimir Timeline
        </button>
      </div>

      <div className="page">
        {/* ─── ENCABEZADO ─── */}
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
              N° EXPEDIENTE: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '140px', fontWeight: 'bold' }}>{c.numeroCaso || '[EXPEDIENTE]'}</span>
            </div>
          </div>
        </header>

        {/* ─── DATOS DEL EXPEDIENTE ─── */}
        <div className="section">
          <div className="section-title">I. DATOS DE IDENTIFICACIÓN DEL CASO AUDITADO</div>
          <table className="tabla-datos">
            <tbody>
              <tr>
                <td style={{ width: '30%', fontWeight: 'bold' }}>N° Expediente / Caso:</td>
                <td contentEditable suppressContentEditableWarning style={{ fontWeight: 'bold' }}>{c.numeroCaso || 'GENERAL / GLOBAL'}</td>
              </tr>
              <tr>
                <td>Título del Expediente:</td>
                <td contentEditable suppressContentEditableWarning>{c.titulo || 'Múltiples Casos Auditados'}</td>
              </tr>
              <tr>
                <td>Perito Responsable:</td>
                <td contentEditable suppressContentEditableWarning>{c.peritoLider || '—'}</td>
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

        {/* ─── SECCIÓN II: RESUMEN Y SELLO DE CADENA ─── */}
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

        {/* ─── SECCIÓN III: TIMELINE DE EVENTOS ─── */}
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

        {/* ─── SECCIÓN IV: FIRMAS Y VALIDACIÓN PERICIAL ─── */}
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

      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            backgroundColor: '#FECF06',
            color: '#000000',
            fontWeight: 700,
            fontSize: '13px',
            px: 4,
            py: 1.2,
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(254, 207, 6, 0.35)',
            '&:hover': {
              backgroundColor: '#e0b700',
              boxShadow: '0 6px 20px rgba(254, 207, 6, 0.5)',
            },
          }}
        >
          IMPRIMIR PLANILLA COMPLETA (TAMAÑO OFICIO)
        </Button>
      </Box>
    </div>
  );
};

export default ActaAuditoriaTimelinePage;
