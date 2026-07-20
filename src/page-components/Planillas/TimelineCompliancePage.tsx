import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PrintIcon from '@mui/icons-material/Print';
import { useCMSStore } from '../../store/cmsStore';
import { getTipoProyectoConfig } from '../../data/tiposProyecto';
import type { CasoCMS, StepState } from '../../store/cmsStore';
import './Planillas.css';

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
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Times New Roman', Times, serif" }}>
        <p style={{ fontSize: '18px', fontWeight: 700 }}>Expediente no encontrado</p>
        <p style={{ color: '#888', marginTop: '8px' }}>
          Use el módulo de Auditoría para seleccionar un caso e imprimir su línea de tiempo.
        </p>
      </div>
    );
  }

  const config = getTipoProyectoConfig(caso.tipoProyecto);
  const steps  = caso.steps || {};

  const faseStats = config.fases.map(fase => {
    const pasos = config.pasos.filter(p => fase.pasoIds.includes(p.id));
    const completados = pasos.filter(p => steps[p.id]?.estado === 'completado').length;
    return { ...fase, pasos, completados, total: pasos.length };
  });

  const totalPasos       = config.pasos.length;
  const totalCompletados = config.pasos.filter(p => steps[p.id]?.estado === 'completado').length;
  const pct              = totalPasos > 0 ? Math.round((totalCompletados / totalPasos) * 100) : 0;

  const handlePrint = () => {
    const container = document.querySelector('.planilla-container');
    if (container) {
      container.classList.add('modo-vista-previa');
    }
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
                src="/logo.png"
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

        {/* ── DATOS DEL EXPEDIENTE ── */}
        <div className="section" style={{ marginBottom: '16px' }}>
          <div className="section-title">I. Datos de Identificación del Caso</div>
          <table className="tabla-datos">
            <tbody>
              <tr>
                <td style={{ width: '30%', fontWeight: 700 }}>N° Expediente</td>
                <td contentEditable suppressContentEditableWarning style={{ fontWeight: 700 }}>{caso.numeroCaso}</td>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold' }}>
            <span>NIVEL DE AVANCE GLOBAL COMPLIANCE</span>
            <span>{totalCompletados} de {totalPasos} hitos completados ({pct}%)</span>
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
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: estado === 'completado' ? '#30D158' : estado === 'en_progreso' ? '#FF9F0A' : '#e5e5ea',
                        color: estado === 'completado' || estado === 'en_progreso' ? '#fff' : '#8e8e93',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 'bold', border: '1px solid #1d1d1f', flexShrink: 0
                      }}>
                        {estadoMeta.symbol}
                      </div>
                      {!isLast && (
                        <div style={{
                          width: '2px', flex: 1, minHeight: '16px',
                          background: estado === 'completado' ? '#30D158' : '#d2d2d7',
                          marginTop: '2px'
                        }} />
                      )}
                    </div>

                    {/* Step details */}
                    <div style={{ flex: 1, background: '#fff', border: '1px solid #d2d2d7', borderRadius: '6px', padding: '8px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1d1d1f' }}>
                          Paso {paso.num}: {paso.titulo}
                        </span>
                        <span style={{
                          fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px',
                          background: estado === 'completado' ? '#e4f8e9' : estado === 'en_progreso' ? '#fff4e5' : '#f2f2f7',
                          color: estado === 'completado' ? '#1b7d34' : estado === 'en_progreso' ? '#b26200' : '#8e8e93',
                          border: '0.5px solid #d2d2d7'
                        }}>
                          {estadoMeta.label.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ fontSize: '10px', color: '#515154', marginBottom: '4px', lineHeight: '1.4' }}>
                        {paso.guide}
                      </div>

                      {stepState?.fechaCompletado && (
                        <div style={{ fontSize: '9px', color: '#30D158', fontWeight: 'bold' }}>
                          ✓ Completado el: {formatFecha(stepState.fechaCompletado)}
                        </div>
                      )}

                      {/* Normativas asociadas */}
                      {paso.normativas && paso.normativas.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {paso.normativas.map(n => (
                            <span key={n.label} style={{
                              fontSize: '8px', background: '#f2f2f7', color: '#1d1d1f',
                              padding: '1px 5px', borderRadius: '3px', border: '0.5px solid #d2d2d7',
                              fontWeight: '600'
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

        {/* ── FIRMAS Y VALIDACIÓN PERICIAL ── */}
        <div className="section" style={{ pageBreakInside: 'avoid', marginTop: '30px' }}>
          <div className="section-title">III. Certificación Pericial y Firmas de Responsabilidad</div>
          <div style={{ fontSize: '10px', color: '#515154', marginBottom: '20px', textAlign: 'justify', lineHeight: '1.4' }}>
            Certifico que la presente Línea de Tiempo de Compliance Forense refleja fielmente el estado, secuencia y trazabilidad inmutable de las operaciones realizadas sobre la evidencia digital asignada al Expediente N° <strong>{caso.numeroCaso}</strong>, bajo estricto cumplimiento de los estándares ISO/IEC 27037:2012, NIST SP 800-86 y el Manual Único de Cadena de Custodia (MUCC-2017).
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #1d1d1f', height: '40px', marginBottom: '6px' }} />
              <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{caso.peritoLider || '__________________________'}</div>
              <div style={{ fontSize: '9px', color: '#515154' }}>PERITO FORENSE LÍDER</div>
              <div style={{ fontSize: '8px', color: '#8e8e93' }}>Firma y Sello</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #1d1d1f', height: '40px', marginBottom: '6px' }} />
              <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{caso.fiscal || '__________________________'}</div>
              <div style={{ fontSize: '9px', color: '#515154' }}>FISCALÍA / REQUISITORIO</div>
              <div style={{ fontSize: '8px', color: '#8e8e93' }}>Recibido Conformidad</div>
            </div>
          </div>
        </div>

        {/* Pie de página institucional */}
        <footer style={{ marginTop: '30px', borderTop: '1px solid #d2d2d7', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#8e8e93' }}>
          <span>SHA256.US — Laboratorio de Informática Forense y Ciberseguridad</span>
          <span>Formato Oficial Compliance · Impreso el {new Date().toLocaleDateString('es-VE')}</span>
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
}
