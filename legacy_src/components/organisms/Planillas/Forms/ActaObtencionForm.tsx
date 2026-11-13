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

export default function ActaObtencionForm({ caso, onSave }: PlanillaFormProps) {
  const [formData, setFormData] = useState({
    numeroCaso: caso?.numeroCaso || '',
    solicitante_nombre: caso?.solicitante_nombre || '',
    solicitante_cedula: caso?.solicitante_cedula || '',
    dispositivo_numero_tel: caso?.dispositivo_numero_tel || '',
    solicitante_direccion: caso?.solicitante_direccion || '',
    dispositivo_marca: caso?.dispositivo_marca || '',
    dispositivo_modelo: caso?.dispositivo_modelo || '',
    dispositivo_imei: caso?.dispositivo_imei || '',
    dispositivo_imei2: caso?.dispositivo_imei2 || '',
    dispositivo_sim_card: caso?.dispositivo_sim_card || '',
    dispositivo_estado_fisico: caso?.dispositivo_estado_fisico || 'Excelente estado, pantalla intacta',
    dispositivo_modo_aislamiento: caso?.dispositivo_modo_aislamiento || 'Modo Avión + Bolsa Faraday RF',
    bolsa_faraday_numero: caso?.bolsa_faraday_numero || '',
    precinto_numero: caso?.precinto_numero || '',
    hashSHA256: caso?.hashSHA256 || caso?.imagen_hash_sha256 || '',
    hashMD5: caso?.hashMD5 || caso?.imagen_hash_md5 || '',
    peritoLider: caso?.peritoLider || 'Ing. Christopher V. Vance',
    perito_cedula: caso?.perito_cedula || 'V-19.823.104',
    perito_civ: caso?.perito_civ || 'CIV N° 284.912',
    descripcion: caso?.descripcion || '',
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

      {/* 1. CONSIGNANTE */}
      <div className="uswds-card">
        <div className="uswds-banner-title">👤 1. DATOS DEL CONSIGNANTE PRIVADO</div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Nombres y Apellidos</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.solicitante_nombre} onChange={handleChange('solicitante_nombre')} placeholder="ej. Alexander Wright" />
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
            <label className="form-label" style={S.label}>Dirección de Habitación</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.solicitante_direccion} onChange={handleChange('solicitante_direccion')} placeholder="Av. 23 Enero, Lara" />
          </div>
        </div>
      </div>

      {/* 2. DISPOSITIVO */}
      <div className="uswds-card">
        <div className="uswds-banner-title">📱 2. ESPECIFICACIÓN TÉCNICA DEL DISPOSITIVO</div>
        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label" style={S.label}>Marca</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.dispositivo_marca} onChange={handleChange('dispositivo_marca')} placeholder="Xiaomi / Samsung" />
          </div>
          <div className="col-md-4">
            <label className="form-label" style={S.label}>Modelo</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.dispositivo_modelo} onChange={handleChange('dispositivo_modelo')} placeholder="Redmi Note 12 Pro" />
          </div>
          <div className="col-md-4">
            <label className="form-label" style={S.label}>IMEI 1</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.dispositivo_imei} onChange={handleChange('dispositivo_imei')} placeholder="864920193847102" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Estado Físico</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.dispositivo_estado_fisico} onChange={handleChange('dispositivo_estado_fisico')} />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Aislamiento RF</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.dispositivo_modo_aislamiento} onChange={handleChange('dispositivo_modo_aislamiento')} />
          </div>
        </div>
      </div>

      {/* 3. EMBALAJE & HASH GÉNESIS */}
      <div className="uswds-card">
        <div className="uswds-banner-title">🔒 3. EMBALAJE, PRECINTO & HASH GÉNESIS (ISO/IEC 27037)</div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>N° Bolsa Faraday</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.bolsa_faraday_numero} onChange={handleChange('bolsa_faraday_numero')} placeholder="FARADAY-2026-991" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>N° Precinto de Seguridad</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.precinto_numero} onChange={handleChange('precinto_numero')} placeholder="SEAL-SHA256-8812" />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Hash Génesis SHA-256 (64 hex)</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.hashSHA256} onChange={handleChange('hashSHA256')} placeholder="SHA-256 Hash..." />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Hash Génesis MD5 (32 hex)</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.hashMD5} onChange={handleChange('hashMD5')} placeholder="MD5 Hash..." />
          </div>
        </div>
      </div>

      {/* 4. MOTIVO Y ANTECEDENTES */}
      <div className="uswds-card">
        <div className="uswds-banner-title">📝 4. MOTIVO Y ANTECEDENTES DE LA CONSIGNACIÓN</div>
        <textarea className="form-control form-control-sm" rows={3} style={S.input} value={formData.descripcion} onChange={handleChange('descripcion')} placeholder="Describa detalladamente el motivo de entrega y hechos relevantes..." />
      </div>

      <div className="d-flex justify-content-end gap-2 pt-2">
        <button type="submit" className="btn btn-sm fw-bold px-4" style={{ background: '#005EA2', color: '#fff', border: 'none', letterSpacing: '0.5px' }}>
          💾 GUARDAR Y ACTUALIZAR PDF
        </button>
      </div>
    </form>
  );
}
