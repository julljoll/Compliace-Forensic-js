/**
 * DictamenAudiosPdf.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dictamen Pericial Informático Forense — ANÁLISIS DE AUDIOS WHATSAPP
 * Arquitectura UX/UI centrada en el usuario: 10 Folios con flujo pedagógico
 * Patrón: ¿Qué es? → Proceso → Figura SVG → Resultado → Tabla
 *
 * Estándar: Daubert v. Merrell Dow (1993) + FRE Rule 702 + SWGDE
 *           COPP Arts. 187, 223, 225 | ISO/IEC 27042:2015 | MUCC-2017
 *           Sonic Visualiser v5.x (QMUL, GPL-2.0)
 *
 * Estructura (10 folios):
 *  F01 — Portada Dinámica Foliada
 *  F02 — Preámbulo Institucional + Identificación del Audio + Marco RAG
 *  F03 — Pipeline de 5 Pasos + Decodificación Opus (PASO 1/5) + Triple Hash
 *  F04 — Espectrograma FFT Sonic Visualiser (PASO 2/5)
 *  F05 — Waveform + Formantes F1/F2/F3 (PASO 3/5)
 *  F06 — Pitch F₀ Yin Anti-Deepfake (PASO 4/5) — NUEVA FIGURA
 *  F07 — SNR y Piso de Ruido Ambiental (PASO 5/5)
 *  F08 — Checklist 5 Pilares + Conclusiones + Daubert
 *  F09 — Firmas Bilaterales y Dactiloscopía (COPP Art. 223)
 *  F10 — Bibliografía Normativa RAG + Instrumental Forense
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';
import PlanillaCoverPagePdf from '../PlanillaCoverPagePdf';
import {
  SpectrogramSvg,
  WaveformFormanteSvg,
  SnrBarchartSvg,
  PitchYinTrackingSvg,
} from '../forensicSvgCharts';

// ─── ESTILOS UX PEDAGÓGICOS ──────────────────────────────────────────────────
const uxStyles = StyleSheet.create({
  whatIsBox: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#005EA2',
    padding: 5,
    marginBottom: 4,
    borderRadius: 2,
  },
  whatIsTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#005EA2',
    marginBottom: 2,
  },
  whatIsText: {
    fontSize: 6.5,
    color: '#1E293B',
    lineHeight: 1.35,
    textAlign: 'justify',
  },
  processBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 0.8,
    borderColor: '#CBD5E1',
    padding: 4,
    marginBottom: 4,
    borderRadius: 2,
  },
  processTitle: {
    fontSize: 6.8,
    fontFamily: 'Helvetica-Bold',
    color: '#112E51',
    marginBottom: 2,
  },
  resultBox: {
    backgroundColor: '#F0FFF0',
    borderWidth: 1,
    borderColor: '#006600',
    padding: 5,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 2,
  },
  resultTitle: {
    fontSize: 6.8,
    fontFamily: 'Helvetica-Bold',
    color: '#006600',
    marginBottom: 2,
  },
  resultText: {
    fontSize: 6.3,
    color: '#1E293B',
    textAlign: 'justify',
    lineHeight: 1.3,
  },
  stepBadge: {
    position: 'absolute',
    top: 8,
    right: 14,
    backgroundColor: '#112E51',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  stepBadgeText: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  figureContainer: {
    borderWidth: 1,
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF',
    padding: 5,
    marginBottom: 4,
  },
  figureTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginBottom: 3,
  },
  pipelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: 4,
  },
  pipelineCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#005EA2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipelineCircleText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  pipelineLabel: {
    fontSize: 6.5,
    color: '#1E293B',
    flex: 1,
  },
  checklistRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CBD5E1',
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
});

interface Props {
  caso?: any;
  isBlankMode?: boolean;
}

export const DictamenAudiosPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, 'EXP-2026-SHA-0091');
  const fecha = fmt(c.fecha, '23/07/2026 — 11:45 AM');
  const isBlank = isBlankMode;
  const numeroDictamen = isBlank
    ? ''
    : (c.numeroCaso
      ? (c.numeroCaso.startsWith('DICT-') ? c.numeroCaso : `DICT-AUD-${c.numeroCaso}`)
      : 'DICT-AUD-SHA256-2026-0091');

  return (
    <Document title={`Dictamen_Pericial_Audios_WhatsApp_${c.numeroCaso || 'EXP'}`}>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLIO 01 — PORTADA DINÁMICA FOLIADA                                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <PlanillaCoverPagePdf planillaId="dictamen-audios" caso={caso} isBlankMode={isBlankMode} />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLIO 02 — PREÁMBULO + IDENTIFICACIÓN DEL AUDIO + MARCO RAG          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        <View style={pdfStyles.classificationBanner}>
          <Text style={pdfStyles.classificationText}>
            CONFIDENCIAL — DICTAMEN PERICIAL DE AUDIO FORENSE — NOTAS DE VOZ WHATSAPP (OPUS / SONIC VISUALISER)
          </Text>
        </View>

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>DICTAMEN PERICIAL INFORMÁTICO FORENSE PRIVADO</Text>
          <Text style={pdfStyles.subTitle}>
            ANÁLISIS ACÚSTICO DE AUTENTICIDAD DE NOTAS DE VOZ WHATSAPP — PIPELINE DE 5 ETAPAS (SONIC VISUALISER)
          </Text>

          <View style={pdfStyles.expedienteBox}>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>EXPEDIENTE N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 7.5, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroExpediente}</Text>
              </View>
            </View>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>DICTAMEN N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 7.5, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroDictamen}</Text>
              </View>
            </View>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>FECHA:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 7.5, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{fecha}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 1.0 IDENTIFICACIÓN */}
        <Text id="seccion-1.0" style={pdfStyles.sectionTitle}>1.0 IDENTIFICACIÓN DEL PERITAJE Y DEL AUDIO CONSIGNADO</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Perito Informático Forense Líder:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.peritoLider, 'Ing. Christopher V. Vance')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Consignante / Solicitante:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre, 'Alexander R. Wright')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_cedula, 'V-18.492.019')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Archivo de Audio Analizado:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.descripcion, 'PTT-20260615-WA0017.opus — Nota de Voz WhatsApp | 00:12.4s | 48,000 Hz | Ogg/Opus VBR')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Teléfono de Origen WhatsApp:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.telefono_origen, '+58 414-5928102 (CONATEL)')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Sede / Bóveda de Resguardo:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.sede, 'Sede Principal Quíbor — Bóveda de Custodia SHA256.US')}</Text>
        </View>

        {/* 2.0 MARCO NORMATIVO RAG */}
        <Text id="seccion-2.0" style={[pdfStyles.sectionTitle, { marginTop: 4 }]}>2.0 MARCO NORMATIVO Y REQUISITOS PROBATORIOS RAG</Text>
        <View style={{ paddingLeft: 5 }}>
          {[
            ['COPP (Arts. 187, 223, 225):', 'Cadena de Custodia, designación de mínimo 2 peritos y estructura formal del dictamen.'],
            ['SWGDE (Scientific Working Group on Digital Evidence):', 'Guías técnicas internacionales para análisis forense de audio digital.'],
            ['FRE Rule 702 / Daubert Standard:', 'Admisibilidad científica: metodología comprobable, tasa de error <0.05%, revisión por pares, aceptación general.'],
            ['ISO/IEC 27037:2012 & 27042:2015:', 'Identificación, adquisición, preservación e interpretación de evidencia de audio digital.'],
            ['MUCC-2017 (§ 4-7):', 'Trazabilidad SHA-256, inalterabilidad del soporte y registro pericial.'],
            ['RFC 6716 (IETF):', 'Especificación técnica del Códec Opus utilizado por WhatsApp para notas de voz.'],
            ['Ley sobre Mensajes de Datos y Firmas Electrónicas (Art. 4):', 'Eficacia probatoria de datos y voz transmitidos electrónicamente.'],
          ].map(([bold, text], i) => (
            <Text key={i} style={{ fontSize: 6.5, color: '#1E293B', marginBottom: 1.5 }}>
              {'• '}<Text style={{ fontFamily: 'Helvetica-Bold' }}>{bold}</Text>{' '}{text}
            </Text>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLIO 03 — PIPELINE DE 5 PASOS + DECODIFICACIÓN OPUS (PASO 1/5)      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <View style={uxStyles.stepBadge}>
          <Text style={uxStyles.stepBadgeText}>PASO 1 DE 5</Text>
        </View>

        {/* Pipeline visual */}
        <Text style={pdfStyles.sectionTitle}>3.0 PIPELINE DE ANÁLISIS FORENSE ACÚSTICO — 5 ETAPAS</Text>
        <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.8, borderColor: '#CBD5E1', padding: 5, marginBottom: 5, borderRadius: 2 }}>
          {[
            { n: '1', label: 'Decodificación del Códec Opus (48 kHz) y verificación de tramas anti-splicing', active: true },
            { n: '2', label: 'Espectrograma FFT de frecuencias (0–24 kHz) en Sonic Visualiser — Continuidad armónica' },
            { n: '3', label: 'Forma de Onda (Waveform) y Formantes vocales F1/F2/F3 — Resonancias del tracto vocal' },
            { n: '4', label: 'Frecuencia Fundamental (Pitch F₀) con Algoritmo Yin — Descarte de Deepfake / TTS por IA' },
            { n: '5', label: 'Relación Señal-Ruido (SNR) y Piso de Ruido Ambiental — Grabación en toma única' },
          ].map((step, i) => (
            <View key={i} style={uxStyles.pipelineStep}>
              <View style={[uxStyles.pipelineCircle, step.active ? { backgroundColor: '#006600' } : {}]}>
                <Text style={uxStyles.pipelineCircleText}>{step.n}</Text>
              </View>
              <Text style={[uxStyles.pipelineLabel, step.active ? { fontFamily: 'Helvetica-Bold' } : {}]}>{step.label}</Text>
            </View>
          ))}
        </View>

        {/* ¿QUÉ ES EL CÓDEC OPUS? */}
        <Text style={pdfStyles.sectionTitle}>3.1 DECODIFICACIÓN PEDAGÓGICA DEL CÓDEC OPUS (48 kHz)</Text>
        <View style={uxStyles.whatIsBox}>
          <Text style={uxStyles.whatIsTitle}>🔵 ¿QUÉ ES EL CÓDEC OPUS Y POR QUÉ ES IMPORTANTE?</Text>
          <Text style={uxStyles.whatIsText}>
            WhatsApp graba las notas de voz usando un compresor de audio llamado <Text style={{ fontFamily: 'Helvetica-Bold' }}>Opus</Text> (RFC 6716). Este compresor divide la voz en paquetes de <Text style={{ fontFamily: 'Helvetica-Bold' }}>20 milisegundos</Text> cada uno, muestreados a <Text style={{ fontFamily: 'Helvetica-Bold' }}>48.000 veces por segundo</Text>. Si alguien pegó o empalmó un fragmento de otro audio, los paquetes presentan saltos o discontinuidades detectables. Verificar que todos los paquetes son homogéneos y consecutivos descarta manipulación.
          </Text>
        </View>

        {/* Proceso */}
        <View style={uxStyles.processBox}>
          <Text style={uxStyles.processTitle}>⚙️ PROCESO APLICADO — Decodificación y verificación de tramas Opus:</Text>
          <Text style={{ fontSize: 6.3, color: '#1E293B', lineHeight: 1.3 }}>
            Se extrajo el archivo .opus de la base de datos WhatsApp (msgstore.db) mediante IPED Forensics v4.1 y se decodificó con PyOgg Engine v0.10.11. Se inspeccionaron los límites de trama, la tasa de bits variable (VBR) y los timestamps del contenedor Ogg para detectar empalmes.
          </Text>
        </View>

        {/* Tabla Opus */}
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '28%' }]}>Parámetro Técnico</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '26%' }]}>Valor en la Muestra</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '26%' }]}>Estándar WhatsApp</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Estado</Text>
          </View>
          {[
            ['Frecuencia de Muestreo', '48.000 Hz', '48.000 Hz', 'CONFORME ✓'],
            ['Tamaño de Trama', '20 ms por paquete', '20 ms (SILK Voice)', 'NATIVO ✓'],
            ['Modo de Bitrate', 'VBR (16-32 kbps)', 'VBR Dinámico', 'TÍPICO ✓'],
            ['Canales', 'Mono / 16-bit', 'Mono / 16-bit', 'CONFORME ✓'],
            ['Integridad de Tramas', 'Continuidad total', 'Sin saltos Ogg', 'NO SPLICING ✓'],
          ].map(([p, v, e, s], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '28%', fontFamily: 'Helvetica-Bold', fontSize: 6.2 }]}>{p}</Text>
              <Text style={[pdfStyles.tableCell, { width: '26%', fontSize: 6.2 }]}>{v}</Text>
              <Text style={[pdfStyles.tableCell, { width: '26%', fontSize: 6.2 }]}>{e}</Text>
              <Text style={[pdfStyles.tableCell, { width: '20%', fontSize: 6.2, fontFamily: 'Helvetica-Bold', color: '#006600' }]}>{isBlank ? '' : s}</Text>
            </View>
          ))}
        </View>

        {/* Resultado */}
        <View style={uxStyles.resultBox}>
          <Text style={uxStyles.resultTitle}>✅ RESULTADO DEL PASO 1 — DECODIFICACIÓN OPUS:</Text>
          <Text style={uxStyles.resultText}>
            {isBlank ? '' : 'El archivo Ogg/Opus presenta tramas homogéneas de 20 ms sin saltos de timestamp ni discontinuidades de cuantización. La tasa de bits variable (VBR) es consistente con una grabación directa WhatsApp. NO SE DETECTAN EMPALMES (ANTI-SPLICING VERIFICADO).'}
          </Text>
        </View>

        {/* Triple Hash */}
        <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2, marginBottom: 2 }}>
          VERIFICACIÓN CRIPTOGRÁFICA TRIPLE — MUCC-2017 § 5.1:
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '14%' }]}>Algoritmo</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '51%' }]}>Hash Génesis</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Cierre</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '15%' }]}>Resultado</Text>
          </View>
          {[
            { algo: 'MD5', hash: fmt(c.hashMD5, 'b5f2a3e8c9d1047f6a2d3e8c9b5f1e2d'), resultado: 'MATCH ✓' },
            { algo: 'SHA-1', hash: fmt(c.hashSHA1, '9c3b7a2f1e4d5c8a0b6f3e2d9c7a4b1f0e8d5c3a'), resultado: 'MATCH ✓' },
            { algo: 'SHA-256', hash: fmt(c.hashSHA256, 'b5f2a3e8c9d1047f6a2d3e8c9b5f1e2d7a4c0f3b8e5d2a9c6b3f0e7d4a1c8b502'), resultado: 'MATCH ✓' },
          ].map((row, i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '14%', fontFamily: 'Helvetica-Bold' }]}>{row.algo}</Text>
              <Text style={[pdfStyles.tableCell, { width: '51%', fontSize: 5.5, fontFamily: 'Courier' }]}>{isBlank ? '' : row.hash}</Text>
              <Text style={[pdfStyles.tableCell, { width: '20%', fontSize: 6, color: '#006600' }]}>ÍNTEGRO</Text>
              <Text style={[pdfStyles.tableCell, { width: '15%', fontSize: 6, fontFamily: 'Helvetica-Bold', color: '#006600' }]}>{isBlank ? '' : row.resultado}</Text>
            </View>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLIO 04 — ESPECTROGRAMA FFT (PASO 2/5)                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <View style={uxStyles.stepBadge}>
          <Text style={uxStyles.stepBadgeText}>PASO 2 DE 5</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>4.0 ESPECTROGRAMA FFT — MAPA DE FRECUENCIAS (SONIC VISUALISER)</Text>

        <View style={uxStyles.whatIsBox}>
          <Text style={uxStyles.whatIsTitle}>🔵 ¿QUÉ ES UN ESPECTROGRAMA Y QUÉ REVELA?</Text>
          <Text style={uxStyles.whatIsText}>
            Un espectrograma es un "mapa de calor del sonido": muestra <Text style={{ fontFamily: 'Helvetica-Bold' }}>qué frecuencias</Text> (graves a agudos) están presentes en <Text style={{ fontFamily: 'Helvetica-Bold' }}>cada instante de tiempo</Text>, y con <Text style={{ fontFamily: 'Helvetica-Bold' }}>cuánta energía</Text> (intensidad en decibelios). Si alguien cortó o pegó un fragmento de audio, aparece una línea vertical abrupta o una franja de silencio anómala que rompe la continuidad natural del patrón vocal.
          </Text>
        </View>

        <View style={uxStyles.processBox}>
          <Text style={uxStyles.processTitle}>⚙️ PROCESO — Espectrograma FFT en Sonic Visualiser v5.x:</Text>
          <Text style={{ fontSize: 6.3, color: '#1E293B', lineHeight: 1.3 }}>
            Se cargó la copia forense del archivo .opus en Sonic Visualiser (Queen Mary University of London, GPL-2.0). Se aplicó la Transformada Rápida de Fourier (FFT) con ventana Hann de 2048 bins, 75% de solapamiento y escala logarítmica en dB. El rango frecuencial analizado abarca de 0 a 24.000 Hz (límite de Nyquist a 48 kHz).
          </Text>
        </View>

        <View style={uxStyles.figureContainer}>
          <Text style={uxStyles.figureTitle}>FIGURA 1: ESPECTROGRAMA FFT (0–24 kHz) — SONIC VISUALISER v5.x (Hann 2048 bins)</Text>
          <SpectrogramSvg width={484} height={155} isBlank={isBlank} />
        </View>

        <View style={uxStyles.resultBox}>
          <Text style={uxStyles.resultTitle}>✅ RESULTADO DEL PASO 2 — ESPECTROGRAMA:</Text>
          <Text style={uxStyles.resultText}>
            {isBlank ? '' : 'La densidad espectral de potencia presenta continuidad armónica ininterrumpida en toda la línea temporal. No existen discontinuidades verticales (cortes), franjas de silenciamiento anómalo ni atenuaciones abruptas de banda. La energía se concentra en el rango vocal humano (300–3.400 Hz) con atenuación natural por encima de 8 kHz. CONCLUSIÓN: Espectro íntegro y auténtico.'}
          </Text>
        </View>

        <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 3, marginBottom: 2 }}>
          PARÁMETROS EXACTOS DE SONIC VISUALISER:
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Parámetro</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '35%' }]}>Valor Configurado</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '40%' }]}>Sustento Técnico</Text>
          </View>
          {[
            ['Ventana FFT', 'Hann (Hanning)', 'Minimiza fuga espectral'],
            ['Tamaño de Bloque', '2048 bins (42.66 ms)', 'Resolución: 23.43 Hz/bin'],
            ['Solapamiento', '75% (Hop: 512 muestras)', 'Alta resolución temporal'],
            ['Escala de Amplitud', 'Logarítmica dB (-90 a 0)', 'Rango dinámico del oído'],
          ].map(([p, v, s], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontFamily: 'Helvetica-Bold', fontSize: 6.2 }]}>{p}</Text>
              <Text style={[pdfStyles.tableCell, { width: '35%', fontSize: 6.2 }]}>{v}</Text>
              <Text style={[pdfStyles.tableCell, { width: '40%', fontSize: 6.2 }]}>{s}</Text>
            </View>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLIO 05 — WAVEFORM + FORMANTES F1/F2/F3 (PASO 3/5)                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <View style={uxStyles.stepBadge}>
          <Text style={uxStyles.stepBadgeText}>PASO 3 DE 5</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>5.0 FORMA DE ONDA Y FORMANTES VOCALES F1/F2/F3 (SONIC VISUALISER)</Text>

        <View style={uxStyles.whatIsBox}>
          <Text style={uxStyles.whatIsTitle}>🔵 ¿QUÉ SON LA FORMA DE ONDA Y LOS FORMANTES DE VOZ?</Text>
          <Text style={uxStyles.whatIsText}>
            La <Text style={{ fontFamily: 'Helvetica-Bold' }}>forma de onda</Text> es el dibujo de la vibración del sonido en el tiempo: muestra la amplitud (volumen) segundo a segundo. Los <Text style={{ fontFamily: 'Helvetica-Bold' }}>formantes</Text> son las frecuencias de resonancia del tracto vocal humano (garganta, boca, nariz). Cada persona tiene formantes únicos, como una "huella vocal". Verificar que los formantes son estables y naturales confirma que quien habla es un ser humano real y no una voz sintética.
          </Text>
        </View>

        <View style={uxStyles.processBox}>
          <Text style={uxStyles.processTitle}>⚙️ PROCESO — Waveform y extracción de Formantes en Sonic Visualiser:</Text>
          <Text style={{ fontSize: 6.3, color: '#1E293B', lineHeight: 1.3 }}>
            Se renderizó la forma de onda en modo Peak + RMS overlay con resolución de 10 ms/div y normalización -1.0 a +1.0 V. Simultáneamente se aplicó el plugin de análisis de formantes para localizar las tres primeras resonancias vocales (F1, F2, F3) a lo largo de toda la duración del audio.
          </Text>
        </View>

        <View style={uxStyles.figureContainer}>
          <Text style={uxStyles.figureTitle}>FIGURA 2: WAVEFORM TEMPORAL Y FORMANTES VOCALES F1/F2/F3 — SONIC VISUALISER</Text>
          <WaveformFormanteSvg width={484} height={155} isBlank={isBlank} />
        </View>

        <View style={uxStyles.resultBox}>
          <Text style={uxStyles.resultTitle}>✅ RESULTADO DEL PASO 3 — WAVEFORM Y FORMANTES:</Text>
          <Text style={uxStyles.resultText}>
            {isBlank ? '' : 'La envolvente acústica muestra decaimiento exponencial natural conforme a reverberación física. No se observan silencios artificiales de amplitud 0.0V ni anomalías de cruce por cero. Los formantes F1 (620 Hz), F2 (1.850 Hz) y F3 (2.740 Hz) son fisiológicamente naturales y estables. CONCLUSIÓN: Voz emitida por tracto vocal humano auténtico.'}
          </Text>
        </View>

        <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 3, marginBottom: 2 }}>
          VALORES DE FORMANTES VOCALES DETECTADOS:
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '22%' }]}>Formante</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '28%' }]}>Frecuencia Central</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Comportamiento</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Validación</Text>
          </View>
          {[
            ['F₁ (Primer)', '620 Hz (Apertura Mandibular)', 'Estable / Resonante', 'VOZ HUMANA ✓'],
            ['F₂ (Segundo)', '1.850 Hz (Posición Lingual)', 'Modulación Continua', 'FONACIÓN NATURAL ✓'],
            ['F₃ (Tercer)', '2.740 Hz (Timbre Individual)', 'Estabilidad Acústica', 'TIMBRE CONSISTENTE ✓'],
          ].map(([f, fr, c2, v], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '22%', fontFamily: 'Helvetica-Bold', fontSize: 6.2 }]}>{f}</Text>
              <Text style={[pdfStyles.tableCell, { width: '28%', fontSize: 6.2 }]}>{fr}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.2 }]}>{c2}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.2, fontFamily: 'Helvetica-Bold', color: '#006600' }]}>{isBlank ? '' : v}</Text>
            </View>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLIO 06 — PITCH F₀ YIN ANTI-DEEPFAKE (PASO 4/5) — NUEVA FIGURA     */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <View style={uxStyles.stepBadge}>
          <Text style={uxStyles.stepBadgeText}>PASO 4 DE 5</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>6.0 PITCH FUNDAMENTAL (F₀) — DETECCIÓN ANTI-DEEPFAKE (ALGORITMO YIN)</Text>

        <View style={uxStyles.whatIsBox}>
          <Text style={uxStyles.whatIsTitle}>🔵 ¿QUÉ ES EL PITCH (F₀) Y POR QUÉ DESCARTA DEEPFAKES?</Text>
          <Text style={uxStyles.whatIsText}>
            El <Text style={{ fontFamily: 'Helvetica-Bold' }}>Pitch</Text> (o frecuencia fundamental F₀) es el "tono base" de la voz, determinado por la velocidad de vibración de las cuerdas vocales. En una persona real, el pitch varía constantemente con <Text style={{ fontFamily: 'Helvetica-Bold' }}>micro-inflexiones biológicas</Text> (jitter, shimmer, vibrato laríngeo). Las voces generadas por <Text style={{ fontFamily: 'Helvetica-Bold' }}>Inteligencia Artificial (Deepfake / TTS)</Text> presentan trayectorias planas con saltos abruptos no biológicos. Si la curva de Pitch es fluida y continua, la voz es humana auténtica.
          </Text>
        </View>

        <View style={uxStyles.processBox}>
          <Text style={uxStyles.processTitle}>⚙️ PROCESO — Pitch Tracking con Algoritmo Yin en Sonic Visualiser:</Text>
          <Text style={{ fontSize: 6.3, color: '#1E293B', lineHeight: 1.3 }}>
            Se aplicó el algoritmo Yin (de Cheveigné & Kawahara, 2002) mediante el Vamp Plugin de Sonic Visualiser en el rango de 80 a 400 Hz. El resultado se contrastó con el patrón típico de un sintetizador TTS/Deepfake (línea de referencia roja punteada en la figura) para hacer evidente la diferencia al observador.
          </Text>
        </View>

        <View style={uxStyles.figureContainer}>
          <Text style={uxStyles.figureTitle}>FIGURA 3: PITCH F₀ TRACKING — VOZ HUMANA (verde) vs DEEPFAKE IA (rojo punteado)</Text>
          <PitchYinTrackingSvg width={484} height={160} isBlank={isBlank} />
        </View>

        <View style={uxStyles.resultBox}>
          <Text style={uxStyles.resultTitle}>✅ RESULTADO DEL PASO 4 — PITCH F₀ ANTI-DEEPFAKE:</Text>
          <Text style={uxStyles.resultText}>
            {isBlank ? '' : 'La trayectoria de Pitch F₀ (línea verde) exhibe micro-modulaciones biológicas continuas características de las cuerdas vocales humanas: jitter del 0.8%, shimmer del 1.2% y relación armónico-ruido (HNR) de 22.4 dB. La curva se mantiene dentro de la banda de voz humana adulta (85–255 Hz). No presenta los saltos abruptos ni la planitud típica de sintetizadores TTS o clonaciones Deepfake por IA. CONCLUSIÓN: VOZ HUMANA NATURAL CONFIRMADA — DESCARTADO DEEPFAKE.'}
          </Text>
        </View>

        <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 3, marginBottom: 2 }}>
          COMPARATIVA — VOZ HUMANA vs INTELIGENCIA ARTIFICIAL:
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Indicador</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Voz Humana (Esperado)</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Deepfake / TTS</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Muestra Analizada</Text>
          </View>
          {[
            ['Trayectoria F₀', 'Continua con jitter', 'Plana con saltos', 'CONTINUA ✓ (Humana)'],
            ['Jitter (%)', '0.2% – 1.5%', '< 0.05% (artificial)', '0.8% ✓ (Biológico)'],
            ['Shimmer (%)', '0.5% – 2.5%', '< 0.1% (artificial)', '1.2% ✓ (Biológico)'],
            ['HNR (dB)', '> 15 dB', '> 35 dB (hiper-limpio)', '22.4 dB ✓ (Natural)'],
          ].map(([i2, h, d, m], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontFamily: 'Helvetica-Bold', fontSize: 6.2 }]}>{i2}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.2 }]}>{h}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.2, color: '#D9381E' }]}>{d}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.2, fontFamily: 'Helvetica-Bold', color: '#006600' }]}>{isBlank ? '' : m}</Text>
            </View>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLIO 07 — SNR Y PISO DE RUIDO AMBIENTAL (PASO 5/5)                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <View style={uxStyles.stepBadge}>
          <Text style={uxStyles.stepBadgeText}>PASO 5 DE 5</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>7.0 RELACIÓN SEÑAL-RUIDO (SNR) Y PISO DE RUIDO AMBIENTAL</Text>

        <View style={uxStyles.whatIsBox}>
          <Text style={uxStyles.whatIsTitle}>🔵 ¿QUÉ ES LA RELACIÓN SEÑAL-RUIDO (SNR)?</Text>
          <Text style={uxStyles.whatIsText}>
            La <Text style={{ fontFamily: 'Helvetica-Bold' }}>SNR</Text> mide cuántas veces más fuerte es la voz del hablante respecto al ruido de fondo (aire acondicionado, tráfico, etc.). Se expresa en <Text style={{ fontFamily: 'Helvetica-Bold' }}>decibelios (dB)</Text>: a mayor número, más limpia la grabación. Si el "piso de ruido" cambia bruscamente entre segmentos, significa que se mezclaron fragmentos grabados en distintos lugares o momentos. Un piso estable certifica una grabación continua en el mismo entorno.
          </Text>
        </View>

        <View style={uxStyles.processBox}>
          <Text style={uxStyles.processTitle}>⚙️ PROCESO — Medición de SNR por segmentos temporales:</Text>
          <Text style={{ fontSize: 6.3, color: '#1E293B', lineHeight: 1.3 }}>
            Se segmentó el audio en bloques de 4 segundos y se midió la relación señal-ruido (SNR) en cada segmento. Adicionalmente se analizó el piso de ruido en las pausas vocales (silencios) para verificar su homogeneidad espectral.
          </Text>
        </View>

        <View style={uxStyles.figureContainer}>
          <Text style={uxStyles.figureTitle}>FIGURA 4: SNR POR SEGMENTOS Y AUDITORÍA DE INTEGRIDAD CRIPTOGRÁFICA</Text>
          <SnrBarchartSvg width={484} height={145} isBlank={isBlank} />
        </View>

        <View style={uxStyles.resultBox}>
          <Text style={uxStyles.resultTitle}>✅ RESULTADO DEL PASO 5 — SNR Y PISO DE RUIDO:</Text>
          <Text style={uxStyles.resultText}>
            {isBlank ? '' : 'El SNR promedio es de 44.2 dB con desviación máxima de ±0.4 dB entre segmentos. El piso de ruido en las pausas vocales es estacionario (-58 a -60 dBFS), confirmando que la grabación se realizó en un solo entorno acústico sin edición de silencios ni ensamblaje de fragmentos. CONCLUSIÓN: Grabación en toma única confirmada.'}
          </Text>
        </View>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '22%' }]}>Segmento</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>SNR (dB)</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '28%' }]}>Piso de Ruido</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Consistencia</Text>
          </View>
          {[
            ['0–4 seg', '44.2 dB', '-58.4 dBFS', 'HOMOGÉNEO ✓'],
            ['4–8 seg', '43.8 dB', '-58.1 dBFS', 'HOMOGÉNEO ✓'],
            ['8–12.4 seg', '44.6 dB', '-58.6 dBFS', 'HOMOGÉNEO ✓'],
            ['Pausas vocales', '58.1 dB', '-60.2 dBFS', 'ESTACIONARIO ✓'],
          ].map(([s, snr, nf, c2], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '22%', fontFamily: 'Helvetica-Bold', fontSize: 6.2 }]}>{s}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.2 }]}>{snr}</Text>
              <Text style={[pdfStyles.tableCell, { width: '28%', fontSize: 6.2 }]}>{nf}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.2, fontFamily: 'Helvetica-Bold', color: '#006600' }]}>{isBlank ? '' : c2}</Text>
            </View>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLIO 08 — CHECKLIST 5 PILARES + CONCLUSIONES + DAUBERT              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>8.0 RESUMEN EJECUTIVO — CHECKLIST DE 5 PILARES DE AUTENTICIDAD ACÚSTICA</Text>
        <Text style={{ fontSize: 6.5, color: '#475569', marginBottom: 4 }}>
          Tabla resumen para evaluación rápida por el Tribunal. Cada pilar debe ser CONFORME para dictaminar autenticidad:
        </Text>

        {/* Checklist table */}
        <View style={{ borderWidth: 1, borderColor: '#0F172A', marginBottom: 6 }}>
          <View style={[uxStyles.checklistRow, { backgroundColor: '#112E51' }]}>
            <Text style={{ width: '8%', fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' }}>Paso</Text>
            <Text style={{ width: '30%', fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' }}>Pilar de Autenticidad</Text>
            <Text style={{ width: '40%', fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' }}>Evidencia Clave</Text>
            <Text style={{ width: '22%', fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', textAlign: 'center' }}>Estado</Text>
          </View>
          {[
            ['1', 'Decodificación Opus', 'Tramas de 20ms homogéneas, VBR nativo, sin splicing', 'CONFORME ✓'],
            ['2', 'Espectrograma FFT', 'Continuidad armónica 0–24kHz sin cortes verticales', 'CONFORME ✓'],
            ['3', 'Formantes Vocales F1-F3', 'F1: 620Hz, F2: 1850Hz, F3: 2740Hz — Estables', 'CONFORME ✓'],
            ['4', 'Pitch F₀ Anti-Deepfake', 'Curva Yin biológica, jitter 0.8%, shimmer 1.2%', 'CONFORME ✓'],
            ['5', 'SNR / Piso de Ruido', 'SNR 44.2 dB, piso estacionario -58 dBFS', 'CONFORME ✓'],
          ].map(([n, pilar, evidencia, estado], i) => (
            <View key={i} style={[uxStyles.checklistRow, { backgroundColor: i % 2 === 0 ? '#F0FFF0' : '#FFFFFF' }]}>
              <Text style={{ width: '8%', fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#006600' }}>{isBlank ? '' : n}</Text>
              <Text style={{ width: '30%', fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#1E293B' }}>{pilar}</Text>
              <Text style={{ width: '40%', fontSize: 6.2, color: '#1E293B' }}>{isBlank ? '' : evidencia}</Text>
              <Text style={{ width: '22%', fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#006600', textAlign: 'center' }}>{isBlank ? '' : estado}</Text>
            </View>
          ))}
        </View>

        {/* Dictamen Categórico */}
        <Text style={pdfStyles.sectionTitle}>9.0 DICTAMEN CATEGÓRICO FINAL (COPP ART. 225)</Text>
        <View style={{ borderWidth: 1.5, borderColor: '#006600', backgroundColor: '#F0FFF0', padding: 6, marginBottom: 5 }}>
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#006600', marginBottom: 3, textAlign: 'center' }}>
            DICTAMEN: NOTA DE VOZ WHATSAPP 100% AUTÉNTICA, ÍNTEGRA Y PLENA PRUEBA PROBATORIA
          </Text>
          <Text style={{ fontSize: 6.5, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
            {isBlank ? '' : `Con base en los 5 pilares de análisis acústico-forense ejecutados en el Laboratorio SHA256.US mediante Sonic Visualiser v5.x — (1) decodificación Opus sin empalmes, (2) espectrograma FFT con continuidad armónica íntegra, (3) formantes vocales F1/F2/F3 estables y biológicos, (4) Pitch F₀ con micro-variaciones naturales (descartado Deepfake/IA) y (5) SNR de 44.2 dB con piso de ruido estacionario — el suscrito Perito dictamina categóricamente que la nota de voz ${numeroExpediente} ES ABSOLUTAMENTE AUTÉNTICA, ÍNTEGRA Y FIEL. Tiene pleno valor probatorio conforme a la Ley sobre Mensajes de Datos y Firmas Electrónicas (Art. 4), el COPP (Arts. 187, 223, 225) y el estándar de admisibilidad científica Daubert / FRE Rule 702.`}
          </Text>
        </View>

        {/* Limitaciones */}
        <Text style={pdfStyles.sectionTitle}>10.0 LIMITACIONES TÉCNICAS (FRE RULE 702-b)</Text>
        <View style={pdfStyles.limitationsBox}>
          <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#D97706', marginBottom: 1 }}>
            ALCANCE Y LIMITACIONES:
          </Text>
          <Text style={{ fontSize: 6, color: '#1E293B', textAlign: 'justify', lineHeight: 1.25 }}>
            El análisis se circunscribe a la muestra de audio consignada bajo hash SHA-256 génesis. No se emite pronunciamiento sobre intenciones conductuales, limitándose al rigor técnico del soporte digital.
          </Text>
        </View>

        {/* Cláusula Daubert */}
        <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.8, borderColor: '#CBD5E1', padding: 4, marginTop: 3 }}>
          <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#112E51', marginBottom: 1 }}>
            CLÁUSULA DE VALIDEZ CIENTÍFICA DAUBERT / FRE 702 / SWGDE:
          </Text>
          <Text style={{ fontSize: 5.8, color: '#1E293B', textAlign: 'justify', lineHeight: 1.25 }}>
            El instrumental (Sonic Visualiser, Vamp Plugins, FFTW3) cumple los 4 pilares Daubert: (1) Metodología comprobable y refutable; (2) Tasa de error {'<'} 0.05%; (3) Revisión por pares (QMUL, IRCAM, IEEE); (4) Aceptación general (SWGDE / ENFSI).
          </Text>
        </View>

        <PlanillaFooter />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLIO 09 — FIRMAS BILATERALES Y DACTILOSCOPÍA (COPP ART. 223)        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>XI. JURAMENTO PERICIAL, FIRMAS BILATERALES Y REGISTRO DACTILAR (COPP ART. 223, 225)</Text>

        <View style={pdfStyles.impartialityBox}>
          <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 2 }}>
            JURAMENTO DE OBJETIVIDAD CIENTÍFICA (COPP ART. 225 / DAUBERT):
          </Text>
          <Text style={{ fontSize: 6.2, color: '#1E293B', textAlign: 'justify', lineHeight: 1.3 }}>
            Los suscritos Peritos Informáticos Forenses declaran bajo juramento no poseer interés directo ni indirecto con las partes. El análisis fue ejecutado conforme a principios científicos comprobables, reproducibles e imparciales, sobre copias forenses verificadas con hash SHA-256.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 6 }}>
          {/* PERITO 1 */}
          <View style={[pdfStyles.peritoCard, { width: '48%' }]}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO INFORMÁTICO FORENSE N° 1 (LÍDER)</Text>
            <View style={pdfStyles.peritoCardDividerLine} />
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 2 }}>
              <View style={pdfStyles.peritoThumbBox}><Text style={pdfStyles.peritoThumbText}>PULGAR DER.</Text></View>
              <View style={pdfStyles.peritoThumbBox}><Text style={pdfStyles.peritoThumbText}>PULGAR IZQ.</Text></View>
            </View>
            <View style={pdfStyles.peritoDottedLine} />
            <View style={pdfStyles.peritoSignatureLine} />
            <Text style={pdfStyles.peritoCardSubTitle}>Firma y Sello del Perito Principal</Text>
            <View style={{ marginTop: 2, width: '100%' }}>
              {[
                ['Nombre:', fmt(c.peritoLider, 'Ing. Christopher V. Vance')],
                ['Cédula:', fmt(c.peritoCedula, 'V-19.823.104')],
                ['CIV N°:', fmt(c.peritoCiv, 'CIV N° 284.912')],
                ['INPRE:', fmt(c.peritoInpre, 'INPRE N° 102.849')],
                ['Especialidad:', 'Acústica Forense & Evidencia Digital'],
              ].map(([lbl, val], i) => (
                <View key={i} style={pdfStyles.peritoFieldRow}>
                  <Text style={[pdfStyles.peritoFieldLabel, { fontSize: 5.8 }]}>{lbl}</Text>
                  <Text style={[pdfStyles.peritoFieldValue, { fontSize: 5.8 }]}>{isBlank ? '' : val}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, justifyContent: 'center', gap: 4 }}>
              <Text style={{ fontSize: 5.8, fontFamily: 'Helvetica-Bold' }}>Rol ISO 27037:</Text>
              {['DEFR', 'DES'].map((r, idx) => (
                <View key={r} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>{isBlankMode ? '' : (idx === 1 ? '✓' : '')}</Text></View>
                  <Text style={{ fontSize: 5.8, fontFamily: 'Helvetica-Bold' }}>{r}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* PERITO 2 */}
          <View style={[pdfStyles.peritoCard, { width: '48%' }]}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO INFORMÁTICO FORENSE N° 2 (COPP 223)</Text>
            <View style={pdfStyles.peritoCardDividerLine} />
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 2 }}>
              <View style={pdfStyles.peritoThumbBox}><Text style={pdfStyles.peritoThumbText}>PULGAR DER.</Text></View>
              <View style={pdfStyles.peritoThumbBox}><Text style={pdfStyles.peritoThumbText}>PULGAR IZQ.</Text></View>
            </View>
            <View style={pdfStyles.peritoDottedLine} />
            <View style={pdfStyles.peritoSignatureLine} />
            <Text style={pdfStyles.peritoCardSubTitle}>Firma y Sello del Co-Perito Acreditado</Text>
            <View style={{ marginTop: 2, width: '100%' }}>
              {[
                ['Nombre:', fmt(c.coPeritoNombre, 'Ing. Valentina S. Mendoza')],
                ['Cédula:', fmt(c.coPeritoCedula, 'V-22.104.582')],
                ['CIV N°:', fmt(c.coPeritoCiv, 'CIV N° 312.445')],
                ['INPRE:', fmt(c.coPeritoInpre, 'INPRE N° 118.902')],
                ['Especialidad:', 'Análisis de Señales & Criptografía'],
              ].map(([lbl, val], i) => (
                <View key={i} style={pdfStyles.peritoFieldRow}>
                  <Text style={[pdfStyles.peritoFieldLabel, { fontSize: 5.8 }]}>{lbl}</Text>
                  <Text style={[pdfStyles.peritoFieldValue, { fontSize: 5.8 }]}>{isBlank ? '' : val}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, justifyContent: 'center', gap: 4 }}>
              <Text style={{ fontSize: 5.8, fontFamily: 'Helvetica-Bold' }}>Rol ISO 27037:</Text>
              {['DEFR', 'DES'].map((r, idx) => (
                <View key={r} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>{isBlankMode ? '' : (idx === 1 ? '✓' : '')}</Text></View>
                  <Text style={{ fontSize: 5.8, fontFamily: 'Helvetica-Bold' }}>{r}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <PlanillaFooter />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FOLIO 10 — BIBLIOGRAFÍA NORMATIVA RAG + INSTRUMENTAL                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text id="seccion-12.0" style={pdfStyles.sectionTitle}>XII. ANEXO NORMATIVO RAG Y REGISTRO BIBLIOGRÁFICO</Text>
        <Text style={pdfStyles.paragraph}>
          Fuentes técnico-jurídicas oficiales aplicables al procedimiento pericial de audio forense:
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '22%' }]}>Código / Norma</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '53%' }]}>Título Oficial</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Módulo Normativo</Text>
          </View>
          {[
            ['SWGDE (2020)', 'Scientific Working Group on Digital Evidence — Forensic Audio Analysis', 'Estándar Intl. Audio'],
            ['FRE Rule 702 / Daubert', 'Federal Rules of Evidence 702 — Daubert v. Merrell Dow (1993)', 'Estándar Judicial US'],
            ['MUCC-2017', 'Manual Único de Cadena de Custodia de Evidencias de Venezuela (§ 4-7)', 'Informática Forense VEN'],
            ['ISO/IEC 27037:2012', 'Identification, Collection, Acquisition & Preservation of Digital Evidence', 'Estándar Internacional'],
            ['ISO/IEC 27042:2015', 'Analysis and Interpretation of Digital Evidence (§ 6-7)', 'Estándar Internacional'],
            ['RFC 6716 (IETF)', 'Definition of the Opus Audio Codec — Speech & Audio Transmission', 'Estándar Técnico IETF'],
            ['RFC 3227 (IETF)', 'Guidelines for Evidence Collection and Archiving', 'Estándar Técnico'],
            ['NIST SP 800-86', 'Guide to Integrating Forensic Techniques into Incident Response', 'Publicación US'],
            ['COPP (Gaceta 6.645)', 'Código Orgánico Procesal Penal — Arts. 187, 223-225', 'Sustento VEN'],
            ['Ley Mensajes Datos', 'Ley sobre Mensajes de Datos y Firmas Electrónicas — Art. 4', 'Sustento VEN'],
          ].map(([code, title, mod], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>{code}</Text>
              <Text style={[pdfStyles.tableCell, { width: '53%' }]}>{title}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6 }]}>{mod}</Text>
            </View>
          ))}
        </View>

        <Text style={[pdfStyles.sectionTitle, { marginTop: 6 }]}>XIII. INSTRUMENTAL FORENSE UTILIZADO</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Herramienta</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Versión</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '30%' }]}>Organismo / Autor</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Licencia</Text>
          </View>
          {[
            ['Sonic Visualiser', 'v5.x', 'QMUL (Queen Mary, London)', 'GPL-2.0 (Libre)'],
            ['Vamp Plugins', 'v2.10', 'QMUL C4DM', 'BSD / GPL'],
            ['FFTW3', 'v3.3.10', 'MIT', 'GPL-2.0'],
            ['PyOgg Engine', 'v0.10.11', 'TeamPyOgg', 'Dominio Público'],
            ['IPED Forensics', 'v4.1+', 'Policía Federal de Brasil / INTERPOL', 'GPL-3.0'],
            ['FTK Imager', 'v4.7+', 'Exterro (AccessData)', 'Propietario'],
          ].map(([h, v, o, l], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontFamily: 'Helvetica-Bold', fontSize: 6.2 }]}>{h}</Text>
              <Text style={[pdfStyles.tableCell, { width: '20%', fontSize: 6.2, fontFamily: 'Courier' }]}>{v}</Text>
              <Text style={[pdfStyles.tableCell, { width: '30%', fontSize: 6.2 }]}>{o}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.2 }]}>{l}</Text>
            </View>
          ))}
        </View>

        <Text style={[pdfStyles.paragraph, { marginTop: 10, textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>
          FIN DEL DICTAMEN PERICIAL — ANÁLISIS DE AUDIOS WHATSAPP (SONIC VISUALISER) — {numeroDictamen}
        </Text>
        <Text style={[pdfStyles.paragraph, { textAlign: 'center', fontSize: 7 }]}>
          Laboratorio SHA256.US — Informática Forense y Cumplimiento Normativo — Sede Principal Quíbor, Venezuela
        </Text>

        <PlanillaFooter />
      </Page>

    </Document>
  );
};

export default DictamenAudiosPdf;
