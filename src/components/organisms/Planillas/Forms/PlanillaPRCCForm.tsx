'use client';

import React, { useState } from 'react';
import { CasoCMS } from '@/store/cmsStore';

interface PlanillaFormProps {
  caso?: CasoCMS;
  onSave: (data: Partial<CasoCMS>) => void;
}

// ─── Estilos reutilizables inline alineados al DC3 USWDS Light Theme ────────
const S = {
  label: { fontSize: 11, fontWeight: 700, color: '#1B2A4A', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: 3 },
  input: { borderColor: '#CBD5E1', backgroundColor: '#FFFFFF', color: '#1B2A4A', fontSize: 13 },
  inputMono: { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC', color: '#1B2A4A', fontSize: 12, fontFamily: "'Fira Code', monospace" },
};

export default function PlanillaPRCCForm({ caso, onSave }: PlanillaFormProps) {
  const [formData, setFormData] = useState({
    numeroCaso: caso?.numeroCaso || '',
    numeroPRCC: caso?.numeroPRCC || caso?.numero_prcc || '',
    despachoFiscal: caso?.despachoFiscal || '',
    organismoOrdenante: caso?.organismoOrdenante || '',
    solicitante_direccion: caso?.solicitante_direccion || '',
    peritoLider: caso?.peritoLider || '',
    perito_cedula: caso?.perito_cedula || '',
    dispositivo_marca: caso?.dispositivo_marca || '',
    dispositivo_modelo: caso?.dispositivo_modelo || '',
    dispositivo_imei: caso?.dispositivo_imei || '',
    hashSHA256: caso?.hashSHA256 || caso?.imagen_hash_sha256 || '',
    solicitante_nombre: caso?.solicitante_nombre || '',
    solicitante_cedula: caso?.solicitante_cedula || '',
    motivo_transferencia: caso?.motivo_transferencia || '3. Resguardo',
    receptor_nombre: caso?.receptor_nombre || caso?.peritoLider || '',
    receptor_cedula: caso?.receptor_cedula || caso?.perito_cedula || '',
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

      {/* SECCIÓN I: DATOS GENERALES */}
      <div className="uswds-card">
        <div className="uswds-banner-title">📁 I. DATOS GENERALES DEL EXPEDIENTE</div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>N° Expediente / Causa</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.numeroCaso} onChange={handleChange('numeroCaso')} placeholder="ej. MP-01-2026-WA" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>N° PRCC Correlativo</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.numeroPRCC} onChange={handleChange('numeroPRCC')} placeholder="ej. PRCC-2026-0042" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Despacho que Instruye</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.despachoFiscal} onChange={handleChange('despachoFiscal')} placeholder="ej. Fiscalía 8va Lara" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Organismo que Instruye</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.organismoOrdenante} onChange={handleChange('organismoOrdenante')} placeholder="ej. Ministerio Público" />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Dirección de Obtención</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.solicitante_direccion} onChange={handleChange('solicitante_direccion')} placeholder="Lugar exacto de obtención de la evidencia" />
          </div>
        </div>
      </div>

      {/* SECCIÓN III: FUNCIONARIOS */}
      <div className="uswds-card">
        <div className="uswds-banner-title">👮 III. FUNCIONARIOS — FIJACIÓN & COLECCIÓN</div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Operario que Fija (Nombre)</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.peritoLider} onChange={handleChange('peritoLider')} placeholder="Nombre del Perito que Fija" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>C.I. / Credencial</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.perito_cedula} onChange={handleChange('perito_cedula')} placeholder="V-19.823.104" />
          </div>
        </div>
      </div>

      {/* SECCIÓN IV: EVIDENCIA & HASH SHA-256 */}
      <div className="uswds-card">
        <div className="uswds-banner-title">🔒 IV. DESCRIPCIÓN DE LA EVIDENCIA & HASH SHA-256 GÉNESIS</div>
        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label" style={S.label}>Marca</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.dispositivo_marca} onChange={handleChange('dispositivo_marca')} placeholder="Samsung" />
          </div>
          <div className="col-md-4">
            <label className="form-label" style={S.label}>Modelo</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.dispositivo_modelo} onChange={handleChange('dispositivo_modelo')} placeholder="Galaxy A54" />
          </div>
          <div className="col-md-4">
            <label className="form-label" style={S.label}>Serial / IMEI</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.dispositivo_imei} onChange={handleChange('dispositivo_imei')} placeholder="354928110948271" />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Hash Génesis SHA-256 (64 caracteres hexadecimales)</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.hashSHA256} onChange={handleChange('hashSHA256')} placeholder="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" />
          </div>
        </div>
      </div>

      {/* SECCIÓN V: TRANSFERENCIA */}
      <div className="uswds-card">
        <div className="uswds-banner-title">🔄 V. TRANSFERENCIA DE EVIDENCIA</div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Entregante (Consignante)</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.solicitante_nombre} onChange={handleChange('solicitante_nombre')} placeholder="Nombre Entregante" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Receptor (Perito Receptor)</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.receptor_nombre} onChange={handleChange('receptor_nombre')} placeholder="Nombre Receptor" />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Observaciones de Transferencia</label>
            <textarea className="form-control form-control-sm" rows={2} style={S.input} value={formData.notas} onChange={handleChange('notas')} placeholder="Observaciones técnicas de resguardo..." />
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
