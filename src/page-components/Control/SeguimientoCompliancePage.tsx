'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { useCMSStore } from '../../store/cmsStore';
import { getPasosPorTipo } from '../../data/tiposProyecto';
import {
  ShieldCheck, CheckCircle2, Clock, Lock, FileText,
  ChevronRight, AlertTriangle, FileCheck, Info
} from '../../components/atoms/AppleIcon';

// ── Colores de estado ─────────────────────────────────────────────────────────
const ESTADO_COLOR = {
  completado: { color: '#008837', tagClass: 'usa-tag--success', label: 'Completado' },
  en_proceso: { color: '#C05621', tagClass: 'usa-tag--info',    label: 'En Proceso' },
  pendiente:  { color: '#475569', tagClass: 'usa-tag--muted',   label: 'Bloqueado' },
};

function EstadoIcon({ estado }: { estado: string }) {
  if (estado === 'completado') return <CheckCircle2 size={16} className="text-success" />;
  if (estado === 'en_proceso') return <Clock size={16} className="text-warning" />;
  return <Lock size={16} className="text-muted" />;
}

export default function SeguimientoCompliancePage() {
  const searchParams = useSearchParams();

  const casos = useCMSStore(state => state.casos);
  const completeStep = useCMSStore(state => state.completeStep);
  const toggleComplianceCheck = useCMSStore(state => state.toggleComplianceCheck);

  const [selectedCasoId, setSelectedCasoId] = useState<string>(
    searchParams.get('casoId') || casos[0]?.id || ''
  );
  const [expandedPaso, setExpandedPaso] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCasoId && casos.length > 0) setSelectedCasoId(casos[0].id);
  }, [casos, selectedCasoId]);

  const casoActivo = useMemo(
    () => casos.find(c => c.id === selectedCasoId) || casos[0],
    [casos, selectedCasoId]
  );

  const pasosConfig = useMemo(() => {
    if (!casoActivo?.tipoProyecto) return getPasosPorTipo('forense_whatsapp');
    return getPasosPorTipo(casoActivo.tipoProyecto);
  }, [casoActivo]);

  const checklist   = casoActivo?.compliance_checklist || [];
  const checkedCount = checklist.filter(c => c.checked).length;
  const complianceRate = Math.min(100, Math.round((checkedCount / Math.max(checklist.length, 1)) * 100));

  // Estado visual de cada paso
  const pasoEstados: Record<string, keyof typeof ESTADO_COLOR> = useMemo(() => {
    if (!casoActivo || !pasosConfig) return {};
    const out: Record<string, keyof typeof ESTADO_COLOR> = {};
    pasosConfig.forEach(p => {
      const isDone = casoActivo.completed_steps?.[p.id] || casoActivo.steps?.[p.id]?.estado === 'completado';
      const isProgress = casoActivo.steps?.[p.id]?.estado === 'en_progreso';
      out[p.id] = isDone ? 'completado' : isProgress ? 'en_proceso' : 'pendiente';
    });
    return out;
  }, [casoActivo, pasosConfig]);

  // Bloqueo secuencial: el paso N solo se puede completar si N-1 está completado
  function isPasoDesbloqueado(idx: number): boolean {
    if (idx === 0) return true;
    const prevId = pasosConfig[idx - 1]?.id;
    return pasoEstados[prevId] === 'completado';
  }

  function handleTogglePaso(pasoId: string) {
    setExpandedPaso(prev => prev === pasoId ? null : pasoId);
  }

  function handleCompletarPaso(pasoId: string) {
    useCMSStore.getState().seleccionarCaso(selectedCasoId);
    completeStep(pasoId);
  }

  const fases = casoActivo?.tipoProyecto
    ? getPasosPorTipo(casoActivo.tipoProyecto).reduce((acc: string[], p) => {
        if (!acc.includes(p.fase)) acc.push(p.fase);
        return acc;
      }, [])
    : [];

  return (
    <div className="container-fluid max-w-1280 px-0 pb-5">

      {/* Header Institucional USWDS */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pb-3 mb-4 border-bottom border-2" style={{ borderColor: '#CBD5E1' }}>
        <div>
          <h1 className="h3 fw-bold text-navy mb-1 d-flex align-items-center gap-2" style={{ color: '#112E51' }}>
            <ShieldCheck size={24} className="text-warning" />
            Seguimiento Normativo — Cadena de Custodia
          </h1>
          <p className="text-muted small mb-0">
            Gating secuencial forense · MUCC-2017 · ISO 27037 · COPP Art. 187
          </p>
        </div>

        {casos.length > 0 && (
          <div className="min-w-280">
            <label className="form-label small fw-bold mb-1">Expediente Activo</label>
            <select
              className="form-select font-monospace"
              value={selectedCasoId}
              onChange={(e) => setSelectedCasoId(e.target.value)}
            >
              {casos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.numeroCaso} — {c.titulo}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sin casos */}
      {!casoActivo && (
        <div className="usa-alert usa-alert--info mb-4">
          <div className="usa-alert__heading">Sin Expedientes</div>
          No hay expedientes abiertos. Cree un caso desde el Panel Principal para iniciar el seguimiento normativo.
        </div>
      )}

      {casoActivo && (
        <>
          {/* Resumen del caso USWDS Summary Box */}
          <div className="usa-summary-box mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-7">
                <div className="text-warning font-monospace fw-bold small text-uppercase mb-1">
                  EXPEDIENTE: {casoActivo.numeroCaso}
                </div>
                <h2 className="h4 fw-bold text-navy mb-1" style={{ color: '#112E51' }}>
                  {casoActivo.titulo}
                </h2>
                <div className="text-muted small">
                  Perito: <span className="fw-semibold text-dark">{casoActivo.peritoLider || 'Sin asignar'}</span> · Fiscalía: <span className="fw-semibold text-dark">{casoActivo.fiscal || 'Ministerio Público'}</span>
                </div>

                <div className="d-flex flex-wrap gap-1 mt-2">
                  {['MUCC-2017', 'ISO 27037', 'COPP Art. 187', 'Ley Mensajes Datos'].map(n => (
                    <span key={n} className="usa-tag usa-tag--info" style={{ fontSize: '9.5px' }}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-12 col-md-5">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small text-uppercase fw-bold text-muted">Tasa de Cumplimiento</span>
                  <span className="fw-bold font-monospace text-success fs-5">{complianceRate}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${complianceRate}%` }}
                    aria-valuenow={complianceRate}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de Pasos USWDS (.usa-step-indicator) */}
          <div className="card p-3 mb-4 border bg-white rounded-3 shadow-sm">
            <div className="fw-bold text-navy text-uppercase mb-2 small" style={{ letterSpacing: '0.05em' }}>
              Progresión del Expediente por Fases
            </div>
            <div className="usa-step-indicator">
              {fases.map((fase, idx) => {
                const isComplete = idx < (pasosConfig.filter(p => pasoEstados[p.id] === 'completado').length / 3);
                return (
                  <div
                    key={fase}
                    className={`usa-step-indicator__segment ${
                      isComplete ? 'usa-step-indicator__segment--complete' : 'usa-step-indicator__segment--current'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Lista de Procesos y Gating Secuencial (.usa-process-list) */}
          <div className="card p-4 border bg-white rounded-3 shadow-sm mb-4">
            <h3 className="h6 fw-bold text-navy text-uppercase mb-4" style={{ letterSpacing: '0.05em' }}>
              📋 Pasos del Protocolo Pericial (Gating Gating ISO/MUCC)
            </h3>

            <ol className="usa-process-list">
              {pasosConfig.map((paso, idx) => {
                const estado = pasoEstados[paso.id] || 'pendiente';
                const meta = ESTADO_COLOR[estado];
                const desbloqueado = isPasoDesbloqueado(idx);
                const isExpanded = expandedPaso === paso.id;

                return (
                  <li
                    key={paso.id}
                    className={`usa-process-list__item ${estado === 'completado' ? 'completed' : ''}`}
                  >
                    <div className="d-flex align-items-center justify-content-between cursor-pointer" onClick={() => handleTogglePaso(paso.id)}>
                      <div>
                        <span className="fw-bold text-navy me-2" style={{ fontSize: '14px' }}>
                          Paso {paso.num}: {paso.titulo}
                        </span>
                        <span className={`usa-tag ${meta.tagClass}`}>
                          {meta.label}
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {desbloqueado && estado !== 'completado' && (
                          <button
                            type="button"
                            className="btn btn-sm btn-success fw-bold py-1 px-2"
                            onClick={(e) => { e.stopPropagation(); handleCompletarPaso(paso.id); }}
                          >
                            ✓ Completar Paso
                          </button>
                        )}
                        <ChevronRight
                          size={16}
                          style={{
                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                          }}
                        />
                      </div>
                    </div>

                    {/* Detalle Desplegable */}
                    {isExpanded && (
                      <div className="mt-3 p-3 bg-light rounded-3 border">
                        <p className="small text-dark mb-2">{(paso as any).detalle || (paso as any).descripcion || ''}</p>
                        <div className="d-flex gap-2 align-items-center small text-muted font-monospace">
                          <span>Normas: {(paso as any).normativa || (paso as any).normas || 'ISO 27037'}</span>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
