'use client';

import React from 'react';
import { getPlanillaRegistry } from '@/data/planillasRegistry';
import { Shield, FileText, CheckCircle2 } from '@/components/atoms/AppleIcon';

interface PlanillaCoverPageWebProps {
  planillaId: string;
  caso?: any;
  peritoNombre?: string;
}

export function PlanillaCoverPageWeb({ planillaId, caso, peritoNombre }: PlanillaCoverPageWebProps) {
  const registry = getPlanillaRegistry(planillaId);
  const c = caso || {};

  const expNumero = c.numeroCaso || 'EXP-2026-SHA-0091';
  const prccNumero = c.numeroPRCC || 'PRCC-2026-0042';
  const fechaEmision = c.fecha || '23/07/2026 - 09:30 AM';
  const perito = peritoNombre || c.peritoAsignado || 'Ing. Christopher V. Vance (Perito Informático Forense CIV N° 284.912)';

  return (
    <div className="card p-4 bg-white border rounded-3 shadow-sm mb-4">
      {/* Listón de Clasificación Legal */}
      <div className="usa-alert usa-alert--info mb-3 py-2">
        <div className="d-flex align-items-center gap-2 font-monospace fw-bold small text-navy" style={{ color: '#112E51' }}>
          <Shield size={18} className="text-warning" />
          DOSSIER FORENSE OFICIAL — FOLIO 01 (PORTADA RECEPTORA)
        </div>
      </div>

      {/* Bloque Central con Título */}
      <div className="bg-light p-4 rounded-3 border text-center mb-4">
        <h2 className="h4 fw-bold text-navy mb-2" style={{ color: '#112E51' }}>
          {registry.nombreOficial}
        </h2>
        <p className="text-muted small mx-auto max-w-750 mb-3">
          {registry.subtitulo}
        </p>

        {/* Tarjetas de Metadatos del Expediente */}
        <div className="row g-2">
          <div className="col-12 col-sm-4">
            <div className="bg-white p-2 rounded border">
              <div className="text-uppercase fw-bold text-muted" style={{ fontSize: '10px' }}>EXPEDIENTE N°</div>
              <div className="fw-bold font-monospace text-navy" style={{ fontSize: '13px' }}>{expNumero}</div>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="bg-white p-2 rounded border">
              <div className="text-uppercase fw-bold text-muted" style={{ fontSize: '10px' }}>PRCC CORRELATIVO</div>
              <div className="fw-bold font-monospace text-success" style={{ fontSize: '13px' }}>{prccNumero}</div>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="bg-white p-2 rounded border">
              <div className="text-uppercase fw-bold text-muted" style={{ fontSize: '10px' }}>FECHA EMISIÓN</div>
              <div className="fw-bold font-monospace text-primary" style={{ fontSize: '13px' }}>{fechaEmision}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda Dinámica de Secciones Enumeradas */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="fw-bold text-navy d-flex align-items-center gap-1" style={{ fontSize: '14px', color: '#112E51' }}>
            <FileText size={18} className="text-warning" />
            LEYENDA DE CONTENIDO ENUMERADO SECCIÓN POR SECCIÓN
          </div>
          <span className="usa-tag usa-tag--info">
            {registry.sections.length} Secciones
          </span>
        </div>

        <div className="table-responsive rounded border bg-white">
          <table className="usa-table table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th scope="col" style={{ width: '10%' }}>N° SECC.</th>
                <th scope="col" style={{ width: '50%' }}>DENOMINACIÓN DE LA SECCIÓN</th>
                <th scope="col" style={{ width: '40%' }}>RESUMEN DE CONTENIDO</th>
              </tr>
            </thead>
            <tbody>
              {registry.sections.map((sec) => (
                <tr
                  key={sec.numero}
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById(`seccion-${sec.numero}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="font-monospace fw-bold text-success" style={{ fontSize: '12px' }}>
                    <a href={`#seccion-${sec.numero}`} className="text-decoration-none text-success">
                      {sec.numero}
                    </a>
                  </td>
                  <td className="fw-bold text-navy" style={{ fontSize: '12px', color: '#112E51' }}>
                    <a href={`#seccion-${sec.numero}`} className="text-decoration-none text-navy">
                      {sec.titulo}
                    </a>
                  </td>
                  <td className="text-muted small">
                    {sec.descripcion} {sec.camposCount ? `(${sec.camposCount} ítems)` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Normativas Ancladas */}
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span className="fw-bold small text-navy text-uppercase" style={{ fontSize: '11px', color: '#112E51' }}>
          MARCO NORMATIVO APLICABLE:
        </span>
        {registry.normativas.map((norm, idx) => (
          <span key={idx} className="usa-tag usa-tag--info" style={{ fontSize: '10px' }}>
            {norm}
          </span>
        ))}
      </div>
    </div>
  );
}
