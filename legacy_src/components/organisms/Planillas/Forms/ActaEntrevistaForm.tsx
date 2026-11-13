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

export default function ActaEntrevistaForm({ caso, onSave }: PlanillaFormProps) {
  const [formData, setFormData] = useState({
    numeroCaso: caso?.numeroCaso || '',
    solicitante_nombre: caso?.solicitante_nombre || '',
    solicitante_cedula: caso?.solicitante_cedula || '',
    dispositivo_numero_tel: caso?.dispositivo_numero_tel || '',
    correo_investigar: caso?.correo_investigar || '',
    solicitante_direccion: caso?.solicitante_direccion || '',
    condicion_juridica: caso?.condicion_juridica || 'Víctima / Denunciante',
    peritoLider: caso?.peritoLider || 'Ing. Christopher V. Vance',
    perito_cedula: caso?.perito_cedula || 'V-19.823.104',
    descripcion: caso?.descripcion || '',
    notas: caso?.notas || '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">

      {/* 1. DATOS DEL ENTREVISTADO */}
      <div className="uswds-card">
        <div className="uswds-banner-title">👤 1. IDENTIFICACIÓN COMPLETA DEL ENTREVISTADO</div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Nombres y Apellidos</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.solicitante_nombre} onChange={handleChange('solicitante_nombre')} placeholder="Alexander Wright" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Cédula de Identidad</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.solicitante_cedula} onChange={handleChange('solicitante_cedula')} placeholder="V-18.492.019" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Teléfono de Contacto</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.dispositivo_numero_tel} onChange={handleChange('dispositivo_numero_tel')} placeholder="+58 (414) 592-8102" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Correo Electrónico</label>
            <input type="email" className="form-control form-control-sm" style={S.input} value={formData.correo_investigar} onChange={handleChange('correo_investigar')} placeholder="alexander@corporate.com" />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Dirección de Habitación</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.solicitante_direccion} onChange={handleChange('solicitante_direccion')} placeholder="Dirección del Entrevistado" />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Calidad / Condición Jurídica</label>
            <select className="form-select form-select-sm" style={S.input} value={formData.condicion_juridica} onChange={handleChange('condicion_juridica')}>
              <option value="Víctima / Denunciante">Víctima / Denunciante</option>
              <option value="Testigo / Informante">Testigo / Informante</option>
              <option value="Propietario de Evidencia">Propietario Legítimo de la Evidencia</option>
              <option value="Tercero Legitimado">Tercero Legitimado / Apoderado</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. DECLARACIÓN */}
      <div className="uswds-card">
        <div className="uswds-banner-title">🗣️ 2. DECLARACIÓN DEL ENTREVISTADO (MANIFIESTO TÉCNICO)</div>
        <textarea className="form-control form-control-sm" rows={4} style={S.input} value={formData.descripcion} onChange={handleChange('descripcion')} placeholder="Detalle las declaraciones, credenciales de acceso facilitadas, contexto y antecedentes expuestos..." />
      </div>

      {/* 3. PERITO ENTREVISTADOR */}
      <div className="uswds-card">
        <div className="uswds-banner-title">🔬 3. DILIGENCIADO POR PERITO RESPONSABLE</div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Perito Entrevistador</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.peritoLider} onChange={handleChange('peritoLider')} />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>C.I. / Credencial Pericial</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.perito_cedula} onChange={handleChange('perito_cedula')} />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 pt-2">
        <button type="submit" className="btn btn-sm fw-bold px-4" style={{ background: '#005EA2', color: '#fff', border: 'none', letterSpacing: '0.5px' }}>
          💾 GUARDAR Y ACTUALIZAR PDF
        </button>
      </div>
    </form>
  );
}
