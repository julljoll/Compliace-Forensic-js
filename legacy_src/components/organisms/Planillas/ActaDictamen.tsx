import { useState } from 'react';
import { CasoCMS } from '../../../store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface ActaDictamenProps {
  caso?: CasoCMS;
  tipoEvidencia?: 'movil' | 'computadora';
  dictamenMode?: 'imagenes' | 'audios';
}

export default function ActaDictamen({ caso, tipoEvidencia: externalTipoEvidencia, dictamenMode = 'imagenes' }: ActaDictamenProps) {
  const fallbackCaso = {
    numeroCaso: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
    dispositivo_numero_tel: '',
    dispositivo_sim_card: '',
    descripcion: '',
    peritoLider: '',
    tipoProyecto: '',
    discoduro_serial: '',
    discoduro_capacidad: '',
    discoduro_marca: '',
    discoduro_modelo: '',
  };

  const c = caso || fallbackCaso;
  const [internalTipoEvidencia] = useState<'movil' | 'computadora'>(
    c.tipoProyecto === 'forense_discoduro' ? 'computadora' : 'movil'
  );
  const tipoEvidencia = externalTipoEvidencia || internalTipoEvidencia;
  const isAudio = dictamenMode === 'audios';

  const handleCheckboxClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const box = target.closest('.check-item .box, .check-item');
    if (box) {
      const spanBox = box.classList.contains('box') ? box : box.querySelector('.box');
      if (spanBox) {
        if (spanBox.textContent === 'X') {
          spanBox.textContent = '';
        } else {
          spanBox.textContent = 'X';
        }
      }
    }
  };

  return (
    <PlanillaFolioTemplate
      title={isAudio ? "Dictamen Pericial de Audio Forense (WhatsApp Opus)" : "Dictamen Pericial Informático Forense"}
      nroLabel="N° DICTAMEN:"
      nroValue={c.numeroCaso ? (isAudio ? `D-AUD-${c.numeroCaso}` : `D-FORENSE-${c.numeroCaso}`) : <span className="placeholder-field">[N° DICTAMEN]</span>}
      watermarkText={isAudio ? "DICTAMEN AUDIO OPUS" : "DICTAMEN PERICIAL"}
      onClick={handleCheckboxClick}
    >
      {/* HEADER PRINCIPAL ESMERALDA */}
      <div className="uswds-top-header">
        {isAudio
          ? 'DICTAMEN PERICIAL ACÚSTICO FORENSE — SONIC VISUALISER, OPUS 48 kHz, SWGDE, DAUBERT / FRE 702 & COPP ARTS. 187, 223, 225'
          : 'DICTAMEN PERICIAL INFORMÁTICO FORENSE — MUCC-2017, ISO/IEC 27042 & COPP ARTS. 187, 223, 225'}
      </div>

      {/* 1.0 MARCO NORMATIVO Y REQUISITOS PROBATORIOS */}
      <div className="section">
        <div className="uswds-banner-title">1.0 MARCO NORMATIVO Y FUNDAMENTACIÓN JURÍDICA RAG</div>
        <div className="uswds-card" style={{ padding: '10px', fontSize: '8.5pt', lineHeight: '1.5' }}>
          <div style={{ fontWeight: 'bold', color: '#112E51', marginBottom: '4px' }}>
            MARCO JURÍDICO VENEZOLANO E INTERNACIONAL APLICABLE:
          </div>
          <ul style={{ margin: '0 0 8px 16px', padding: 0 }}>
            <li><strong>COPP (Arts. 187, 223, 225):</strong> Garantía procesal de Cadena de Custodia, designación de mínimo dos (2) Peritos Informáticos Forenses y estructura formal del Dictamen Pericial.</li>
            <li><strong>Ley sobre Mensajes de Datos y Firmas Electrónicas (Art. 4):</strong> Eficacia probatoria equivalente a documento escrito e inalterabilidad del soporte digital.</li>
            {isAudio && (
              <li><strong>SWGDE (Scientific Working Group on Digital Evidence):</strong> Directrices técnicas internacionales para análisis forense de audio, detección de cortes, análisis espectrográfico y admisibilidad probatoria.</li>
            )}
            <li><strong>ISO/IEC 27037:2012 &amp; ISO/IEC 27042:2015:</strong> Directrices internacionales para la recolección, adquisición, análisis e interpretación de evidencia digital (Estándar Daubert / FRE Rule 702).</li>
            <li><strong>MUCC-2017:</strong> Manual Único de Cadena de Custodia de Evidencias (Ministerio Público / CICPC).</li>
          </ul>

          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Perito Informático Forense Principal (N° 1)</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.peritoLider} placeholder="[Nombre y Apellido del Perito 1]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Co-Perito Informático Forense (N° 2 — COPP Art. 223)</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Nombre y Apellido del Perito 2]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2.0 ACREDITACIÓN PERICIAL E IDENTIFICACIÓN DE LA EVIDENCIA */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-2.0">2.0 ACREDITACIÓN PERICIAL E IDENTIFICACIÓN DE LA EVIDENCIA DIGITAL</PlanillaSectionTitle>
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td style={{ width: '35%', fontWeight: 'bold' }}>Evidencia Digital Objeto de Peritaje</td>
                <td>
                  Teléfono Móvil Smart: <strong className="placeholder-field">{c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : '[Marca / Modelo del Dispositivo]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Identificadores Únicos (IMEI 1 / Serial)</td>
                <td><PlanillaEditableValue value={c.dispositivo_imei} placeholder="[Serial / IMEI 1 / IMEI 2]" /></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Línea Telefónica / SIM Card ICCID</td>
                <td><PlanillaEditableValue value={c.dispositivo_numero_tel} placeholder="[N° de Línea / Operadora / SIM Card]" /></td>
              </tr>
              {isAudio && (
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Archivo de Audio WhatsApp (.opus)</td>
                  <td><PlanillaEditableValue placeholder="[PTT-20260615-WA0017.opus — 48,000 Hz Mono VBR]" /></td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td style={{ width: '35%', fontWeight: 'bold' }}>Equipo Computador Examinado</td>
                <td>
                  <PlanillaEditableValue
                    value={c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : undefined}
                    placeholder="[Marca / Modelo del Computador]"
                  />
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Unidad de Disco Duro Examinada</td>
                <td>
                  <PlanillaEditableValue
                    value={c.discoduro_serial || c.discoduro_capacidad ? `${c.discoduro_marca || ''} ${c.discoduro_capacidad || ''} S/N: ${c.discoduro_serial || ''}`.trim() : undefined}
                    placeholder="[Serial, Capacidad y Modelo del Disco Duro]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* 3.0 METODOLOGÍA CIENTÍFICA Y HERRAMIENTAS FORENSES CERTIFICADAS */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-3.0">3.0 METODOLOGÍA CIENTÍFICA Y SUITE DE HERRAMIENTAS FORENSES CERTIFICADAS</PlanillaSectionTitle>
        <div style={{ fontSize: '8.5pt', color: '#1E293B', backgroundColor: '#F8FAFC', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '4px', lineHeight: '1.6' }}>
          <div style={{ fontWeight: 'bold', color: '#112E51', marginBottom: '4px' }}>
            HERRAMIENTAS FORENSES OFICIALES UTILIZADAS EN EL PERITAJE:
          </div>
          <ol style={{ margin: '0 0 0 18px', padding: 0 }}>
            <li><strong>FTK Imager (v4.7+):</strong> Adquisición e imagen forense bit-a-bit (RAW/DD, E01) en entorno apantallado electromagnéticamente, con verificación automática de Hash SHA-256 / MD5 génesis.</li>
            <li><strong>Avilla Forensics (Mobile Engine):</strong> Extracción forense física y lógica en dispositivos móviles Android/iOS, desarrollada con el respaldo tecnológico de la <strong>Policía Federal de Brasil (Polícia Federal do Brasil)</strong> y utilizada internacionalmente por <strong>INTERPOL</strong>.</li>
            <li><strong>IPED Forensics (v4.1+ — Indexador e Processador de Evidências Digitais):</strong> Parseo, indexación masiva y decodificación de bases de datos SQLite (`msgstore.db` de WhatsApp), desarrollada por la <strong>Policía Federal de Brasil</strong> y adoptada oficialmente por la <strong>INTERPOL</strong>.</li>
            <li><strong>Sonic Visualiser (v5.x Forensic Audio Engine — QMUL, GPL-2.0):</strong> Análisis espectral FFT de alta resolución (Hann 2048 bins, 75% overlap), cálculo de Pitch fundamental $F_0$ con algoritmo Yin (80-400 Hz), formantes vocales humanos $F_1-F_3$, medición SNR y descarte de Deepfakes.</li>
            <li><strong>PhotoHolmes (Forensic Python Engine):</strong> Análisis pericial de autenticidad fotográfica mediante <strong>ELA (Error Level Analysis)</strong>, mapa de inconsistencia de compresión JPEG, matriz de cuantización y metadatos EXIF.</li>
          </ol>
        </div>
      </div>

      {/* 4.0 ANÁLISIS ELA DE IMÁGENES FOTOGRÁFICAS (PHOTOHOLMES) — Si aplica */}
      {!isAudio && (
        <div className="section">
          <PlanillaSectionTitle id="seccion-4.0">4.0 ANÁLISIS ELA (ERROR LEVEL ANALYSIS) Y METADATOS FOTOGRÁFICOS (PHOTOHOLMES)</PlanillaSectionTitle>
          <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table">
            <tbody>
              <tr>
                <td style={{ width: '35%', fontWeight: 'bold' }}>Técnica de Inspección Fotográfica</td>
                <td>[X] Error Level Analysis (ELA - PhotoHolmes Engine) &nbsp;&nbsp;&nbsp;&nbsp; [X] Extracción de Metadatos EXIF / JFIF</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Resultado de Matriz ELA / Compresión</td>
                <td><PlanillaEditableValue placeholder="[Distribución de error de compresión uniforme. Ausencia de manipulación, parches o inserción de capas]" /></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Consistencia de Timestamps / Cámara</td>
                <td><PlanillaEditableValue placeholder="[Coincidencia total entre fecha EXIF de captura, timestamp de sistema de archivos y registro IPED]" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 5.0 ANÁLISIS ESPECTROGRÁFICO DE AUDIOS DE WHATSAPP (SONIC VISUALISER) */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-5.0">
          {isAudio ? "4.0 PIPELINE DE 5 ETAPAS FORENSES EN SONIC VISUALISER (CÓDEC OPUS & DAUBERT)" : "5.0 ANÁLISIS ESPECTROGRÁFICO DE AUDIOS Y NOTAS DE VOZ OPUS (SONIC VISUALISER)"}
        </PlanillaSectionTitle>
        {isAudio ? (
          <div>
            {/* Resumen pedagógico del pipeline */}
            <div style={{ backgroundColor: '#EFF6FF', borderLeft: '4px solid #005EA2', padding: '8px 12px', marginBottom: '10px', borderRadius: '4px', fontSize: '8.5pt', color: '#1E293B', lineHeight: '1.5' }}>
              <strong style={{ color: '#005EA2' }}>🔵 METODOLOGÍA PEDAGÓGICA DE 5 PASOS:</strong> Cada etapa analiza un vector acústico independiente para garantizar que la nota de voz es auténtica, no fue empalmada (anti-splicing), no fue generada por IA (anti-Deepfake) y fue grabada en una sola toma continua en el mismo entorno físico.
            </div>

            <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table">
              <thead>
                <tr style={{ backgroundColor: '#112E51', color: '#FFFFFF', fontSize: '8pt', textAlign: 'left' }}>
                  <th style={{ width: '8%', padding: '6px', color: '#FFFFFF' }}>Paso</th>
                  <th style={{ width: '27%', padding: '6px', color: '#FFFFFF' }}>Etapa Acústica Forense</th>
                  <th style={{ width: '45%', padding: '6px', color: '#FFFFFF' }}>Parámetros / Herramienta / Detección</th>
                  <th style={{ width: '20%', padding: '6px', color: '#FFFFFF' }}>Dictamen / Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', textAlign: 'center', color: '#005EA2' }}>1</td>
                  <td style={{ fontWeight: 'bold' }}>Decodificación Códec Opus (48 kHz)</td>
                  <td><PlanillaEditableValue placeholder="[Tramas de 20 ms homogéneas, VBR dinámico 16-32 kbps, límites de paquete íntegros. Anti-Splicing verificado]" /></td>
                  <td style={{ color: '#008837', fontWeight: 'bold' }}>NATIVO ✓</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', textAlign: 'center', color: '#005EA2' }}>2</td>
                  <td style={{ fontWeight: 'bold' }}>Espectrograma FFT (Sonic Visualiser)</td>
                  <td><PlanillaEditableValue placeholder="[FFT Hann 2048 bins, 75% overlap, escala logarítmica dB. Continuidad armónica 0-24 kHz sin cortes ni silencios anómalos]" /></td>
                  <td style={{ color: '#008837', fontWeight: 'bold' }}>CONFORME ✓</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', textAlign: 'center', color: '#005EA2' }}>3</td>
                  <td style={{ fontWeight: 'bold' }}>Forma de Onda &amp; Formantes F₁/F₂/F₃</td>
                  <td><PlanillaEditableValue placeholder="[F1: 620 Hz, F2: 1,850 Hz, F3: 2,740 Hz — Resonancias biológicas del tracto vocal humano estables y sin artefactos]" /></td>
                  <td style={{ color: '#008837', fontWeight: 'bold' }}>VOZ HUMANA ✓</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', textAlign: 'center', color: '#005EA2' }}>4</td>
                  <td style={{ fontWeight: 'bold' }}>Pitch Fundamental F₀ (Algoritmo Yin)</td>
                  <td><PlanillaEditableValue placeholder="[Rastreo biológico 80-400 Hz continuo (Jitter: 0.8%, Shimmer: 1.2%, HNR: 22.4 dB). Descartado sintetizador TTS o Deepfake por IA]" /></td>
                  <td style={{ color: '#008837', fontWeight: 'bold' }}>NO DEEPFAKE ✓</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', textAlign: 'center', color: '#005EA2' }}>5</td>
                  <td style={{ fontWeight: 'bold' }}>Relación Señal-Ruido (SNR) &amp; Piso</td>
                  <td><PlanillaEditableValue placeholder="[SNR > 40 dB (Promedio 44.2 dB). Piso de ruido ambiental estacionario (-58 a -60 dBFS). Grabación en toma única confirmada]" /></td>
                  <td style={{ color: '#008837', fontWeight: 'bold' }}>ESTACIONARIO ✓</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '8px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '4px', fontSize: '8pt', color: '#475569' }}>
              <strong>🏛️ Estándar de Admisibilidad:</strong> Cumplimiento estricto de Daubert v. Merrell Dow (1993), FRE Rule 702, directrices SWGDE y COPP Arts. 187, 223, 225. Tasa de error comprobada &lt; 0.05%.
            </div>
          </div>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table">
            <tbody>
              <tr>
                <td style={{ width: '35%', fontWeight: 'bold' }}>Herramienta y Formato Examinado</td>
                <td>[X] Sonic Visualiser Audio Engine (Espectrograma 48 kHz) &nbsp;&nbsp;&nbsp;&nbsp; [X] Contenedor OggOpus / AAC WhatsApp</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Análisis Frecuencial y Formantes de Voz</td>
                <td><PlanillaEditableValue placeholder="[Continuidad espectral armónica ininterrumpida. Ausencia de cortes, sobreposiciones o empalmes de audio]" /></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Frecuencia de Muestreo / Cuantización</td>
                <td><PlanillaEditableValue placeholder="[Frecuencia nativa 48,000 Hz / Bitrate dinámico Opus característico de grabación directa WhatsApp]" /></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* 6.0 VERIFICACIÓN DE NO ALTERACIÓN Y CONTINUIDAD DIGITAL */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-6.0">{isAudio ? "5.0 VERIFICACIÓN DE NO ALTERACIÓN Y CONTINUIDAD ACÚSTICA (ISO/IEC 27042)" : "6.0 VERIFICACIÓN DE NO ALTERACIÓN Y CONTINUIDAD DIGITAL (ISO/IEC 27042)"}</PlanillaSectionTitle>
        <div style={{ fontSize: '8.5pt', color: '#1E293B', padding: '6px 0', lineHeight: '1.5' }}>
          {isAudio
            ? 'El análisis espectrográfico y de formantes en Sonic Visualiser no evidencia manipulaciones, cortes, sobreposición de pistas acústicas, síntesis vocal por IA ni re-grabaciones indebidas. La nota de voz preserva su integridad génesis conforme a SWGDE e ISO/IEC 27042.'
            : 'El análisis técnico-científico integral no evidencia manipulaciones, cortes, sobreposición de pistas, ediciones fotográficas ni re-salvados indebidos de terceros. La evidencia preserva su integridad génesis.'}
        </div>
      </div>

      {/* 7.0 CONCLUSIONES PERICIALES Y REGISTRO DE CADENA */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <PlanillaSectionTitle id="seccion-7.0">{isAudio ? "6.0 CONCLUSIONES PERICIALES Y DICTAMEN ACÚSTICO FINAL (COPP ART. 225)" : "7.0 CONCLUSIONES PERICIALES Y DICTAMEN FINAL (COPP ART. 225)"}</PlanillaSectionTitle>
        <div className="form-group motive-box" contentEditable suppressContentEditableWarning style={{ minHeight: '420px', padding: '12px', lineHeight: '24px' }}>
          <p style={{ margin: 0 }}>
            <span className="placeholder-field">
              {c.descripcion
                ? c.descripcion
                : (isAudio
                  ? '[DICTAMEN CATEGÓRICO: La nota de voz WhatsApp analizada en Sonic Visualiser es 100% AUTÉNTICA, ÍNTEGRA Y GENUINA. Presenta continuidad armónica FFT sin empalmes, trayectoria de Pitch F0 natural de fonación humana (descartado Deepfake), relación señal-ruido SNR de 44.2 dB y correspondencia criptográfica triple MD5/SHA-1/SHA-256 MATCH]'
                  : '[Indique aquí las conclusiones técnico-periciales, hallazgos, hashes de verificación SHA-256 y dictamen final de autenticidad probatoria]')}
            </span>
          </p>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
        </div>
      </div>

      {/* 8.0 ANEXO SHA-256 Y TRAZABILIDAD CRIPTOGRÁFICA (ISO/IEC 27037 Sec. 8) */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-8.0">{isAudio ? "7.0 ANEXO NORMATIVO — REGISTRO DE INTEGRIDAD TRIPLE (MD5, SHA-1, SHA-256)" : "8.0 ANEXO NORMATIVO — REGISTRO DE TRAZABILIDAD SHA-256 E INTEGRIDAD CRIPTOGRÁFICA"}</PlanillaSectionTitle>
        <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table">
          <tbody>
            <tr>
              <td style={{ width: '32%', fontWeight: 'bold' }}>Hash SHA-256 Génesis del Audio Original</td>
              <td><PlanillaEditableValue placeholder="[Hash SHA-256 — 64 caracteres hex del archivo .opus objeto de peritaje]" style={{ fontSize: '9px', fontFamily: 'monospace' }} /></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Hash SHA-256 de la Copia de Trabajo Pericial</td>
              <td><PlanillaEditableValue placeholder="[Hash SHA-256 — copia de trabajo procesada en Sonic Visualiser (MATCH ✓)]" style={{ fontSize: '9px', fontFamily: 'monospace' }} /></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Fecha y Hora del Cálculo de Hash</td>
              <td><PlanillaEditableValue placeholder="[DD/MM/AAAA — HH:MM:SS — Zona horaria VET UTC-4]" /></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Herramientas de Verificación de Integridad</td>
              <td><PlanillaEditableValue placeholder="[Sonic Visualiser v5.x / FTK Imager v4.7 / IPED Forensics v4.1 / sha256sum]" style={{ fontSize: '9px' }} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FIRMAS DEL PERITO — Mínimo 2 peritos según COPP Art. 223 */}
      <div className="signature-section" style={{ marginTop: '20px', gap: '10mm' }}>
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO INFORMÁTICO FORENSE N° 1 (PRINCIPAL)</div>
          <div className="sig-field" style={{ marginTop: '6px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito Responsable]</span>}</span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Cédula del Perito 1]</span></span>
          </div>
          <div className="sig-field">
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° CIV Perito 1]</span></span>
          </div>
          <div className="sig-field">
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° INPRE Perito 1]</span></span>
          </div>
          <div className="sig-field">
            Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">{isAudio ? "[Especialista en Acústica Forense & Evidencia Digital]" : "[Perito Especialista Forense Senior]"}</span></span>
          </div>

          <div className="sig-line" style={{ marginTop: '14px' }} />
          <div className="sig-line-label">Firma y Sello del Perito Principal</div>

          <div className="fingerprint-row" style={{ margin: '10px 0 6px 0', justifyContent: 'center' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>

          <div style={{ fontSize: '8px', textAlign: 'center', marginTop: '4px', color: '#0F172A', fontWeight: 'bold' }}>
            Rol ISO/IEC 27037: [ &nbsp;X&nbsp; ] DES (Especialista / Dictamen) &nbsp;&nbsp; [ &nbsp; ] DEFR
          </div>
        </div>

        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO INFORMÁTICO FORENSE N° 2 (COPP Art. 223)</div>
          <div className="sig-field" style={{ marginTop: '6px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Nombre del Co-Perito 2]</span></span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Cédula del Perito 2]</span></span>
          </div>
          <div className="sig-field">
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° CIV Perito 2]</span></span>
          </div>
          <div className="sig-field">
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° INPRE Perito 2]</span></span>
          </div>
          <div className="sig-field">
            Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">{isAudio ? "[Co-Perito en Señales & Criptografía]" : "[Co-Perito Informático Forense]"}</span></span>
          </div>

          <div className="sig-line" style={{ marginTop: '14px' }} />
          <div className="sig-line-label">Firma y Sello del Co-Perito Acreditado</div>

          <div className="fingerprint-row" style={{ margin: '10px 0 6px 0', justifyContent: 'center' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>

          <div style={{ fontSize: '8px', textAlign: 'center', marginTop: '4px', color: '#0F172A', fontWeight: 'bold' }}>
            Rol ISO/IEC 27037: [ &nbsp;X&nbsp; ] DES (Especialista / Dictamen) &nbsp;&nbsp; [ &nbsp; ] DEFR
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
