import { CasoCMS } from '../../../store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface ActaConsentimientoProps {
  caso?: CasoCMS;
}

export default function ActaConsentimiento({ caso }: ActaConsentimientoProps) {
  const c = caso || ({} as Partial<CasoCMS>);

  return (
    <PlanillaFolioTemplate
      title="Acta de Consentimiento Informado y Autorización"
      nroLabel="N° EXPEDIENTE:"
      nroValue={c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}
      watermarkText="CONSENTIMIENTO"
    >
      {/* HEADER PRINCIPAL */}
      <div className="uswds-top-header">
        ACTA DE CONSENTIMIENTO INFORMADO, AUTORIZACIÓN DE ACCESO Y HÁBEAS DATA — ARTS. 28 Y 60 CRBV, ISO 27037
      </div>

      {/* BLOQUE EXPEDIENTE / PRCC */}
      <div className="section">
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Expediente N°</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.numeroCaso} placeholder="[N° Expediente]" style={{ fontFamily: 'monospace' }} />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>PRCC N°</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[PRCC-2026-XXXX]" style={{ fontFamily: 'monospace' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 1.0 DECLARACIÓN DE LEGITIMACIÓN */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-1.0">
          1.0 DECLARACIÓN DE LEGITIMACIÓN DE POSESIÓN Y TITULARIDAD
        </PlanillaSectionTitle>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Apellidos y Nombres</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Apellidos y Nombres]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Cédula de Identidad / RIF</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_cedula} placeholder="[V- / J-]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Carácter con el que actúa</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Propietario / Representante Legal / Custodio]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Empresa / Entidad Solicitante</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Nombre de la Empresa o Entidad]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2.0 AUTORIZACIÓN EXPRESA */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-2.0">
          2.0 AUTORIZACIÓN EXPRESA DE INSPECCIÓN TÉCNICO-PERICIAL
        </PlanillaSectionTitle>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Marca, Modelo y Tipo</PlanillaFieldLabel>
              <PlanillaEditableValue
                value={c.dispositivo_marca && c.dispositivo_modelo ? `${c.dispositivo_marca} ${c.dispositivo_modelo}` : undefined}
                placeholder="[Marca / Modelo del Dispositivo]"
              />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Número de Serie / IMEI</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.dispositivo_imei} placeholder="[IMEI / S/N del Dispositivo]" style={{ fontFamily: 'monospace' }} />
            </div>
            <div className="form-group uswds-slot-input" style={{ gridColumn: 'span 2' }}>
              <PlanillaFieldLabel>Alcance Autorizado de Inspección</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Extracción física/lógica, decodificación de mensajes, análisis de metadatos EXIF...]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3.0 POLÍTICA DE HÁBEAS DATA */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-3.0">
          3.0 POLÍTICA DE HÁBEAS DATA Y PROTECCIÓN DE DATOS SENSIBLES
        </PlanillaSectionTitle>
        <div style={{ padding: '10px 14px', backgroundColor: '#FEFCE8', borderLeft: '4px solid #D9A700', borderRadius: '4px', marginBottom: '10px', fontSize: '9pt', lineHeight: '1.6', textAlign: 'justify', color: '#1B2A4A' }}>
          El consignante declara bajo fe de juramento ser el titular legítimo o poseer la representación legal debidamente acreditada sobre la evidencia digital descrita.
          Autoriza voluntariamente al laboratorio privado SHA256.US a realizar la extracción, clonación bit a bit y peritaje forense de los contenidos digitales dentro del alcance
          delimitado, eximiendo al laboratorio de cualquier responsabilidad derivada del tratamiento legítimo de los datos en cumplimiento del encargo.
        </div>
      </div>

      {/* 4.0 EXENCIÓN DE RESPONSABILIDAD */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-4.0">
          4.0 EXENCIÓN DE RESPONSABILIDAD LEGAL Y ALCANCE PERICIAL
        </PlanillaSectionTitle>
        <div style={{ padding: '10px 14px', backgroundColor: '#F0FDF4', borderLeft: '4px solid #008837', borderRadius: '4px', marginBottom: '10px', fontSize: '9pt', lineHeight: '1.6', textAlign: 'justify', color: '#1B2A4A' }}>
          Las partes acuerdan que las actividades de extracción, decodificación e inspección forense se circunscriben estrictamente a la búsqueda de evidencia digital pertinente.
          SHA256.US no asume responsabilidad por la existencia previa de archivos dañados o datos borrados antes de la consignación.
        </div>
      </div>

      {/* 5.0 FIRMAS Y REGISTRO DACTILAR */}
      <div className="signature-section" style={{ gap: '14mm', pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        {/* Declarante / Consignante */}
        <div className="sig-detail-card">
          <div className="sig-detail-label">DECLARANTE / CONSIGNANTE</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              {c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Nombre del Declarante]</span>}
            </span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              {c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad]</span>}
            </span>
          </div>
          <div className="sig-field">
            Teléfono: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Número Telefónico]</span>
            </span>
          </div>
          <div className="sig-field">
            Dirección: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Dirección de Habitación]</span>
            </span>
          </div>
          <div className="sig-line" style={{ marginTop: '16px' }} />
          <div className="sig-line-label">Firma del Declarante Consignante</div>
          <div className="fingerprint-row" style={{ margin: '12px 0 8px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
        </div>

        {/* Receptor / Perito SHA256.US */}
        <div className="sig-detail-card">
          <div className="sig-detail-label">RECEPTOR / PERITO OFICIAL SHA256.US</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              {c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre y Apellido del Perito]</span>}
            </span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Cédula del Perito]</span>
            </span>
          </div>
          <div className="sig-field">
            CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[N° CIV (Colegio de Ingenieros)]</span>
            </span>
          </div>
          <div className="sig-field">
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[N° Inpreabogado]</span>
            </span>
          </div>
          <div className="sig-field">
            Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Perito Informático Forense]</span>
            </span>
          </div>
          <div className="sig-line" style={{ marginTop: '16px' }} />
          <div className="sig-line-label">Firma del Perito Receptor</div>
          <div className="fingerprint-row" style={{ margin: '12px 0 8px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div style={{ fontSize: '8px', textAlign: 'center', marginTop: '6px', color: '#0F172A', fontWeight: 'bold' }}>
            Rol ISO/IEC 27037: [&nbsp;X&nbsp;] DEFR (Adquisición &amp; Imagen Forense) &nbsp;&nbsp;&nbsp;&nbsp; [&nbsp;&nbsp;] DES
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
