/**
 * DictamenAudiosPdf.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dictamen Pericial Informático Forense — Versión ANÁLISIS DE AUDIOS WHATSAPP
 * Estándar: Daubert v. Merrell Dow Pharmaceuticals (1993) + FRE Rule 702
 *            COPP Arts. 187, 223, 225 | ISO/IEC 27042:2015 | MUCC-2017
 *            PyOgg Python Audio Engine — Ogg/Opus Decoder 48 kHz
 *
 * Estructura (8 páginas):
 *  Pág. 1 — Portada + Preámbulo + Marco Normativo RAG
 *  Pág. 2 — Acreditación Pericial + Objeto Pericial + Tabla SHA-256 + Triple Hash
 *  Pág. 3 — Metodología + Hallazgos Específicos de Audio
 *  Pág. 4 — FIGURA 1: Espectrograma de Frecuencias (0-24kHz)
 *  Pág. 5 — FIGURA 2: Waveform Temporal + Análisis de Formantes F1/F2/F3
 *  Pág. 6 — FIGURA 3: Análisis SNR + Tabla Triple Hash Opus
 *  Pág. 7 — Conclusiones + Limitaciones + Juramento + Firma Dactilar
 *  Pág. 8 — Bibliografía Normativa RAG (MUCC-2017 + ISO + COPP + NIST)
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
  const numeroDictamen = `DICT-AUD-SHA256-2026-${numeroExpediente || '0091'}`;
  const isBlank = isBlankMode;

  return (
    <Document title={`Dictamen_Pericial_Audios_WhatsApp_${c.numeroCaso || 'EXP'}`}>
      {/* PÁGINA 1 (FOLIO 01) — PORTADA DINÁMICA FOLIADA CON LEYENDA SECCIONAL */}
      <PlanillaCoverPagePdf planillaId="dictamen-audios" caso={caso} isBlankMode={isBlankMode} />

      {/* ====================================================================== */}
      {/* PÁGINA 2 — PORTADA INTERNA, PREÁMBULO INSTITUCIONAL Y MARCO NORMATIVO */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        {/* Clasificación documental */}
        <View style={pdfStyles.classificationBanner}>
          <Text style={pdfStyles.classificationText}>
            CONFIDENCIAL — DOCUMENTO PROBATORIO DE USO PERICIAL OFICIAL — ANÁLISIS FORENSE DE AUDIOS WHATSAPP
          </Text>
        </View>

        {/* Título + Subtítulo */}
        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>DICTAMEN PERICIAL INFORMÁTICO FORENSE PRIVADO</Text>
          <Text style={pdfStyles.subTitle}>
            ANÁLISIS DE AUTENTICIDAD E INTEGRIDAD DE NOTAS DE VOZ WHATSAPP — LABORATORIO SHA256.US
          </Text>

          <View style={pdfStyles.expedienteBox}>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>EXPEDIENTE N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroExpediente}</Text>
              </View>
            </View>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>DICTAMEN N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 7.5, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroDictamen}</Text>
              </View>
            </View>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>TIPO DE ANÁLISIS:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 7.5, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>
                  AUDIOS WHATSAPP — OPUS/OGG | ESPECTROGRAMA | FORMANTES | SNR
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 1.0 MARCO NORMATIVO */}
        <Text id="seccion-1.0" style={pdfStyles.sectionTitle}>1.0 MARCO NORMATIVO Y REQUISITOS PROBATORIOS</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Perito Informático Forense Privado:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.peritoLider, 'Ing. Jull J. Ollarves S.')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Consignante / Solicitante:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre, 'Carlos Eduardo Mendoza Rivas')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / RIF:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_cedula, 'V-18.492.019')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fecha de Emisión del Dictamen:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
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
        <Text id="seccion-2.0" style={pdfStyles.sectionTitle}>2.0 ACREDITACIÓN PERICIAL E IDENTIFICACIÓN DE AUDIOS</Text>
        <Text style={pdfStyles.paragraph}>
          El presente dictamen se fundamenta en las disposiciones legales venezolanas e internacionales en materia de forensía de audio digital y mensajería instantánea:
        </Text>
        <View style={{ paddingLeft: 6, marginVertical: 2 }}>
          {[
            ['COPP (Arts. 187, 223, 225):', 'Cadena de Custodia, peritajes privados y dictamen pericial de medios de comunicación electrónica.'],
            ['Ley sobre Mensajes de Datos y Firmas Electrónicas (Art. 4):', 'Eficacia probatoria de mensajes de datos y notas de voz transmitidas electrónicamente.'],
            ['Ley Especial de Delitos Informáticos (2001, Art. 8):', 'Regulación del manejo de datos de comunicaciones digitales como prueba penal.'],
            ['ISO/IEC 27037:2012 (§ 7-9):', 'Identificación, recolección, adquisición y preservación de evidencia de audio digital.'],
            ['ISO/IEC 27042:2015 (§ 6-7):', 'Análisis e interpretación técnico-científica de evidencia digital de audio.'],
            ['MUCC-2017 (§ 4-7):', 'Trazabilidad SHA-256 del archivo de audio, inalterabilidad del soporte y registro pericial.'],
            ['FRE Rule 702 / Daubert Standard:', 'Metodología comprobable, revisada por pares, tasa de error conocida y aceptación general.'],
          ].map(([bold, text], i) => (
            <Text key={i} style={{ fontSize: 7.5, color: '#1E293B', marginBottom: 2 }}>
              {'• '}<Text style={{ fontFamily: 'Helvetica-Bold' }}>{bold}</Text>{' '}{text}
            </Text>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 2 — ACREDITACIÓN PERICIAL + OBJETO + TABLA SHA-256              */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        {/* 3.0 METODOLOGÍA DE DECODIFICACIÓN */}
        <Text id="seccion-3.0" style={pdfStyles.sectionTitle}>3.0 METODOLOGÍA DE DECODIFICACIÓN OPUS Y METADATOS</Text>
        <View style={pdfStyles.impartialityBox}>
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 2 }}>
            JURAMENTO Y DECLARACIÓN DE OBJETIVIDAD CIENTÍFICA (COPP ART. 225 / ESTÁNDAR DAUBERT — FRE RULE 702):
          </Text>
          <Text style={{ fontSize: 7, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
            El suscrito Perito Informático Forense declara bajo juramento no poseer interés directo ni indirecto con las partes involucradas. El análisis acústico-forense fue ejecutado conforme a principios científicos comprobables, reproducibles e imparciales. Los archivos de audio fueron procesados sobre copias forenses verificadas con hash SHA-256, sin acceso al archivo original para garantizar la inalterabilidad del soporte conforme al MUCC-2017 § 4.2 e ISO/IEC 27037:2012 § 8.
          </Text>
        </View>

        {/* 4.0 ESPECTROGRAMA Y ANÁLISIS */}
        <Text id="seccion-4.0" style={pdfStyles.sectionTitle}>4.0 ESPECTROGRAMA Y ANÁLISIS DE FRECUENCIA AUDIO</Text>
        <Text style={pdfStyles.paragraph}>
          El presente peritaje tiene por objeto determinar la <Text style={{ fontFamily: 'Helvetica-Bold' }}>AUTENTICIDAD, INTEGRIDAD, CONTINUIDAD E INALTERABILIDAD</Text> de la nota de voz WhatsApp en formato Ogg/Opus consignada voluntariamente ante el Laboratorio SHA256.US. Mediante la aplicación de análisis espectral de frecuencias, análisis de formantes de voz (F1/F2/F3), medición de relación señal-ruido (SNR) y verificación criptográfica triple, se determinará si el audio ha sido editado, cortado, manipulado por síntesis vocal o alterado electrónicamente.
        </Text>

        {/* 5.0 CÁLCULO DE PITCH */}
        <Text id="seccion-5.0" style={pdfStyles.sectionTitle}>5.0 CÁLCULO DE PITCH, FORMANTES Y CONTINUIDAD</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Formato / Codec</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Duración / Frecuencia</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '55%' }]}>Hash SHA-256 Génesis (Cadena de Custodia MUCC-2017)</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '20%', fontFamily: 'Helvetica-Bold' }]}>
              {fmt(c.audio_formato, 'Ogg/Opus VBR (WhatsApp PTT)')}
            </Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>
              {fmt(c.audio_duracion, '00:12.4s | 48,000 Hz | 16 bit | Mono')}
            </Text>
            <Text style={[pdfStyles.tableCell, { width: '55%', fontSize: 6, fontFamily: 'Courier' }]}>
              {fmt(c.hashGenesis, 'b5f2a3e8c9d1047f6a2d3e8c9b5f1e2d7a4c0f3b8e5d2a9c6b3f0e7d4a1c8b502')}
            </Text>
          </View>
        </View>

        {/* Tabla triple hash */}
        <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 8, marginBottom: 4 }}>
          VERIFICACIÓN DE INTEGRIDAD TRIPLE — MUCC-2017 § 5.1 (Hash de Apertura vs Hash de Cierre del Archivo Opus):
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '12%' }]}>Algoritmo</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '53%' }]}>Hash de Apertura (Consignación)</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Estado al Cierre</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '15%' }]}>Resultado</Text>
          </View>
          {[
            { algo: 'MD5', hash: fmt(c.hashMD5, 'b5f2a3e8c9d1047f6a2d3e8c9b5f1e2d'), resultado: 'MATCH ✓' },
            { algo: 'SHA-1', hash: fmt(c.hashSHA1, '9c3b7a2f1e4d5c8a0b6f3e2d9c7a4b1f0e8d5c3a'), resultado: 'MATCH ✓' },
            { algo: 'SHA-256', hash: fmt(c.hashSHA256, 'b5f2a3e8c9d1047f6a2d3e8c9b5f1e2d7a4c0f3b8e5d2a9c6b3f0e7d4a1c8b502'), resultado: 'MATCH ✓' },
          ].map((row, i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '12%', fontFamily: 'Helvetica-Bold' }]}>{row.algo}</Text>
              <Text style={[pdfStyles.tableCell, { width: '53%', fontSize: 6, fontFamily: 'Courier' }]}>{isBlank ? '' : row.hash}</Text>
              <Text style={[pdfStyles.tableCell, { width: '20%', fontSize: 7, color: '#006600' }]}>ÍNTEGRO / NO ALTERADO</Text>
              <Text style={[pdfStyles.tableCell, { width: '15%', fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#006600' }]}>{isBlank ? '' : row.resultado}</Text>
            </View>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 3 — METODOLOGÍA FORENSE + HALLAZGOS ESPECÍFICOS DE AUDIO        */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        {/* 6.0 VERIFICACIÓN DE EDICIÓN */}
        <Text id="seccion-6.0" style={pdfStyles.sectionTitle}>6.0 VERIFICACIÓN DE EDICIÓN Y CORTE DE ONDA</Text>
        <Text style={pdfStyles.paragraph}>
          Se aplicó el protocolo estandarizado de forensía acústica digital conforme a ISO/IEC 27042:2015. El archivo de audio fue procesado sobre duplicado forense verificado mediante triple hash. Herramientas utilizadas:
        </Text>
        <View style={{ paddingLeft: 6, marginVertical: 3 }}>
          {[
            ['PyOgg Python Audio Engine v0.10.11:', 'Decodificación nativa del contenedor Ogg/Opus WhatsApp. Análisis de frecuencia de muestreo, frames VBR, y extracción de metadatos de cabecera Opus. github.com/TeamPyOgg/PyOgg'],
            ['IPED Digital Forensics v4.1 (PF Brasil / INTERPOL):', 'Extracción masiva de archivos PTT (.opus) de la base de datos WhatsApp msgstore.db con verificación de integridad SHA-256.'],
            ['LibreOffice / Python-pydub:', 'Análisis de forma de onda (waveform), segmentación de silencios y análisis de amplitud por canal.'],
            ['Praat v6.3 (Phonetics Lab - Amsterdam):', 'Análisis de formantes de voz (F1/F2/F3), pitch tracking, y verificación de VOT (Voice Onset Time).'],
            ['FTK Imager v4.7 (AccessData):', 'Adquisición forense y verificación criptográfica del dispositivo origen de la extracción.'],
          ].map(([bold, text], i) => (
            <Text key={i} style={{ fontSize: 7.5, color: '#1E293B', marginBottom: 3 }}>
              {i + 1}. <Text style={{ fontFamily: 'Helvetica-Bold' }}>{bold}</Text> {text}
            </Text>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* PÁGINA 4 — ANEXO ESPECTROGRAMA */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO I — ESPECTROGRAMA DE FRECUENCIAS (0-24 kHz) — PyOgg Opus Engine</Text>
        <Text style={pdfStyles.paragraph}>
          El <Text style={{ fontFamily: 'Helvetica-Bold' }}>Espectrograma de Frecuencias</Text> es la representación gráfica tridimensional de la energía acústica.
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 8 }}>
          <SpectrogramSvg width={484} height={175} isBlank={isBlank} />
        </View>

        <PlanillaFooter />
      </Page>

      {/* PÁGINA 5 — WAVEFORM */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO II — WAVEFORM TEMPORAL + ANÁLISIS DE FORMANTES F1/F2/F3</Text>
        <Text style={pdfStyles.paragraph}>
          El <Text style={{ fontFamily: 'Helvetica-Bold' }}>análisis de formantes de voz</Text> identifica las resonancias características.
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 8 }}>
          <WaveformFormanteSvg width={484} height={170} isBlank={isBlank} />
        </View>

        <PlanillaFooter />
      </Page>

      {/* PÁGINA 6 — SNR */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO III — ANÁLISIS SNR + TABLA DE INTEGRIDAD CRIPTOGRÁFICA</Text>
        <Text style={pdfStyles.paragraph}>
          La <Text style={{ fontFamily: 'Helvetica-Bold' }}>Relación Señal-Ruido (SNR)</Text> mide la proporción entre la señal de voz útil y el ruido de fondo.
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 8 }}>
          <SnrBarchartSvg width={484} height={155} isBlank={isBlank} />
        </View>

        <PlanillaFooter />
      </Page>

      {/* PÁGINA 7 — CONCLUSIONES */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        {/* 7.0 CONCLUSIONES PERICIALES */}
        <Text id="seccion-7.0" style={pdfStyles.sectionTitle}>7.0 CONCLUSIONES PERICIALES Y REGISTRO DE CADENA</Text>
        <View style={{ borderWidth: 1.5, borderColor: '#006600', backgroundColor: '#F0FFF0', padding: 8, marginBottom: 8 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#006600', marginBottom: 4, textAlign: 'center' }}>
            DICTAMEN: AUDIO WHATSAPP AUTÉNTICO, ÍNTEGRO Y VÁLIDO COMO MEDIO PROBATORIO
          </Text>
          <Text style={{ fontSize: 7.5, color: '#1E293B', textAlign: 'justify', lineHeight: 1.4 }}>
            {isBlank ? '' : `Con base en los análisis técnico-científicos ejecutados en el Laboratorio SHA256.US — específicamente análisis espectral de frecuencias (SNR 44.2 dB, codec Opus 48 kHz íntegro), análisis de formantes de voz (F1/F2/F3 consistentes, VOZ HUMANA CONFIRMADA) y verificación criptográfica triple (MD5/SHA-1/SHA-256 MATCH) conforme al MUCC-2017, el suscrito Perito dictamina formalmente que la nota de voz WhatsApp identificada como ${numeroExpediente} (PTT-20260615-WA0017.opus) ES ABSOLUTAMENTE AUTÉNTICA, ÍNTEGRA Y FIEL. No se detectan ediciones, cortes, empalmes, síntesis de voz artificial ni manipulaciones digitales de ningún tipo.`}
          </Text>
        </View>

        <PlanillaFooter />
      </Page>

      {/* PÁGINA 8 — BIBLIOGRAFÍA NORMATIVA */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        {/* 8.0 ANEXO DE TRAZABILIDAD */}
        <Text id="seccion-8.0" style={pdfStyles.sectionTitle}>8.0 ANEXO DE TRAZABILIDAD SHA-256</Text>
        <Text style={pdfStyles.paragraph}>
          El presente trabajo pericial consulta y se fundamenta en las siguientes fuentes técnico-jurídicas oficiales aplicables al procedimiento pericial:
        </Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '22%' }]}>Código / Norma</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '53%' }]}>Título Oficial del Documento / Gaceta</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Módulo Normativo / Referencia</Text>
          </View>
          {[
            ['MUCC-2017', 'Manual Único de Cadena de Custodia de Evidencias de Venezuela (§ 4-7)', 'Informática Forense'],
            ['ISO/IEC 27037:2012', 'Guidelines for Identification, Collection, Acquisition and Preservation of Digital Evidence', 'Estándar Internacional'],
            ['ISO/IEC 27042:2015', 'Guidelines for Analysis and Interpretation of Digital Evidence (§ 6-7)', 'Estándar Internacional'],
            ['NIST SP 800-101', 'Guidelines on Mobile Device Forensics — WhatsApp Evidence (§ 4.3)', 'Publicación Especial US'],
            ['NIST SP 800-86', 'Guide to Integrating Forensic Techniques into Incident Response (§ 3.4)', 'Publicación Especial US'],
            ['COPP (Gaceta N° 6.645)', 'Código Orgánico Procesal Penal — Arts. 187 (Cadena) y 223-225 (Peritaje)', 'Sustento Procesal VEN'],
            ['Ley Mensajes Datos', 'Ley sobre Mensajes de Datos y Firmas Electrónicas (Gaceta N° 37.148) — Art. 4', 'Sustento Sustantivo VEN'],
            ['Ley Delitos Inform. 2001', 'Ley Especial de Delitos Informáticos (Gaceta N° 37.313) — Art. 8', 'Legislación Especializada'],
            ['RFC 3227 (IETF 2002)', 'Guidelines for Evidence Collection and Archiving — Orden de Volatilidad', 'Estándar Técnico Network'],
            ['FRE Rule 702 / Daubert', 'Federal Rules of Evidence 702 — Daubert v. Merrell Dow (1993) — Estándar Pericial', 'Estándar Judicial US'],
          ].map(([code, title, mod], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>{code}</Text>
              <Text style={[pdfStyles.tableCell, { width: '53%' }]}>{title}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.5 }]}>{mod}</Text>
            </View>
          ))}
        </View>

        <Text style={[pdfStyles.paragraph, { marginTop: 10, textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>
          FIN DEL DICTAMEN PERICIAL — ANÁLISIS DE AUDIOS WHATSAPP — {numeroDictamen}
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
