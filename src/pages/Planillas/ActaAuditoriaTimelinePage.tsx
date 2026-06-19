import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCMSStore } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import './Planillas.css';

const ActaAuditoriaTimelinePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const storeLogs = useAuditStore(state => state.logs);
  const loadStoreLogs = useAuditStore(state => state.loadLogs);

  const handleCaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams(e.target.value ? { casoId: e.target.value } : {});
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

  const handlePrint = () => {
    const camposRequeridos = [
      { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
      { valor: caso?.titulo, nombre: 'Título del Caso' },
      { valor: caso?.peritoLider, nombre: 'Nombre del Perito Responsable' },
    ];
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
            {casos.map(c => (
              <option key={c.id} value={c.id}>
                {c.numeroCaso || 'Sin Nro'} - {c.titulo}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handlePrint} className="print-button" style={{ margin: 0, padding: '6px 16px', fontSize: '13px' }}>
          🖨️ Imprimir Timeline de Auditoría
        </button>
      </div>

      <div className="page">
        {/* ─── ENCABEZADO ─── */}
        <header>
          <div className="logo-container">
            <div className="logo-branding">
              <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="SHA256.US Logo" className="logo-img" />
              <span className="logo-text">SHA256.US</span>
            </div>
            <span className="logo-subtext">Laboratorio de Informática Forense y Ciberseguridad</span>
            <span className="address-text">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quibor, Municipio Jiménez del Estado Lara.</span>
          </div>
          <div className="acta-header">
            <h1 className="acta-title">Acta de Auditoría Forense — Timeline del Caso</h1>
            <div className="acta-nro">
              N° EXPEDIENTE: <span className="box-inline" style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>
                <span className="placeholder-field">{caso?.numeroCaso || '[EXPEDIENTE]'}</span>
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
              <div className="value"><span className="placeholder-field">{caso?.numeroCaso || '[N° Expediente]'}</span></div>
            </div>
            <div className="form-group">
              <div className="label">Título del Caso</div>
              <div className="value"><span className="placeholder-field">{caso?.titulo || '[Título del Caso]'}</span></div>
            </div>
            <div className="form-group">
              <div className="label">Total de Eventos Registrados</div>
              <div className="value">{logsDelCaso.length} evento{logsDelCaso.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="form-group">
              <div className="label">Fecha de Impresión del Acta</div>
              <div className="value">{fechaImpresion}</div>
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
            <div style={{ fontFamily: 'monospace', marginTop: '5px', fontSize: '8px', fontWeight: 'bold' }}>
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
                    <td>{log.detalle}</td>
                    <td>{log.usuario}</td>
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
              Nombre: <span className="sig-underline">{caso?.peritoLider ? caso.peritoLider : <span className="placeholder-field">[Nombre del Perito Forense]</span>}</span>
            </div>
            <div className="sig-field">
              C.I.: <span className="sig-underline"><span className="placeholder-field">[Cédula de Identidad]</span></span>
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
              Nombre: <span className="sig-underline"><span className="placeholder-field">[Nombre del Supervisor]</span></span>
            </div>
            <div className="sig-field">
              Cargo: <span className="sig-underline"><span className="placeholder-field">[Compliance Officer / Coordinador]</span></span>
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

      <div className="no-print" style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>
        <button onClick={handlePrint} className="print-button">
          🖨️ Imprimir Timeline de Auditoría (Tamaño Oficio)
        </button>
      </div>
    </div>
  );
};

export default ActaAuditoriaTimelinePage;
