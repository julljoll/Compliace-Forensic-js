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
      {/* HEADER PRINCIPAL ESMERALDA */}
      <div className="uswds-top-header">
        ACTA DE ENTREVISTA TÉCNICO-PERICIAL — MUCC-2017 & ISO/IEC 27042
      </div>

      {/* 1.0 DATOS DE LA ACTUACIÓN */}
      <div className="section">
        <div className="uswds-banner-title">1.0 DATOS GENERALES Y LUGAR DE LA ENTREVISTA</div>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Lugar de Actuación / Sede</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Lara, Venezuela — Laboratorio Forense SHA256.US]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Fecha y Hora de la Entrevista</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[DD/MM/AAAA - HH:MM]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2.0 DATOS DEL ENTREVISTADO */}
      <div className="section">
        <div className="uswds-banner-title">2.0 IDENTIFICACIÓN DEL ENTREVISTADO Y CALIDAD JURÍDICA</div>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Apellidos y Nombres</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Apellidos y Nombres del Entrevistado]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Cédula de Identidad / Pasaporte</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_cedula} placeholder="[Cédula de Identidad]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Teléfono de Contacto Principal</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.dispositivo_numero_tel} placeholder="[Teléfono de Contacto]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Correo Electrónico</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.correo_investigar} placeholder="[Correo Electrónico]" style={{ fontSize: '9.5pt' }} />
            </div>
            <div className="form-group uswds-slot-input" style={{ gridColumn: 'span 2' }}>
              <PlanillaFieldLabel>Dirección de Habitación Habitual</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Dirección de Habitación]" style={{ fontSize: '9.5pt' }} />
            </div>
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

      {/* 3.0 DECLARACIÓN TÉCNICO-PERICIAL */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-3.0">3.0 DECLARACIÓN TÉCNICO-PERICIAL Y ANTECEDENTES</PlanillaSectionTitle>
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

      {/* 4.0 CONOCIMIENTO DE DERECHOS */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <PlanillaSectionTitle id="seccion-4.0">4.0 CONOCIMIENTO DE DERECHOS Y AUTORIZACIÓN FORENSE</PlanillaSectionTitle>
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
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Nombre del Entrevistado]</span>}</span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula del Entrevistado]</span>}</span>
          </div>
          <div className="sig-field">
            Teléfono: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Número Telefónico]</span>}</span>
          </div>
          <div className="sig-field">
            Dirección: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Dirección de Habitación]</span></span>
          </div>

          <div className="sig-line" style={{ marginTop: '16px' }} />
          <div className="sig-line-label">Firma del Entrevistado</div>

          <div className="fingerprint-row" style={{ margin: '12px 0 8px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
        </div>
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO ENTREVISTADOR</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre y Apellido del Perito]</span>}</span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Cédula del Perito]</span></span>
          </div>
          <div className="sig-field">
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° CIV (Colegio de Ingenieros)]</span></span>
          </div>
          <div className="sig-field">
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° Inpreabogado]</span></span>
          </div>
          <div className="sig-field">
            Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Experto Informático Forense]</span></span>
          </div>

          <div className="sig-line" style={{ marginTop: '16px' }} />
          <div className="sig-line-label">Firma del Perito Entrevistador</div>

          <div className="fingerprint-row" style={{ margin: '12px 0 8px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>

          <div style={{ fontSize: '8px', textAlign: 'center', marginTop: '6px', color: '#0F172A', fontWeight: 'bold' }}>
            Rol ISO/IEC 27037: [ &nbsp;X&nbsp; ] DEFR (Adquisición & Imagen Forense) &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] DES
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
