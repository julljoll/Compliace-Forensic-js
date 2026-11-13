'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2 } from '../../atoms/AppleIcon';

export interface CampoFaltante {
  nombre: string;
  valor?: string;
}

interface PlanillaGatingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmProceed: () => void;
  camposFaltantes: CampoFaltante[];
  nombrePlanilla: string;
}

export default function PlanillaGatingDialog({
  open,
  onClose,
  onConfirmProceed,
  camposFaltantes,
  nombrePlanilla,
}: PlanillaGatingDialogProps) {
  if (!open) return null;
  const hayFaltantes = camposFaltantes.length > 0;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border shadow-lg bg-white rounded-3">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold text-navy d-flex align-items-center gap-2" style={{ color: '#112E51' }}>
              {hayFaltantes ? <AlertTriangle size={20} className="text-warning" /> : <CheckCircle2 size={20} className="text-success" />}
              {hayFaltantes ? 'Validación de Expediente' : 'Expediente Completo'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {hayFaltantes ? (
              <>
                <p className="small text-dark mb-2">
                  Se detectaron campos requeridos incompletos en el expediente para la planilla{' '}
                  <strong className="text-navy">{nombrePlanilla}</strong>:
                </p>

                <div className="usa-alert usa-alert--info mb-3">
                  <ul className="mb-0 ps-3 font-monospace small">
                    {camposFaltantes.map((campo, index) => (
                      <li key={index}>{campo.nombre}</li>
                    ))}
                  </ul>
                </div>

                <p className="small text-muted mb-0">
                  ¿Desea proceder a generar e imprimir la planilla en blanco/rayada para su llenado manuscrito?
                </p>
              </>
            ) : (
              <p className="small text-success mb-0 fw-bold">
                Todos los datos obligatorios del expediente se encuentran completos para la planilla{' '}
                <strong>{nombrePlanilla}</strong>.
              </p>
            )}
          </div>

          <div className="modal-footer border-top">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm fw-bold"
              onClick={() => {
                onConfirmProceed();
                onClose();
              }}
            >
              {hayFaltantes ? 'Proceder con Incompletos' : 'Generar y Ver PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
