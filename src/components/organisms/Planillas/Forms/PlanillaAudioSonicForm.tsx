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
  sectionHeader: { backgroundColor: '#112E51', color: '#FFFFFF', padding: '6px 12px', fontSize: 12, fontWeight: 700, borderRadius: '4px 4px 0 0', marginTop: 12 },
};

export default function PlanillaAudioSonicForm({ caso, onSave }: PlanillaFormProps) {
  const [formData, setFormData] = useState({
    numeroCaso: caso?.numeroCaso || '',
    tribunalJurisdiccion: caso?.despachoFiscal || caso?.organismoOrdenante || '',
    peritoLider: caso?.peritoLider || '',
    peritoCedula: caso?.perito_cedula || '',
    peritoCiv: caso?.perito_civ || '',
    peritoInpre: caso?.perito_inpre || '',
    peritoCertificaciones: 'Perito Forense en Acústica Digital / SWGDE / ISO 27042',
    fechaRecepcion: caso?.fechaCreacion ? new Date(caso?.fechaCreacion).toISOString().split('T')[0] : '',
    custodiaEntregadoPor: caso?.solicitante_nombre || '',
    hashSHA256Genesis: caso?.hashSHA256 || caso?.imagen_hash_sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    audioNombreArchivo: 'AUDIO_WHATSAPP_PTT_20260723_WA0012.opus',
    audioFormato: 'Ogg/Opus (48.000 Hz, 16-bit Mono, VBR)',
    audioDuracion: '00:01:42.850 (102.85 seg)',
    audioSampleRate: '48.000 Hz (Nyquist: 24.000 Hz)',
    audioHashPreProceso: caso?.hashSHA256 || '7a8f3b92c10d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
    audioHashPostProceso: caso?.hashSHA256 || '7a8f3b92c10d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
    procesoSeleccionado: 'Espectrograma FFT + Frecuencia Fundamental (F0)',
    parametrosTecnicos: 'FFT Window: Hann (Size: 2048), Step: 512 bins, Freq Range: 0 - 24.000 Hz, Linear/dB Scale',
    observacionesTecnicas: 'Continuidad armónica ininterrumpida observada en rango 300Hz-3400Hz. Sin discontinuidades de fase, saltos espectrales bruscos ni artefactos de edición por empalme (splicing).',
    conclusionDictamen: 'Sin evidencia de alteración',
    fundamentoMetodologico: 'SWGDE Guidelines for Forensic Audio Analysis Sec 4.2 · Metodología reproducible de análisis espectral FFT según FRE Rule 702 / Daubert Standard',
    limitacionesAnalisis: 'Codificación con pérdidas inherente al códec Opus/WhatsApp; análisis circunscrito a la banda pasante audible y formantes vocales.',
    softwareVersion: 'Sonic Visualiser v5.0.2 (x86_64, GPL-2.0-or-later)',
    tasaErrorMetodo: '< 0.05% en detección de discontinuidades de fase FFT bajo condiciones de relación señal-ruido SNR > 15 dB',
    declaracionJurada: 'Declaro bajo juramento que el presente análisis técnico fue ejecutado aplicando metodología científica validada por la comunidad internacional (SWGDE/ISO 27042), verificable y reproducible por terceros peritos independientes bajo el estándar Daubert/FRE 702.',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2 p-1">
      {/* SECCIÓN 1: ENCABEZADO Y CADENA DE CUSTODIA */}
      <div style={S.sectionHeader}>📁 1.0 ENCABEZADO DEL CASO &amp; CADENA DE CUSTODIA (SHA-256 GÉNESIS)</div>
      <div className="bg-white p-3 border rounded-bottom shadow-sm">
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>N° de Expediente / Causa</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.numeroCaso} onChange={handleChange('numeroCaso')} placeholder="ej. MP-2026-AUD-0091" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Tribunal / Jurisdicción</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.tribunalJurisdiccion} onChange={handleChange('tribunalJurisdiccion')} placeholder="ej. Tribunal 1° de Juicio / Circunscripción Federal" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Perito Responsable</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.peritoLider} onChange={handleChange('peritoLider')} placeholder="Nombre y Apellido del Perito" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>C.I. / CIV / INPRE / Certificaciones</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={`${formData.peritoCedula} | ${formData.peritoCiv}`} onChange={handleChange('peritoCedula')} placeholder="C.I. / N° Colegiatura" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Consignante / Custodio que entrega</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.custodiaEntregadoPor} onChange={handleChange('custodiaEntregadoPor')} placeholder="Nombre de quien consigna la evidencia" />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Fecha y Hora de Recepción</label>
            <input type="date" className="form-control form-control-sm" style={S.input} value={formData.fechaRecepcion} onChange={handleChange('fechaRecepcion')} />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Hash Génesis SHA-256 Original (Cadena de Custodia)</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.hashSHA256Genesis} onChange={handleChange('hashSHA256Genesis')} />
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: REGISTRO TÉCNICO DE PROCESOS EN SONIC VISUALISER */}
      <div style={S.sectionHeader}>🔬 2.0 REGISTRO TÉCNICO DE PROCESOS POR AUDIO (SONIC VISUALISER)</div>
      <div className="bg-white p-3 border rounded-bottom shadow-sm">
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Nombre del Archivo de Audio</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.audioNombreArchivo} onChange={handleChange('audioNombreArchivo')} />
          </div>
          <div className="col-md-3">
            <label className="form-label" style={S.label}>Formato y Códec</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.audioFormato} onChange={handleChange('audioFormato')} />
          </div>
          <div className="col-md-3">
            <label className="form-label" style={S.label}>Duración Exacta</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.audioDuracion} onChange={handleChange('audioDuracion')} />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Proceso Aplicado en Sonic Visualiser</label>
            <select className="form-select form-select-sm" style={S.input} value={formData.procesoSeleccionado} onChange={handleChange('procesoSeleccionado')}>
              <option value="Espectrograma FFT + Frecuencia Fundamental (F0)">Espectrograma FFT + Frecuencia Fundamental (F0)</option>
              <option value="Forma de Onda (Waveform Temporal)">Forma de Onda (Waveform Temporal)</option>
              <option value="Detección de Picos Espectrales y Armónicos">Detección de Picos Espectrales y Armónicos</option>
              <option value="Análisis de Relación Señal-Ruido (SNR)">Análisis de Relación Señal-Ruido (SNR)</option>
              <option value="Otro Proceso de Acústica Forense">Otro Proceso de Acústica Forense</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Parámetros Técnicos Exactos (FFT / Ventana / Escala)</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.parametrosTecnicos} onChange={handleChange('parametrosTecnicos')} />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Observación Técnica Objetiva (Sin juicio de valor subjetivo)</label>
            <textarea className="form-control form-control-sm" rows={2} style={S.input} value={formData.observacionesTecnicas} onChange={handleChange('observacionesTecnicas')} />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: DICTAMEN INDIVIDUALIZADO & FRE 702 */}
      <div style={S.sectionHeader}>⚖️ 3.0 DICTAMEN INDIVIDUALIZADO POR AUDIO &amp; CRITERIO DAUBERT</div>
      <div className="bg-white p-3 border rounded-bottom shadow-sm">
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Conclusión Técnica Individualizada</label>
            <select className="form-select form-select-sm" style={S.input} value={formData.conclusionDictamen} onChange={handleChange('conclusionDictamen')}>
              <option value="Auténtico">Auténtico (Conforme con génesis de grabación original)</option>
              <option value="Sin evidencia de alteración">Sin evidencia de alteración (Continuidad espectral íntegra)</option>
              <option value="Inconcluso">Inconcluso (Limitación técnica de SNR o degradación)</option>
              <option value="Indicios de manipulación">Indicios de manipulación (Discontinuidad de fase/edición)</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Tasa de Error Conocida del Método</label>
            <input type="text" className="form-control form-control-sm" style={S.inputMono} value={formData.tasaErrorMetodo} onChange={handleChange('tasaErrorMetodo')} />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Fundamento Metodológico Citado (SWGDE / Daubert)</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.fundamentoMetodologico} onChange={handleChange('fundamentoMetodologico')} />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={S.label}>Limitaciones del Análisis Técnico</label>
            <input type="text" className="form-control form-control-sm" style={S.input} value={formData.limitacionesAnalisis} onChange={handleChange('limitacionesAnalisis')} />
          </div>
          <div className="col-12">
            <label className="form-label" style={S.label}>Declaración Jurada del Perito (Requisito Daubert)</label>
            <textarea className="form-control form-control-sm" rows={2} style={S.input} value={formData.declaracionJurada} onChange={handleChange('declaracionJurada')} />
          </div>
        </div>
      </div>

      {/* BOTÓN GUARDAR */}
      <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
        <button type="submit" className="btn btn-primary btn-sm px-4 fw-bold shadow-sm" style={{ backgroundColor: '#005EA2', borderColor: '#005EA2' }}>
          💾 Guardar e Incorporar a la Planilla
        </button>
      </div>
    </form>
  );
}
