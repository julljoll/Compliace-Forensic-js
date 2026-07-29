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
}

export default function ActaDictamen({ caso, tipoEvidencia: externalTipoEvidencia }: ActaDictamenProps) {
  const fallbackCaso = {
    numeroCaso: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
    dispositivo_numero_tel: '',
    dispositivo_sim_card: '',
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
      {/* 1.0 MARCO NORMATIVO Y REQUISITOS */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-1.0">1.0 MARCO NORMATIVO Y REQUISITOS PROBATORIOS</PlanillaSectionTitle>
        <div className="grid-container">
          <div className="form-group">
            <PlanillaFieldLabel>Perito Informático Forense Responsable</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.peritoLider} placeholder="[Nombre y Apellido del Perito]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Acreditación / Colegiatura CIV / TSJ</PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[ej: Perito Judicial Acreditado N° 5192-TSJ]" />
          </div>
        </div>
      </div>

      {/* 2.0 ACREDITACIÓN PERICIAL */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-2.0">2.0 ACREDITACIÓN PERICIAL E IDENTIFICACIÓN DE IMÁGENES</PlanillaSectionTitle>
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
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
              </tr>
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Equipo Computador</td>
                <td>
                  <PlanillaEditableValue
                    value={c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : undefined}
                    placeholder="[Marca / Modelo del Computador]"
                  />
                </td>
              </tr>
              <tr>
                <td>Unidad de Disco Duro Examinada</td>
                <td>
                  <PlanillaEditableValue
                    value={c.discoduro_serial || c.discoduro_capacidad ? `${c.discoduro_marca || ''} ${c.discoduro_capacidad || ''} S/N: ${c.discoduro_serial || ''}`.trim() : undefined}
                    placeholder="[Serial y Capacidad del Disco Duro]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

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
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5.0 DETECCIÓN COPY-MOVE Y METADATOS */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-5.0">5.0 DETECCIÓN COPY-MOVE, EXIF Y ESTRUCTURA DE CONTENEDOR</PlanillaSectionTitle>
        <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table">
          <tbody>
            <tr>
              <td style={{ width: '35%', fontWeight: 'bold' }}>Verificación EXIF / OggOpus</td>
              <td><PlanillaEditableValue placeholder="[Encabezados intactos / Coincidencia de timestamp / Bit-rate VBR continuo]" /></td>
            </tr>
          </tbody>
        </table>
      </div>

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
              <td style={{ fontWeight: 'bold' }}>Herramienta de Verificación de Integridad</td>
              <td><PlanillaEditableValue placeholder="[ej: HashMyFiles v2.43 / sha256sum / FTK Imager v4.7 / IPED Forensics v4.1]" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FIRMAS DEL PERITO — Mínimo 2 peritos según COPP Art. 223 */}
      <div className="signature-section" style={{ marginTop: '20px', gap: '10mm' }}>
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO INFORMÁTICO FORENSE N° 1</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0', justifyContent: 'center' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma y Sello del Perito Acreditado</div>
          <div className="sig-field" style={{ marginTop: '6px', textAlign: 'center' }}>
            <strong>{c.peritoLider || '[Nombre del Perito Responsable]'}</strong>
          </div>
          <div className="sig-field" style={{ textAlign: 'center', fontSize: '9pt' }}>
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° CIV]</span></span>
          </div>
          <div className="sig-field" style={{ textAlign: 'center', fontSize: '9pt' }}>
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° INPRE]</span></span>
          </div>
        </div>
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO INFORMÁTICO FORENSE N° 2 (COPP Art. 223)</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0', justifyContent: 'center' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma y Sello del Co-Perito Acreditado</div>
          <div className="sig-field" style={{ marginTop: '6px', textAlign: 'center' }}>
            <strong><span className="placeholder-field">[Nombre del Co-Perito]</span></strong>
          </div>
          <div className="sig-field" style={{ textAlign: 'center', fontSize: '9pt' }}>
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° CIV]</span></span>
          </div>
          <div className="sig-field" style={{ textAlign: 'center', fontSize: '9pt' }}>
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° INPRE]</span></span>
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
