'use client';

import React from 'react';
import USWDSGovBanner from './USWDSGovBanner';
import USWDSStepIndicator from './USWDSStepIndicator';
import { PlanillaId } from '@/hooks/usePlanillaFormData';
import { CasoCMS } from '@/store/cmsStore';
import { ShieldCheck } from '@/components/atoms/AppleIcon';

import PlanillaPRCCForm from './Forms/PlanillaPRCCForm';
import ActaObtencionForm from './Forms/ActaObtencionForm';
import ActaEntrevistaForm from './Forms/ActaEntrevistaForm';
import ActaDictamenForm from './Forms/ActaDictamenForm';
import ActaEntregaResultadosForm from './Forms/ActaEntregaResultadosForm';

export interface DigitalFormData {
  solicitante_nombre: string;
  solicitante_cedula: string;
  dispositivo_numero_tel: string;
  solicitante_direccion: string;
  dispositivo_marca: string;
  dispositivo_modelo: string;
  dispositivo_imei: string;
  dispositivo_estado_fisico: string;
  bolsa_faraday_numero: string;
  precinto_numero: string;
  hashSHA256: string;
  hashMD5: string;
  peritoLider: string;
  peritoCedula: string;
  peritoCiv: string;
  peritoInpre: string;
  peritoCargo: string;
  descripcion: string;
}

interface PlanillaDigitalFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<CasoCMS>) => void;
  title?: string;
  caso?: CasoCMS;
  planillaId?: PlanillaId;
}

// ── Etiquetas de Planilla para el header del modal ──────────────────────────
const PLANILLA_LABELS: Record<PlanillaId, { emoji: string; subtitle: string }> = {
  prcc:                    { emoji: '📋', subtitle: 'MUCC-2017 § 4 · COPP Art. 187 · ISO/IEC 27037:2012' },
  acta_obtencion:          { emoji: '📦', subtitle: 'MUCC-2017 § 5 · ISO/IEC 27037:2012 · COPP Art. 187' },
  acta_entrevista:         { emoji: '🗣️', subtitle: 'MUCC-2017 § 3 · ISO/IEC 27037:2012 · COPP Art. 225' },
  acta_dictamen:           { emoji: '🔬', subtitle: 'ISO/IEC 27042:2015 · NIST SP 800-86 · COPP Art. 225' },
  acta_entrega_resultados: { emoji: '📤', subtitle: 'MUCC-2017 § 8 · ISO/IEC 27037:2012 · COPP Art. 187' },
  acta_consentimiento:     { emoji: '✍️', subtitle: 'Arts. 28 y 60 CRBV · Arts. 4 y 6 LMD FE · ISO 27037' },
  acta_desprecintado:      { emoji: '🔓', subtitle: 'MUCC-2017 Fase 2 · ISO/IEC 27037 Sec. 7.2 · COPP Art. 187' },
  acta_sanitizacion:       { emoji: '🗑️', subtitle: 'NIST SP 800-88 Rev. 1 · ISO/IEC 27001 · Crypto-Erase' },
  acta_auditoria_timeline: { emoji: '📊', subtitle: 'ISO/IEC 27037:2012 · MUCC-2017 · SHA-256 Inmutable' },
};

export default function PlanillaDigitalFormModal({
  open,
  onClose,
  onSave,
  title = 'Llenar Planilla desde la Computadora',
  caso,
  planillaId = 'acta_obtencion',
}: PlanillaDigitalFormModalProps) {
  if (!open) return null;

  const meta = PLANILLA_LABELS[planillaId] ?? { emoji: '📄', subtitle: 'MUCC-2017 · ISO/IEC 27037' };

  const renderSpecificForm = () => {
    switch (planillaId) {
      case 'prcc':                    return <PlanillaPRCCForm caso={caso} onSave={onSave} />;
      case 'acta_obtencion':          return <ActaObtencionForm caso={caso} onSave={onSave} />;
      case 'acta_entrevista':         return <ActaEntrevistaForm caso={caso} onSave={onSave} />;
      case 'acta_dictamen':           return <ActaDictamenForm caso={caso} onSave={onSave} />;
      case 'acta_entrega_resultados': return <ActaEntregaResultadosForm caso={caso} onSave={onSave} />;
      default:                        return <ActaObtencionForm caso={caso} onSave={onSave} />;
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      style={{
        backgroundColor: 'rgba(17, 46, 81, 0.80)',
        backdropFilter: 'blur(6px)',
        zIndex: 1055,
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" role="document">
        <div
          className="modal-content shadow-lg"
          style={{
            background: '#F0F4F8',
            border: '2px solid #005EA2',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {/* ── USWDS Government Banner (Dark Navy Institucional) ──────────── */}
          <USWDSGovBanner
            expediente={caso?.numeroCaso ? `EXP-${caso.numeroCaso}` : 'EXP-SHA256-US'}
          />

          {/* ── Modal Header DC3 Navy ─────────────────────────────────────── */}
          <div
            className="modal-header px-4 py-3 d-flex align-items-center justify-content-between"
            style={{ background: '#112E51', borderBottom: '3px solid #D9A700' }}
          >
            <div className="d-flex align-items-center gap-3">
              {/* Sello Institucional */}
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: 44, height: 44,
                  background: 'rgba(217,167,0,0.15)',
                  border: '2px solid #D9A700',
                }}
              >
                <span style={{ fontSize: 22 }}>{meta.emoji}</span>
              </div>

              <div>
                {/* Rótulo "PLANILLA FORENSE" */}
                <div
                  className="d-flex align-items-center gap-2 mb-1"
                  style={{ fontSize: 9, letterSpacing: '1.5px', color: '#D9A700', fontWeight: 700, textTransform: 'uppercase' }}
                >
                  <ShieldCheck size={11} />
                  SISTEMA SHA256.US — LLENADO INTERACTIVO DE PLANILLA FORENSE
                </div>
                <h5
                  className="modal-title m-0 fw-bold"
                  style={{ fontSize: 15, color: '#FFFFFF', lineHeight: 1.2 }}
                >
                  {title}
                </h5>
                <div
                  className="mt-1"
                  style={{ fontSize: 10, color: '#94A3B8', letterSpacing: '0.3px' }}
                >
                  {meta.subtitle}
                </div>
              </div>
            </div>

            {/* Expediente + cierre */}
            <div className="d-flex align-items-center gap-3">
              {caso?.numeroCaso && (
                <div className="text-end d-none d-md-block">
                  <div style={{ fontSize: 9, color: '#D9A700', textTransform: 'uppercase', letterSpacing: '1px' }}>Expediente</div>
                  <div className="fw-bold font-monospace" style={{ fontSize: 12, color: '#FFFFFF' }}>
                    {caso.numeroCaso}
                  </div>
                </div>
              )}
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                className="btn-close btn-close-white"
                style={{ filter: 'invert(1) brightness(0.8)' }}
              />
            </div>
          </div>

          {/* ── Barra de Normativas ───────────────────────────────────────── */}
          <div
            className="d-flex align-items-center gap-2 px-4 py-2 flex-wrap"
            style={{ background: '#1A2536', borderBottom: '1px solid #2D3B52' }}
          >
            {['MUCC-2017', 'ISO 27037:2012', 'ISO 27042:2015', 'COPP Art. 187', 'NIST SP 800-86'].map(n => (
              <span
                key={n}
                className="usa-tag"
                style={{ fontSize: 9, letterSpacing: '0.4px', cursor: 'default' }}
              >
                {n}
              </span>
            ))}
          </div>

          {/* ── Indicador de Pasos Forenses ───────────────────────────────── */}
          <div className="px-4 pt-3" style={{ background: '#F0F4F8' }}>
            <USWDSStepIndicator currentStep={1} />
          </div>

          {/* ── Cuerpo del Formulario ─────────────────────────────────────── */}
          <div
            className="modal-body px-4 pb-4 pt-2"
            style={{ background: '#F0F4F8', overflowY: 'auto', maxHeight: '60vh' }}
          >
            {/* Aviso institucional */}
            <div
              className="d-flex align-items-start gap-2 p-2 mb-3 rounded"
              style={{
                background: 'rgba(0, 94, 162, 0.08)',
                border: '1px solid rgba(0, 94, 162, 0.25)',
                fontSize: 11,
                color: '#1B2A4A',
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
              <span>
                Los datos ingresados se guardan en el expediente activo (Zustand + IndexedDB) y se reflejan
                automáticamente en la <strong>vista previa PDF</strong>. Las firmas, huellas dactilares y observaciones
                manuscritas deben completarse en la versión impresa.
              </span>
            </div>

            {/* Formulario Específico */}
            {renderSpecificForm()}
          </div>
        </div>
      </div>
    </div>
  );
}
