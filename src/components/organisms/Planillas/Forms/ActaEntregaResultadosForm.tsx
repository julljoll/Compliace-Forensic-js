'use client';

import React, { useState } from 'react';
import { CasoCMS } from '@/store/cmsStore';

interface PlanillaFormProps {
  caso?: CasoCMS;
  onSave: (data: Partial<CasoCMS>) => void;
}

const S = {
  label: { fontSize: 11, fontWeight: 700, color: '#1B2A4A', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: 3 },
  input: { borderColor: '#CBD5E1', backgroundColor: '#FFFFFF', color: '#1B2A4A', fontSize: 13 },
};

export default function ActaEntregaResultadosForm({ caso, onSave }: PlanillaFormProps) {
  const [formData, setFormData] = useState({
    numeroCaso: caso?.numeroCaso || '',
    numeroPRCC: caso?.numeroPRCC || caso?.numero_prcc || '',
    solicitante_nombre: caso?.solicitante_nombre || '',
    solicitante_cedula: caso?.solicitante_cedula || '',
    fechaCreacion: caso?.fechaCreacion || '',
    peritoLider: caso?.peritoLider || 'Ing. Christopher V. Vance',
    perito_cedula: caso?.perito_cedula || 'V-19.823.104',
    dispositivo_marca: caso?.dispositivo_marca || '',
    dispositivo_modelo: caso?.dispositivo_modelo || '',
    hashSHA256: caso?.hashSHA256 || caso?.imagen_hash_sha256 || '',
    notas: caso?.notas || 'Se realiza la entrega formal del dictamen pericial impreso y soporte digital con hash verificado.',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">

      {/* 1. DATOS DE IDENTIFICACIÓN */}
      <div className="uswds-card">
        <div className="uswds-banner-title">📋 1. DATOS DE IDENTIFICACIÓN Y RECEPCIÓN</div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>N° Expediente / Caso</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.numeroCaso} onChange={handleChange('numeroCaso')} />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>N° PRCC Correlativo</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.numeroPRCC} onChange={handleChange('numeroPRCC')} />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Nombre del Receptor / Consignante</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.solicitante_nombre} onChange={handleChange('solicitante_nombre')} />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Cédula del Receptor</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.solicitante_cedula} onChange={handleChange('solicitante_cedula')} />
          </div>
        </div>
      </div>

      {/* 2. PERITO ENTREGANTE */}
      <div className="uswds-card">
        <div className="uswds-banner-title">🧑‍⚖️ 2. DILIGENCIADO POR PERITO ENTREGANTE</div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Perito Entregante</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.peritoLider} onChange={handleChange('peritoLider')} />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>C.I. / Credencial Pericial</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.perito_cedula} onChange={handleChange('perito_cedula')} />
          </div>
        </div>
      </div>

      {/* 3. OBSERVACIONES */}
      <div className="uswds-card">
        <div className="uswds-banner-title">📝 3. OBSERVACIONES Y CERTIFICACIÓN DE RECEPCIÓN</div>
        <textarea className="form-control form-control-sm" rows={3} style={S.input} value={formData.notas} onChange={handleChange('notas')} />
      </div>

      <div className="d-flex justify-content-end gap-2 pt-2">
        <button type="submit" className="btn btn-sm fw-bold px-4" style={{ background: '#005EA2', color: '#fff', border: 'none', letterSpacing: '0.5px' }}>
          💾 GUARDAR Y ACTUALIZAR PDF
        </button>
      </div>
    </form>
  );
}
