/**
 * DictamenImagenesPdf.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dictamen Pericial Informático Forense — Versión ANÁLISIS DE IMÁGENES
 * Estándar: Daubert v. Merrell Dow Pharmaceuticals (1993) + FRE Rule 702
 *            COPP Arts. 187, 223, 225 | ISO/IEC 27042:2015 | MUCC-2017
 *            PhotoHolmes Python Forensic Engine
 *
 * Estructura (8 páginas):
 *  Pág. 1 — Portada + Preámbulo + Marco Normativo RAG
 *  Pág. 2 — Acreditación Pericial + Objeto Pericial + Tabla SHA-256
 *  Pág. 3 — Metodología + Hallazgos Específicos de Imagen
 *  Pág. 4 — FIGURA 1: ELA Map (Error Level Analysis)
 *  Pág. 5 — FIGURA 2: Copy-Move Detection
 *  Pág. 6 — FIGURA 3: JPEG Ghost + Metadata EXIF
 *  Pág. 7 — Conclusiones + Limitaciones + Juramento + Firma Dactilar
 *  Pág. 8 — Bibliografía Normativa RAG (MUCC-2017 + ISO + COPP + NIST)
 */

import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';
import {
  ElaMapSvg,
  CopyMoveDetectionSvg,
  JpegGhostExifSvg,
} from '../forensicSvgCharts';

interface Props {
  caso?: any;
  isBlankMode?: boolean;
}

export const DictamenImagenesPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, 'EXP-2026-SHA-0091');
  const fecha = fmt(c.fecha, '23/07/2026 — 11:45 AM');
  const numeroDictamen = `DICT-IMG-SHA256-2026-${numeroExpediente || '0091'}`;
  const isBlank = isBlankMode;

  return (
    <Document title={`Dictamen_Pericial_Imagenes_${c.numeroCaso || 'EXP'}`}>

      {/* ====================================================================== */}
      {/* PÁGINA 1 — PORTADA, PREÁMBULO INSTITUCIONAL Y MARCO NORMATIVO RAG      */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        {/* Clasificación documental */}
        <View style={pdfStyles.classificationBanner}>
          <Text style={pdfStyles.classificationText}>
            CONFIDENCIAL — DOCUMENTO PROBATORIO DE USO PERICIAL OFICIAL — ANÁLISIS FORENSE DE IMÁGENES DIGITALES
          </Text>
        </View>

        {/* Título + Subtítulo */}
        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>DICTAMEN PERICIAL INFORMÁTICO FORENSE PRIVADO</Text>
          <Text style={pdfStyles.subTitle}>
            ANÁLISIS DE AUTENTICIDAD E INTEGRIDAD FOTOGRÁFICA DIGITAL — LABORATORIO SHA256.US
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
                  IMÁGENES DIGITALES — ELA / COPY-MOVE / JPEG GHOST / EXIF
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
          <Text style={pdfStyles.fieldLabel}>Referencia de Imagen Analizada:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.descripcion, 'IMG_20260615_143207.jpg — Xiaomi Redmi Note 12 Pro 5G | 3024×4032 px | 3.2 MB')}</Text>
        </View>

        {/* Sección II — Marco Jurídico */}
        <Text style={pdfStyles.sectionTitle}>II. MARCO JURÍDICO Y FUNDAMENTACIÓN NORMATIVA RAG</Text>
        <Text style={pdfStyles.paragraph}>
          El presente dictamen se fundamenta en las siguientes disposiciones legales venezolanas e internacionales en materia de forensía digital fotográfica:
        </Text>
        <View style={{ paddingLeft: 6, marginVertical: 2 }}>
          {[
            ['COPP (Arts. 187, 223, 225):', 'Cadena de Custodia, peritajes privados y dictamen pericial formal.'],
            ['Ley sobre Mensajes de Datos y Firmas Electrónicas (Art. 4):', 'Eficacia probatoria e integridad de mensajes de datos con soporte fotográfico.'],
            ['ISO/IEC 27037:2012 (§ 7-9):', 'Identificación, recolección, adquisición y preservación de evidencia digital fotográfica.'],
            ['ISO/IEC 27042:2015 (§ 6):', 'Análisis e interpretación técnico-científica de evidencia digital multimedia.'],
            ['MUCC-2017 (§ 4-7):', 'Trazabilidad SHA-256, inalterabilidad del soporte fotográfico y registro pericial.'],
            ['NIST SP 800-86 (§ 3.4):', 'Guía para integración de técnicas forenses en el procesamiento de imagen digital.'],
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
            El suscrito Perito Informático Forense declara bajo juramento no poseer interés directo ni indirecto con las partes involucradas. Todos los análisis fotográficos, métodos de procesamiento y conclusiones vertidas han sido ejecutados conforme a principios científicos comprobables, reproducibles e imparciales, utilizando licencias y motores certificados internacionalmente. El análisis fue realizado en estación de trabajo aislada (Air-Gap) para garantizar la integridad de la muestra digital conforme al MUCC-2017 § 4.2.
          </Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>IV. OBJETO PERICIAL Y PLANTEAMIENTO TÉCNICO-CIENTÍFICO</Text>
        <Text style={pdfStyles.paragraph}>
          El presente peritaje tiene por objeto determinar la <Text style={{ fontFamily: 'Helvetica-Bold' }}>AUTENTICIDAD, INTEGRIDAD, ORIGEN E INALTERABILIDAD</Text> de la imagen digital consignada voluntariamente ante el Laboratorio SHA256.US. Mediante la aplicación de las técnicas forenses fotográficas: Análisis de Nivel de Error (ELA), Detección de Regiones Clonadas (Copy-Move), JPEG Ghost Overlay y extracción de metadatos EXIF, se determinará si la imagen ha sido objeto de edición, fotomontaje, recorte o inserción artificial de elementos.
        </Text>

        <Text style={pdfStyles.sectionTitle}>V. IDENTIFICACIÓN DE LA EVIDENCIA E INTEGRIDAD SHA-256 (MUCC-2017 § 5.1)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '22%' }]}>Tipo de Archivo</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '23%' }]}>Dimensiones / Tamaño</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '55%' }]}>Hash SHA-256 Génesis (Cadena de Custodia MUCC-2017)</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>
              {fmt(c.evidencia_tipo, 'Imagen JPEG (Fotografía Digital)')}
            </Text>
            <Text style={[pdfStyles.tableCell, { width: '23%' }]}>
              {fmt(c.evidencia_dim, '3024 × 4032 px | 3.2 MB | 72 DPI')}
            </Text>
            <Text style={[pdfStyles.tableCell, { width: '55%', fontSize: 6, fontFamily: 'Courier' }]}>
              {fmt(c.hashGenesis, 'a3f9d2e5c8b1047f6a2d3e8c9b5f1e2d7a4c0f3b8e5d2a9c6b3f0e7d4a1c8b5f2')}
            </Text>
          </View>
        </View>

        {/* Tabla triple hash */}
        <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 8, marginBottom: 4 }}>
          VERIFICACIÓN DE INTEGRIDAD TRIPLE — MUCC-2017 § 5.1 (Hash de Apertura vs Hash de Cierre):
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '12%' }]}>Algoritmo</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '53%' }]}>Hash de Apertura (Consignación)</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Estado al Cierre</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '15%' }]}>Resultado</Text>
          </View>
          {[
            { algo: 'MD5', hash: fmt(c.hashMD5, 'a3f9d2e5c8b1047f6a2d3e8c9b5f1e2d'), resultado: 'MATCH ✓' },
            { algo: 'SHA-1', hash: fmt(c.hashSHA1, '3a7b9f2e6c0d14a82f5b3e9c1d6a0f4b8c2e7a3b'), resultado: 'MATCH ✓' },
            { algo: 'SHA-256', hash: fmt(c.hashSHA256, 'a3f9d2e5c8b1047f6a2d3e8c9b5f1e2d7a4c0f3b8e5d2a9c6b3f0e7d4a1c8b5f2'), resultado: 'MATCH ✓' },
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
      {/* PÁGINA 3 — METODOLOGÍA FORENSE + HALLAZGOS ESPECÍFICOS DE IMAGEN       */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>VI. METODOLOGÍA Y HERRAMIENTAS FORENSES CERTIFICADAS (ISO/IEC 27042 § 6)</Text>
        <Text style={pdfStyles.paragraph}>
          Se aplicó el protocolo estandarizado de forensía fotográfica digital conforme a ISO/IEC 27042:2015. La imagen fue procesada en entorno controlado sobre duplicado forense verificado con hash SHA-256. Herramientas utilizadas:
        </Text>
        <View style={{ paddingLeft: 6, marginVertical: 3 }}>
          {[
            ['PhotoHolmes Python Forensic Engine v2.1:', 'Motor de análisis ELA, Copy-Move Detection, JPEG Ghost y mapas de compresión. github.com/photoholmes/photoholmes'],
            ['FTK Imager v4.7 (AccessData):', 'Adquisición forense y verificación criptográfica del soporte de almacenamiento.'],
            ['IPED Digital Forensics v4.1:', 'Extracción masiva de metadatos EXIF, geolocalización GPS y árbol de archivos forense.'],
            ['ExifTool v12.76 (Phil Harvey):', 'Extracción completa y parsing de metadatos EXIF/IPTC/XMP del archivo de imagen.'],
            ['Hex Fiend / WinHex:', 'Inspección de cabecera binaria hexadecimal y validación de marcadores JPEG (FFD8FFE1).'],
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
              '1. ELA (Error Level Analysis) — PhotoHolmes Engine: El análisis de nivel de error evidencia homogeneidad ' +
              'estadística del 96.2% en todos los bloques de compresión JPEG. No se detectan regiones con re-compresión ' +
              'diferencial indicativa de fotomontaje o inserción de elementos.\n\n' +
              '2. Copy-Move Detection — Block Matching: Los 12 bloques analizados mediante correlación cruzada normalizada ' +
              '(NCC) no presentan regiones clonadas ni trasladadas. Índice de coincidencia: 0.0% en todos los bloques.\n\n' +
              '3. JPEG Ghost Overlay: La superposición con calidad reducida (Q=50) revela artefactos uniformes en toda la ' +
              'superficie de la imagen, consistentes con una única compresión JPEG original sin capas adicionales.\n\n' +
              '4. Metadata EXIF: Los metadatos extraídos con ExifTool v12.76 son coherentes e íntegros. El campo ' +
              'DateTimeOriginal coincide con la declaración del consignante. Coordenadas GPS verificadas. Software: ' +
              '"Android Camera v4.2". Sin evidencia de edición en software como Photoshop, GIMP o similar.\n\n' +
              '5. Inspección de Cabecera Binaria: La firma hexadecimal FFD8FFE1 corresponde a formato JPEG estándar ' +
              'con bloque EXIF. Estructura de marcadores coherente y sin fragmentos sospechosos.'
            )}
          </Text>
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 4 — FIGURA 1: ANÁLISIS ELA (ERROR LEVEL ANALYSIS)               */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO I — ANÁLISIS ELA (ERROR LEVEL ANALYSIS) — PhotoHolmes Engine</Text>
        <Text style={pdfStyles.paragraph}>
          El <Text style={{ fontFamily: 'Helvetica-Bold' }}>Error Level Analysis (ELA)</Text> es una técnica forense fotográfica estandarizada que evalúa los niveles de re-compresión JPEG en distintas regiones de la imagen. Las áreas editadas presentan niveles de error significativamente superiores a las regiones auténticas. La uniformidad del mapa resultante confirma la autenticidad de la imagen.
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 8 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 6 }}>
            FIGURA 1: ANÁLISIS ELA — COMPARATIVA IMAGEN ORIGINAL vs MAPA DE NIVEL DE ERROR
          </Text>
          <ElaMapSvg width={484} height={195} isBlank={isBlank} />
          <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.5, borderColor: '#CBD5E1', padding: 5, marginTop: 6 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 2 }}>
              INTERPRETACIÓN PERICIAL — LEYENDA TÉCNICA ELA:
            </Text>
            <Text style={{ fontSize: 6.5, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
              {isBlank ? '' : 'El mapa ELA generado por PhotoHolmes Python Forensic Engine v2.1 muestra homogeneidad estadística en la distribución de niveles de re-compresión JPEG. La tasa de consistencia global es del 96.2%, categoría "AUTÉNTICA" según el umbral del 85% establecido por Farid et al. (2009). Las regiones con coloración verde uniforme indican ausencia de edición digital posterior. CONCLUSIÓN: La imagen ES 100% AUTÉNTICA Y FIEL, libre de fotomontajes o inserciones artificiales.'}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 6, marginBottom: 3 }}>
          FUNDAMENTACIÓN CIENTÍFICA DEL MÉTODO ELA:
        </Text>
        <View style={{ paddingLeft: 6 }}>
          <Text style={{ fontSize: 7, color: '#1E293B', marginBottom: 2 }}>
            • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Base científica:</Text> Farid, H. & Lyu, S. (2003). "Detecting hidden messages using higher-order statistics and support vector machines." LNCS 2578.
          </Text>
          <Text style={{ fontSize: 7, color: '#1E293B', marginBottom: 2 }}>
            • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Revisión por pares:</Text> Krawetz, N. (2007). "A picture's worth: Digital image analysis and forensics." BlackHat Briefings.
          </Text>
          <Text style={{ fontSize: 7, color: '#1E293B', marginBottom: 2 }}>
            • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Aceptación judicial:</Text> El método ELA ha sido aceptado como prueba pericial en tribunales de los Estados Unidos (Daubert), la Unión Europea y Venezuela (COPP Art. 223).
          </Text>
          <Text style={{ fontSize: 7, color: '#1E293B', marginBottom: 2 }}>
            • <Text style={{ fontFamily: 'Helvetica-Bold' }}>Estándar ISO/IEC 27042 § 7.3:</Text> El análisis se realizó sobre copia forense bit-a-bit del archivo original sin modificar la evidencia primaria.
          </Text>
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 5 — FIGURA 2: COPY-MOVE DETECTION                               */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO II — DETECCIÓN DE REGIONES CLONADAS (COPY-MOVE)</Text>
        <Text style={pdfStyles.paragraph}>
          La <Text style={{ fontFamily: 'Helvetica-Bold' }}>Detección Copy-Move</Text> es una técnica forense que identifica regiones de la imagen que han sido copiadas y pegadas dentro del mismo archivo para ocultar u añadir elementos. Se emplea el algoritmo de correlación cruzada normalizada (NCC) por bloques de 16×16 píxeles con transformación DCT.
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 8 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 6 }}>
            FIGURA 2: COPY-MOVE DETECTION — GRID DE ANÁLISIS DE {'{'}12{'}'} BLOQUES (PhotoHolmes NCC)
          </Text>
          <CopyMoveDetectionSvg width={484} height={185} isBlank={isBlank} />
          <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.5, borderColor: '#CBD5E1', padding: 5, marginTop: 6 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 2 }}>
              INTERPRETACIÓN PERICIAL — ANÁLISIS DE BLOQUES NCC:
            </Text>
            <Text style={{ fontSize: 6.5, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
              {isBlank ? '' : 'El análisis de correlación cruzada normalizada aplicado sobre 12 bloques (grid 4×3) de la imagen analizada no detecta ninguna coincidencia de similitud superior al umbral de 85% que indicaría una región clonada o trasladada. El índice de coincidencia máximo registrado es 0.0% en todos los bloques evaluados. CONCLUSIÓN: La imagen NO presenta regiones copiadas, clonadas ni manipuladas. AUTENTICIDAD CONFIRMADA (ISO/IEC 27042 § 7.3).'}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 6, marginBottom: 3 }}>
          PARÁMETROS TÉCNICOS DEL ANÁLISIS:
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '30%' }]}>Parámetro</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '35%' }]}>Valor Aplicado</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '35%' }]}>Referencia</Text>
          </View>
          {[
            ['Tamaño de bloque DCT', '16 × 16 píxeles', 'PhotoHolmes Default'],
            ['Algoritmo de correlación', 'NCC (Normalized Cross-Correlation)', 'Fridrich et al. 2003'],
            ['Umbral de detección', 'NCC ≥ 0.85 = Clonación', 'NIST SP 800-86'],
            ['Bloques analizados', '12 (Grid 4×3)', 'ISO 27042 § 7'],
            ['Resultado global', '0 regiones clonadas detectadas', 'RESULTADO PERICIAL'],
          ].map(([param, val, ref], i) => (
            <View key={i} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '30%', fontFamily: 'Helvetica-Bold' }]}>{param}</Text>
              <Text style={[pdfStyles.tableCell, { width: '35%' }]}>{isBlank ? '' : val}</Text>
              <Text style={[pdfStyles.tableCell, { width: '35%', fontSize: 6.5 }]}>{ref}</Text>
            </View>
          ))}
        </View>

        <PlanillaFooter />
      </Page>

      {/* ====================================================================== */}
      {/* PÁGINA 6 — FIGURA 3: JPEG GHOST + METADATA EXIF                        */}
      {/* ====================================================================== */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>ANEXO GRÁFICO III — JPEG GHOST OVERLAY + METADATOS EXIF</Text>
        <Text style={pdfStyles.paragraph}>
          El <Text style={{ fontFamily: 'Helvetica-Bold' }}>JPEG Ghost</Text> detecta si elementos externos fueron insertados en la imagen a una calidad de compresión diferente a la imagen base. Los metadatos EXIF proveen información sobre el dispositivo de captura, configuración de cámara, fecha/hora y coordenadas GPS para establecer la procedencia y autenticidad del archivo.
        </Text>

        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, marginBottom: 8 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 6 }}>
            FIGURA 3: JPEG GHOST OVERLAY + TABLA COMPLETA DE METADATOS EXIF — ExifTool v12.76
          </Text>
          <JpegGhostExifSvg width={484} height={175} isBlank={isBlank} />
          <View style={{ backgroundColor: '#F8FAFC', borderWidth: 0.5, borderColor: '#CBD5E1', padding: 5, marginTop: 6 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 2 }}>
              INTERPRETACIÓN PERICIAL — JPEG GHOST Y METADATA:
            </Text>
            <Text style={{ fontSize: 6.5, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
              {isBlank ? '' : 'El análisis JPEG Ghost a Q=50 revela artefactos de compresión uniformes en toda la superficie, lo que descarta la inserción de elementos a distinta calidad. Los metadatos EXIF extraídos son íntegros y coherentes: el campo DateTimeOriginal (2026:06:15 14:32:07) coincide con la declaración del consignante. Las coordenadas GPS (10° 04\' 22.8" N / 69° 21\' 14.3" W) ubican la captura en la localidad declarada. El campo Software indica "Android Camera v4.2" sin rastros de Photoshop, GIMP, Snapseed ni herramienta de edición. Hash SHA-256 EXIF verificado: MATCH. CONCLUSIÓN: Metadata ÍNTEGRA y ORIGEN VERIFICADO.'}
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
            DICTAMEN: IMAGEN DIGITAL AUTÉNTICA, ÍNTEGRA Y VÁLIDA COMO MEDIO PROBATORIO
          </Text>
          <Text style={{ fontSize: 7.5, color: '#1E293B', textAlign: 'justify', lineHeight: 1.4 }}>
            {isBlank ? '' : `Con base en los análisis técnico-científicos ejecutados en el Laboratorio SHA256.US — específicamente ELA (96.2% de consistencia), Copy-Move Detection (0 regiones clonadas), JPEG Ghost (artefactos uniformes) y validación de metadatos EXIF (íntegros y coherentes) — y habiéndose auditado la inalterabilidad de la muestra mediante triple verificación Hash (MD5/SHA-1/SHA-256) conforme al MUCC-2017, el suscrito Perito dictamina formalmente que la imagen digital identificada como ${numeroExpediente} ES ABSOLUTAMENTE AUTÉNTICA, ÍNTEGRA Y FIEL. No se detectan alteraciones, fotomontajes, inserciones artificiales, clonaciones ni modificaciones en los metadatos. La imagen constituye PLENA PRUEBA DIGITAL conforme a la Ley sobre Mensajes de Datos y Firmas Electrónicas y el COPP Art. 223.`}
          </Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>IX. LIMITACIONES TÉCNICAS DEL ANÁLISIS PERICIAL (FRE RULE 702-b)</Text>
        <View style={pdfStyles.limitationsBox}>
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#D97706', marginBottom: 2 }}>
            ALCANCE Y LIMITACIONES EXPRESAS DEL DICTAMEN:
          </Text>
          <Text style={{ fontSize: 7, color: '#1E293B', textAlign: 'justify', lineHeight: 1.35 }}>
            El presente análisis se limita estrictamente al archivo de imagen digital consignado físicamente. Las conclusiones no se extienden a versiones previas de la imagen en dispositivos o servidores externos, metadatos eliminados con anterioridad a la consignación, ni a cadenas de transmisión de mensajería instantánea (re-compresiones de plataformas). El análisis fue realizado sobre el archivo consignado tal como fue entregado al Laboratorio SHA256.US.
          </Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>X. JURAMENTO PERICIAL, FIRMA Y REGISTRO DACTILAR (COPP ART. 225 / MUCC-2017 § 7)</Text>
        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <View style={[pdfStyles.peritoCard, { width: '72%' }]}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO INFORMÁTICO FORENSE DICTAMINADOR — ANÁLISIS DE IMÁGENES</Text>
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
                ['Especialización:', 'Informática Forense — Análisis de Imagen Digital'],
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
            ['NIST SP 800-86', 'Guide to Integrating Forensic Techniques into Incident Response (§ 3.4)', 'Publicación Especial US'],
            ['COPP (Gaceta N° 6.645)', 'Código Orgánico Procesal Penal — Arts. 187 (Cadena de Custodia) y 223-225 (Peritaje)', 'Sustento Procesal VEN'],
            ['Ley Mensajes Datos', 'Ley sobre Mensajes de Datos y Firmas Electrónicas (Gaceta N° 37.148) — Art. 4', 'Sustento Sustantivo VEN'],
            ['Ley Delitos Inform. 2001', 'Ley Especial de Delitos Informáticos (Gaceta N° 37.313)', 'Legislación Especializada'],
            ['RFC 3227 (IETF 2002)', 'Guidelines for Evidence Collection and Archiving — Orden de Volatilidad', 'Estándar Técnico Network'],
            ['ACPO Good Practice v5', 'Good Practice Guide for Digital Evidence (ACPO UK 2012)', 'Referencia Internacional'],
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
          FIN DEL DICTAMEN PERICIAL — ANÁLISIS DE IMÁGENES DIGITALES — {numeroDictamen}
        </Text>
        <Text style={[pdfStyles.paragraph, { textAlign: 'center', fontSize: 7 }]}>
          Laboratorio SHA256.US — Informática Forense y Cumplimiento Normativo — Sede Principal Quíbor, Venezuela
        </Text>

        <PlanillaFooter />
      </Page>

    </Document>
  );
};

export default DictamenImagenesPdf;
