import { useState } from 'react';
import { CasoCMS } from '../../../store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaCheckboxGroup } from '../../atoms/Planillas/PlanillaCheckboxGroup';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface PlanillaPRCCProps {
  caso?: CasoCMS;
  tipoEvidencia?: 'movil' | 'computadora';
}

export default function PlanillaPRCC({ caso, tipoEvidencia: externalTipoEvidencia }: PlanillaPRCCProps) {
  const fallbackCaso = {
    numeroCaso: '',
    numeroPRCC: '',
    solicitante_nombre: '',
    solicitante_cedula: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
    dispositivo_imei2: '',
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
      title="Planilla de Registro de Cadena de Custodia (PRCC)"
      nroLabel="N° PRCC:"
      nroValue={c.numeroPRCC ? c.numeroPRCC : <span className="placeholder-field">[PRCC]</span>}
      watermarkText="CADENA CUSTODIA"
      onClick={handleCheckboxClick}
    >
      {/* SECCIÓN I */}
      <div className="section">
        <PlanillaSectionTitle>I. Datos del Consignante, del Caso y Organismo</PlanillaSectionTitle>
        <div className="grid-container">
          <div className="form-group">
            <PlanillaFieldLabel>Apellidos y Nombres del Consignante</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Apellidos y Nombres del Consignante]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Cédula de Identidad / Pasaporte</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.solicitante_cedula} placeholder="[Cédula de Identidad]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>N° de Expediente / Caso</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.numeroCaso} placeholder="[N° Expediente]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Lugar de Resguardo / Sede</PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[Laboratorio Forense SHA256.US — Lara]" />
          </div>
        </div>
      </div>

      {/* SECCIÓN II */}
      <div className="section">
        <PlanillaSectionTitle>II. Forma de Obtención (MUCC-2017 — Consignación Privada)</PlanillaSectionTitle>
        <div className="form-group">
          <PlanillaCheckboxGroup
            style={{ flexDirection: 'row', gap: '15px' }}
            options={[
              { id: 'ob1', label: 'CONSIGNACIÓN DIRECTA (ENTREGA VOLUNTARIA)', checked: true },
              { id: 'ob2', label: 'TÉCNICA (Análisis Pericial Interno)' },
              { id: 'ob3', label: 'DERIVACIÓN CORPORATIVA' },
            ]}
          />
          <div style={{ fontSize: '7.5pt', color: '#666', fontStyle: 'italic', marginTop: '3px' }}>
            *Nota: Como laboratorio de informática forense privado, la obtención de evidencias se realiza exclusivamente mediante consignación voluntaria del titular, representante o custodio autorizado.
          </div>
        </div>
      </div>

      {/* SECCIÓN III */}
      <div className="section">
        <PlanillaSectionTitle>III. Operarios (Perito Informático) — MUCC-2017</PlanillaSectionTitle>
        <div className="signature-grid">
          <div className="sig-card">
            <PlanillaFieldLabel>A. Fijación (Nombre y Credencial)</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.peritoLider} placeholder="[Nombre del Perito]" style={{ minHeight: '18px', fontWeight: 'bold', padding: '2px 5px' }} />
            <div className="sig-row">
              <div className="sig-firma-col">
                <div className="sig-box" />
                <span className="sig-label">FIRMA</span>
              </div>
              <PlanillaThumbBox label="PULGAR DER." />
            </div>
          </div>
          <div className="sig-card">
            <PlanillaFieldLabel>B. Colección (Nombre y Credencial)</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.peritoLider} placeholder="[Nombre del Perito]" style={{ minHeight: '18px', fontWeight: 'bold', padding: '2px 5px' }} />
            <div className="sig-row">
              <div className="sig-firma-col">
                <div className="sig-box" />
                <span className="sig-label">FIRMA</span>
              </div>
              <PlanillaThumbBox label="PULGAR DER." />
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN IV */}
      <div className="section">
        <PlanillaSectionTitle>IV. Descripción de la Evidencia Digital Consignada ({tipoEvidencia === 'movil' ? 'Móvil' : 'Computador'})</PlanillaSectionTitle>
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Tipo de Dispositivo</td>
                <td>
                  <PlanillaCheckboxGroup
                    fontSize="9px"
                    style={{ flexDirection: 'row', gap: '15px' }}
                    options={[
                      { id: 'td1', label: 'Teléfono Móvil Android' },
                      { id: 'td2', label: 'Tableta' },
                      { id: 'td3', label: 'Otro' },
                    ]}
                  />
                </td>
              </tr>
              <tr>
                <td>Marca / Modelo</td>
                <td>
                  <PlanillaEditableValue
                    value={c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : undefined}
                    placeholder="[Marca / Modelo del Dispositivo]"
                  />
                </td>
              </tr>
              <tr>
                <td>IMEI 1</td>
                <td><PlanillaEditableValue value={c.dispositivo_imei} placeholder="[IMEI 1 / Serial]" /></td>
              </tr>
              <tr>
                <td>IMEI 2</td>
                <td><PlanillaEditableValue value={c.dispositivo_imei2} placeholder="[IMEI 2]" /></td>
              </tr>
              <tr>
                <td>N° de Serie / Serial</td>
                <td><PlanillaEditableValue value={c.dispositivo_imei} placeholder="[Serial / IMEI]" /></td>
              </tr>
              <tr>
                <td>N° de Línea / Teléfono</td>
                <td><PlanillaEditableValue value={c.dispositivo_numero_tel} placeholder="[Teléfono de Contacto]" /></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Tipo de Computadora</td>
                <td>
                  <PlanillaCheckboxGroup
                    fontSize="9px"
                    style={{ flexDirection: 'row', gap: '15px' }}
                    options={[
                      { id: 'tc1', label: 'Laptop / Portátil' },
                      { id: 'tc2', label: 'Escritorio / PC' },
                      { id: 'tc3', label: 'Servidor / Disco Externo' },
                    ]}
                  />
                </td>
              </tr>
              <tr>
                <td>Marca / Modelo</td>
                <td>
                  <PlanillaEditableValue
                    value={c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : undefined}
                    placeholder="[Marca / Modelo del Equipo]"
                  />
                </td>
              </tr>
              <tr>
                <td>Serial del Equipo</td>
                <td><PlanillaEditableValue value={c.dispositivo_imei} placeholder="[Serial del Equipo]" /></td>
              </tr>
              <tr>
                <td>Disco Duro (Marca / Capacidad / Serial)</td>
                <td>
                  <PlanillaEditableValue
                    value={c.discoduro_serial || c.discoduro_capacidad ? `${c.discoduro_marca || ''} ${c.discoduro_capacidad || ''} S/N: ${c.discoduro_serial || ''}`.trim() : undefined}
                    placeholder="[Detalle del Disco Duro (Marca, Capacidad, Serial)]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* SECCIÓN V */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <PlanillaSectionTitle>V. Continuidad y Registro de Traslados de Cadena de Custodia</PlanillaSectionTitle>
        <table border={1} cellSpacing={0} cellPadding={6} className="tabla-datos">
          <thead>
            <tr style={{ background: '#f2f2f7', textAlign: 'center', fontSize: '9px' }}>
              <th style={{ width: '12%' }}>Fecha / Hora</th>
              <th style={{ width: '22%' }}>Entrega (Nombre / C.I.)</th>
              <th style={{ width: '22%' }}>Recibe (Nombre / C.I.)</th>
              <th>Propósito / Observaciones</th>
              <th style={{ width: '14%' }}>Firma / Huella</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><PlanillaEditableValue placeholder="[Fecha]" /></td>
              <td><PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Consignante]" /></td>
              <td><PlanillaEditableValue value={c.peritoLider} placeholder="[Perito Receptor]" /></td>
              <td>Recepción Inicial en Laboratorio Forense para Resguardo y Adquisición</td>
              <td style={{ textAlign: 'center' }}>________________</td>
            </tr>
            <tr>
              <td><PlanillaEditableValue placeholder="[Fecha]" /></td>
              <td><PlanillaEditableValue placeholder="[Entregado Por]" /></td>
              <td><PlanillaEditableValue placeholder="[Recibido Por]" /></td>
              <td><PlanillaEditableValue placeholder="[Propósito del Traslado / Análisis]" /></td>
              <td style={{ textAlign: 'center' }}>________________</td>
            </tr>
          </tbody>
        </table>
      </div>
    </PlanillaFolioTemplate>
  );
}
