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
  inputMono: { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC', color: '#1B2A4A', fontSize: 12, fontFamily: "'Fira Code', monospace" },
};

export default function ActaDictamenForm({ caso, onSave }: PlanillaFormProps) {
  const [formData, setFormData] = useState({
    numeroCaso: caso?.numeroCaso || '',
    peritoLider: caso?.peritoLider || 'Ing. Christopher V. Vance',
    perito_cedula: caso?.perito_cedula || 'V-19.823.104',
    perito_civ: caso?.perito_civ || 'CIV N° 284.912',
    perito_cargo: caso?.perito_cargo || 'Perito Informático Forense Principal',
    perito2_nombre: (caso as any)?.perito2_nombre || '',
    perito2_cedula: (caso as any)?.perito2_cedula || '',
    perito2_civ: (caso as any)?.perito2_civ || '',
    dispositivo_marca: caso?.dispositivo_marca || '',
    dispositivo_modelo: caso?.dispositivo_modelo || '',
    dispositivo_imei: caso?.dispositivo_imei || '',
    hashSHA256: caso?.hashSHA256 || caso?.imagen_hash_sha256 || '',
    hashMD5: caso?.hashMD5 || caso?.imagen_hash_md5 || '',
    descripcion: caso?.descripcion || '',
    notas: caso?.notas || '',
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

      {/* 1. ACREDITACIÓN PERICIAL BILATERAL (COPP ART. 223) */}
      <div className="uswds-card">
        <div className="uswds-banner-title">🏛️ 1. ACREDITACIÓN DE PERITOS INFORMÁTICOS FORENSES (COPP ART. 223)</div>
        <div className="row g-2">
          {/* PERITO 1 */}
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Perito Principal (N° 1)</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.peritoLider} onChange={handleChange('peritoLider')} />
          </div>
          <div className="col-md-3">
            <label className="form-label" style={S.label}>C.I. Perito 1</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.perito_cedula} onChange={handleChange('perito_cedula')} />
          </div>
          <div className="col-md-3">
            <label className="form-label" style={S.label}>CIV N° Perito 1</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.perito_civ} onChange={handleChange('perito_civ')} />
          </div>

          {/* PERITO 2 */}
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Co-Perito (N° 2 — COPP Art. 223)</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.perito2_nombre} onChange={handleChange('perito2_nombre')} placeholder="[Nombre y Apellido Co-Perito]" />
          </div>
          <div className="col-md-3">
            <label className="form-label" style={S.label}>C.I. Perito 2</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.perito2_cedula} onChange={handleChange('perito2_cedula')} placeholder="[C.I. Perito 2]" />
          </div>
          <div className="col-md-3">
            <label className="form-label" style={S.label}>CIV N° Perito 2</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.perito2_civ} onChange={handleChange('perito2_civ')} placeholder="[CIV Perito 2]" />
          </div>
        </div>
      </div>

      {/* 2. EVIDENCIA DIGITAL */}
      <div className="uswds-card">
        <div className="uswds-banner-title">🔬 2. EVIDENCIA DIGITAL SOMETIDA A PERITAJE</div>
        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label" style={S.label}>Marca</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.dispositivo_marca} onChange={handleChange('dispositivo_marca')} />
          </div>
          <div className="col-md-4">
            <label className="form-label" style={S.label}>Modelo</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.dispositivo_modelo} onChange={handleChange('dispositivo_modelo')} />
          </div>
          <div className="col-md-4">
            <label className="form-label" style={S.label}>Serial / IMEI</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.dispositivo_imei} onChange={handleChange('dispositivo_imei')} />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Hash Génesis SHA-256 Verificado</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.hashSHA256} onChange={handleChange('hashSHA256')} placeholder="SHA-256 del dispositivo original..." />
          </div>
        </div>
      </div>

      {/* 3. HALLAZGOS Y CONCLUSIONES */}
      <div className="uswds-card">
        <div className="uswds-banner-title">📊 3. HALLAZGOS Y CONCLUSIONES TÉCNICO-CIENTÍFICAS</div>
        <div className="mb-2">
          <label className="form-label" style={S.label}>Procedimientos y Metodología Aplicada</label>
          <textarea className="form-control form-control-sm" rows={3} style={S.input} value={formData.descripcion} onChange={handleChange('descripcion')} placeholder="Herramientas (FTK Imager, Avilla Forensics, IPED Forensics - Polícia Federal do Brasil/INTERPOL, PhotoHolmes ELA, Sonic Visualiser 48kHz)..." />
        </div>
        <div>
          <label className="form-label" style={S.label}>Conclusiones Periciales</label>
          <textarea className="form-control form-control-sm" rows={3} style={S.input} value={formData.notas} onChange={handleChange('notas')} placeholder="Síntesis de las conclusiones categóricas del dictamen pericial..." />
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
