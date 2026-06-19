import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCMSStore } from '../../store/cmsStore';
import { getTipoProyectoConfig } from '../../data/tiposProyecto';
import type { CasoCMS, StepState } from '../../store/cmsStore';
import '../../pages/Planillas/Planillas.css';

// ── Helpers ──────────────────────────────────────────────────────────────────

const ESTADO_PASO: Record<string, { label: string; symbol: string }> = {
  completado:  { label: 'Completado',  symbol: '✓' },
  en_progreso: { label: 'En Progreso', symbol: '◉' },
  disponible:  { label: 'Pendiente',   symbol: '○' },
  bloqueado:   { label: 'Bloqueado',   symbol: '✗' },
};

const TIPO_LABEL: Record<string, string> = {
  forense_whatsapp:  'Análisis Forense Móvil Android (WhatsApp)',
  forense_email:     'Análisis Forense de Correo Electrónico',
  forense_discoduro: 'Análisis Forense de Computadora / Disco Duro',
};

function formatFecha(f?: string) {
  if (!f) return '—';
  try {
    return new Date(f).toLocaleDateString('es-VE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return f;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TimelineCompliancePage() {
  const [params] = useSearchParams();
  const casoId   = params.get('casoId');
  const { casos } = useCMSStore();

  const caso: CasoCMS | undefined = useMemo(
    () => (casoId ? casos.find(c => c.id === casoId) : undefined),
    [casoId, casos]
  );

  if (!caso) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: '18px', fontWeight: 700 }}>Expediente no encontrado</p>
        <p style={{ color: '#888', marginTop: '8px' }}>
          Use el módulo de Auditoría para seleccionar un caso e imprimir su línea de tiempo.
        </p>
      </div>
    );
  }

  const config = getTipoProyectoConfig(caso.tipoProyecto);
  const steps  = caso.steps || {};

  const now = new Date().toLocaleDateString('es-VE', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  // Compute per-phase stats
  const faseStats = config.fases.map(fase => {
    const pasos = config.pasos.filter(p => fase.pasoIds.includes(p.id));
    const completados = pasos.filter(p => steps[p.id]?.estado === 'completado').length;
    return { ...fase, pasos, completados, total: pasos.length };
  });

  const totalPasos       = config.pasos.length;
  const totalCompletados = config.pasos.filter(p => steps[p.id]?.estado === 'completado').length;
  const pct              = totalPasos > 0 ? Math.round((totalCompletados / totalPasos) * 100) : 0;

  return (
    <div className="planilla-container print-light">

      {/* ── TOOLBAR (solo en pantalla, no se imprime) ── */}
      <div className="no-print" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 24px',
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: '#F2F2F7', border: '1px solid #D1D1D6', borderRadius: '8px',
            padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          ← Volver
        </button>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E' }}>
            Línea de Tiempo — {caso.numeroCaso}
          </span>
          <span style={{ fontSize: '12px', color: '#8E8E93', marginLeft: '8px' }}>
            {caso.titulo}
          </span>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            background: '#0071E3', color: '#fff',
            border: 'none', borderRadius: '8px',
            padding: '7px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          🖨 Imprimir
        </button>
      </div>

      {/* ── CONTENIDO IMPRIMIBLE ── */}
      <div style={{
        maxWidth: '780px', margin: '0 auto',
        paddingTop: '70px',
        fontFamily: '"SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        color: '#1C1C1E',
      }}>

        {/* Encabezado institucional — membrete igual a las demás planillas */}
        <header style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          borderBottom: '2px solid #1C1C1E', paddingBottom: '14px', marginBottom: '20px',
          gap: '16px',
        }}>
          {/* Logo + nombre organismo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg"
                alt="SHA256.US Logo"
                style={{ width: '38px', height: '38px', flexShrink: 0 }}
              />
              <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', color: '#1C1C1E' }}>
                SHA256.US
              </span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#555', marginTop: '2px' }}>
              Laboratorio de Informática Forense y Ciberseguridad
            </span>
            <span style={{ fontSize: '10px', color: '#888', maxWidth: '340px', lineHeight: 1.4 }}>
              Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso,<br />
              oficina N° 8, Quibor, Municipio Jiménez del Estado Lara.
            </span>
          </div>

          {/* Título del acta */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', margin: 0 }}>
              República Bolivariana de Venezuela<br />Ministerio Público
            </p>
            <h1 style={{ fontSize: '15px', fontWeight: 800, margin: '6px 0 4px', letterSpacing: '-0.02em', color: '#1C1C1E' }}>
              LÍNEA DE TIEMPO DEL PROCESO<br />FORENSE — COMPLIANCE
            </h1>
            <p style={{ fontSize: '10px', color: '#555', margin: 0 }}>
              SHA-256 Chain · MUCC-2017 · ISO/IEC 27037<br />
              {now}
            </p>
          </div>
        </header>

        {/* Datos del expediente */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12px' }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700, padding: '5px 8px', width: '150px', verticalAlign: 'top', color: '#555' }}>N° Expediente:</td>
              <td style={{ padding: '5px 8px', fontWeight: 700 }}>{caso.numeroCaso}</td>
              <td style={{ fontWeight: 700, padding: '5px 8px', width: '140px', color: '#555' }}>Fecha Inicio:</td>
              <td style={{ padding: '5px 8px' }}>{formatFecha(caso.fechaCreacion)}</td>
            </tr>
            <tr style={{ background: '#F2F2F7' }}>
              <td style={{ fontWeight: 700, padding: '5px 8px', color: '#555' }}>Tipo de Análisis:</td>
              <td colSpan={3} style={{ padding: '5px 8px' }}>{TIPO_LABEL[caso.tipoProyecto] || caso.tipoProyecto}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, padding: '5px 8px', color: '#555' }}>Caso / Título:</td>
              <td colSpan={3} style={{ padding: '5px 8px' }}>{caso.titulo}</td>
            </tr>
            <tr style={{ background: '#F2F2F7' }}>
              <td style={{ fontWeight: 700, padding: '5px 8px', color: '#555' }}>Perito Líder:</td>
              <td style={{ padding: '5px 8px' }}>{caso.peritoLider || '—'}</td>
              <td style={{ fontWeight: 700, padding: '5px 8px', color: '#555' }}>Fiscal:</td>
              <td style={{ padding: '5px 8px' }}>{caso.fiscal || '—'}</td>
            </tr>
            {caso.despachoFiscal && (
              <tr>
                <td style={{ fontWeight: 700, padding: '5px 8px', color: '#555' }}>Despacho Fiscal:</td>
                <td colSpan={3} style={{ padding: '5px 8px' }}>{caso.despachoFiscal}</td>
              </tr>
            )}
            {caso.expediente && (
              <tr style={{ background: '#F2F2F7' }}>
                <td style={{ fontWeight: 700, padding: '5px 8px', color: '#555' }}>N° PRCC/Exp:</td>
                <td colSpan={3} style={{ padding: '5px 8px' }}>{caso.expediente}</td>
              </tr>
            )}
            <tr>
              <td style={{ fontWeight: 700, padding: '5px 8px', color: '#555' }}>Estado General:</td>
              <td style={{ padding: '5px 8px', fontWeight: 700, textTransform: 'capitalize' }}>{caso.estado.replace('_', ' ')}</td>
              <td style={{ fontWeight: 700, padding: '5px 8px', color: '#555' }}>Última Actualización:</td>
              <td style={{ padding: '5px 8px' }}>{formatFecha(caso.fechaUltimaActualizacion)}</td>
            </tr>
          </tbody>
        </table>

        {/* Barra de progreso global */}
        <div style={{
          background: '#F2F2F7', borderRadius: '10px', padding: '14px 18px',
          marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Avance Global del Proceso</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: pct >= 80 ? '#34C759' : pct >= 40 ? '#FF9500' : '#0071E3' }}>
                {totalCompletados} / {totalPasos} pasos completados ({pct}%)
              </span>
            </div>
            <div style={{ background: '#D1D1D6', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                width: `${pct}%`, height: '100%', borderRadius: '4px',
                background: pct >= 80 ? '#34C759' : pct >= 40 ? '#FF9500' : '#0071E3',
              }} />
            </div>
          </div>
        </div>

        {/* ── FASES Y PASOS (Línea de Tiempo) ── */}
        {faseStats.map((fase, faseIdx) => (
          <div key={fase.nombre} style={{ marginBottom: '28px' }}>

            {/* Encabezado de fase */}
            <div style={{
              background: '#1C1C1E', color: '#fff',
              padding: '8px 14px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>
                {String(faseIdx + 1).padStart(2, '0')} — {fase.nombre}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.75 }}>
                {fase.completados}/{fase.total} completados
              </span>
            </div>

            {/* Pasos de la fase */}
            {fase.pasos.map((paso, pasoIdx) => {
              const stepState: StepState | undefined = steps[paso.id];
              const estado = stepState?.estado || 'disponible';
              const estadoMeta = ESTADO_PASO[estado] || ESTADO_PASO.disponible;
              const isLast = pasoIdx === fase.pasos.length - 1;

              return (
                <div key={paso.id} style={{ display: 'flex', gap: '12px', paddingBottom: isLast ? '0' : '0' }}>

                  {/* Timeline column */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0 }}>
                    {/* Circle */}
                    <div style={{
                      width: '28px', height: '28px',
                      borderRadius: '50%',
                      border: `2px solid ${estado === 'completado' ? '#34C759' : estado === 'en_progreso' ? '#FF9500' : estado === 'bloqueado' ? '#FF3B30' : '#D1D1D6'}`,
                      background: estado === 'completado' ? '#34C759' : estado === 'en_progreso' ? 'rgba(255,149,0,0.12)' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 800,
                      color: estado === 'completado' ? '#fff' : estado === 'bloqueado' ? '#FF3B30' : '#555',
                      flexShrink: 0, zIndex: 1,
                    }}>
                      {estado === 'completado' ? '✓' : paso.num}
                    </div>
                    {/* Vertical line */}
                    {!isLast && (
                      <div style={{ width: '2px', flex: 1, background: '#E5E5EA', minHeight: '20px', marginTop: '2px' }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{
                    flex: 1, borderBottom: isLast ? 'none' : '1px solid #F2F2F7',
                    paddingBottom: '14px', marginBottom: isLast ? '0' : '0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1C1C1E' }}>
                          Paso {paso.num}: {paso.titulo}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#636366' }}>
                          {paso.action}
                        </p>
                      </div>
                      <span style={{
                        flexShrink: 0, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                        padding: '2px 8px', borderRadius: '20px',
                        background: estado === 'completado' ? 'rgba(52,199,89,0.1)' : estado === 'en_progreso' ? 'rgba(255,149,0,0.1)' : estado === 'bloqueado' ? 'rgba(255,59,48,0.1)' : '#F2F2F7',
                        color: estado === 'completado' ? '#34C759' : estado === 'en_progreso' ? '#FF9500' : estado === 'bloqueado' ? '#FF3B30' : '#8E8E93',
                        border: `1px solid ${estado === 'completado' ? 'rgba(52,199,89,0.25)' : estado === 'en_progreso' ? 'rgba(255,149,0,0.25)' : estado === 'bloqueado' ? 'rgba(255,59,48,0.25)' : '#D1D1D6'}`,
                      }}>
                        {estadoMeta.label}
                      </span>
                    </div>

                    {/* Step metadata (dates, responsable) */}
                    {(stepState?.fechaInicio || stepState?.fechaCompletado || stepState?.responsable) && (
                      <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '10.5px', color: '#636366', flexWrap: 'wrap' }}>
                        {stepState.fechaInicio && (
                          <span>📅 Inicio: <strong>{formatFecha(stepState.fechaInicio)}</strong></span>
                        )}
                        {stepState.fechaCompletado && (
                          <span>✅ Completado: <strong>{formatFecha(stepState.fechaCompletado)}</strong></span>
                        )}
                        {stepState.responsable && (
                          <span>👤 Responsable: <strong>{stepState.responsable}</strong></span>
                        )}
                      </div>
                    )}

                    {/* Observaciones */}
                    {stepState?.observaciones && (
                      <p style={{
                        margin: '6px 0 0', fontSize: '11px', color: '#3C3C43',
                        fontStyle: 'italic', paddingLeft: '10px',
                        borderLeft: '2px solid #D1D1D6',
                      }}>
                        {stepState.observaciones}
                      </p>
                    )}

                    {/* Normativas */}
                    {paso.normativas.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                        {paso.normativas.map((n, ni) => (
                          <span key={ni} style={{
                            fontSize: '9px', fontWeight: 700,
                            padding: '1px 6px', borderRadius: '3px',
                            background: '#F2F2F7', color: '#636366',
                            border: '1px solid #D1D1D6',
                          }}>
                            {n.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Docs required */}
                    {paso.docs.length > 0 && (
                      <p style={{ margin: '5px 0 0', fontSize: '10.5px', color: '#636366' }}>
                        <strong>Documentos:</strong> {paso.docs.join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* ── Firma y cierre ── */}
        <div style={{
          borderTop: '2px solid #1C1C1E', marginTop: '32px', paddingTop: '20px',
        }}>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #1C1C1E', marginBottom: '6px', marginTop: '40px' }} />
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 700 }}>{caso.peritoLider || 'Perito Forense'}</p>
              <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#636366' }}>Perito Forense Líder</p>
            </div>
            {caso.compliance && (
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ borderTop: '1px solid #1C1C1E', marginBottom: '6px', marginTop: '40px' }} />
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 700 }}>{caso.compliance}</p>
                <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#636366' }}>Compliance Officer</p>
              </div>
            )}
            {caso.fiscal && (
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ borderTop: '1px solid #1C1C1E', marginBottom: '6px', marginTop: '40px' }} />
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 700 }}>{caso.fiscal}</p>
                <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#636366' }}>Fiscal del Ministerio Público</p>
              </div>
            )}
          </div>
          <p style={{ textAlign: 'center', fontSize: '10px', color: '#8E8E93', marginTop: '20px' }}>
            Documento generado por SHA256.US · MUCC-2017 · ISO/IEC 27037 · {now}
          </p>
        </div>

      </div>
    </div>
  );
}
