import { CasoCMS } from '../../../store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface ActaDesprecintadoProps {
  caso?: CasoCMS;
}

export default function ActaDesprecintado({ caso }: ActaDesprecintadoProps) {
  const c = caso || ({} as Partial<CasoCMS>);

  return (
    <PlanillaFolioTemplate
      title="Acta de Apertura y Desprecintado de Evidencia"
      nroLabel="N° EXPEDIENTE:"
      nroValue={c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}
      watermarkText="DESPRECINTADO"
    >
      {/* HEADER PRINCIPAL */}
      <div className="uswds-top-header">
        ACTA DE APERTURA Y DESPRECINTADO DE EVIDENCIA EN LABORATORIO — MUCC-2017 FASE 2, ISO/IEC 27037 SEC. 7.2 &amp; ART. 187 COPP
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

      {/* 1.0 IDENTIFICACIÓN DEL PAQUETE */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-1.0">
          1.0 IDENTIFICACIÓN DEL PAQUETE Y PRECINTO DE SEGURIDAD
        </PlanillaSectionTitle>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Código de Bolsa Faraday / Sobre</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Bolsa Faraday Inviolable #BF-SHA-XXXX]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Número de Precinto de Seguridad</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Precinto Holográfico SHA256-XXXXX]" style={{ fontFamily: 'monospace' }} />
            </div>
            <div className="form-group uswds-slot-input" style={{ gridColumn: 'span 2' }}>
              <PlanillaFieldLabel>Estado del Precinto al Recibir</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Intacto / Inviolado / Sello Holográfico sin alteraciones]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2.0 COMPROBACIÓN DE INTEGRIDAD */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-2.0">
          2.0 COMPROBACIÓN DE INTEGRIDAD DE LA BOLSA FARADAY / EMBALAJE
        </PlanillaSectionTitle>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Estación de Trabajo / Write-Blocker</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Estación Forense N° 01 (Tableau Write-Blocker T8u)]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Perito Analista Responsable</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.peritoLider} placeholder="[Nombre y Apellido del Perito]" />
            </div>
            <div className="form-group uswds-slot-input" style={{ gridColumn: 'span 2' }}>
              <PlanillaFieldLabel>Testigo de Apertura de Laboratorio</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Nombre del Testigo (Oficial de Custodia)]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3.0 REMOCIÓN CONTROLADA */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-3.0">
          3.0 REMOCIÓN CONTROLADA DEL PRECINTO Y EXTRACCIÓN DE EVIDENCIA
        </PlanillaSectionTitle>
        <div style={{ padding: '10px 14px', backgroundColor: '#FEFCE8', borderLeft: '4px solid #D9A700', borderRadius: '4px', marginBottom: '10px', fontSize: '9pt', lineHeight: '1.6', textAlign: 'justify', color: '#1B2A4A' }}>
          Se hace constar formalmente que en la sede del Laboratorio Privado SHA256.US se procedió a la remoción e inspección del precinto de la bolsa contenedora de la evidencia digital.
          Se verificó que el contenido corresponde exactamente con el inventario de la Planilla de Registro de Cadena de Custodia (PRCC) y no presenta signos de fuerza o alteración previa.
        </div>
        <div className="form-group" style={{ marginTop: '8px' }}>
          <PlanillaFieldLabel style={{ fontSize: '8.5pt', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            OBSERVACIONES DE LA APERTURA (Describa el estado de la evidencia al desprecintar):
          </PlanillaFieldLabel>
          <div contentEditable suppressContentEditableWarning style={{ minHeight: '100px', padding: '8px', fontSize: '10pt', lineHeight: '24px', border: '1px dashed #CBD5E1', borderRadius: '4px' }}>
            <span className="placeholder-field">[Describa el estado exacto del embalaje, precinto y evidencia al momento de la apertura]</span>
            <div className="dotted-line"></div>
            <div className="dotted-line"></div>
            <div className="dotted-line"></div>
          </div>
        </div>
      </div>

      {/* 4.0 REGISTRO FOTOGRÁFICO */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-4.0">
          4.0 REGISTRO FOTOGRÁFICO DE APERTURA Y VERIFICACIÓN VISUAL
        </PlanillaSectionTitle>
        <div style={{ padding: '10px 14px', backgroundColor: '#F0FDF4', borderLeft: '4px solid #008837', borderRadius: '4px', marginBottom: '10px', fontSize: '9pt', lineHeight: '1.6', textAlign: 'justify', color: '#1B2A4A' }}>
          Se tomaron fotografías macro de alta resolución del precinto intacto y del proceso de corte térmico/mecánico del empaque secundario para constancia en el expediente pericial.
        </div>
        <div style={{ padding: '8px 10px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', borderRadius: '4px', marginTop: '6px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '8.5pt' }}>
            <div>[&nbsp;&nbsp;&nbsp;] <strong>Fotografías del Precinto Intacto</strong></div>
            <div>[&nbsp;&nbsp;&nbsp;] <strong>Fotografías del Proceso de Corte</strong></div>
            <div>[&nbsp;&nbsp;&nbsp;] <strong>Fotografías de la Evidencia Extraída</strong></div>
            <div>N° de Fotografías: <span className="placeholder-field" contentEditable suppressContentEditableWarning style={{ border: 'none', display: 'inline-block', minWidth: '50px' }}>[N°]</span></div>
          </div>
        </div>
      </div>

      {/* 5.0 FIRMAS */}
      <div className="signature-section" style={{ gap: '14mm', pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        {/* Perito Analista */}
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO ANALISTA EN LABORATORIO</div>
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
              <span className="placeholder-field">[N° CIV]</span>
            </span>
          </div>
          <div className="sig-field">
            INPREABOGADO N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[N° Inpreabogado]</span>
            </span>
          </div>
          <div className="sig-field">
            Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Perito Analista Forense]</span>
            </span>
          </div>
          <div className="sig-line" style={{ marginTop: '16px' }} />
          <div className="sig-line-label">Firma del Perito Analista</div>
          <div className="fingerprint-row" style={{ margin: '12px 0 8px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div style={{ fontSize: '8px', textAlign: 'center', marginTop: '6px', color: '#0F172A', fontWeight: 'bold' }}>
            Rol ISO/IEC 27037: [&nbsp;X&nbsp;] DEFR (Adquisición &amp; Imagen Forense) &nbsp;&nbsp;&nbsp;&nbsp; [&nbsp;&nbsp;] DES
          </div>
        </div>

        {/* Testigo / Control de Custodia */}
        <div className="sig-detail-card">
          <div className="sig-detail-label">TESTIGO / CONTROL DE CUSTODIA</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Nombre del Testigo de Custodia]</span>
            </span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Cédula del Testigo]</span>
            </span>
          </div>
          <div className="sig-field">
            Cargo / Rol: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Oficial de Custodia]</span>
            </span>
          </div>
          <div className="sig-line" style={{ marginTop: '32px' }} />
          <div className="sig-line-label">Firma del Testigo de Custodia</div>
          <div className="fingerprint-row" style={{ margin: '12px 0 8px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
