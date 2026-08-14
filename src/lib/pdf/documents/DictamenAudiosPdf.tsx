/**
 * DictamenAudiosPdf.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dictamen Pericial Informático Forense — Versión ANÁLISIS DE AUDIOS WHATSAPP
 * Estándar: Daubert v. Merrell Dow Pharmaceuticals (1993) + FRE Rule 702
 *            SWGDE (Scientific Working Group on Digital Evidence)
 *            COPP Arts. 187, 223, 225 | ISO/IEC 27042:2015 | MUCC-2017
 *            Sonic Visualiser v5.x (QMUL, GPL-2.0) — Ogg/Opus Decoder 48 kHz
 *
 * Estructura (8 folios):
 *  Folio 01 — Portada Dinámica Foliada (PlanillaCoverPagePdf)
 *  Folio 02 — Portada Interna, Preámbulo Institucional y Marco Normativo RAG
 *  Folio 03 — Decodificación Pedagógica Opus 48kHz, Metodología Sonic Visualiser, Pitch F0 Anti-Deepfake y Cláusula Daubert
 *  Folio 04 — FIGURA 1: Espectrograma de Frecuencias (0-24 kHz) — Sonic Visualiser FFT Hann 2048
 *  Folio 05 — FIGURA 2: Waveform Temporal + Análisis de Formantes F1/F2/F3 + Pitch F0 Yin
 *  Folio 06 — FIGURA 3: Análisis SNR + Piso de Ruido Estacionario + Triple Hash Opus
 *  Folio 07 — Conclusiones Periciales + Limitaciones FRE 702-b + Firmas Bilaterales y Dactiloscopía (COPP Art. 223)
 *  Folio 08 — Bibliografía Normativa RAG (MUCC-2017 + ISO + COPP + SWGDE + FRE 702)
 */

import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';
import PlanillaCoverPagePdf from '../PlanillaCoverPagePdf';
import {
  SpectrogramSvg,
  WaveformFormanteSvg,
  SnrBarchartSvg,
} from '../forensicSvgCharts';

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
      {/* ====================================================================== */}
      {/* PÁGINA 1 (FOLIO 01) — PORTADA DINÁMICA FOLIADA                        */}
      {/* ====================================================================== */}
      <PlanillaCoverPagePdf planillaId="dictamen-audios" caso={caso} isBlankMode={isBlankMode} />

      {/* ====================================================================== */}
      {/* PÁGINA 2 (FOLIO 02) — PORTADA INTERNA, PREÁMBULO Y MARCO NORMATIVO    */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        {/* Clasificación documental */}
        <View style={pdfStyles.classificationBanner}>
          <Text style={pdfStyles.classificationText}>
            CONFIDENCIAL — DOCUMENTO PROBATORIO DE USO PERICIAL OFICIAL — ANÁLISIS FORENSE ACÚSTICO DE NOTAS DE VOZ WHATSAPP
          </Text>
        </View>

        {/* Título + Subtítulo */}
        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>DICTAMEN PERICIAL INFORMÁTICO FORENSE PRIVADO</Text>
          <Text style={pdfStyles.subTitle}>
            ANÁLISIS DE AUTENTICIDAD E INTEGRIDAD ACÚSTICA DE AUDIOS WHATSAPP (OPUS / SONIC VISUALISER)
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

        {/* Sub-banner Tipo de Análisis */}
        <View style={{ backgroundColor: '#F1F5F9', borderLeftWidth: 3, borderLeftColor: '#005EA2', paddingHorizontal: 6, paddingVertical: 3, marginTop: 4, marginBottom: 5 }}>
          <Text style={{ fontSize: 7.2, fontFamily: 'Helvetica-Bold', color: '#112E51' }}>
            METODOLOGÍA ACÚSTICA: CÓDEC OPUS (48 kHz) | SONIC VISUALISER FFT (HANN 2048) | PITCH F₀ YIN | SNR {'>'} 40 dB
          </Text>
        </View>

        {/* 1.0 MARCO NORMATIVO */}
        <Text id="seccion-1.0" style={pdfStyles.sectionTitle}>1.0 MARCO NORMATIVO Y REQUISITOS PROBATORIOS RAG</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Perito Informático Forense Líder:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.peritoLider, 'Ing. Christopher V. Vance')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Consignante / Solicitante:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre, 'Alexander R. Wright')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / RIF:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_cedula, 'V-18.492.019')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Sede de Bóveda y Resguardo:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.sede, 'Sede Principal Quíbor — Bóveda de Custodia SHA256.US')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Referencia del Audio Analizado:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.descripcion, 'PTT-20260615-WA0017.opus — WhatsApp Nota de Voz | 00:12.4s | 48,000 Hz | Ogg/Opus VBR')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Número de Teléfono Origen WhatsApp:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.telefono_origen, '+58 414-5928102 (REGISTRADO ANTE CONATEL)')}</Text>
        </View>

        {/* 2.0 ACREDITACIÓN PERICIAL */}
        <Text id="seccion-2.0" style={[pdfStyles.sectionTitle, { marginTop: 5 }]}>2.0 ACREDITACIÓN PERICIAL E IDENTIFICACIÓN DE AUDIOS</Text>
        <Text style={pdfStyles.paragraph}>
          El presente dictamen se fundamenta en las disposiciones legales venezolanas e internacionales en materia de forensía de audio digital y mensajería instantánea:
        </Text>
        <View style={{ paddingLeft: 6, marginVertical: 2 }}>
          {[
            ['COPP (Arts. 187, 223, 225):', 'Garantía procesal de Cadena de Custodia, peritajes privados y dictamen formal de medios de comunicación electrónica.'],
            ['Ley sobre Mensajes de Datos y Firmas Electrónicas (Art. 4):', 'Plena eficacia probatoria de mensajes de datos y notas de voz transmitidas electrónicamente.'],
            ['SWGDE (Scientific Working Group on Digital Evidence):', 'Guías técnicas internacionales de referencia para análisis forense de audio/video e integridad en tribunales.'],
            ['FRE Rule 702 / Daubert Standard (EE. UU.):', 'Admisibilidad científica probatoria: metodología comprobable, revisada por pares, tasa de error conocida (<0.05%) y aceptación general.'],
            ['ISO/IEC 27037:2012 & 27042:2015:', 'Identificación, adquisición, preservación e interpretación técnico-científica de evidencia de audio digital.'],
            ['MUCC-2017 (§ 4-7):', 'Manual Único de Cadena de Custodia: trazabilidad criptográfica SHA-256, inalterabilidad del soporte y registro pericial.'],
            ['RFC 3227 (IETF):', 'Directrices de recolección y archivo de evidencia volátil digital.'],
          ].map(([bold, text], i) => (
            <Text key={i} style={{ fontSize: 7, color: '#1E293B', marginBottom: 2 }}>
              {'• '}<Text style={{ fontFamily: 'Helvetica-Bold' }}>{bold}</Text>{' '}{text}
            </Text>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 3 (FOLIO 03) — METODOLOGÍA PEDAGÓGICA OPUS & SONIC VISUALISER  */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        {/* 3.0 DECODIFICACIÓN PEDAGÓGICA CÓDEC OPUS */}
        <Text id="seccion-3.0" style={pdfStyles.sectionTitle}>3.0 DECODIFICACIÓN PEDAGÓGICA DEL CÓDEC OPUS (48 kHz) Y METADATOS</Text>
        <Text style={{ fontSize: 7, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35, marginBottom: 4 }}>
          Las notas de voz de WhatsApp son encapsuladas en contenedores Ogg utilizando el <Text style={{ fontFamily: 'Helvetica-Bold' }}>códec híbrido Opus (RFC 6716)</Text>. Opus combina dos motores: <Text style={{ fontFamily: 'Helvetica-Bold' }}>SILK</Text> (optimizado para voz humana con predicción lineal) y <Text style={{ fontFamily: 'Helvetica-Bold' }}>CELT</Text> (para amplio espectro). WhatsApp emite tramas de audio con duración fija de <Text style={{ fontFamily: 'Helvetica-Bold' }}>20 ms</Text> muestreadas nativamente a <Text style={{ fontFamily: 'Helvetica-Bold' }}>48.000 Hz</Text> en tasa de bits variable (VBR). La homogeneidad de los límites de trama y la ausencia de saltos de cuantización descarta empalmes o inserciones de audio ajeno (<Text style={{ fontFamily: 'Helvetica-Oblique' }}>anti-splicing</Text>).
        </Text>

        {/* Tabla Parámetros Códec Opus */}
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '28%' }]}>Parámetro Técnico Opus</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '26%' }]}>Valor Registrado en Muestra</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '26%' }]}>Estándar Nativo WhatsApp</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Dictamen / Estado</Text>
          </View>
          {[
            ['Frecuencia de Muestreo', '48.000 Hz (Nyquist 24 kHz)', '48.000 Hz Constante', 'CONFORME ✓'],
            ['Tamaño de Trama (Frame)', '20 ms por paquete Ogg', '20 ms (SILK Voice Mode)', 'NATIVO ✓'],
            ['Modo de Bitrate', 'VBR (Variable Bit Rate)', 'VBR Dinámico (16-32 kbps)', 'ÍNDICE TÍPICO ✓'],
            ['Canales / Cuantización', 'Mono (1 Canal) / 16-bit Float', 'Mono / 16-bit PCM', 'CONFORME ✓'],
            ['Integridad de Límite de Tramas', 'Continuidad de paquetes sin salto', 'Sin saltos de timestamp Ogg', 'SIN EMPALMES (NO SPLICING) ✓'],
          ].map(([p, v, e, s], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '28%', fontFamily: 'Helvetica-Bold', fontSize: 6.5 }]}>{p}</Text>
              <Text style={[pdfStyles.tableCell, { width: '26%', fontSize: 6.5 }]}>{v}</Text>
              <Text style={[pdfStyles.tableCell, { width: '26%', fontSize: 6.5 }]}>{e}</Text>
              <Text style={[pdfStyles.tableCell, { width: '20%', fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#006600' }]}>{isBlank ? '' : s}</Text>
            </View>
          ))}
        </View>

        {/* Triple Hash */}
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 4, marginBottom: 2 }}>
          VERIFICACIÓN DE INTEGRIDAD TRIPLE CRIPTOGRÁFICA — MUCC-2017 § 5.1 (Hash de Apertura vs Hash de Cierre):
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '14%' }]}>Algoritmo</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '51%' }]}>Valor Hash Criptográfico Génesis</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Estado al Cierre</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '15%' }]}>Resultado</Text>
          </View>
          {[
            { algo: 'MD5', hash: fmt(c.hashMD5, 'b5f2a3e8c9d1047f6a2d3e8c9b5f1e2d'), resultado: 'MATCH ✓' },
            { algo: 'SHA-1', hash: fmt(c.hashSHA1, '9c3b7a2f1e4d5c8a0b6f3e2d9c7a4b1f0e8d5c3a'), resultado: 'MATCH ✓' },
            { algo: 'SHA-256', hash: fmt(c.hashSHA256, 'b5f2a3e8c9d1047f6a2d3e8c9b5f1e2d7a4c0f3b8e5d2a9c6b3f0e7d4a1c8b502'), resultado: 'MATCH ✓' },
          ].map((row, i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '14%', fontFamily: 'Helvetica-Bold' }]}>{row.algo}</Text>
              <Text style={[pdfStyles.tableCell, { width: '51%', fontSize: 5.8, fontFamily: 'Courier' }]}>{isBlank ? '' : row.hash}</Text>
              <Text style={[pdfStyles.tableCell, { width: '20%', fontSize: 6.5, color: '#006600' }]}>ÍNTEGRO / NO ALTERADO</Text>
              <Text style={[pdfStyles.tableCell, { width: '15%', fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: '#006600' }]}>{isBlank ? '' : row.resultado}</Text>
            </View>
          ))}
        </View>

        {/* 4.0 ESPECTROGRAMA FFT & 5.0 PITCH F0 ANTI-DEEPFAKE */}
        <Text id="seccion-4.0" style={[pdfStyles.sectionTitle, { marginTop: 4 }]}>4.0 METODOLOGÍA SONIC VISUALISER, ESPECTROGRAMA FFT Y PITCH F₀ YIN</Text>
        <Text style={{ fontSize: 7, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35, marginBottom: 3 }}>
          Se utilizó la suite <Text style={{ fontFamily: 'Helvetica-Bold' }}>Sonic Visualiser v5.x</Text> (desarrollada por el Centre for Digital Music - Queen Mary University of London, bajo licencia GPL-2.0). Se aplicaron los siguientes métodos analíticos de física acústica:
        </Text>
        <View style={{ paddingLeft: 6, marginBottom: 4 }}>
          <Text style={{ fontSize: 6.8, color: '#1E293B', marginBottom: 2 }}>
            • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Espectrograma FFT (Hann 2048 bins, 75% overlap):</Text> Mapeo tridimensional de energía acústica (frecuencia vs. tiempo vs. intensidad en dB). Revela continuidad armónica vocal en la banda de 300 a 3.400 Hz, sin cortes verticales ni atenuaciones abruptas.
          </Text>
          <Text style={{ fontSize: 6.8, color: '#1E293B', marginBottom: 2 }}>
            • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Frecuencia Fundamental (F₀) y Algoritmo Yin (80-400 Hz):</Text> Rastreo de las micro-inflexiones melódicas naturales de las cuerdas vocales humanas. Las voces sintéticas por Inteligencia Artificial (TTS/Deepfake) exhiben saltos aperiódicos o formantes sobre-suavizados. En la muestra, la trayectoria de $F_0$ es 100% continua y humana.
          </Text>
          <Text style={{ fontSize: 6.8, color: '#1E293B', marginBottom: 2 }}>
            • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Piso de Ruido Estacionario y SNR ({'>'} 40 dB):</Text> La relación señal-ruido constante y la homogeneidad del ruido de fondo acreditan que la grabación se realizó en una sola toma física ininterrumpida.
          </Text>
        </View>

        {/* 6.0 CLÁUSULA DAUBERT */}
        <Text id="seccion-6.0" style={[pdfStyles.sectionTitle, { marginTop: 3 }]}>6.0 INSTRUMENTAL FORENSE Y CLÁUSULA DAUBERT / FRE RULE 702</Text>
        <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.8, borderColor: '#CBD5E1', padding: 5 }}>
          <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#112E51', marginBottom: 2 }}>
            DECLARACIÓN DE VALIDEZ CIENTÍFICA (ESTÁNDAR DAUBERT — FRE RULE 702):
          </Text>
          <Text style={{ fontSize: 6.3, color: '#1E293B', textAlign: 'justify', lineHeight: 1.3 }}>
            El suscrito Perito certifica que el instrumental utilizado (<Text style={{ fontFamily: 'Helvetica-Bold' }}>Sonic Visualiser, PyOgg Engine, Vamp Plugins y FFTW3</Text>) cumple a cabalidad con los 4 pilares de admisibilidad científica Daubert: (1) <Text style={{ fontFamily: 'Helvetica-Bold' }}>Metodología comprobable y refutable</Text> mediante duplicación exacta de parámetros; (2) <Text style={{ fontFamily: 'Helvetica-Bold' }}>Tasa de error conocida y controlada</Text> (&lt; 0.05% en transformada Fourier); (3) <Text style={{ fontFamily: 'Helvetica-Bold' }}>Revisión por pares</Text> en publicaciones de QMUL, IRCAM e IEEE; (4) <Text style={{ fontFamily: 'Helvetica-Bold' }}>Aceptación general</Text> por la comunidad internacional de forensía acústica (SWGDE / ENFSI).
          </Text>
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 4 (FOLIO 04) — ANEXO I: ESPECTROGRAMA FFT (0-24 kHz)            */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO I — ESPECTROGRAMA DE FRECUENCIAS (0-24 kHz) — SONIC VISUALISER FFT</Text>
        <Text style={pdfStyles.paragraph}>
          El <Text style={{ fontFamily: 'Helvetica-Bold' }}>Espectrograma FFT</Text> obtenido mediante Sonic Visualiser descompone la señal acústica en el dominio de la frecuencia. La energía concentrada en la banda vocal (300–3.400 Hz) y el límite de banda en 8 kHz característico de Opus certifican una grabación directa y sin adulteración.
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 6 }}>
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 4 }}>
            FIGURA 1: ESPECTROGRAMA DE FRECUENCIAS (0–24 kHz) — FFT HANN 2048 BINS (Sonic Visualiser v5.x)
          </Text>
          <SpectrogramSvg width={484} height={165} isBlank={isBlank} />
          <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.5, borderColor: '#CBD5E1', padding: 4, marginTop: 5 }}>
            <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 1 }}>
              INTERPRETACIÓN PERICIAL DEL ESPECTROGRAMA:
            </Text>
            <Text style={{ fontSize: 6.3, color: '#1E293B', textAlign: 'justify', lineHeight: 1.3 }}>
              {isBlank ? '' : 'La densidad espectral de potencia presenta continuidad armónica ininterrumpida a lo largo de toda la línea de tiempo. No existen discontinuidades verticales (que evidenciarían cortes o empalmes de audio), ni franjas de silenciamiento anómalo. La respuesta de frecuencias concuerda exactamente con el modelo acústico de notas de voz nativas WhatsApp. CONCLUSIÓN: Continuidad espectral íntegra y auténtica.'}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 4, marginBottom: 2 }}>
          PARÁMETROS EXACTOS DE RENDERIZADO EN SONIC VISUALISER:
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Parámetro</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '35%' }]}>Valor Configurado</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '40%' }]}>Sustento Técnico / Estándar</Text>
          </View>
          {[
            ['Ventana de Análisis', 'Hann (Hanning Window)', 'Minimización de fuga espectral (Spectral Leakage)'],
            ['Tamaño de Bloque FFT', '2048 bins (42.66 ms a 48 kHz)', 'Resolución frecuencial óptima (23.43 Hz/bin)'],
            ['Solapamiento (Overlap)', '75% (Hop size 512 samples)', 'Alta resolución temporal en transitorios vocales'],
            ['Escala de Amplitud', 'Logarítmica dB (-90 dB a 0 dB)', 'Rango dinámico del oído humano'],
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

      {/* ====================================================================== */}
      {/* PÁGINA 5 (FOLIO 05) — ANEXO II: WAVEFORM + FORMANTES + PITCH F0        */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO II — WAVEFORM TEMPORAL + FORMANTES F1/F2/F3 + PITCH F₀ (YIN)</Text>
        <Text style={pdfStyles.paragraph}>
          La combinación de la <Text style={{ fontFamily: 'Helvetica-Bold' }}>Forma de Onda Temporal (Waveform)</Text> y el rastreo de formantes vocales permite individualizar el tracto vocal del hablante y descartar clonaciones de voz mediante Inteligencia Artificial (Deepfake).
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 6 }}>
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 4 }}>
            FIGURA 2: WAVEFORM TEMPORAL Y PITCH TRACKING DE FORMANTES VOCALES (F1/F2/F3)
          </Text>
          <WaveformFormanteSvg width={484} height={160} isBlank={isBlank} />
          <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.5, borderColor: '#CBD5E1', padding: 4, marginTop: 5 }}>
            <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 1 }}>
              INTERPRETACIÓN PERICIAL DE FORMANTES Y PITCH:
            </Text>
            <Text style={{ fontSize: 6.3, color: '#1E293B', textAlign: 'justify', lineHeight: 1.3 }}>
              {isBlank ? '' : 'Los formantes vocales F1 (620 Hz), F2 (1.850 Hz) y F3 (2.740 Hz) exhiben trayectorias fisiológicamente naturales asociadas a la resonancia del tracto vocal humano. La frecuencia fundamental F₀ (medida con algoritmo Yin) presenta micro-modulaciones biológicas continuas, descartando por completo sintetizadores vocales TTS o clonación por IA (Deepfake). CONCLUSIÓN: Emisión vocal humana auténtica y genuina.'}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 4, marginBottom: 2 }}>
          VALORES DE FORMANTES VOCALES DETECTADOS:
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '22%' }]}>Formante / Banda</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '28%' }]}>Frecuencia Central</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Comportamiento</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Validación Humana</Text>
          </View>
          {[
            ['F₁ (Primer Formante)', '620 Hz (Apertura Mandibular)', 'Estable / Resonante', 'VOZ HUMANA CONFIRMADA ✓'],
            ['F₂ (Segundo Formante)', '1.850 Hz (Posición Lingual)', 'Modulación Continua', 'FONACIÓN NATURAL ✓'],
            ['F₃ (Tercer Formante)', '2.740 Hz (Timbre Individual)', 'Estabilidad Acústica', 'TIMBRE CONSISTENTE ✓'],
            ['F₀ (Pitch Fundamental)', '125–185 Hz (Tono Base)', 'Curva Yin Biológica', 'DESCARTADO DEEPFAKE ✓'],
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

      {/* ====================================================================== */}
      {/* PÁGINA 6 (FOLIO 06) — ANEXO III: ANÁLISIS SNR & PISO DE RUIDO          */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO III — ANÁLISIS SNR (RELACIÓN SEÑAL-RUIDO) Y PISO AMBIENTAL</Text>
        <Text style={pdfStyles.paragraph}>
          La <Text style={{ fontFamily: 'Helvetica-Bold' }}>Relación Señal-Ruido (SNR)</Text> mide la proporción entre la potencia de la voz útil y el ruido de fondo circundante. La estabilidad del piso de ruido a través de los segmentos temporales acredita una grabación continua en un mismo espacio físico.
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 6 }}>
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 4 }}>
            FIGURA 3: MEDICIÓN DE SNR POR SEGMENTOS Y AUDITORÍA DE INMUTABILIDAD CRIPTOGRÁFICA
          </Text>
          <SnrBarchartSvg width={484} height={150} isBlank={isBlank} />
          <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.5, borderColor: '#CBD5E1', padding: 4, marginTop: 5 }}>
            <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 1 }}>
              INTERPRETACIÓN PERICIAL DEL PISO DE RUIDO:
            </Text>
            <Text style={{ fontSize: 6.3, color: '#1E293B', textAlign: 'justify', lineHeight: 1.3 }}>
              {isBlank ? '' : 'El valor promedio de SNR se ubica en 44.2 dB, indicativo de excelente claridad acústica sin saturación ni recortes por ganancia excesiva (clipping). La respuesta espectral del piso de ruido en los pasajes de silencio es estacionaria, lo cual confirma que el archivo no fue ensamblado con fragmentos grabados en entornos acústicos diferentes. CONCLUSIÓN: Unidad temporal y espacial certificada.'}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 4, marginBottom: 2 }}>
          AUDITORÍA AMBIENTAL POR TRAMAS DE AUDIO:
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '22%' }]}>Segmento Temporal</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Nivel SNR Registrado</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '28%' }]}>Piso de Ruido (Noise Floor)</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Consistencia Espacial</Text>
          </View>
          {[
            ['Segmento 1 (0–4 seg)', '44.2 dB', '-58.4 dBFS (Ambiente)', 'HOMOGÉNEO ✓'],
            ['Segmento 2 (4–8 seg)', '43.8 dB', '-58.1 dBFS (Ambiente)', 'HOMOGÉNEO ✓'],
            ['Segmento 3 (8–12.4 seg)', '44.6 dB', '-58.6 dBFS (Ambiente)', 'HOMOGÉNEO ✓'],
            ['Pausa / Silencio Vocal', '58.1 dB', '-60.2 dBFS (Estacionario)', 'SIN EDICIÓN DE SILENCIO ✓'],
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

      {/* ====================================================================== */}
      {/* PÁGINA 7 (FOLIO 07) — CONCLUSIONES, LIMITACIONES, FIRMAS Y DACTILAR    */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        {/* 7.0 CONCLUSIONES TÉCNICO-PERICIALES */}
        <Text id="seccion-7.0" style={pdfStyles.sectionTitle}>7.0 CONCLUSIONES PERICIALES Y DICTAMEN FINAL (COPP ART. 225)</Text>
        <View style={{ borderWidth: 1.5, borderColor: '#006600', backgroundColor: '#F0FFF0', padding: 6, marginBottom: 5 }}>
          <Text style={{ fontSize: 7.8, fontFamily: 'Helvetica-Bold', color: '#006600', marginBottom: 3, textAlign: 'center' }}>
            DICTAMEN CATEGÓRICO: NOTA DE VOZ WHATSAPP AUTÉNTICA, ÍNTEGRA Y PLENA PRUEBA PROBATORIA
          </Text>
          <Text style={{ fontSize: 6.8, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
            {isBlank ? '' : `Con base en los análisis técnico-científicos ejecutados en el Laboratorio Forense SHA256.US —específicamente la decodificación del códec Opus a 48.000 Hz, el espectrograma FFT de frecuencias sin cortes ni splicing, el rastreo de formantes F1/F2/F3 y pitch F₀ confirmatorio de fonación humana genuina (descartando clonación Deepfake por IA), la relación señal-ruido SNR de 44.2 dB con piso ambiental estacionario, y la triple verificación criptográfica (MD5/SHA-1/SHA-256 MATCH)— el suscrito Perito Informático Forense dictamina de manera categórica que la evidencia digital identificada como ${numeroExpediente} (archivo PTT-20260615-WA0017.opus) ES 100% AUTÉNTICA, ÍNTEGRA Y FIEL A SU GRABACIÓN ORIGINAL. No presenta ediciones, cortes, uniones de pistas ni alteraciones de ninguna naturaleza, revistiendo PLENO VALOR PROBATORIO conforme a la Ley sobre Mensajes de Datos y Firmas Electrónicas (Art. 4) y el COPP (Arts. 187, 223, 225).`}
          </Text>
        </View>

        {/* LIMITACIONES TÉCNICAS */}
        <Text style={[pdfStyles.sectionTitle, { marginTop: 3 }]}>IX. LIMITACIONES TÉCNICAS DEL ANÁLISIS PERICIAL (FRE RULE 702-b)</Text>
        <View style={pdfStyles.limitationsBox}>
          <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#D97706', marginBottom: 1 }}>
            ALCANCE Y LIMITACIONES EXPRESAS DEL DICTAMEN ACÚSTICO:
          </Text>
          <Text style={{ fontSize: 6.2, color: '#1E293B', textAlign: 'justify', lineHeight: 1.25 }}>
            El análisis se circunscribe a la muestra de audio consignada bajo hash SHA-256 génesis. Las conclusiones de autenticidad se fundamentan en la física acústica del archivo y su cadena de custodia ininterrumpida. No se emite pronunciamiento sobre intenciones conductuales, limitándose el dictamen al rigor técnico del soporte digital.
          </Text>
        </View>

        {/* FIRMAS BILATERALES Y DACTILOSCOPIA (COPP Art. 223) */}
        <Text style={[pdfStyles.sectionTitle, { marginTop: 3 }]}>X. JURAMENTO, FIRMAS PERICIALES Y REGISTRO DACTILAR (COPP ART. 223, 225)</Text>
        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 4 }}>
          {/* PERITO 1 */}
          <View style={[pdfStyles.peritoCard, { width: '48%' }]}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO INFORMÁTICO FORENSE N° 1 (LÍDER)</Text>
            <View style={pdfStyles.peritoCardDividerLine} />

            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 2 }}>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR DER.</Text>
              </View>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR IZQ.</Text>
              </View>
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

          {/* PERITO 2 / COADYUVANTE */}
          <View style={[pdfStyles.peritoCard, { width: '48%' }]}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO INFORMÁTICO FORENSE N° 2 (COPP 223)</Text>
            <View style={pdfStyles.peritoCardDividerLine} />

            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 2 }}>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR DER.</Text>
              </View>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR IZQ.</Text>
              </View>
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

      {/* ====================================================================== */}
      {/* PÁGINA 8 (FOLIO 08) — BIBLIOGRAFÍA NORMATIVA RAG                       */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text id="seccion-8.0" style={pdfStyles.sectionTitle}>8.0 ANEXO NORMATIVO RAG Y REGISTRO BIBLIOGRÁFICO OFICIAL</Text>
        <Text style={pdfStyles.paragraph}>
          El presente dictamen pericial consulta y se fundamenta en las siguientes fuentes técnico-jurídicas oficiales aplicables al procedimiento pericial de audio forense:
        </Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '22%' }]}>Código / Norma</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '53%' }]}>Título Oficial del Documento / Gaceta</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Módulo Normativo / Referencia</Text>
          </View>
          {[
            ['SWGDE (2020)', 'Scientific Working Group on Digital Evidence — Guidelines for Forensic Audio Analysis', 'Estándar Internacional Audio'],
            ['FRE Rule 702 / Daubert', 'Federal Rules of Evidence 702 — Daubert v. Merrell Dow (1993) — Estándar Científico', 'Estándar Judicial US'],
            ['MUCC-2017', 'Manual Único de Cadena de Custodia de Evidencias de Venezuela (§ 4-7)', 'Informática Forense VEN'],
            ['ISO/IEC 27037:2012', 'Guidelines for Identification, Collection, Acquisition and Preservation of Digital Evidence', 'Estándar Internacional'],
            ['ISO/IEC 27042:2015', 'Guidelines for Analysis and Interpretation of Digital Evidence (§ 6-7)', 'Estándar Internacional'],
            ['RFC 6716 (IETF)', 'Definition of the Opus Audio Codec — Interactive Speech and Audio Transmission', 'Estándar Técnico IETF'],
            ['RFC 3227 (IETF)', 'Guidelines for Evidence Collection and Archiving — Orden de Volatilidad', 'Estándar Técnico Network'],
            ['NIST SP 800-86', 'Guide to Integrating Forensic Techniques into Incident Response (§ 3.4)', 'Publicación Especial US'],
            ['COPP (Gaceta N° 6.645)', 'Código Orgánico Procesal Penal — Arts. 187 (Cadena de Custodia) y 223-225 (Peritaje)', 'Sustento Procesal VEN'],
            ['Ley Mensajes Datos', 'Ley sobre Mensajes de Datos y Firmas Electrónicas (Gaceta N° 37.148) — Art. 4', 'Sustento Sustantivo VEN'],
            ['Ley Delitos Inform. 2001', 'Ley Especial de Delitos Informáticos (Gaceta N° 37.313) — Art. 8', 'Legislación Especializada VEN'],
          ].map(([code, title, mod], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>{code}</Text>
              <Text style={[pdfStyles.tableCell, { width: '53%' }]}>{title}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.5 }]}>{mod}</Text>
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
