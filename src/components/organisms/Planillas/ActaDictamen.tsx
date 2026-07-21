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
      {/* I. DATOS DE IDENTIFICACIÓN PERICIAL */}
      <div className="section">
        <PlanillaSectionTitle>I. Identificación del Perito y Requisitorio</PlanillaSectionTitle>
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

      {/* II. IDENTIFICACIÓN DE LA EVIDENCIA */}
      <div className="section">
        <PlanillaSectionTitle>II. Identificación de la Evidencia Técnica Examinada ({tipoEvidencia === 'movil' ? 'Móvil' : 'Computador'})</PlanillaSectionTitle>
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
                <td>Unidad de Disco Duro Examinda</td>
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

      {/* III. CONCLUSIONES PERICIALES */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <PlanillaSectionTitle>III. Conclusiones Técnico-Periciales Legales</PlanillaSectionTitle>
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

      {/* IV. FIRMA DEL PERITO */}
      <div className="signature-section" style={{ marginTop: '20px' }}>
        <div className="sig-detail-card" style={{ gridColumn: 'span 2', maxWidth: '320px', margin: '0 auto' }}>
          <div className="sig-detail-label">EL PERITO INFORMÁTICO FORENSE</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0', justifyContent: 'center' }}>
            <PlanillaThumbBox label="PULGAR DER." />
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma y Sello del Perito Acreditado</div>
          <div className="sig-field" style={{ marginTop: '8px', textAlign: 'center' }}>
            <strong>{c.peritoLider || '[Nombre del Perito Responsable]'}</strong>
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
