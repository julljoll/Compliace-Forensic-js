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

export default function ActaDictamen({ caso, tipoEvidencia: externalTipoEvidencia }: ActaDictamenProps) {
  const fallbackCaso = {
    numeroCaso: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
    dispositivo_numero_tel: '',
    dispositivo_sim_card: '',
<<<<<<< HEAD
    descripcion: '',
=======
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
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
      title="Dictamen Pericial Informático Forense"
      nroLabel="N° DICTAMEN:"
      nroValue={c.numeroCaso ? `D-FORENSE-${c.numeroCaso}` : <span className="placeholder-field">[N° DICTAMEN]</span>}
      watermarkText="DICTAMEN PERICIAL"
      onClick={handleCheckboxClick}
    >
      {/* HEADER PRINCIPAL ESMERALDA */}
      <div className="uswds-top-header">
<<<<<<< HEAD
        DICTAMEN PERICIAL INFORMÁTICO FORENSE — MUCC-2017, ISO/IEC 27042 & COPP ARTS. 187, 223, 225
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
            <li><strong>ISO/IEC 27037:2012 &amp; ISO/IEC 27042:2015:</strong> Directrices internacionales para la recolección, adquisición, análisis e interpretación de evidencia digital (Estándar Daubert).</li>
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
=======
        DICTAMEN PERICIAL INFORMÁTICO FORENSE — MUCC-2017 & COPP ART. 187
      </div>

      {/* 1.0 MARCO NORMATIVO Y REQUISITOS */}
      <div className="section">
        <div className="uswds-banner-title">1.0 MARCO NORMATIVO Y REQUISITOS PROBATORIOS</div>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Perito Informático Forense Responsable</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.peritoLider} placeholder="[Nombre y Apellido del Perito]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Acreditación / Colegiatura CIV / TSJ</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[ej: Perito Judicial Acreditado N° 5192-TSJ]" />
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* 2.0 ACREDITACIÓN PERICIAL E IDENTIFICACIÓN DE LA EVIDENCIA */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-2.0">2.0 ACREDITACIÓN PERICIAL E IDENTIFICACIÓN DE LA EVIDENCIA DIGITAL</PlanillaSectionTitle>
=======
      {/* 2.0 ACREDITACIÓN PERICIAL */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-2.0">2.0 ACREDITACIÓN PERICIAL E IDENTIFICACIÓN DE IMÁGENES</PlanillaSectionTitle>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
<<<<<<< HEAD
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
=======
                <td>Evidencia Digital</td>
                <td>
                  Teléfono Móvil: <strong className="placeholder-field">{c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : '[Marca / Modelo]'}</strong>
                </td>
              </tr>
              <tr>
                <td>Serial / IMEI 1</td>
                <td><PlanillaEditableValue value={c.dispositivo_imei} placeholder="[IMEI / S/N]" /></td>
              </tr>
              <tr>
                <td>Línea / SIM Card</td>
                <td><PlanillaEditableValue value={c.dispositivo_numero_tel} placeholder="[N° de Línea]" /></td>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
              </tr>
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
<<<<<<< HEAD
                <td style={{ width: '35%', fontWeight: 'bold' }}>Equipo Computador Examinado</td>
=======
                <td>Equipo Computador</td>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
                <td>
                  <PlanillaEditableValue
                    value={c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : undefined}
                    placeholder="[Marca / Modelo del Computador]"
                  />
                </td>
              </tr>
              <tr>
<<<<<<< HEAD
                <td style={{ fontWeight: 'bold' }}>Unidad de Disco Duro Examinada</td>
                <td>
                  <PlanillaEditableValue
                    value={c.discoduro_serial || c.discoduro_capacidad ? `${c.discoduro_marca || ''} ${c.discoduro_capacidad || ''} S/N: ${c.discoduro_serial || ''}`.trim() : undefined}
                    placeholder="[Serial, Capacidad y Modelo del Disco Duro]"
=======
                <td>Unidad de Disco Duro Examinada</td>
                <td>
                  <PlanillaEditableValue
                    value={c.discoduro_serial || c.discoduro_capacidad ? `${c.discoduro_marca || ''} ${c.discoduro_capacidad || ''} S/N: ${c.discoduro_serial || ''}`.trim() : undefined}
                    placeholder="[Serial y Capacidad del Disco Duro]"
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

<<<<<<< HEAD
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
            <li><strong>PhotoHolmes (Forensic Python Engine):</strong> Análisis pericial de autenticidad fotográfica mediante <strong>ELA (Error Level Analysis)</strong>, mapa de inconsistencia de compresión JPEG, matriz de cuantización y metadatos EXIF.</li>
            <li><strong>Sonic Visualiser (v4.5+ Audio Forensic Engine):</strong> Espectrometría acústica para audios Opus/AAC de WhatsApp, espectrograma frecuencial (48 kHz), análisis de armónicos formantes de voz humana y verificación de cortes/edición.</li>
          </ol>
        </div>
      </div>

      {/* 4.0 ANÁLISIS ELA DE IMÁGENES FOTOGRÁFICAS (PHOTOHOLMES) */}
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
=======
      {/* 3.0 METODOLOGÍA CIENTÍFICA */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-3.0">3.0 METODOLOGÍA CIENTÍFICA FORENSE (ISO/IEC 27042:2015 &amp; DAUBERT STANDARD)</PlanillaSectionTitle>
        <div className="form-group" style={{ fontSize: '8.5pt', color: '#1d1d1f', backgroundColor: '#fafafa', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          Procesamiento mediante herramientas científicas de inspección pericial (IPED Forensics v4.1, PhotoHolmes Python Engine ELA y PyOgg Audio Engine). Preservación estricta de la estructura de contenedores nativos y trazabilidad criptográfica.
        </div>
      </div>

      {/* 4.0 ANÁLISIS ELA / ESPECTROGRAMA */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-4.0">4.0 ANÁLISIS ELA (ERROR LEVEL ANALYSIS) / ESPECTROGRAMA ACÚSTICO</PlanillaSectionTitle>
        <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table">
          <tbody>
            <tr>
              <td style={{ width: '35%', fontWeight: 'bold' }}>Técnica de Análisis Aplicada</td>
              <td>[X] Error Level Analysis (ELA) &nbsp;&nbsp;&nbsp;&nbsp; [X] Espectrograma de Frecuencia (48 kHz)</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Respuesta de Frecuencia / Matriz ELA</td>
              <td><PlanillaEditableValue placeholder="[Respuesta frecuencial continua e ininterrumpida / Niveles de compresión uniformes]" /></td>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
            </tr>
          </tbody>
        </table>
      </div>

<<<<<<< HEAD
      {/* 5.0 ANÁLISIS ESPECTROGRÁFICO DE AUDIOS DE WHATSAPP (SONIC VISUALISER) */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-5.0">5.0 ANÁLISIS ESPECTROGRÁFICO DE AUDIOS Y NOTAS DE VOZ OPUS (SONIC VISUALISER)</PlanillaSectionTitle>
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
=======
      {/* 5.0 DETECCIÓN COPY-MOVE Y METADATOS */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-5.0">5.0 DETECCIÓN COPY-MOVE, EXIF Y ESTRUCTURA DE CONTENEDOR</PlanillaSectionTitle>
        <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table">
          <tbody>
            <tr>
              <td style={{ width: '35%', fontWeight: 'bold' }}>Verificación EXIF / OggOpus</td>
              <td><PlanillaEditableValue placeholder="[Encabezados intactos / Coincidencia de timestamp / Bit-rate VBR continuo]" /></td>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
            </tr>
          </tbody>
        </table>
      </div>

<<<<<<< HEAD
      {/* 6.0 VERIFICACIÓN DE NO ALTERACIÓN Y CONTINUIDAD DIGITAL */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-6.0">6.0 VERIFICACIÓN DE NO ALTERACIÓN Y CONTINUIDAD DIGITAL (ISO/IEC 27042)</PlanillaSectionTitle>
        <div style={{ fontSize: '8.5pt', color: '#1E293B', padding: '6px 0', lineHeight: '1.5' }}>
          El análisis técnico-científico integral no evidencia manipulaciones, cortes, sobreposición de pistas, ediciones fotográficas ni re-salvados indebidos de terceros. La evidencia preserva su integridad génesis.
        </div>
      </div>

      {/* 7.0 CONCLUSIONES PERICIALES Y REGISTRO DE CADENA */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <PlanillaSectionTitle id="seccion-7.0">7.0 CONCLUSIONES PERICIALES Y DICTAMEN FINAL (COPP ART. 225)</PlanillaSectionTitle>
        <div className="form-group motive-box" contentEditable suppressContentEditableWarning style={{ minHeight: '420px', padding: '12px', lineHeight: '24px' }}>
          <p style={{ margin: 0 }}>
            <span className="placeholder-field">{c.descripcion ? c.descripcion : '[Indique aquí las conclusiones técnico-periciales, hallazgos, hashes de verificación SHA-256 y dictamen final de autenticidad probatoria]'}</span>
=======
      {/* 6.0 VERIFICACIÓN DE NO ALTERACIÓN */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-6.0">6.0 VERIFICACIÓN DE NO ALTERACIÓN Y CONTINUIDAD DIGITAL</PlanillaSectionTitle>
        <div style={{ fontSize: '8.5pt', color: '#1E293B', padding: '6px 0' }}>
          El análisis no evidencia manipulaciones, cortes, sobreposición de pistas ni re-salvados de terceros.
        </div>
      </div>

      {/* 7.0 CONCLUSIONES PERICIALES */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <PlanillaSectionTitle id="seccion-7.0">7.0 CONCLUSIONES PERICIALES Y REGISTRO DE CADENA</PlanillaSectionTitle>
        <div className="form-group motive-box" contentEditable suppressContentEditableWarning style={{ minHeight: '420px', padding: '12px', lineHeight: '24px' }}>
          <p style={{ margin: 0 }}>
            <span className="placeholder-field">[Indique aquí las conclusiones técnico-periciales, hallazgos, hashes de verificación SHA-256 y valoración legal del dictamen]</span>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
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
<<<<<<< HEAD
          <div className="dotted-line"></div>
=======
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
        </div>
      </div>

      {/* 8.0 ANEXO SHA-256 Y TRAZABILIDAD CRIPTOGRÁFICA (ISO/IEC 27037 Sec. 8) */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-8.0">8.0 ANEXO NORMATIVO — REGISTRO DE TRAZABILIDAD SHA-256 E INTEGRIDAD CRIPTOGRÁFICA</PlanillaSectionTitle>
        <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table">
          <tbody>
            <tr>
              <td style={{ width: '32%', fontWeight: 'bold' }}>Hash SHA-256 del Archivo Original Analizado</td>
              <td><PlanillaEditableValue placeholder="[Hash SHA-256 — 64 caracteres hex del archivo objeto de peritaje]" style={{ fontSize: '9px', fontFamily: 'monospace' }} /></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Hash SHA-256 de la Copia de Trabajo Pericial</td>
              <td><PlanillaEditableValue placeholder="[Hash SHA-256 — copia de trabajo utilizada en el análisis (debe coincidir con original)]" style={{ fontSize: '9px', fontFamily: 'monospace' }} /></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Fecha y Hora del Cálculo de Hash</td>
              <td><PlanillaEditableValue placeholder="[DD/MM/AAAA — HH:MM:SS — Zona horaria VET UTC-4]" /></td>
            </tr>
            <tr>
<<<<<<< HEAD
              <td style={{ fontWeight: 'bold' }}>Herramientas de Verificación de Integridad</td>
              <td><PlanillaEditableValue placeholder="[FTK Imager v4.7 / IPED Forensics v4.1 / Avilla Forensics / sha256sum]" style={{ fontSize: '9px' }} /></td>
=======
              <td style={{ fontWeight: 'bold' }}>Herramienta de Verificación de Integridad</td>
              <td><PlanillaEditableValue placeholder="[ej: HashMyFiles v2.43 / sha256sum / FTK Imager v4.7 / IPED Forensics v4.1]" /></td>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
            </tr>
          </tbody>
        </table>
      </div>

      {/* FIRMAS DEL PERITO — Mínimo 2 peritos según COPP Art. 223 */}
      <div className="signature-section" style={{ marginTop: '20px', gap: '10mm' }}>
        <div className="sig-detail-card">
<<<<<<< HEAD
          <div className="sig-detail-label">PERITO INFORMÁTICO FORENSE N° 1 (PRINCIPAL)</div>
=======
          <div className="sig-detail-label">PERITO INFORMÁTICO FORENSE N° 1</div>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
          <div className="sig-field" style={{ marginTop: '6px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito Responsable]</span>}</span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Cédula del Perito 1]</span></span>
          </div>
          <div className="sig-field">
<<<<<<< HEAD
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° CIV Perito 1]</span></span>
          </div>
          <div className="sig-field">
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° INPRE Perito 1]</span></span>
          </div>
          <div className="sig-field">
            Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Perito Especialista Forense Senior]</span></span>
          </div>

          <div className="sig-line" style={{ marginTop: '14px' }} />
          <div className="sig-line-label">Firma y Sello del Perito Principal</div>
=======
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° CIV 1]</span></span>
          </div>
          <div className="sig-field">
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° INPRE 1]</span></span>
          </div>
          <div className="sig-field">
            Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Perito Especialista Forense]</span></span>
          </div>

          <div className="sig-line" style={{ marginTop: '14px' }} />
          <div className="sig-line-label">Firma y Sello del Perito Acreditado</div>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862

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
<<<<<<< HEAD
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° CIV Perito 2]</span></span>
          </div>
          <div className="sig-field">
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° INPRE Perito 2]</span></span>
=======
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° CIV 2]</span></span>
          </div>
          <div className="sig-field">
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° INPRE 2]</span></span>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
          </div>
          <div className="sig-field">
            Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Co-Perito Informático Forense]</span></span>
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

