import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import { getTipoProyectoConfig } from '../../data/tiposProyecto';
import type { CasoCMS, StepState } from '../../store/cmsStore';
import './Planillas.css';
import { downloadPlanillaZip } from './downloadPlanillaZip';
import PlanillaToolbar from '../../components/molecules/PlanillaToolbar';

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

export default function TimelineCompliancePage() {
  const params = useSearchParams();
  const casoId   = params.get('casoId');
  const { casos } = useCMSStore();

  const caso: CasoCMS | undefined = useMemo(
    () => (casoId ? casos.find(c => c.id === casoId) : undefined),
    [casoId, casos]
  );

  useEffect(() => {
    window.scrollTo(0, 0);

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
  }, []);

  if (!caso) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Ubuntu', sans-serif" }}>
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

  const faseStats = config.fases.map(fase => {
    const pasos = config.pasos.filter(p => fase.pasoIds.includes(p.id));
    const completados = pasos.filter(p => steps[p.id]?.estado === 'completado').length;
    return { ...fase, pasos, completados, total: pasos.length };
  });

  const totalPasos       = config.pasos.length;
  const totalCompletados = config.pasos.filter(p => steps[p.id]?.estado === 'completado').length;
  const pct              = totalPasos > 0 ? Math.round((totalCompletados / totalPasos) * 100) : 0;

  const camposRequeridos = [
    { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
    { valor: caso?.titulo, nombre: 'Título del Caso' },
    { valor: caso?.peritoLider, nombre: 'Perito Forense Líder' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="planilla-container">
      <div className="page">
        {/* Encabezado institucional — membrete igual a las demás planillas */}
        <header>
          <div className="logo-container">
            <div className="logo-branding">
              <img
                src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg"
                alt="SHA256.US Logo"
                className="logo-img"
              />
              <span className="logo-text">SHA256.US</span>
            </div>
            <span className="logo-subtext">
              Laboratorio de Informática Forense y Ciberseguridad
            </span>
            <span className="address-text">
              Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Municipio Jiménez del Estado Lara.
            </span>
          </div>

          {/* Título del acta */}
          <div className="acta-header">
            <h1 className="acta-title">Línea de Tiempo del Proceso Forense — Compliance</h1>
            <div className="acta-nro">
              N° EXPEDIENTE: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{caso.numeroCaso ? caso.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}</span>
            </div>
          </div>
        </header>

        {/* Datos del expediente */}
        <div className="section">
          <div className="section-title">I. Datos e Identificación de la Investigación</div>
          <table className="evidence-table" style={{ width: '100%', marginBottom: '20px' }}>
            <tbody>
              <tr>
                <td>N° Expediente</td>
                <td contentEditable suppressContentEditableWarning><strong>{caso.numeroCaso}</strong></td>
              </tr>
              <tr>
                <td>Fecha de Inicio</td>
                <td contentEditable suppressContentEditableWarning>{formatFecha(caso.fechaCreacion)}</td>
              </tr>
              <tr>
                <td>Tipo de Análisis</td>
                <td contentEditable suppressContentEditableWarning>{TIPO_LABEL[caso.tipoProyecto] || caso.tipoProyecto}</td>
              </tr>
              <tr>
                <td>Título del Caso</td>
                <td contentEditable suppressContentEditableWarning>{caso.titulo}</td>
              </tr>
              <tr>
                <td>Perito Líder</td>
                <td contentEditable suppressContentEditableWarning>{caso.peritoLider || '—'}</td>
              </tr>
              <tr>
                <td>Fiscalía Actuante</td>
                <td contentEditable suppressContentEditableWarning>{caso.fiscal || '—'}</td>
              </tr>
              <tr>
                <td>Despacho Fiscal</td>
                <td contentEditable suppressContentEditableWarning>{caso.despachoFiscal || '—'}</td>
              </tr>
              <tr>
                <td>N° PRCC / Registro</td>
                <td contentEditable suppressContentEditableWarning>{caso.expediente || '—'}</td>
              </tr>
              <tr>
                <td>Estado General</td>
                <td contentEditable suppressContentEditableWarning style={{ textTransform: 'capitalize' }}>{caso.estado.replace('_', ' ')}</td>
              </tr>
              <tr>
                <td>Última Actualización</td>
                <td contentEditable suppressContentEditableWarning>{formatFecha(caso.fechaUltimaActualizacion)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Barra de progreso global */}
        <div style={{
          background: '#F2F2F7', borderRadius: '8px', padding: '12px 16px',
          marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px',
          border: '1px solid #1d1d1f'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 'bold', color: '#1d1d1f' }}>
            <span>AVANCE GLOBAL DEL CUMPLIMIENTO (COMPLIANCE)</span>
            <span>
              {totalCompletados} / {totalPasos} pasos completados ({pct}%)
            </span>
          </div>
          <div style={{ background: '#d2d2d7', borderRadius: '4px', height: '8px', overflow: 'hidden', border: '0.5px solid #1d1d1f' }}>
            <div style={{
              width: `${pct}%`, height: '100%', borderRadius: '4px',
              background: pct >= 80 ? '#30D158' : pct >= 40 ? '#FF9F0A' : '#0A84FF',
            }} />
          </div>
        </div>

        {/* ── FASES Y PASOS (Línea de Tiempo) ── */}
        <div className="section">
          <div className="section-title">II. Historial de Fases Forenses y Hitos de Compliance</div>
          {faseStats.map((fase, faseIdx) => (
            <div key={fase.nombre} style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
              {/* Encabezado de fase */}
              <div style={{
                background: '#f2f2f7', color: '#1d1d1f',
                padding: '6px 10px', border: '1px solid #1d1d1f',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '8px', fontWeight: 'bold', fontSize: '11px'
              }}>
                <span>
                  {String(faseIdx + 1).padStart(2, '0')} — {fase.nombre.toUpperCase()}
                </span>
                <span>
                  {fase.completados}/{fase.total} COMPLETADOS
                </span>
              </div>

              {/* Pasos de la fase */}
              {fase.pasos.map((paso, pasoIdx) => {
                const stepState: StepState | undefined = steps[paso.id];
                const estado = stepState?.estado || 'disponible';
                const estadoMeta = ESTADO_PASO[estado] || ESTADO_PASO.disponible;
                const isLast = pasoIdx === fase.pasos.length - 1;

                return (
                  <div key={paso.id} style={{ display: 'flex', gap: '12px', paddingBottom: '10px' }}>
                    {/* Timeline column */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0 }}>
                      <div style={{
                        width: '24px', height: '24px',
                        borderRadius: '50%',
                        border: '1.5px solid #1d1d1f',
                        background: estado === 'completado' ? '#30D158' : estado === 'en_progreso' ? '#FF9F0A' : '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: 'bold',
                        color: estado === 'completado' ? '#ffffff' : '#1d1d1f',
                        flexShrink: 0, zIndex: 1,
                      }}>
                        {estado === 'completado' ? '✓' : paso.num}
                      </div>
                      {!isLast && (
                        <div style={{ width: '1.5px', flex: 1, background: '#1d1d1f', minHeight: '16px', marginTop: '2px' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{
                      flex: 1, borderBottom: isLast ? 'none' : '0.5px dashed #8e8e93',
                      paddingBottom: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#1d1d1f' }}>
                            Paso {paso.num}: {paso.titulo}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: '9.5px', color: '#515154' }}>
                            {paso.action}
                          </p>
                        </div>
                        <span style={{
                          flexShrink: 0, fontSize: '8.5px', fontWeight: 'bold', textTransform: 'uppercase',
                          padding: '1px 6px', border: '1px solid #1d1d1f',
                          background: estado === 'completado' ? 'rgba(48,209,88,0.1)' : estado === 'en_progreso' ? 'rgba(255,159,10,0.1)' : '#ffffff',
                          color: estado === 'completado' ? '#30D158' : estado === 'en_progreso' ? '#FF9F0A' : '#515154',
                        }}>
                          {estadoMeta.label}
                        </span>
                      </div>

                      {/* Step metadata */}
                      {(stepState?.fechaInicio || stepState?.fechaCompletado || stepState?.responsable) && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '9px', color: '#515154', flexWrap: 'wrap' }}>
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
                          margin: '4px 0 0', fontSize: '9px', color: '#1d1d1f',
                          fontStyle: 'italic', paddingLeft: '8px',
                          borderLeft: '1.5px solid #8e8e93',
                        }}>
                          {stepState.observaciones}
                        </p>
                      )}

                      {/* Normativas */}
                      {paso.normativas.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {paso.normativas.map((n, ni) => (
                            <span key={ni} style={{
                              fontSize: '8px', fontWeight: 'bold',
                              padding: '1px 4px', border: '0.5px solid #1d1d1f',
                              background: '#ffffff', color: '#1d1d1f',
                            }}>
                              {n.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Firma y cierre ── */}
        <div style={{
          borderTop: '2px solid #1d1d1f', marginTop: '24px', paddingTop: '16px',
          pageBreakInside: 'avoid'
        }}>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #1d1d1f', marginBottom: '4px', marginTop: '30px' }} />
              <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold' }}>{caso.peritoLider || 'Perito Forense'}</p>
              <p style={{ margin: '1px 0 0', fontSize: '9px', color: '#515154' }}>Perito Forense Líder</p>
            </div>
            {caso.compliance && (
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ borderTop: '1px solid #1d1d1f', marginBottom: '4px', marginTop: '30px' }} />
                <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold' }}>{caso.compliance}</p>
                <p style={{ margin: '1px 0 0', fontSize: '9px', color: '#515154' }}>Compliance Officer</p>
              </div>
            )}
            {caso.fiscal && (
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ borderTop: '1px solid #1d1d1f', marginBottom: '4px', marginTop: '30px' }} />
                <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold' }}>{caso.fiscal}</p>
                <p style={{ margin: '1px 0 0', fontSize: '9px', color: '#515154' }}>Fiscal del Ministerio Público</p>
              </div>
            )}
          </div>
          <p style={{ textAlign: 'center', fontSize: '8.5px', color: '#515154', marginTop: '16px' }}>
            Documento de Auditoría Forense · Generado por SHA256.US · MUCC-2017 · ISO/IEC 27037 · {now}
          </p>
        </div>

      </div>

      <PlanillaToolbar
        onPrint={handlePrint}
        onDownloadZip={() => downloadPlanillaZip(`TimelineCompliance_${caso.numeroCaso || 'caso'}`, 'Línea de Tiempo Forense Compliance')}
        tituloDocumento="Línea de Tiempo Forense - Compliance"
        camposRequeridos={camposRequeridos}
        casoId={casoId || undefined}
      />
    </div>
  );
}
