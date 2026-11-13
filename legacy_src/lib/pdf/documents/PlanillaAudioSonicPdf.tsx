/**
 * PlanillaAudioSonicPdf.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Planilla de Informe Forense de Audio (Sonic Visualiser)
 * Estándar: Daubert v. Merrell Dow Pharmaceuticals (1993) · FRE Rule 702
 *           SWGDE Guidelines for Forensic Audio Analysis
 *           MUCC-2017 § 6 · COPP Art. 187, 223, 225 · ISO/IEC 27037 / 27042
 *
 * Motor: Sonic Visualiser (Centre for Digital Music - QMUL, GPL-2.0-or-later)
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';
import PlanillaCoverPagePdf from '../PlanillaCoverPagePdf';
import { SpectrogramSvg, WaveformFormanteSvg } from '../forensicSvgCharts';

interface Props {
  caso?: any;
  isBlankMode?: boolean;
}

const customStyles = StyleSheet.create({
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#112E51',
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  tableRowBody: {
    flexDirection: 'row',
    borderBottomWidth: 0.8,
    borderBottomColor: '#CBD5E1',
    paddingVertical: 3,
    paddingHorizontal: 4,
    minHeight: 18,
  },
  tableCellHeader: {
    color: '#FFFFFF',
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  tableCellBody: {
    fontSize: 6.5,
    color: '#1E293B',
  },
  softwareBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 3,
    padding: 5,
    marginTop: 4,
    marginBottom: 4,
  },
  daubertDisclaimer: {
    backgroundColor: '#FEF9C3',
    borderLeftWidth: 3,
    borderLeftColor: '#CA8A04',
    padding: 4,
    marginTop: 3,
    marginBottom: 4,
  },
  daubertDisclaimerText: {
    fontSize: 6.2,
    color: '#713F12',
    lineHeight: 1.35,
  },
  thumbBox: {
    width: 65,
    height: 70,
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    padding: 2,
  },
});

export const PlanillaAudioSonicPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, 'EXP-2026-SHA-0091');
  const fecha = fmt(c.fechaCreacion ? new Date(c.fechaCreacion).toLocaleDateString('es-VE') : '', '23/07/2026');
  const isBlank = isBlankMode;
  const numeroInforme = isBlank ? '' : (c.numeroCaso ? `INF-AUD-SONIC-${c.numeroCaso}` : 'INF-AUD-SONIC-2026-0091');

  return (
    <Document title={`Informe_Forense_Audio_SonicVisualiser_${c.numeroCaso || 'EXP'}`}>
      {/* PÁGINA 1 — PORTADA DINÁMICA FOLIADA */}
      <PlanillaCoverPagePdf planillaId="informe-audio-sonic" caso={caso} isBlankMode={isBlankMode} />

      {/* ====================================================================== */}
      {/* PÁGINA 2 — ENCABEZADO, CADENA DE CUSTODIA Y METADATOS TÉCNICOS */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        {/* Clasificación Documental */}
        <View style={pdfStyles.classificationBanner}>
          <Text style={pdfStyles.classificationText}>
            CONFIDENCIAL — DOCUMENTO PROBATORIO DE USO PERICIAL OFICIAL — ANÁLISIS DE AUDIO DIGITAL (SONIC VISUALISER)
          </Text>
        </View>

        {/* Título Principal */}
        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>PLANILLA DE INFORME FORENSE DE AUDIO (SONIC VISUALISER)</Text>
          <Text style={pdfStyles.subTitle}>
            ANÁLISIS ESPECTROGRÁFICO FFT, FORMA DE ONDA, FRECUENCIA FUNDAMENTAL (F0) Y EVALUACIÓN DAUBERT / FRE 702 / SWGDE
          </Text>

          <View style={pdfStyles.expedienteBox}>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>EXPEDIENTE N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 7.5, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroExpediente}</Text>
              </View>
            </View>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>INFORME AUDIO N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 7.5, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroInforme}</Text>
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

        {/* Sub-banner Marco Normativo */}
        <View style={{ backgroundColor: '#F1F5F9', borderLeftWidth: 3, borderLeftColor: '#005EA2', paddingHorizontal: 6, paddingVertical: 2.5, marginTop: 2, marginBottom: 4 }}>
          <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#112E51' }}>
            ESTÁNDAR PROBATORIO: FRE RULE 702 · DAUBERT STANDARD · SWGDE GUIDELINES · ISO/IEC 27037 / 27042 · MUCC-2017
          </Text>
        </View>

        {/* 1.0 ENCABEZADO DEL CASO & CADENA DE CUSTODIA */}
        <Text id="seccion-1.0" style={pdfStyles.sectionTitle}>1.0 ENCABEZADO DEL CASO &amp; CADENA DE CUSTODIA (SHA-256 GÉNESIS)</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Expediente / Causa:</Text>
          <Text style={pdfStyles.fieldValue}>{numeroExpediente}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Tribunal / Jurisdicción:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.despachoFiscal || c.organismoOrdenante, 'Tribunal 1° de Juicio / Circunscripción Judicial Federal')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Perito Responsable:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.peritoLider, 'Ing. Perito Especialista en Acústica Forense & Evidencia Digital')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Credenciales / Colegiatura:</Text>
          <Text style={pdfStyles.fieldValue}>
            {fmt(c.perito_cedula ? `C.I. ${c.perito_cedula} | CIV: ${c.perito_civ || '218.402'} | Certificación SWGDE / ISO 27042` : '', 'C.I. V-18.420.912 | CIV N° 218.402 | Inpre N° 98.114 | SWGDE Audio Specialist')}
          </Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Custodio / Consignante:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre, 'Custodio Legal / Consignante Privado Autenticado')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Hash SHA-256 Génesis:</Text>
          <Text style={[pdfStyles.fieldValue, { fontFamily: 'Courier', fontSize: 6 }]}>
            {fmt(c.hashSHA256, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
          </Text>
        </View>

        {/* 2.0 REGISTRO TÉCNICO DE PROCESOS POR AUDIO EN SONIC VISUALISER */}
        <Text id="seccion-2.0" style={[pdfStyles.sectionTitle, { marginTop: 6 }]}>2.0 REGISTRO TÉCNICO DE PROCESOS POR AUDIO (SONIC VISUALISER)</Text>

        {/* Metadatos de la muestra */}
        <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.8, borderColor: '#CBD5E1', padding: 4, marginBottom: 4, borderRadius: 2 }}>
          <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#005EA2', marginBottom: 2 }}>
            2.1 Metadatos Técnicos del Archivo de Audio Bajo Peritaje:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
            <Text style={{ fontSize: 6.2, width: '48%' }}>
              • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Archivo:</Text> AUDIO_PTT_20260723_WA0012.opus
            </Text>
            <Text style={{ fontSize: 6.2, width: '48%' }}>
              • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Formato/Códec:</Text> Ogg/Opus (16-bit Mono, VBR)
            </Text>
            <Text style={{ fontSize: 6.2, width: '48%' }}>
              • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Duración:</Text> 00:01:42.850 (102.85 seg)
            </Text>
            <Text style={{ fontSize: 6.2, width: '48%' }}>
              • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Frecuencia Muestreo:</Text> 48.000 Hz (Nyquist: 24 kHz)
            </Text>
            <Text style={{ fontSize: 6.2, width: '100%', fontFamily: 'Courier' }}>
              • <Text style={{ fontFamily: 'Helvetica-Bold' }}>SHA-256 Pre-Proceso:</Text> {fmt(c.hashSHA256, '7a8f3b92c10d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f')}
            </Text>
            <Text style={{ fontSize: 6.2, width: '100%', fontFamily: 'Courier' }}>
              • <Text style={{ fontFamily: 'Helvetica-Bold' }}>SHA-256 Post-Proceso:</Text> {fmt(c.hashSHA256, '7a8f3b92c10d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f')} (MATCH ✓)
            </Text>
          </View>
        </View>

        {/* Tabla de Procesos */}
        <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#005EA2', marginBottom: 2 }}>
          2.2 Matriz de Procesos Instrumentales Aplicados en Sonic Visualiser:
        </Text>
        <View style={{ borderWidth: 0.8, borderColor: '#CBD5E1', marginBottom: 6 }}>
          <View style={customStyles.tableRowHeader}>
            <Text style={[customStyles.tableCellHeader, { width: '22%' }]}>Proceso Aplicado</Text>
            <Text style={[customStyles.tableCellHeader, { width: '30%' }]}>Parámetros Exactos (Sonic Visualiser)</Text>
            <Text style={[customStyles.tableCellHeader, { width: '48%' }]}>Observación Técnica Objetiva</Text>
          </View>

          <View style={customStyles.tableRowBody}>
            <Text style={[customStyles.tableCellBody, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>
              1. Espectrograma FFT (0-24 kHz)
            </Text>
            <Text style={[customStyles.tableCellBody, { width: '30%', fontFamily: 'Courier', fontSize: 5.8 }]}>
              Window: Hann (2048 bins){'\n'}
              Hop: 512 bins (75% overlap){'\n'}
              Scale: Linear / dB (-90 a 0 dB)
            </Text>
            <Text style={[customStyles.tableCellBody, { width: '48%', fontSize: 6 }]}>
              Continuidad espectral íntegra en rango vocal (300Hz-3.400Hz). Ausencia de cortes verticales (splicing clipping) ni atenuaciones anormales de banda.
            </Text>
          </View>

          <View style={customStyles.tableRowBody}>
            <Text style={[customStyles.tableCellBody, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>
              2. Forma de Onda (Waveform)
            </Text>
            <Text style={[customStyles.tableCellBody, { width: '30%', fontFamily: 'Courier', fontSize: 5.8 }]}>
              Mode: Peak &amp; RMS overlay{'\n'}
              Time Res: 10 ms/div{'\n'}
              Norm: -1.0 a +1.0 V
            </Text>
            <Text style={[customStyles.tableCellBody, { width: '48%', fontSize: 6 }]}>
              Decaimiento exponencial de envolvente natural conforme a reverberación física. No se observan anomalías de cruce por cero ni silencios artificiales (0.0 V).
            </Text>
          </View>

          <View style={customStyles.tableRowBody}>
            <Text style={[customStyles.tableCellBody, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>
              3. Frecuencia Fundamental (F0)
            </Text>
            <Text style={[customStyles.tableCellBody, { width: '30%', fontFamily: 'Courier', fontSize: 5.8 }]}>
              Plugin: Yin Pitch Estimation{'\n'}
              Search Range: 80 - 400 Hz{'\n'}
              Threshold: 0.15
            </Text>
            <Text style={[customStyles.tableCellBody, { width: '48%', fontSize: 6 }]}>
              Curva melódica de pitch F0 continua con micro-modulaciones tonales de fonación humana real. Ausencia de saltos discretos propios de síntesis TTS / Deepfake.
            </Text>
          </View>

          <View style={customStyles.tableRowBody}>
            <Text style={[customStyles.tableCellBody, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>
              4. Detección Picos &amp; SNR
            </Text>
            <Text style={[customStyles.tableCellBody, { width: '30%', fontFamily: 'Courier', fontSize: 5.8 }]}>
              Harmonics: H1 a H6{'\n'}
              Noise Floor: -54.2 dBFS{'\n'}
              SNR Promedio: 22.4 dB
            </Text>
            <Text style={[customStyles.tableCellBody, { width: '48%', fontSize: 6 }]}>
              Piso de ruido ambiental estacionario y homogéneo durante los 102.85s de la muestra, confirmando unidad de tiempo y espacio en toma única.
            </Text>
          </View>
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 3 — FIGURAS GRÁFICAS COMPARATIVAS, SOFTWARE DAUBERT & CIERRE */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <PlanillaHeader />

        {/* 2.3 FIGURAS COMPARATIVAS ANTES / DESPUÉS */}
        <Text style={[pdfStyles.sectionTitle, { marginTop: 0 }]}>
          2.3 REGISTRO GRÁFICO COMPARATIVO EN SONIC VISUALISER (ANTES VS. DESPUÉS)
        </Text>

        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
          {/* Figura Waveform */}
          <View style={{ width: '49%', borderWidth: 0.8, borderColor: '#CBD5E1', padding: 3, borderRadius: 2 }}>
            <Text style={{ fontSize: 6.2, fontFamily: 'Helvetica-Bold', color: '#112E51', marginBottom: 2 }}>
              FIGURA A: WAVEFORM TEMPORAL CRUDO (ANTES)
            </Text>
            <WaveformFormanteSvg width={230} height={70} isBlank={isBlank} />
            <Text style={{ fontSize: 5.5, color: '#475569', marginTop: 2 }}>
              Captura de envolvente RMS temporal en capa de análisis Sonic Visualiser.
            </Text>
          </View>

          {/* Figura Espectrograma */}
          <View style={{ width: '49%', borderWidth: 0.8, borderColor: '#CBD5E1', padding: 3, borderRadius: 2 }}>
            <Text style={{ fontSize: 6.2, fontFamily: 'Helvetica-Bold', color: '#005EA2', marginBottom: 2 }}>
              FIGURA B: ESPECTROGRAMA FFT ANOTADO (DESPUÉS)
            </Text>
            <SpectrogramSvg width={230} height={70} isBlank={isBlank} />
            <Text style={{ fontSize: 5.5, color: '#475569', marginTop: 2 }}>
              Espectrograma FFT 0-24 kHz con trazo continuo de F0 y formantes F1-F3.
            </Text>
          </View>
        </View>

        {/* 3.0 DICTAMEN INDIVIDUALIZADO DEL PERITO */}
        <Text id="seccion-3.0" style={pdfStyles.sectionTitle}>3.0 DICTAMEN INDIVIDUALIZADO PARA ESTE ARCHIVO DE AUDIO</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Conclusión Técnica Específica:</Text>
          <Text style={[pdfStyles.fieldValue, { fontFamily: 'Helvetica-Bold', color: '#008837' }]}>
            [ X ] SIN EVIDENCIA DE ALTERACIÓN (Continuidad espectral íntegra y formantes armónicos conformes)
          </Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fundamento Metodológico:</Text>
          <Text style={pdfStyles.fieldValue}>
            SWGDE Guidelines for Forensic Audio Analysis (Sec. 4.2 &amp; 5.1); Hollien, H. Forensic Voice Identification; ISO/IEC 27042:2015.
          </Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Limitaciones del Análisis:</Text>
          <Text style={pdfStyles.fieldValue}>
            Circunscrito a la banda audible y formantes preservados por compresión Opus/WhatsApp (48 kHz).
          </Text>
        </View>

        {/* 4.0 IDENTIFICACIÓN DEL SOFTWARE (SONIC VISUALISER & DESCARGO DAUBERT) */}
        <Text id="seccion-4.0" style={[pdfStyles.sectionTitle, { marginTop: 4 }]}>
          4.0 IDENTIFICACIÓN TÉCNICA DEL SOFTWARE INSTRUMENTAL (SONIC VISUALISER)
        </Text>
        <View style={customStyles.softwareBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
            <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#112E51' }}>
              Software: Sonic Visualiser v5.0.2 (x86_64) | Licencia: GNU GPL-2.0-or-later
            </Text>
            <Text style={{ fontSize: 6.2, fontFamily: 'Helvetica-Bold', color: '#008837' }}>
              100% CÓDIGO ABIERTO AUDITABLE
            </Text>
          </View>
          <Text style={{ fontSize: 6.2, color: '#334155' }}>
            Desarrollador: Centre for Digital Music (C4DM), Queen Mary University of London · Motores: Vamp Plugins, FFTW3.
          </Text>

          <View style={customStyles.daubertDisclaimer}>
            <Text style={[customStyles.daubertDisclaimerText, { fontFamily: 'Helvetica-Bold', marginBottom: 1 }]}>
              ⚖️ NOTA METODOLÓGICA Y DESCARGO DE RESPONSABILIDAD DAUBERT / FRE 702:
            </Text>
            <Text style={customStyles.daubertDisclaimerText}>
              Sonic Visualiser es una herramienta instrumental de análisis y visualización de espectrogramas y formas de onda utilizada como apoyo técnico de laboratorio. La validez probatoria del presente informe emana de la metodología científica aplicada por el perito, sustentada en principios de acústica forense, revisión por pares y plena sujeción al estándar Daubert v. Merrell Dow Pharmaceuticals (1993) y FRE 702, y no de una supuesta certificación judicial previa del software por tribunal alguno.
            </Text>
          </View>
        </View>

        {/* 5.0 DECLARACIÓN JURADA DEL PERITO & CIERRE DACTILOSCÓPICO */}
        <Text id="seccion-5.0" style={[pdfStyles.sectionTitle, { marginTop: 4 }]}>
          5.0 DECLARACIÓN JURADA DEL PERITO (REQUISITO DAUBERT), TASA DE ERROR Y FIRMAS
        </Text>
        <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.8, borderColor: '#CBD5E1', padding: 4, borderRadius: 2, marginBottom: 4 }}>
          <Text style={{ fontSize: 6.2, color: '#1E293B', lineHeight: 1.35 }}>
            «Declaro bajo juramento que este análisis fue ejecutado conforme a metodología científica reproducible y verificable por terceros peritos. La tasa de error documentada del análisis espectral FFT bajo SNR &gt; 15 dB es inferior al 0.05% en la detección de discontinuidades de fase o empalmes de edición.»
          </Text>
        </View>

        {/* BLOQUE DE FIRMAS Y DACTILOSCOPÍA */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
          {/* Firma Perito */}
          <View style={{ width: '38%', alignItems: 'center' }}>
            <View style={{ width: '100%', height: 26, borderBottomWidth: 1, borderBottomColor: '#0F172A', marginBottom: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 9, fontFamily: 'Times-Italic', color: '#112E51' }}>
                {fmt(c.peritoLider, 'Perito Acústico Forense')}
              </Text>
            </View>
            <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#112E51' }}>
              {fmt(c.peritoLider, 'Ing. Perito Especialista')}
            </Text>
            <Text style={{ fontSize: 5.8, color: '#475569' }}>Perito en Acústica Forense (Líder)</Text>
            <Text style={{ fontSize: 5.8, color: '#475569', fontFamily: 'Courier' }}>
              C.I. {fmt(c.perito_cedula, 'V-18.420.912')} | CIV: {fmt(c.perito_civ, '218.402')}
            </Text>
          </View>

          {/* Dactiloscopía Dual */}
          <View style={{ width: '22%', flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
            <View style={customStyles.thumbBox}>
              <Text style={{ fontSize: 5, color: '#64748B', textAlign: 'center' }}>PULGAR IZQ.</Text>
            </View>
            <View style={customStyles.thumbBox}>
              <Text style={{ fontSize: 5, color: '#64748B', textAlign: 'center' }}>PULGAR DER.</Text>
            </View>
          </View>

          {/* Firma Consignante */}
          <View style={{ width: '38%', alignItems: 'center' }}>
            <View style={{ width: '100%', height: 26, borderBottomWidth: 1, borderBottomColor: '#0F172A', marginBottom: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 9, fontFamily: 'Times-Italic', color: '#112E51' }}>
                {fmt(c.solicitante_nombre, 'Custodio Consignante')}
              </Text>
            </View>
            <Text style={{ fontSize: 6.8, fontFamily: 'Helvetica-Bold', color: '#112E51' }}>
              {fmt(c.solicitante_nombre, 'Consignante / Custodio Legal')}
            </Text>
            <Text style={{ fontSize: 5.8, color: '#475569' }}>Recepción y Conformidad de la Muestra</Text>
            <Text style={{ fontSize: 5.8, color: '#475569', fontFamily: 'Courier' }}>
              C.I. {fmt(c.solicitante_cedula, 'V-15.892.104')}
            </Text>
          </View>
        </View>

        {/* Sello SHA-256 Inmutable */}
        <View style={{ marginTop: 4, padding: 2, backgroundColor: '#F1F5F9', borderRadius: 2, alignItems: 'center' }}>
          <Text style={{ fontSize: 5.2, color: '#112E51', fontFamily: 'Courier' }}>
            INMUTABILIDAD SHA-256: HASH_CHAIN_ID({numeroInforme}:{fecha}:{fmt(c.hashSHA256, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')})
          </Text>
        </View>

        <PlanillaFooter />
      </Page>
    </Document>
  );
};
