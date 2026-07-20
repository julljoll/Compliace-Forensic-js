import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { useCMSStore } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import './Planillas.css';
import { downloadPlanillaZip } from './downloadPlanillaZip';
import PlanillaToolbar from '../../components/molecules/PlanillaToolbar';

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

    // Manejador interactivo para marcar casillas con una "X" al hacer clic
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
    ? logsDelCaso[logsDelCaso.length - 1].hashActual || 'N/A'
    : 'N/A';

  const hashInicial = logsDelCaso.length > 0
    ? logsDelCaso[0].hashActual || 'N/A'
    : 'N/A';

  const getActionLabel = (accion: string) => {
    const upper = accion.toUpperCase();
    if (upper.includes('CREAR') || upper.includes('REGISTRADA') || upper.includes('NUEVO')) return 'CREAR';
    if (upper.includes('ELIMINAR') || upper.includes('ELIMINADA')) return 'ELIMINAR';
    if (upper.includes('ACTUALIZ') || upper.includes('CAMBIA') || upper.includes('MODIFICAR')) return 'MODIFICAR';
    if (upper.includes('VERIFICAR') || upper.includes('CUMPLIMIENTO')) return 'VERIFICAR';
    if (upper.includes('IMPRIM') || upper.includes('PLANILLA')) return 'IMPRIMIR';
    return accion.substring(0, 12);
  };

  const fechaImpresion = new Date().toLocaleDateString('es-VE', {
    day: '2-digit', month: 'long', year: 'numeric',
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
    window.print();
  };

  return (
    <div className="planilla-container">
      {/* MUI Topbar Selector */}
      <Box
        className="no-print"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          mb: 3,
          backgroundColor: '#121412',
          border: '1px solid rgba(254, 207, 6, 0.3)',
          borderRadius: '8px',
        }}
      >
        <Box>
          <Typography component="h1" sx={{ fontSize: '16px', fontWeight: 700, color: '#00FF41', fontFamily: 'monospace' }}>
            ACTA DE AUDITORÍA & TRAZABILIDAD HASH SHA-256
          </Typography>
          <Typography sx={{ fontSize: '11px', color: '#AEAEB2' }}>
            Historial Inmutable de Transacciones Criptográficas Certificadas
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <TextField
            select
            size="small"
            value={casoId}
            onChange={(e) => router.push(e.target.value ? `/planillas/acta-auditoria-timeline?casoId=${e.target.value}` : '/planillas/acta-auditoria-timeline')}
            sx={{ minWidth: 240, '& .MuiInputBase-input': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
          >
            <MenuItem value="">Todos los Registros Auditados</MenuItem>
            {casos.map((cs) => (
              <MenuItem key={cs.id} value={cs.id}>
                {cs.numeroCaso} — {cs.titulo}
              </MenuItem>
            ))}
          </TextField>
          <Chip label="SHA256 INMUTABLE" size="small" sx={{ backgroundColor: 'rgba(0, 255, 65, 0.15)', color: '#00FF41', fontWeight: 700 }} />
        </Stack>
      </Box>

      <div className="page">
        {/* ─── ENCABEZADO ─── */}
        <header>
          <div className="logo-container">
            <div className="logo-branding">
              <img src="/logo.png" alt="SHA256.US Logo" className="logo-img" />
              <span className="logo-text">SHA256.US</span>
            </div>
            <span className="logo-subtext">Laboratorio de Informática Forense y Ciberseguridad</span>
            <span className="address-text">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quíbor, Municipio Jiménez del Estado Lara.</span>
          </div>
          <div className="acta-header">
            <h1 className="acta-title">Acta de Auditoría Forense — Timeline del Caso</h1>
            <div className="acta-nro">
              N° EXPEDIENTE: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>
                <span className="placeholder-field">{c.numeroCaso ? c.numeroCaso : '[EXPEDIENTE]'}</span>
              </span>
            </div>
          </div>
        </header>

        {/* ─── I. DATOS DEL CASO ─── */}
        <div className="section">
          <div className="section-title">I. Datos del Caso y Período de Auditoría</div>
          <div className="grid-container">
            <div className="form-group">
              <div className="label">Caso / Expediente</div>
              <div className="value" contentEditable suppressContentEditableWarning><span className="placeholder-field">{c.numeroCaso ? c.numeroCaso : '[N° Expediente]'}</span></div>
            </div>
            <div className="form-group">
              <div className="label">Título del Caso</div>
              <div className="value" contentEditable suppressContentEditableWarning><span className="placeholder-field">{c.titulo ? c.titulo : '[Título del Caso]'}</span></div>
            </div>
            <div className="form-group">
              <div className="label">Total de Eventos Registrados</div>
              <div className="value">{logsDelCaso.length} evento{logsDelCaso.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="form-group">
              <div className="label">Fecha de Impresión del Acta</div>
              <div className="value" contentEditable suppressContentEditableWarning>{fechaImpresion}</div>
            </div>
            {logsDelCaso.length > 0 && (
              <>
                <div className="form-group">
                  <div className="label">Primer Evento Registrado</div>
                  <div className="value">
                    {new Date(logsDelCaso[0].timestamp).toLocaleString('es-VE')}
                  </div>
                </div>
                <div className="form-group">
                  <div className="label">Último Evento Registrado</div>
                  <div className="value">
                    {new Date(logsDelCaso[logsDelCaso.length - 1].timestamp).toLocaleString('es-VE')}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ─── II. HASH DE INTEGRIDAD DE LA CADENA ─── */}
        <div className="section">
          <div className="section-title">II. Sellado Criptográfico de la Cadena SHA-256</div>
          <div className="legal-text">
            <strong>Resguardo de Integridad:</strong> La presente cadena de auditoría ha sido sellada criptográficamente mediante el algoritmo SHA-256 conforme a la norma <strong>ISO/IEC 27037:2012</strong> y al <strong>Manual Único de Cadena de Custodia de Evidencias (MUCC-2017)</strong>. La verificación de cualquier registro garantiza la inalterabilidad del historial completo.
            <div style={{ fontFamily: 'monospace', marginTop: '5px', fontSize: '8px', fontWeight: 'bold' }} contentEditable suppressContentEditableWarning>
              Hash SHA-256 Inicial: <span className="placeholder-field">{hashInicial.length > 20 ? `${hashInicial.substring(0, 32)}...${hashInicial.substring(hashInicial.length - 8)}` : hashInicial}</span><br />
              Hash SHA-256 Final (Cadena): <span className="placeholder-field">{hashFinalCadena.length > 20 ? `${hashFinalCadena.substring(0, 32)}...${hashFinalCadena.substring(hashFinalCadena.length - 8)}` : hashFinalCadena}</span>
            </div>
          </div>
        </div>

        {/* ─── III. TIMELINE DE EVENTOS ─── */}
        <div className="section">
          <div className="section-title">III. Timeline Cronológico de Eventos del Caso</div>
          {logsDelCaso.length === 0 ? (
            <div className="legal-text" style={{ textAlign: 'center', fontStyle: 'italic' }}>
              No se encontraron eventos de auditoría para este caso.
            </div>
          ) : (
            <table className="timeline-print-table">
              <thead>
                <tr>
                  <th style={{ width: '3%' }}>N°</th>
                  <th style={{ width: '16%' }}>Fecha y Hora</th>
                  <th style={{ width: '11%' }}>Acción</th>
                  <th style={{ width: '37%' }}>Detalle del Evento</th>
                  <th style={{ width: '13%' }}>Operador</th>
                  <th style={{ width: '20%' }}>Hash SHA-256</th>
                </tr>
              </thead>
              <tbody>
                {logsDelCaso.map((log, idx) => (
                  <tr key={log.id}>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '6.5px' }}>
                      {new Date(log.timestamp).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: '2-digit' })}{' '}
                      {new Date(log.timestamp).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '6.5px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>
                        {getActionLabel(log.accion)}
                      </span>
                    </td>
                    <td contentEditable suppressContentEditableWarning>{log.detalle}</td>
                    <td contentEditable suppressContentEditableWarning>{log.usuario}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '6px', wordBreak: 'break-all' }}>
                      {log.hashActual
                        ? `${log.hashActual.substring(0, 12)}...${log.hashActual.substring(log.hashActual.length - 6)}`
                        : '—'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ─── IV. DECLARACIÓN DE INTEGRIDAD ─── */}
        <div className="section">
          <div className="section-title">IV. Declaración de Integridad del Log</div>
          <div className="legal-text" style={{ fontSize: '7.5px' }}>
            <p>El presente timeline de auditoría ha sido generado automáticamente por el Sistema de Gestión de Cumplimiento SHA256.US. Cada registro está vinculado criptográficamente al anterior mediante el algoritmo SHA-256, formando una cadena de bloques inmutable. Cualquier alteración posterior de los registros resultaría en una discrepancia del hash verificable que invalidaría la cadena de custodia conforme al <strong>Art. 187 del Código Orgánico Procesal Penal (COPP)</strong>.</p>
          </div>
        </div>

        {/* ─── V. FIRMAS ─── */}
        <div className="signature-section" style={{ gap: '14mm' }}>
          <div className="sig-detail-card">
            <div className="sig-detail-label">PERITO FORENSE RESPONSABLE</div>
            <div className="sig-line" />
            <div className="sig-line-label">Firma</div>
            <div className="sig-field">
              Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito Forense]</span>}</span>
            </div>
            <div className="sig-field">
              C.I.: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Cédula de Identidad]</span></span>
            </div>
            <div className="fingerprint-row">
              <div className="thumb-wrapper">
                <div className="thumb-box" />
                <span className="thumb-label">PULGAR DER.</span>
              </div>
              <div className="thumb-wrapper">
                <div className="thumb-box" />
                <span className="thumb-label">PULGAR IZQ.</span>
              </div>
            </div>
          </div>
          <div className="sig-detail-card">
            <div className="sig-detail-label">SUPERVISOR DE COMPLIANCE</div>
            <div className="sig-line" />
            <div className="sig-line-label">Firma del Supervisor</div>
            <div className="sig-field">
              Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Nombre del Supervisor]</span></span>
            </div>
            <div className="sig-field">
              Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Compliance Officer / Coordinador]</span></span>
            </div>
            <div className="fingerprint-row">
              <div className="thumb-wrapper">
                <div className="thumb-box" />
                <span className="thumb-label">PULGAR DER.</span>
              </div>
              <div className="thumb-wrapper">
                <div className="thumb-box" />
                <span className="thumb-label">PULGAR IZQ.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          Acta generada automáticamente bajo los estándares ISO/IEC 27037:2012 y el Manual Único de Cadena de Custodia de Evidencias (MUCC-2017)<br />
          SHA256 Forensic Lab — Tecnología al servicio de la justicia | Inmutabilidad criptográfica garantizada por SHA-256 Chain
        </div>
      </div>

      <PlanillaToolbar
        onPrint={handlePrint}
        onDownloadZip={() => downloadPlanillaZip(`AuditoriaTimeline_${c.numeroCaso || 'caso'}`, 'Acta de Auditoría e Inmutabilidad de Línea de Tiempo')}
        tituloDocumento="Acta de Auditoría Forense — Timeline"
        camposRequeridos={camposRequeridos}
        casoId={casoId}
      />
    </div>
  );
};

export default ActaAuditoriaTimelinePage;
