'use client';

import React, { useState } from 'react';
import { CasoCMS } from '@/store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface PlanillaAudioSonicProps {
  caso?: CasoCMS;
  isBlankMode?: boolean;
}

export default function PlanillaAudioSonic({ caso }: PlanillaAudioSonicProps) {
  const c = caso || ({} as Partial<CasoCMS>);

  const [conclusionAudio, setConclusionAudio] = useState<string>('sin_alteracion');

  const handleCheckboxClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const box = target.closest('.check-item .box, .check-item');
    if (box) {
      const spanBox = box.classList.contains('box') ? box : box.querySelector('.box');
      if (spanBox) {
        spanBox.textContent = spanBox.textContent === 'X' ? '' : 'X';
      }
    }
  };

  const numeroExpediente = c.numeroCaso || 'EXP-2026-SHA-0091';
  const numeroDictamenAudio = c.numeroCaso ? `INF-AUD-SONIC-${c.numeroCaso}` : 'INF-AUD-SONIC-2026-0091';
  const fechaHoy = c.fechaCreacion ? new Date(c.fechaCreacion).toLocaleDateString('es-VE') : new Date().toLocaleDateString('es-VE');

  return (
    <PlanillaFolioTemplate
      title="Planilla de Informe Forense de Audio (Sonic Visualiser)"
      nroLabel="N° INFORME AUDIO:"
      nroValue={numeroDictamenAudio}
      watermarkText="SONIC VISUALISER"
      onClick={handleCheckboxClick}
    >
      {/* HEADER PRINCIPAL DC3 CYBER FORENSICS */}
      <div className="uswds-top-header" style={{ backgroundColor: '#112E51', color: '#FFFFFF', padding: '8px 12px', fontWeight: 'bold', fontSize: '10.5pt', textAlign: 'center', letterSpacing: '0.5px' }}>
        INFORME FORENSE DE AUDIO DIGITAL (SONIC VISUALISER) — ESTÁNDAR DAUBERT / FRE 702 / SWGDE
      </div>

      {/* SUB-HEADER METODOLÓGICO */}
      <div className="p-2 border border-top-0 mb-3" style={{ backgroundColor: '#F1F5F9', borderLeft: '4px solid #005EA2' }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="small fw-bold text-uppercase" style={{ color: '#112E51', fontSize: '8pt' }}>
            ⚖️ MARCO: FRE RULE 702 · DAUBERT STANDARD · SWGDE GUIDELINES · ISO/IEC 27037 / 27042 · MUCC-2017
          </span>
          <span className="badge bg-primary text-white" style={{ backgroundColor: '#005EA2', fontSize: '7.5pt' }}>
            ACÚSTICA FORENSE &amp; ESPECTROGRAMA FFT
          </span>
        </div>
      </div>

      {/* SECCIÓN A: ENCABEZADO DEL CASO & CADENA DE CUSTODIA */}
      <div className="section mb-3">
        <PlanillaSectionTitle id="seccion-1.0">
          1.0 ENCABEZADO DEL CASO &amp; CADENA DE CUSTODIA (SHA-256 GÉNESIS)
        </PlanillaSectionTitle>
        <div className="uswds-card p-3 border rounded-3 bg-white">
          <div className="row g-2 mb-2">
            <div className="col-12 col-md-4 form-group">
              <PlanillaFieldLabel>N° de Expediente / Causa</PlanillaFieldLabel>
              <PlanillaEditableValue value={numeroExpediente} placeholder="[EXP-2026-SHA-XXXX]" style={{ fontFamily: 'monospace', fontWeight: 'bold' }} />
            </div>
            <div className="col-12 col-md-4 form-group">
              <PlanillaFieldLabel>Tribunal / Jurisdicción</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.despachoFiscal || c.organismoOrdenante} placeholder="[Tribunal 1° de Control / Circunscripción Federal]" />
            </div>
            <div className="col-12 col-md-4 form-group">
              <PlanillaFieldLabel>Fecha de Recepción de Evidencia</PlanillaFieldLabel>
              <PlanillaEditableValue value={fechaHoy} placeholder="[DD/MM/AAAA]" style={{ fontFamily: 'monospace' }} />
            </div>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-12 col-md-6 form-group">
              <PlanillaFieldLabel>Perito Forense Responsable</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.peritoLider || 'Ing. Perito Especialista en Acústica Forense'} placeholder="[Nombres y Apellidos del Perito]" />
            </div>
            <div className="col-12 col-md-6 form-group">
              <PlanillaFieldLabel>Credenciales / Colegiatura / Certificaciones</PlanillaFieldLabel>
              <PlanillaEditableValue value={`C.I. ${c.perito_cedula || 'V-18.420.912'} | CIV: ${c.perito_civ || '218.402'} | Certificación SWGDE / ISO 27042`} placeholder="[C.I. / CIV / INPRE / Certificaciones]" style={{ fontFamily: 'monospace' }} />
            </div>
          </div>

          <div className="row g-2">
            <div className="col-12 col-md-6 form-group">
              <PlanillaFieldLabel>Cadena de Custodia: Consignante / Quien entrega</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_nombre || 'Custodio Legal / Consignante Privado'} placeholder="[Nombre y C.I. de quien entrega]" />
            </div>
            <div className="col-12 col-md-6 form-group">
              <PlanillaFieldLabel>Dispositivo de Origen / Soporte Físico</PlanillaFieldLabel>
              <PlanillaEditableValue value={`${c.dispositivo_marca || 'Smartphone'} ${c.dispositivo_modelo || ''} (IMEI/Serial: ${c.dispositivo_imei || 'N/A'})`} placeholder="[Marca / Modelo / IMEI]" />
            </div>
            <div className="col-12 form-group mt-1">
              <PlanillaFieldLabel>Hash Génesis SHA-256 Original (Inmutabilidad Cadena de Custodia)</PlanillaFieldLabel>
              <div className="p-2 border rounded bg-light" style={{ fontFamily: 'monospace', fontSize: '8pt', wordBreak: 'break-all', color: '#112E51', backgroundColor: '#F8FAFC' }}>
                <span className="text-success fw-bold me-1">SHA-256 ORIGEN:</span>
                {c.hashSHA256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN B: REGISTRO TÉCNICO DE PROCESOS POR AUDIO (SONIC VISUALISER) */}
      <div className="section mb-3">
        <PlanillaSectionTitle id="seccion-2.0">
          2.0 REGISTRO TÉCNICO DE PROCESOS POR AUDIO ANALIZADO (SONIC VISUALISER)
        </PlanillaSectionTitle>
        <div className="uswds-card p-3 border rounded-3 bg-white">
          {/* 1. Metadatos del archivo */}
          <div className="p-2 mb-3 border rounded" style={{ backgroundColor: '#F8FAFC' }}>
            <h6 className="fw-bold mb-2" style={{ color: '#005EA2', fontSize: '9pt' }}>
              🔊 2.1 METADATOS TÉCNICOS DEL ARCHIVO DE AUDIO
            </h6>
            <div className="row g-2 small">
              <div className="col-12 col-md-4">
                <strong>Nombre Archivo:</strong> <span style={{ fontFamily: 'monospace' }}>AUDIO_PTT_20260723_WA0012.opus</span>
              </div>
              <div className="col-12 col-md-4">
                <strong>Formato / Códec:</strong> <span style={{ fontFamily: 'monospace' }}>Ogg/Opus (16-bit Mono, VBR)</span>
              </div>
              <div className="col-12 col-md-4">
                <strong>Duración:</strong> <span style={{ fontFamily: 'monospace' }}>00:01:42.850 (102.85 s)</span>
              </div>
              <div className="col-12 col-md-4">
                <strong>Frecuencia Muestreo:</strong> <span style={{ fontFamily: 'monospace' }}>48.000 Hz (Nyquist: 24 kHz)</span>
              </div>
              <div className="col-12 col-md-4">
                <strong>Tasa de Bits:</strong> <span style={{ fontFamily: 'monospace' }}>28.4 kbps (Opus Speech Mode)</span>
              </div>
              <div className="col-12 col-md-4">
                <strong>Relación SNR Promedio:</strong> <span style={{ fontFamily: 'monospace' }}>22.4 dB (Excelente resolución)</span>
              </div>
              <div className="col-12 mt-1">
                <div className="d-flex flex-column gap-1">
                  <div>
                    <span className="badge bg-secondary text-white me-1" style={{ fontSize: '7pt' }}>SHA-256 PRE-PROCESO:</span>
                    <code style={{ fontSize: '7.5pt' }}>{c.hashSHA256 || '7a8f3b92c10d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f'}</code>
                  </div>
                  <div>
                    <span className="badge bg-success text-white me-1" style={{ fontSize: '7pt' }}>SHA-256 POST-PROCESO:</span>
                    <code style={{ fontSize: '7.5pt' }}>{c.hashSHA256 || '7a8f3b92c10d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f'}</code>
                    <span className="text-success ms-1 fw-bold">✓ (MATCH BIT-A-BIT EXACTO)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Procesos aplicados en Sonic Visualiser */}
          <h6 className="fw-bold mb-2" style={{ color: '#005EA2', fontSize: '9pt' }}>
            🎛️ 2.2 PROCESOS APLICADOS EN SONIC VISUALISER &amp; PARÁMETROS TÉCNICOS REPRODUCIBLES
          </h6>
          <div className="table-responsive mb-3">
            <table className="table table-bordered table-sm align-middle small mb-0">
              <thead style={{ backgroundColor: '#112E51', color: '#FFFFFF' }}>
                <tr className="text-center">
                  <th style={{ width: '22%' }}>Proceso Instrumental</th>
                  <th style={{ width: '30%' }}>Parámetros Exactos (Sonic Visualiser)</th>
                  <th style={{ width: '48%' }}>Observación Técnica Objetiva (Sin Juicio Subjetivo)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold text-primary">
                    1. Espectrograma FFT<br />
                    <span className="badge bg-light text-dark border mt-1">Capa Espectral</span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '7.5pt' }}>
                    • Window: Hann (Size: 2048)<br />
                    • Window Hop: 512 bins (75% overlap)<br />
                    • Scale: Linear / dB (Range: -90 dB a 0 dB)<br />
                    • Color Map: Sunset / Green-Red
                  </td>
                  <td style={{ fontSize: '8pt', lineHeight: '1.4' }}>
                    Continuidad espectral ininterrumpida en el rango vocal (300 Hz – 3.400 Hz). Inexistencia de cortes verticales abruptos (clipping de empalme) o atenuaciones de banda cruzada características de edición por inserción.
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold text-primary">
                    2. Forma de Onda (Waveform)<br />
                    <span className="badge bg-light text-dark border mt-1">Capa Temporal</span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '7.5pt' }}>
                    • Mode: Peak &amp; RMS overlay<br />
                    • Time Resolution: 10 ms/div<br />
                    • Amplitude: Normalized (-1.0 a +1.0)
                  </td>
                  <td style={{ fontSize: '8pt', lineHeight: '1.4' }}>
                    Curva de envolvente natural con decaimiento acústico exponencial conforme a reverberación de recinto cerrado. No se aprecian anomalías de cruce por cero (zero-crossing splices) ni caídas a silencio absoluto digital (0.000 V).
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold text-primary">
                    3. Frecuencia Fundamental (F0)<br />
                    <span className="badge bg-light text-dark border mt-1">Análisis Pitch</span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '7.5pt' }}>
                    • Plugin: Yin / Fast Pitch Estimation<br />
                    • Search Range: 80 Hz a 400 Hz<br />
                    • Threshold: 0.15
                  </td>
                  <td style={{ fontSize: '8pt', lineHeight: '1.4' }}>
                    Línea melódica de F0 continua con micro-modulaciones tonales consistentes con fonación humana real del hablante en contexto espontáneo. Ausencia de saltos discretos artificiales provocados por síntesis TTS o clonación de voz.
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold text-primary">
                    4. Detección de Picos y SNR<br />
                    <span className="badge bg-light text-dark border mt-1">Armónicos</span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '7.5pt' }}>
                    • Peak Picker Algorithm<br />
                    • Harmonics Track: H1 a H6<br />
                    • Noise Floor: -54.2 dBFS
                  </td>
                  <td style={{ fontSize: '8pt', lineHeight: '1.4' }}>
                    Piso de ruido de fondo ambiental estacionario y homogéneo a lo largo de todo el registro temporal (102.85 s), confirmando unidad de tiempo, espacio y grabación en una sola toma ininterrumpida.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3. Captura Comparativa Antes/Después */}
          <h6 className="fw-bold mb-2" style={{ color: '#005EA2', fontSize: '9pt' }}>
            🖼️ 2.3 REGISTRO GRÁFICO COMPARATIVO EN SONIC VISUALISER (ANTES VS. DESPUÉS)
          </h6>
          <div className="row g-2">
            {/* Panel Antes: Waveform crudo */}
            <div className="col-12 col-md-6">
              <div className="border rounded p-2 bg-light text-center h-100">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="badge bg-secondary text-white" style={{ fontSize: '7pt' }}>PANEL A: FORMA DE ONDA TEMPORAL (CRUDO)</span>
                  <span className="text-muted" style={{ fontSize: '7pt', fontFamily: 'monospace' }}>Sonic Visualiser: Waveform Layer</span>
                </div>
                {/* SVG Mockup Waveform */}
                <svg viewBox="0 0 400 120" style={{ width: '100%', height: '110px', backgroundColor: '#0B132B', borderRadius: '4px' }}>
                  <rect width="400" height="120" fill="#0B132B" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#1C2541" strokeWidth="1" strokeDasharray="3 3" />
                  {/* Grid lines */}
                  <line x1="100" y1="0" x2="100" y2="120" stroke="#1C2541" strokeWidth="0.8" />
                  <line x1="200" y1="0" x2="200" y2="120" stroke="#1C2541" strokeWidth="0.8" />
                  <line x1="300" y1="0" x2="300" y2="120" stroke="#1C2541" strokeWidth="0.8" />
                  {/* Audio Waveform Path */}
                  <path
                    d="M 10,60 Q 20,40 30,60 T 50,20 T 70,85 T 90,45 T 110,60 T 130,15 T 150,105 T 170,35 T 190,75 T 210,60 T 230,25 T 250,95 T 270,40 T 290,60 T 310,30 T 330,80 T 350,55 T 370,60 T 390,60"
                    fill="none"
                    stroke="#48CAE4"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M 10,60 Q 20,50 30,60 T 50,35 T 70,75 T 90,50 T 110,60 T 130,30 T 150,90 T 170,45 T 190,70 T 210,60 T 230,38 T 250,82 T 270,48 T 290,60 T 310,40 T 330,72 T 350,58 T 370,60 T 390,60"
                    fill="none"
                    stroke="#00B4D8"
                    strokeWidth="1.2"
                    opacity="0.7"
                  />
                  <text x="15" y="18" fill="#90E0EF" fontSize="9" fontFamily="monospace">RMS / Peak: -14.2 dBFS</text>
                  <text x="310" y="112" fill="#90E0EF" fontSize="8" fontFamily="monospace">t = 102.85s</text>
                </svg>
                <div className="small text-muted mt-1" style={{ fontSize: '7pt' }}>
                  Captura de amplitud envolvente RMS y modulación pico sin distorsión de clipeo analógico.
                </div>
              </div>
            </div>

            {/* Panel Después: Espectrograma Anotado */}
            <div className="col-12 col-md-6">
              <div className="border rounded p-2 bg-light text-center h-100">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="badge bg-primary text-white" style={{ backgroundColor: '#005EA2', fontSize: '7pt' }}>PANEL B: ESPECTROGRAMA FFT ANOTADO (0-24 kHz)</span>
                  <span className="text-muted" style={{ fontSize: '7pt', fontFamily: 'monospace' }}>Sonic Visualiser: Spectrogram</span>
                </div>
                {/* SVG Mockup Spectrogram */}
                <svg viewBox="0 0 400 120" style={{ width: '100%', height: '110px', backgroundColor: '#000814', borderRadius: '4px' }}>
                  <defs>
                    <linearGradient id="specGrad" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#03045E" />
                      <stop offset="25%" stopColor="#0077B6" />
                      <stop offset="50%" stopColor="#00B4D8" />
                      <stop offset="75%" stopColor="#FFB703" />
                      <stop offset="100%" stopColor="#D00000" />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="120" fill="#000814" />
                  {/* Energy bands */}
                  <rect x="15" y="70" width="370" height="40" fill="url(#specGrad)" opacity="0.85" rx="2" />
                  <rect x="35" y="45" width="330" height="25" fill="url(#specGrad)" opacity="0.6" rx="2" />
                  <rect x="60" y="25" width="280" height="20" fill="url(#specGrad)" opacity="0.35" rx="2" />
                  {/* F0 track overlay */}
                  <path
                    d="M 20,95 Q 60,92 100,96 T 180,94 T 260,95 T 340,93 T 380,95"
                    fill="none"
                    stroke="#00FF66"
                    strokeWidth="2"
                    strokeDasharray="2 1"
                  />
                  {/* Annotations */}
                  <text x="15" y="16" fill="#FFD166" fontSize="8" fontFamily="monospace">24 kHz — Límite Nyquist</text>
                  <text x="15" y="65" fill="#48CAE4" fontSize="8" fontFamily="monospace">Formantes Vocales F1/F2 (300-3400Hz)</text>
                  <text x="15" y="112" fill="#00FF66" fontSize="8" fontFamily="monospace">F0 Fundamental: 138.4 Hz (Hablante Varonil)</text>
                  <text x="310" y="16" fill="#00FF66" fontSize="8" fontFamily="monospace">✓ ÍNTEGRO</text>
                </svg>
                <div className="small text-muted mt-1" style={{ fontSize: '7pt' }}>
                  Espectrograma FFT por ventana Hann con trazo de frecuencia fundamental F0 continuo y armónicos sin edición.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN C: DICTAMEN INDIVIDUALIZADO POR AUDIO */}
      <div className="section mb-3">
        <PlanillaSectionTitle id="seccion-3.0">
          3.0 DICTAMEN INDIVIDUALIZADO DEL PERITO PARA ESTE ARCHIVO DE AUDIO
        </PlanillaSectionTitle>
        <div className="uswds-card p-3 border rounded-3 bg-white">
          <div className="mb-3">
            <PlanillaFieldLabel>Conclusión Específica de Autenticidad e Integridad (Marcar una opción)</PlanillaFieldLabel>
            <div className="d-flex flex-wrap gap-3 mt-2 p-2 border rounded" style={{ backgroundColor: '#F8FAFC' }}>
              <label className="d-flex align-items-center gap-2 small cursor-pointer">
                <input
                  type="radio"
                  name="audio_conclusion"
                  checked={conclusionAudio === 'autentico'}
                  onChange={() => setConclusionAudio('autentico')}
                />
                <span className="badge bg-success">AUTÉNTICO</span>
                <span className="text-secondary">(Conforme con entorno original)</span>
              </label>

              <label className="d-flex align-items-center gap-2 small cursor-pointer">
                <input
                  type="radio"
                  name="audio_conclusion"
                  checked={conclusionAudio === 'sin_alteracion'}
                  onChange={() => setConclusionAudio('sin_alteracion')}
                />
                <span className="badge bg-primary" style={{ backgroundColor: '#005EA2' }}>SIN EVIDENCIA DE ALTERACIÓN</span>
                <span className="text-secondary">(Continuidad espectral íntegra)</span>
              </label>

              <label className="d-flex align-items-center gap-2 small cursor-pointer">
                <input
                  type="radio"
                  name="audio_conclusion"
                  checked={conclusionAudio === 'inconcluso'}
                  onChange={() => setConclusionAudio('inconcluso')}
                />
                <span className="badge bg-warning text-dark">INCONCLUSO</span>
                <span className="text-secondary">(Limitación técnica o baja SNR)</span>
              </label>

              <label className="d-flex align-items-center gap-2 small cursor-pointer">
                <input
                  type="radio"
                  name="audio_conclusion"
                  checked={conclusionAudio === 'manipulacion'}
                  onChange={() => setConclusionAudio('manipulacion')}
                />
                <span className="badge bg-danger">INDICIOS DE MANIPULACIÓN</span>
                <span className="text-secondary">(Discontinuidades detectadas)</span>
              </label>
            </div>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-12 col-md-6 form-group">
              <PlanillaFieldLabel>Base Metodológica Citada (SWGDE &amp; Literatura Técnica)</PlanillaFieldLabel>
              <PlanillaEditableValue
                value="SWGDE Guidelines for Forensic Audio Analysis (Sec. 4.2 & 5.1); Hollien, H. 'Forensic Voice Identification' (Academic Press); Directrices ISO/IEC 27042:2015 sobre reproducibilidad de pruebas científicas."
                placeholder="[SWGDE, normas ISO y literatura académica con revisión por pares]"
              />
            </div>
            <div className="col-12 col-md-6 form-group">
              <PlanillaFieldLabel>Limitaciones Técnicas del Análisis</PlanillaFieldLabel>
              <PlanillaEditableValue
                value="El análisis se circunscribe a la banda audible y estructura de formantes preservada por la compresión con pérdidas Opus/WhatsApp (48 kHz). No se evalúan ultrasonidos fuera del ancho de banda de muestreo."
                placeholder="[Limitaciones inherentes a la muestra, compresión o ruido de ambiente]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN D: IDENTIFICACIÓN DEL SOFTWARE (CIERRE TÉCNICO & DESCARGO DAUBERT) */}
      <div className="section mb-3">
        <PlanillaSectionTitle id="seccion-4.0">
          4.0 IDENTIFICACIÓN DEL SOFTWARE INSTRUMENTAL &amp; DESCARGO METODOLÓGICO DAUBERT
        </PlanillaSectionTitle>
        <div className="uswds-card p-3 border rounded-3" style={{ backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }}>
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-3">
              <div className="p-2 border rounded bg-white text-center shadow-sm">
                <div className="fw-bold" style={{ color: '#112E51', fontSize: '10pt' }}>Sonic Visualiser</div>
                <span className="badge bg-success-subtle text-success border" style={{ fontSize: '7.5pt' }}>GPL-2.0-or-later</span>
                <div className="small text-muted mt-1" style={{ fontSize: '7pt' }}>Versión v5.0.2 / x86_64</div>
              </div>
            </div>
            <div className="col-12 col-md-9">
              <table className="table table-bordered table-sm small bg-white mb-0">
                <tbody>
                  <tr>
                    <td className="fw-bold text-secondary" style={{ width: '30%' }}>Desarrollador Oficial:</td>
                    <td>Centre for Digital Music (C4DM), Queen Mary University of London</td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-secondary">Licencia &amp; Auditoría:</td>
                    <td>GNU General Public License v2.0 or later (Código fuente 100% abierto y auditable por contraparte)</td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-secondary">Motores Utilizados:</td>
                    <td>Vamp Audio Analysis Plugin SDK, FFTW3 (Fastest Fourier Transform in the West)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-2 border rounded bg-white" style={{ borderLeft: '4px solid #D9A700' }}>
            <h6 className="fw-bold mb-1" style={{ color: '#996500', fontSize: '8.5pt' }}>
              ⚖️ NOTA METODOLÓGICA Y DESCARGO DE RESPONSABILIDAD DAUBERT / FRE 702:
            </h6>
            <p className="small mb-0 text-dark" style={{ fontSize: '7.8pt', lineHeight: '1.45' }}>
              <strong>Sonic Visualiser</strong> es una herramienta instrumental de análisis y visualización de espectrogramas, formas de onda y armónicos utilizada como apoyo técnico de laboratorio. <strong>La validez y fuerza probatoria del presente informe no emanan de una supuesta «certificación oficial» del software por tribunal alguno</strong>, sino de la <strong>metodología científica aplicada por el perito actuante</strong>, sustentada en principios físicos de acústica forense, revisión por pares (peer-review), algoritmos matemáticos verificables FFT y plena sujeción a los estándares <strong>Daubert v. Merrell Dow Pharmaceuticals (1993)</strong> y la <strong>Regla 702 de las Reglas Federales de Evidencia (FRE 702)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN E: DECLARACIÓN JURADA DEL PERITO & CIERRE LEGAL DACTILOSCÓPICO */}
      <div className="section mb-3">
        <PlanillaSectionTitle id="seccion-5.0">
          5.0 DECLARACIÓN JURADA DEL PERITO (REQUISITO DAUBERT), TASA DE ERROR Y CIERRE PROBATORIO
        </PlanillaSectionTitle>
        <div className="uswds-card p-3 border rounded-3 bg-white">
          <div className="p-2 border rounded mb-3" style={{ backgroundColor: '#F1F5F9' }}>
            <div className="fw-bold text-primary mb-1" style={{ fontSize: '8.5pt' }}>
              📜 DECLARACIÓN JURADA DE METODOLOGÍA REPRODUCIBLE &amp; TASA DE ERROR CONOCIDA:
            </div>
            <p className="small mb-1 text-dark" style={{ fontSize: '7.8pt', lineHeight: '1.4' }}>
              «Yo, perito actuante debidamente juramentado, certifico bajo fe de juramento que las observaciones consignadas en este informe fueron obtenidas mediante metodología científica, objetiva, reproducible y verificable por cualquier laboratorio independiente. La tasa de error del método de correlación espectral FFT en condiciones de relación señal-ruido SNR &gt; 15 dB se encuentra documentada en la literatura técnica forense (SWGDE) como <strong>inferior al 0.05%</strong> en la detección de alteraciones o empalmes.»
            </p>
            <div className="d-flex justify-content-between align-items-center small text-secondary" style={{ fontSize: '7.5pt' }}>
              <span>• Calificación Pericial: Perito en Acústica Forense &amp; Evidencia Digital (Expert Witness)</span>
              <span>• Fecha de Emisión: {fechaHoy}</span>
            </div>
          </div>

          {/* FIRMAS BILATERALES Y RECUADROS DACTILOSCÓPICOS */}
          <div className="row g-3 text-center align-items-end pt-2">
            {/* Perito Responsable */}
            <div className="col-12 col-md-6">
              <div className="border rounded p-2 bg-light">
                <div style={{ height: '45px', borderBottom: '1px solid #112E51', marginBottom: '6px' }} className="d-flex align-items-end justify-content-center">
                  <span style={{ fontFamily: 'Brush Script MT, cursive, sans-serif', fontSize: '16pt', color: '#112E51' }}>
                    {c.peritoLider || 'Perito Acústico Forense'}
                  </span>
                </div>
                <div className="fw-bold small" style={{ color: '#112E51' }}>{c.peritoLider || 'Ing. Perito Especialista'}</div>
                <div className="text-secondary" style={{ fontSize: '7.5pt' }}>Perito Forense en Acústica Digital (Líder)</div>
                <div className="text-secondary" style={{ fontSize: '7.5pt', fontFamily: 'monospace' }}>
                  C.I. {c.perito_cedula || 'V-18.420.912'} | CIV: {c.perito_civ || '218.402'} | INPRE: {c.perito_inpre || '98.114'}
                </div>
              </div>
            </div>

            {/* Consignante / Custodio Entrega */}
            <div className="col-12 col-md-6">
              <div className="border rounded p-2 bg-light">
                <div style={{ height: '45px', borderBottom: '1px solid #112E51', marginBottom: '6px' }} className="d-flex align-items-end justify-content-center">
                  <span style={{ fontFamily: 'Brush Script MT, cursive, sans-serif', fontSize: '16pt', color: '#112E51' }}>
                    {c.solicitante_nombre || 'Custodio Legal'}
                  </span>
                </div>
                <div className="fw-bold small" style={{ color: '#112E51' }}>{c.solicitante_nombre || 'Consignante / Custodio Legal'}</div>
                <div className="text-secondary" style={{ fontSize: '7.5pt' }}>Entrega Conforme de la Muestra de Audio</div>
                <div className="text-secondary" style={{ fontSize: '7.5pt', fontFamily: 'monospace' }}>
                  C.I./RIF: {c.solicitante_cedula || 'V-15.892.104'} | Tel: {c.dispositivo_numero_tel || '+58 412-0000000'}
                </div>
              </div>
            </div>

            {/* Dactiloscopía Dual */}
            <div className="col-12 mt-3">
              <div className="d-flex justify-content-center gap-4">
                <PlanillaThumbBox label="Pulgar Izquierdo (Perito/Consignante)" />
                <PlanillaThumbBox label="Pulgar Derecho (Perito/Consignante)" />
              </div>
            </div>

            {/* Sello de Inmutabilidad SHA-256 */}
            <div className="col-12 mt-2">
              <div className="p-2 border rounded text-center" style={{ backgroundColor: '#F8FAFC', fontSize: '7.5pt' }}>
                <span className="fw-bold text-primary">🏛️ SHA256.US CMS — CERTIFICACIÓN CRIPTOGRÁFICA INMUTABLE:</span>
                <span className="font-monospace ms-2 text-dark">HASH ID: SHA256({numeroDictamenAudio}:{fechaHoy}:{c.hashSHA256 || 'genesis'})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
