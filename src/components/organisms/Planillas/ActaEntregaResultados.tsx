import { useState } from 'react';
import { CasoCMS } from '../../../store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaCheckboxGroup } from '../../atoms/Planillas/PlanillaCheckboxGroup';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface ActaEntregaResultadosProps {
  caso?: CasoCMS;
  tipoEvidencia?: 'movil' | 'computadora';
}

export default function ActaEntregaResultados({ caso, tipoEvidencia: externalTipoEvidencia }: ActaEntregaResultadosProps) {
  const fallbackCaso = {
    numeroCaso: '',
    numeroPRCC: '',
    solicitante_nombre: '',
    solicitante_cedula: '',
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
      title="Acta de Entrega de Resultados y Devolución"
      nroLabel="N° EXPEDIENTE:"
      nroValue={c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}
      watermarkText="ENTREGA Y DEVOLUCIÓN"
      onClick={handleCheckboxClick}
    >
      {/* 1.0 IDENTIFICACIÓN DE LA ENTREGA */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-1.0">1.0 IDENTIFICACIÓN DE LA ENTREGA Y RECEPCIÓN DE INFORMES</PlanillaSectionTitle>
        <div className="grid-container">
          <div className="form-group">
            <PlanillaFieldLabel>Apellidos y Nombres de quien Recibe</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Apellidos y Nombres]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Cédula de Identidad / Pasaporte</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.solicitante_cedula} placeholder="[Cédula de Identidad]" />
          </div>
        </div>
      </div>

      {/* 2.0 INVENTARIO DE EVIDENCIA */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-2.0">2.0 INVENTARIO DE EVIDENCIA FÍSICA Y DIGITAL DEVUELTA</PlanillaSectionTitle>
        <div className="form-group">
          <PlanillaCheckboxGroup
            style={{ flexDirection: 'column', gap: '5px' }}
            options={[
              { id: 'e1', label: 'DICTAMEN FORENSE ORIGINAL (Documento físico en papel sellado)' },
              { id: 'e2', label: 'SOPORTE DIGITAL (DVD-R / Pendrive) conteniendo el reporte de extracción forense y anexos' },
              { id: 'e3', label: 'ACTA DE DEVOLUCIÓN DEL DISPOSITIVO FÍSICO' },
            ]}
          />
        </div>
      </div>

      {/* 3.0 RE-PRECINTADO Y VERIFICACIÓN */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-3.0">3.0 RE-PRECINTADO Y VERIFICACIÓN DE ESTADO FINAL</PlanillaSectionTitle>
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Equipo Devuelto</td>
                <td>
                  <PlanillaEditableValue
                    value={c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : undefined}
                    placeholder="[Marca / Modelo del Teléfono Móvil]"
                  />
                </td>
              </tr>
              <tr>
                <td>IMEI 1 / Serial</td>
                <td><PlanillaEditableValue value={c.dispositivo_imei} placeholder="[IMEI / Serial]" /></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Computador / Disco Devuelto</td>
                <td>
                  <PlanillaEditableValue
                    value={c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : undefined}
                    placeholder="[Marca / Modelo del Computador]"
                  />
                </td>
              </tr>
              <tr>
                <td>Serial del Equipo / Disco</td>
                <td>
                  <PlanillaEditableValue
                    value={c.discoduro_serial || c.dispositivo_imei ? `${c.discoduro_serial || c.dispositivo_imei || ''}`.trim() : undefined}
                    placeholder="[Serial de la Unidad de Almacenamiento]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* 4.0 CONSTANCIA DE CONFORMIDAD */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-4.0">4.0 CONSTANCIA DE CONFORMIDAD DEL SOLICITANTE</PlanillaSectionTitle>
        <div className="legal-text">
          Hago constar que en la fecha y hora indicadas recibo a mi entera satisfacción la evidencia física anteriormente descrita, verificando que se encuentra en el mismo estado de integridad en el que fue consignada en el laboratorio SHA256.US.
        </div>
      </div>

      {/* 5.0 FIRMAS Y REGISTRO DACTILAR */}
      <div className="signature-section" style={{ gap: '14mm', marginTop: '30px' }}>
        <PlanillaSectionTitle id="seccion-5.0">5.0 FIRMAS Y REGISTRO DACTILAR DE RECEPCIÓN</PlanillaSectionTitle>
        <div className="sig-detail-card">
          <div className="sig-detail-label">QUIEN RECIBE LOS RESULTADOS</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma de Conformidad de Recepción</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad]</span>}</span>
          </div>
        </div>
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO ENTREGADOR</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Perito Entregador</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre y Apellido del Perito]</span>}</span>
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
