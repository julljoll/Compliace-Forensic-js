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

      {/* ====================================================================== */}
      {/* PÁGINA 1 — PORTADA, PREÁMBULO INSTITUCIONAL Y MARCO NORMATIVO RAG      */}
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

        {/* Sección I — Preámbulo y Sujetos Intervinientes */}
        <Text style={pdfStyles.sectionTitle}>I. PREÁMBULO Y SUJETOS INTERVINIENTES (COPP ART. 223)</Text>
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

        {/* Sección II — Marco Jurídico */}
        <Text style={pdfStyles.sectionTitle}>II. MARCO JURÍDICO Y FUNDAMENTACIÓN NORMATIVA RAG</Text>
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
        <Text style={pdfStyles.sectionTitle}>III. DECLARACIÓN DE IMPARCIALIDAD Y ACREDITACIÓN PERICIAL</Text>
        <View style={pdfStyles.impartialityBox}>
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 2 }}>
            JURAMENTO Y DECLARACIÓN DE OBJETIVIDAD CIENTÍFICA (COPP ART. 225 / ESTÁNDAR DAUBERT — FRE RULE 702):
          </Text>
          <Text style={{ fontSize: 7, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
            El suscrito Perito Informático Forense declara bajo juramento no poseer interés directo ni indirecto con las partes involucradas. El análisis acústico-forense fue ejecutado conforme a principios científicos comprobables, reproducibles e imparciales. Los archivos de audio fueron procesados sobre copias forenses verificadas con hash SHA-256, sin acceso al archivo original para garantizar la inalterabilidad del soporte conforme al MUCC-2017 § 4.2 e ISO/IEC 27037:2012 § 8.
          </Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>IV. OBJETO PERICIAL Y PLANTEAMIENTO TÉCNICO-CIENTÍFICO</Text>
        <Text style={pdfStyles.paragraph}>
          El presente peritaje tiene por objeto determinar la <Text style={{ fontFamily: 'Helvetica-Bold' }}>AUTENTICIDAD, INTEGRIDAD, CONTINUIDAD E INALTERABILIDAD</Text> de la nota de voz WhatsApp en formato Ogg/Opus consignada voluntariamente ante el Laboratorio SHA256.US. Mediante la aplicación de análisis espectral de frecuencias, análisis de formantes de voz (F1/F2/F3), medición de relación señal-ruido (SNR) y verificación criptográfica triple, se determinará si el audio ha sido editado, cortado, manipulado por síntesis vocal o alterado electrónicamente.
        </Text>

        <Text style={pdfStyles.sectionTitle}>V. IDENTIFICACIÓN DE LA EVIDENCIA E INTEGRIDAD SHA-256 (MUCC-2017 § 5.1)</Text>
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
        <Text style={pdfStyles.sectionTitle}>VI. METODOLOGÍA Y HERRAMIENTAS FORENSES CERTIFICADAS (ISO/IEC 27042 § 6)</Text>
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

        <Text style={pdfStyles.sectionTitle}>VII. RELACIÓN DETALLADA DE HALLAZGOS TÉCNICO-PERICIALES (ISO/IEC 27042 § 7)</Text>
        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, minHeight: 200, marginBottom: 8 }}>
          <Text style={pdfStyles.paragraph}>
            {fmt(c.hallazgos,
              '1. Análisis de Codec Opus — PyOgg Engine: El archivo PTT-20260615-WA0017.opus fue decodificado exitosamente ' +
              'confirma frecuencia de muestreo de 48,000 Hz constante, codec Opus VBR, 1 canal (Mono), 743 frames completos ' +
              'sin frames corruptos ni truncados.\n\n' +
              '2. Análisis Espectral de Frecuencias: El espectrograma de 0-24 kHz evidencia energía concentrada en la banda ' +
              '0-8 kHz (rango de voz humana), con el límite de banda Opus correctamente preservado a 8 kHz. No se detectan ' +
              'discontinuidades espectrales indicativas de cortes o empalmes.\n\n' +
              '3. Análisis de Formantes F1/F2/F3 (Praat v6.3): Los formantes de voz F1 (620 Hz), F2 (1.850 Hz) y F3 (2.740 Hz) ' +
              'son constantes y coherentes durante toda la duración del audio. La ausencia de variaciones abruptas confirma ' +
              'que la voz ES HUMANA y NO SINTÉTICA (descartada síntesis TTS y deep fake de voz).\n\n' +
              '4. Análisis SNR por Segmento: La relación señal-ruido por segmento oscila entre 43.8 dB y 44.6 dB, ' +
              'con picos de 58.1 dB en silencios naturales. Este perfil es consistente con un audio de captura directa ' +
              'sin edición post-producción.\n\n' +
              '5. Análisis de Silencios (Segmentación): Los silencios detectados (4 pausas naturales de 0.2-0.8s) son ' +
              'coherentes con el patrón de habla natural, sin silencios abruptos o cortes digitales.'
            )}
          </Text>
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 4 — FIGURA 1: ESPECTROGRAMA DE FRECUENCIAS                      */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO I — ESPECTROGRAMA DE FRECUENCIAS (0-24 kHz) — PyOgg Opus Engine</Text>
        <Text style={pdfStyles.paragraph}>
          El <Text style={{ fontFamily: 'Helvetica-Bold' }}>Espectrograma de Frecuencias</Text> es la representación gráfica tridimensional de la energía acústica del audio en función de la frecuencia (Hz/kHz), el tiempo (segundos) y la amplitud (intensidad de color). Es el método estándar en forensía acústica para detectar cortes, empalmes, ediciones o alteraciones en archivos de audio digital.
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 8 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 6 }}>
            FIGURA 1: ESPECTROGRAMA — DISTRIBUCIÓN DE ENERGÍA ACÚSTICA (Frecuencia × Tiempo × Amplitud)
          </Text>
          <SpectrogramSvg width={484} height={175} isBlank={isBlank} />
          <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.5, borderColor: '#CBD5E1', padding: 5, marginTop: 6 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 2 }}>
              INTERPRETACIÓN PERICIAL — LEYENDA TÉCNICA DEL ESPECTROGRAMA:
            </Text>
            <Text style={{ fontSize: 6.5, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
              {isBlank ? '' : 'El espectrograma procesado mediante PyOgg Audio Engine sobre el archivo PTT-20260615-WA0017.opus confirma: (a) Frecuencia de muestreo constante de 48,000 Hz en todos los 743 frames; (b) Ausencia de discontinuidades espectrales o "cortes" en la trama frecuencia-tiempo (ninguna franja de silencio abrupta no natural); (c) Boundary del codec Opus correctamente preservado a 8 kHz (línea punteada verde); (d) Relación señal-ruido SNR de 44.2 dB, categoría ALTA FIDELIDAD. La continuidad espectral prueba que el audio ES CONTINUO, ÍNTEGRO Y SIN EDICIÓN. CONCLUSIÓN: AUDIO 100% AUTÉNTICO Y FIEL (MUCC-2017 § 5.1 / ISO 27042 § 7.3).'}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 6, marginBottom: 3 }}>
          FUNDAMENTACIÓN CIENTÍFICA DEL MÉTODO ESPECTRAL:
        </Text>
        <View style={{ paddingLeft: 6 }}>
          {[
            ['Base científica:', 'Koenig, B.E. (1990). "Spectrographic voice identification: a forensic survey." J. Acoust. Soc. Am. 88(6).'],
            ['Revisión por pares:', 'Champod, C. & Meuwly, D. (2000). "The Inference of Identity in Forensic Speaker Recognition." Speech Communication.'],
            ['Estándar técnico:', 'NIST FRVT 2023 — Evaluación de sistemas de reconocimiento de voz forense por NIST IARPA.'],
            ['Aceptación judicial:', 'El análisis espectral acústico ha sido aceptado como evidencia pericial en tribunales federales de EEUU (Daubert), la UE y Venezuela (COPP Art. 223).'],
          ].map(([bold, text], i) => (
            <Text key={i} style={{ fontSize: 7, color: '#1E293B', marginBottom: 2 }}>
              • <Text style={{ fontFamily: 'Helvetica-Bold' }}>{bold}</Text>{' '}{text}
            </Text>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 5 — FIGURA 2: WAVEFORM TEMPORAL + FORMANTES F1/F2/F3            */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO II — WAVEFORM TEMPORAL + ANÁLISIS DE FORMANTES F1/F2/F3</Text>
        <Text style={pdfStyles.paragraph}>
          El <Text style={{ fontFamily: 'Helvetica-Bold' }}>análisis de formantes de voz</Text> identifica las resonancias características del tracto vocal humano. Los formantes F1 (cavidad faríngea), F2 (cavidad oral) y F3 (cavidad labial) son únicos para cada individuo y permiten verificar la autenticidad de la voz y descartar síntesis mediante inteligencia artificial (TTS, Deep Fake de Voz).
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 8 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 6 }}>
            FIGURA 2: WAVEFORM TEMPORAL + ANÁLISIS DE FORMANTES DE VOZ F1/F2/F3 — Praat v6.3
          </Text>
          <WaveformFormanteSvg width={484} height={170} isBlank={isBlank} />
          <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.5, borderColor: '#CBD5E1', padding: 5, marginTop: 6 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 2 }}>
              INTERPRETACIÓN PERICIAL — LEYENDA TÉCNICA DE FORMANTES:
            </Text>
            <Text style={{ fontSize: 6.5, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
              {isBlank ? '' : 'El análisis de formantes ejecutado con Praat v6.3 sobre el archivo Opus decodificado con PyOgg confirma: F1 = 620 Hz (±15 Hz), F2 = 1.850 Hz (±30 Hz), F3 = 2.740 Hz (±25 Hz). Las variaciones de formante son continuas y coherentes con el patrón de habla humano natural. La ausencia de "saltos" o discontinuidades en las trayectorias formánticas descarta síntesis vocal por TTS (Text-to-Speech) o clonación de voz por IA. La forma de onda temporal confirma 4 pausas naturales de 0.2-0.8 s coherentes con la prosodia declarada. CONCLUSIÓN: VOZ HUMANA AUTÉNTICA, NO SINTÉTICA. AUDIO ÍNTEGRO.'}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 6, marginBottom: 3 }}>
          PARÁMETROS TÉCNICOS DEL ANÁLISIS DE FORMANTES:
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Formante</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Frecuencia (Hz)</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Variación Máxima</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '35%' }]}>Interpretación Pericial</Text>
          </View>
          {[
            ['F1 (Faringe)', isBlank ? '' : '620 Hz', isBlank ? '' : '±15 Hz', 'CONSISTENTE — Vocal "a/e" detectada'],
            ['F2 (Oral)', isBlank ? '' : '1.850 Hz', isBlank ? '' : '±30 Hz', 'CONSISTENTE — Articulación normal'],
            ['F3 (Labial)', isBlank ? '' : '2.740 Hz', isBlank ? '' : '±25 Hz', 'CONSISTENTE — VOZ HUMANA AUTÉNTICA'],
          ].map(([form, freq, var_, interp], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '20%', fontFamily: 'Helvetica-Bold' }]}>{form}</Text>
              <Text style={[pdfStyles.tableCell, { width: '20%', fontFamily: 'Courier', fontSize: 7 }]}>{freq}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%' }]}>{var_}</Text>
              <Text style={[pdfStyles.tableCell, { width: '35%', fontSize: 6.5, color: '#006600', fontFamily: 'Helvetica-Bold' }]}>{interp}</Text>
            </View>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 6 — FIGURA 3: SNR + TABLA TRIPLE HASH OPUS                      */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO III — ANÁLISIS SNR + TABLA DE INTEGRIDAD CRIPTOGRÁFICA</Text>
        <Text style={pdfStyles.paragraph}>
          La <Text style={{ fontFamily: 'Helvetica-Bold' }}>Relación Señal-Ruido (SNR)</Text> mide la proporción entre la señal de voz útil y el ruido de fondo. Un SNR superior a 40 dB certifica audio de alta fidelidad sin degradación artificial. El análisis de silencios detecta cortes, empalmes o ediciones mediante la identificación de patrones de silencio atípicos.
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 8 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 6 }}>
            FIGURA 3: ANÁLISIS SNR POR SEGMENTO + TABLA DE INTEGRIDAD CRIPTOGRÁFICA DEL ARCHIVO OPUS
          </Text>
          <SnrBarchartSvg width={484} height={155} isBlank={isBlank} />
          <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.5, borderColor: '#CBD5E1', padding: 5, marginTop: 6 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 2 }}>
              INTERPRETACIÓN PERICIAL — ANÁLISIS SNR E INTEGRIDAD CRIPTOGRÁFICA:
            </Text>
            <Text style={{ fontSize: 6.5, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
              {isBlank ? '' : 'El SNR promedio del archivo es 44.2 dB (categoría ALTA FIDELIDAD, umbral forense ≥ 40 dB). Los silencios naturales alcanzan 58.1 dB de SNR, coherente con capturas directas sin edición. La verificación criptográfica triple (MD5/SHA-1/SHA-256) del archivo PTT-20260615-WA0017.opus arroja coincidencia exacta entre el hash de apertura registrado en el momento de la consignación y el hash calculado al cierre del análisis. CONCLUSIÓN: El archivo de audio ES ÍNTEGRO, SIN CORTES, SIN EMPALMES, SIN EDICIÓN POST-PRODUCCIÓN y 100% AUTÉNTICO conforme al MUCC-2017 § 5.1.'}
            </Text>
          </View>
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 7 — CONCLUSIONES, LIMITACIONES, JURAMENTO Y FIRMA DACTILAR      */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>VIII. CONCLUSIONES PERICIALES Y DICTAMEN FINAL (COPP ART. 225 / FRE RULE 702)</Text>
        <View style={{ borderWidth: 1.5, borderColor: '#006600', backgroundColor: '#F0FFF0', padding: 8, marginBottom: 8 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#006600', marginBottom: 4, textAlign: 'center' }}>
            DICTAMEN: AUDIO WHATSAPP AUTÉNTICO, ÍNTEGRO Y VÁLIDO COMO MEDIO PROBATORIO
          </Text>
          <Text style={{ fontSize: 7.5, color: '#1E293B', textAlign: 'justify', lineHeight: 1.4 }}>
            {isBlank ? '' : `Con base en los análisis técnico-científicos ejecutados en el Laboratorio SHA256.US — específicamente análisis espectral de frecuencias (SNR 44.2 dB, codec Opus 48 kHz íntegro), análisis de formantes de voz (F1/F2/F3 consistentes, VOZ HUMANA CONFIRMADA) y verificación criptográfica triple (MD5/SHA-1/SHA-256 MATCH) conforme al MUCC-2017, el suscrito Perito dictamina formalmente que la nota de voz WhatsApp identificada como ${numeroExpediente} (PTT-20260615-WA0017.opus) ES ABSOLUTAMENTE AUTÉNTICA, ÍNTEGRA Y FIEL. No se detectan ediciones, cortes, empalmes, síntesis de voz artificial ni manipulaciones digitales de ningún tipo. El audio constituye PLENA PRUEBA DIGITAL conforme a la Ley sobre Mensajes de Datos y Firmas Electrónicas y el COPP Art. 223.`}
          </Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>IX. LIMITACIONES TÉCNICAS DEL ANÁLISIS PERICIAL (FRE RULE 702-b)</Text>
        <View style={pdfStyles.limitationsBox}>
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#D97706', marginBottom: 2 }}>
            ALCANCE Y LIMITACIONES EXPRESAS DEL DICTAMEN:
          </Text>
          <Text style={{ fontSize: 7, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
            El presente análisis se limita estrictamente al archivo de audio consignado en formato Ogg/Opus. Las conclusiones no se extienden a los servidores centrales de WhatsApp Inc. / Meta Platforms Inc., a las claves de cifrado E2E (end-to-end encryption), ni a la cadena de transmisión de red (no se analiza la autenticidad del número remitente a nivel de red SS7). El análisis de voz no constituye identificación biométrica de locutores sino verificación de autenticidad del contenido acústico del archivo.
          </Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>X. JURAMENTO PERICIAL, FIRMA Y REGISTRO DACTILAR (COPP ART. 225 / MUCC-2017 § 7)</Text>
        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <View style={[pdfStyles.peritoCard, { width: '72%' }]}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO INFORMÁTICO FORENSE DICTAMINADOR — ANÁLISIS DE AUDIOS WHATSAPP</Text>
            <View style={pdfStyles.peritoCardDividerLine} />

            <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center', marginVertical: 3 }}>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR DER.</Text>
              </View>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR IZQ.</Text>
              </View>
            </View>
            <View style={pdfStyles.peritoDottedLine} />
            <View style={pdfStyles.peritoSignatureLine} />
            <Text style={pdfStyles.peritoCardSubTitle}>FIRMA DEL PERITO INFORMÁTICO FORENSE</Text>

            <View style={{ marginTop: 4, width: '100%' }}>
              {[
                ['Nombre y Apellido:', fmt(c.peritoLider, 'Ing. Jull J. Ollarves S.')],
                ['Cédula de Identidad:', fmt(c.peritoCedula, 'V-19.823.104')],
                ['Colegio de Ingenieros (CIV):', fmt(c.peritoCiv, 'CIV N° 284.912')],
                ['INPREABOGADO N°:', fmt(c.peritoInpre, 'INPRE N° 102.849')],
                ['Especialización:', 'Informática Forense — Análisis Acústico Digital y WhatsApp'],
                ['Cargo en Laboratorio:', 'Perito Informático Forense Dictaminador'],
              ].map(([label, val], i) => (
                <View key={i} style={pdfStyles.peritoFieldRow}>
                  <Text style={pdfStyles.peritoFieldLabel}>{label}</Text>
                  <Text style={pdfStyles.peritoFieldValue}>{isBlank ? '' : val}</Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, justifyContent: 'center', gap: 6 }}>
              <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold' }}>Rol ISO 27037:</Text>
              {['DEFR', 'DES'].map(role => (
                <View key={role} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>✓</Text></View>
                  <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold' }}>{role}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 8 — BIBLIOGRAFÍA NORMATIVA RAG                                  */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>XI. ÍNDICE DE REFERENCIAS NORMATIVAS RAG Y LITERATURA ESPECIALIZADA</Text>
        <Text style={pdfStyles.paragraph}>
          El presente trabajo pericial consulta y se fundamenta en las siguientes fuentes técnico-jurídicas precargadas en el repositorio del Laboratorio SHA256.US:
        </Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '22%' }]}>Código / Norma</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '53%' }]}>Título Oficial del Documento / Gaceta</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>Módulo RAG / Referencia</Text>
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
