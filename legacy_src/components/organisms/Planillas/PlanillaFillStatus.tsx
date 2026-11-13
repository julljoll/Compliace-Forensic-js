'use client';

import React from 'react';
import { CasoCMS } from '@/store/cmsStore';
import { PlanillaId } from '@/hooks/usePlanillaFormData';
import { ShieldCheck, AlertCircle } from '@/components/atoms/AppleIcon';

interface PlanillaFillStatusProps {
  caso?: CasoCMS;
  planillaId?: PlanillaId;
}

interface RequiredField {
  label: string;
  isFilled: boolean;
}

export default function PlanillaFillStatus({ caso, planillaId = 'acta_obtencion' }: PlanillaFillStatusProps) {
  if (!caso) return null;

  const getRequiredFields = (): RequiredField[] => {
    switch (planillaId) {
      case 'prcc':
        return [
          { label: 'N° Expediente', isFilled: Boolean(caso.numeroCaso) },
          { label: 'N° PRCC', isFilled: Boolean(caso.numeroPRCC || caso.numero_prcc) },
          { label: 'Despacho', isFilled: Boolean(caso.despachoFiscal) },
          { label: 'Consignante', isFilled: Boolean(caso.solicitante_nombre) },
          { label: 'Dispositivo / Serial', isFilled: Boolean(caso.dispositivo_marca || caso.dispositivo_imei) },
          { label: 'Hash SHA-256', isFilled: Boolean(caso.hashSHA256 || caso.imagen_hash_sha256) },
        ];
      case 'acta_obtencion':
        return [
          { label: 'Consignante (Nombre)', isFilled: Boolean(caso.solicitante_nombre) },
          { label: 'Cédula', isFilled: Boolean(caso.solicitante_cedula) },
          { label: 'Dispositivo Marca/Modelo', isFilled: Boolean(caso.dispositivo_marca) },
          { label: 'IMEI / Serial', isFilled: Boolean(caso.dispositivo_imei) },
          { label: 'N° Faraday / Precinto', isFilled: Boolean(caso.bolsa_faraday_numero || caso.precinto_numero) },
          { label: 'Hash SHA-256', isFilled: Boolean(caso.hashSHA256 || caso.imagen_hash_sha256) },
        ];
      case 'acta_entrevista':
        return [
          { label: 'Entrevistado', isFilled: Boolean(caso.solicitante_nombre) },
          { label: 'Cédula', isFilled: Boolean(caso.solicitante_cedula) },
          { label: 'Teléfono', isFilled: Boolean(caso.dispositivo_numero_tel) },
          { label: 'Declaración / Motivo', isFilled: Boolean(caso.descripcion) },
        ];
      case 'acta_dictamen':
        return [
          { label: 'Perito Responsable', isFilled: Boolean(caso.peritoLider) },
          { label: 'Colegiatura CIV/TSJ', isFilled: Boolean(caso.perito_civ) },
          { label: 'Dispositivo Examinado', isFilled: Boolean(caso.dispositivo_marca || caso.dispositivo_imei) },
          { label: 'Hash Génesis SHA-256', isFilled: Boolean(caso.hashSHA256 || caso.imagen_hash_sha256) },
        ];
      case 'acta_entrega_resultados':
        return [
          { label: 'N° Expediente', isFilled: Boolean(caso.numeroCaso) },
          { label: 'Receptor (Nombre)', isFilled: Boolean(caso.solicitante_nombre) },
          { label: 'Cédula Receptor', isFilled: Boolean(caso.solicitante_cedula) },
        ];
      default:
        return [];
    }
  };

  const fields = getRequiredFields();
  if (fields.length === 0) return null;

  const filledCount = fields.filter(f => f.isFilled).length;
  const pct = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="card p-2 bg-light border rounded-3 mb-2">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
        <div className="d-flex align-items-center gap-1 small fw-bold text-navy" style={{ color: '#112E51' }}>
          {pct === 100 ? (
            <ShieldCheck size={16} className="text-success" />
          ) : (
            <AlertCircle size={16} className="text-warning" />
          )}
          <span>COMPLETITUD DEL REGISTRO MUCC-2017:</span>
          <span className={`badge ${pct === 100 ? 'bg-success' : 'bg-warning text-dark'}`}>
            {pct}% ({filledCount}/{fields.length} campos clave)
          </span>
        </div>
        <div className="progress flex-grow-1 mx-2" style={{ height: '6px', minWidth: '120px' }}>
          <div
            className={`progress-bar ${pct === 100 ? 'bg-success' : 'bg-warning'}`}
            role="progressbar"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="d-flex flex-wrap gap-1">
        {fields.map((f, idx) => (
          <span
            key={idx}
            className={`badge ${f.isFilled ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'}`}
            style={{ fontSize: '9px' }}
          >
            {f.isFilled ? '✓' : '✗'} {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}
