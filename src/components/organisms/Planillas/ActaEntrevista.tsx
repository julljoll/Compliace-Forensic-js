import { useState } from 'react';
import { CasoCMS } from '../../../store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaCheckboxGroup } from '../../atoms/Planillas/PlanillaCheckboxGroup';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface ActaEntrevistaProps {
  caso?: CasoCMS;
  tipoEvidencia?: 'movil' | 'computadora';
}

export default function ActaEntrevista({ caso, tipoEvidencia: externalTipoEvidencia }: ActaEntrevistaProps) {
  const fallbackCaso = {
    numeroCaso: '',
    solicitante_nombre: '',
    solicitante_cedula: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
    dispositivo_numero_tel: '',
    correo_investigar: '',
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
      title="Acta de Entrevista Técnico-Pericial"
      nroLabel="N° EXPEDIENTE:"
      nroValue={c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}
      watermarkText="ENTREVISTA"
      onClick={handleCheckboxClick}
    >
      {/* DATOS DE LA ACTUACIÓN */}
      <div className="section">
        <PlanillaSectionTitle>Datos de la Actuación Pericial</PlanillaSectionTitle>
        <div className="grid-container">
          <div className="form-group">
            <PlanillaFieldLabel>Lugar de Actuación / Sede</PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[Lara, Venezuela — Laboratorio Forense SHA256.US]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Fecha y Hora de la Entrevista</PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[Fecha y Hora (ej: DD/MM/AAAA - HH:MM)]" />
          </div>
        </div>
      </div>

      {/* I. DATOS DEL ENTREVISTADO */}
      <div className="section">
        <PlanillaSectionTitle>I. Datos e Identificación del Entrevistado</PlanillaSectionTitle>
        <div className="grid-container">
          <div className="form-group">
            <PlanillaFieldLabel>Apellidos y Nombres</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Apellidos y Nombres del Entrevistado]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Cédula de Identidad / Pasaporte</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.solicitante_cedula} placeholder="[Cédula de Identidad]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Teléfono de Contacto Principal</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.dispositivo_numero_tel} placeholder="[Teléfono de Contacto]" />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Correo Electrónico</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.correo_investigar} placeholder="[Correo Electrónico]" style={{ fontSize: '9.5pt' }} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <PlanillaFieldLabel>Dirección de Habitación Habitual</PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[Dirección de Habitación]" style={{ fontSize: '9.5pt' }} />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '5px', padding: '4px 8px' }}>
          <PlanillaFieldLabel>Condición / Rol en la Investigación</PlanillaFieldLabel>
          <PlanillaCheckboxGroup
            fontSize="8.5pt"
            style={{ flexDirection: 'row', gap: '12px' }}
            options={[
              { id: 'e1', label: 'Víctima' },
              { id: 'e2', label: 'Testigo / Denunciante' },
              { id: 'e3', label: 'Propietario de la Evidencia' },
              { id: 'e4', label: 'Poseedor / Consignatario' },
            ]}
          />
        </div>
      </div>

      {/* II. RELACIÓN DEL DISPOSITIVO */}
      <div className="section">
        <PlanillaSectionTitle>II. Relación del Dispositivo y Cuentas Asociadas ({tipoEvidencia === 'movil' ? 'Móvil' : 'Computador'})</PlanillaSectionTitle>
        <div className="grid-container">
          <div className="form-group">
            <PlanillaFieldLabel>Equipo / Evidencia</PlanillaFieldLabel>
            <PlanillaEditableValue
              value={c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : undefined}
              placeholder="[Marca / Modelo del Equipo]"
            />
          </div>
          <div className="form-group">
            <PlanillaFieldLabel>Serial / IMEI</PlanillaFieldLabel>
            <PlanillaEditableValue value={c.dispositivo_imei} placeholder="[Serial / IMEI del Dispositivo]" />
          </div>
        </div>
      </div>

      {/* III. DESARROLLO DE LA ENTREVISTA */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <PlanillaSectionTitle>III. Declaración Técnico-Pericial del Entrevistado</PlanillaSectionTitle>
        <div className="form-group motive-box" contentEditable suppressContentEditableWarning style={{ minHeight: '400px', padding: '12px', lineHeight: '24px' }}>
          <p style={{ margin: 0 }}>
            <span className="placeholder-field">[Describa en detalle la declaración del entrevistado sobre el uso del equipo, claves de acceso, antecedentes y hechos relacionados]</span>
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
        </div>
      </div>

      {/* IV. FIRMAS */}
      <div className="signature-section" style={{ gap: '14mm' }}>
        <div className="sig-detail-card">
          <div className="sig-detail-label">EL ENTREVISTADO</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Entrevistado</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula del Entrevistado]</span>}</span>
          </div>
        </div>
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO ENTREVISTADOR</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Perito Entrevistador</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre y Apellido del Perito]</span>}</span>
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
