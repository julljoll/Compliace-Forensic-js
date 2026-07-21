'use client';

import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import { getTipoProyectoConfig } from '../../data/tiposProyecto';
import type { CasoCMS, StepState } from '../../store/cmsStore';
import './Planillas.css';
import PlanillaDocumentViewer from '../../components/organisms/Planillas/PlanillaDocumentViewer';

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

  return (
    <div className="planilla-container">
      <PlanillaDocumentViewer
        title={`Informe de Trazabilidad y Compliance — Caso #${caso.numeroCaso}`}
        filenamePrefix={`Timeline_Compliance_${caso.numeroCaso}`}
      >
        <div className="page">
          {/* ENCABEZADO OFICIAL */}
          <header>
            <div className="logo-container">
              <div className="logo-branding">
                <img src="/logo.png" alt="SHA256.US Logo" className="logo-img" />
                <span className="logo-text">SHA256.US</span>
              </div>
              <span className="logo-subtext">Laboratorio de Informática Forense &amp; Ciberseguridad</span>
              <span className="address-text">
                Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Municipio Jiménez del Estado Lara.
              </span>
            </div>

            <div className="acta-header">
              <h1 className="acta-title">INFORME DE TRAZABILIDAD Y COMPLIANCE FORENSE</h1>
              <div className="acta-subtitle">SEGUIMIENTO DE ETAPAS Y CADENA DE CUSTODIA</div>
              <div className="acta-nro">
                N° EXPEDIENTE: <span className="box-inline" style={{ minWidth: '130px', fontWeight: 'bold' }}>{caso.numeroCaso}</span>
              </div>
            </div>
          </header>

          {/* ── DATOS DEL EXPEDIENTE ── */}
          <div className="section">
            <div className="section-title">I. Identificación del Expediente Auditado</div>
            <table className="tabla-datos">
              <tbody>
                <tr>
                  <td style={{ width: '28%', fontWeight: 'bold' }}>N° Caso / Expediente:</td>
                  <td style={{ fontWeight: 'bold' }}>{caso.numeroCaso}</td>
                  <td style={{ width: '22%', fontWeight: 'bold' }}>Tipo de Análisis:</td>
                  <td>{TIPO_LABEL[caso.tipoProyecto] || caso.tipoProyecto}</td>
                </tr>
                <tr>
                  <td>Título del Caso:</td>
                  <td colSpan={3}>{caso.titulo}</td>
                </tr>
                <tr>
                  <td>Perito Responsable:</td>
                  <td>{caso.peritoLider || '—'}</td>
                  <td>Consignante / Solicitante:</td>
                  <td>{caso.solicitante_nombre || '—'} (C.I. {caso.solicitante_cedula || '—'})</td>
                </tr>
                <tr>
                  <td>Fecha de Registro:</td>
                  <td>{formatFecha(caso.fechaCreacion)}</td>
                  <td>Avance Global:</td>
                  <td style={{ fontWeight: 'bold' }}>{pct}% ({totalCompletados} de {totalPasos} pasos)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── MATRIZ DE FASES ── */}
          <div className="section">
            <div className="section-title">II. Matriz de Fases y Pasos del Protocolo Forense</div>
            <table className="tabla-datos" style={{ marginBottom: '14px' }}>
              <thead>
                <tr style={{ background: '#f2f2f7', textAlign: 'center' }}>
                  <th style={{ width: '50px' }}>Fase</th>
                  <th>Denominación de la Fase Protocolar</th>
                  <th style={{ width: '100px' }}>Pasos Total</th>
                  <th style={{ width: '100px' }}>Completados</th>
                  <th style={{ width: '90px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {faseStats.map(f => {
                  const estFase = f.completados === f.total ? 'Completada' : f.completados > 0 ? 'En Proceso' : 'Pendiente';
                  return (
                    <tr key={f.orden} style={{ textAlign: 'center' }}>
                      <td style={{ fontWeight: 'bold' }}>{f.orden}</td>
                      <td style={{ textAlign: 'left', fontWeight: '600' }}>{f.nombre}</td>
                      <td>{f.total}</td>
                      <td style={{ fontWeight: 'bold' }}>{f.completados} / {f.total}</td>
                      <td>
                        <span style={{
                          fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px',
                          background: f.completados === f.total ? '#e6f4ea' : f.completados > 0 ? '#fef7e0' : '#f1f3f4',
                          color: f.completados === f.total ? '#137333' : f.completados > 0 ? '#b06000' : '#5f6368',
                        }}>
                          {estFase}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* PASOS DETALLADOS POR FASE */}
            {faseStats.map(fase => (
              <div key={fase.orden} style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '10px', fontWeight: 'bold', background: '#e5e5ea',
                  padding: '4px 8px', borderLeft: '3px solid #1d1d1f', marginBottom: '6px'
                }}>
                  Fase {fase.orden}: {fase.nombre}
                </div>

                {fase.pasos.map(paso => {
                  const stepState: StepState = steps[paso.id] || { estado: 'bloqueado' };
                  const cfg = ESTADO_PASO[stepState.estado] || { label: stepState.estado, symbol: '?' };
                  return (
                    <div key={paso.id} style={{
                      border: '0.5px solid #d2d2d7', borderRadius: '4px',
                      padding: '8px 10px', marginBottom: '6px', fontSize: '9.5px', background: '#fafafa'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 'bold' }}>Paso {paso.num}: {paso.titulo}</span>
                        <span style={{
                          fontSize: '9px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '3px',
                          background: stepState.estado === 'completado' ? '#e6f4ea' : stepState.estado === 'en_progreso' ? '#fef7e0' : '#f1f3f4',
                          color: stepState.estado === 'completado' ? '#137333' : stepState.estado === 'en_progreso' ? '#b06000' : '#5f6368',
                        }}>
                          {cfg.symbol} {cfg.label}
                        </span>
                      </div>
                      <div style={{ color: '#515154', fontSize: '9px', marginBottom: '4px' }}>
                        {paso.action}
                      </div>

                      {stepState.responsable && (
                        <div style={{ fontSize: '8.5px', color: '#1d1d1f', marginTop: '2px' }}>
                          ✓ Completado por: <strong>{stepState.responsable}</strong> · {formatFecha(stepState.fechaCompletado)}
                        </div>
                      )}
                      {stepState.observaciones && (
                        <div style={{ fontSize: '8.5px', color: '#515154', fontStyle: 'italic', marginTop: '2px' }}>
                          Observaciones: "{stepState.observaciones}"
                        </div>
                      )}

                      {paso.normativas && paso.normativas.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
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
      </PlanillaDocumentViewer>
    </div>
  );
}
