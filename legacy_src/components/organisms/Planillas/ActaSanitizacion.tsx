import { CasoCMS } from '../../../store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface ActaSanitizacionProps {
  caso?: CasoCMS;
}

export default function ActaSanitizacion({ caso }: ActaSanitizacionProps) {
  const c = caso || ({} as Partial<CasoCMS>);

  return (
    <PlanillaFolioTemplate
      title="Acta de Sanitización Criptográfica y Borrado Seguro"
      nroLabel="N° EXPEDIENTE:"
      nroValue={c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}
      watermarkText="SANITIZACIÓN"
    >
      {/* HEADER PRINCIPAL */}
      <div className="uswds-top-header">
        ACTA DE SANITIZACIÓN CRIPTOGRÁFICA Y BORRADO SEGURO DE SERVIDOR — NIST SP 800-88 REV. 1 &amp; ISO/IEC 27001
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

      {/* 1.0 EVIDENCIA Y MEDIOS DIGITALES */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-1.0">
          1.0 EVIDENCIA Y MEDIOS DIGITALES A SANITIZAR
        </PlanillaSectionTitle>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Cliente / Empresa Contratante</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Nombre del Cliente o Empresa]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Servidor / Storage de Proceso</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Nodo Storage SHA256 / Vol. Encriptado ZFS-POOL-02]" />
            </div>
            <div className="form-group uswds-slot-input" style={{ gridColumn: 'span 2' }}>
              <PlanillaFieldLabel>Fecha y Hora de Sanitización</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[DD/MM/AAAA - HH:MM]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2.0 METODOLOGÍA DE BORRADO SEGURO */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-2.0">
          2.0 METODOLOGÍA DE BORRADO SEGURO (OVERWRITE / CRYPTO-ERASE)
        </PlanillaSectionTitle>
        <div className="uswds-card">
          <div className="grid-container" style={{ gridTemplateColumns: '1fr', gap: '10px' }}>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Imágenes Forenses Eliminadas</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Imagen Forense Raw .E01 / Clon Bit a Bit / Dump de Memoria RAM]" />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Hash SHA-256 de Verificación Previa</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855]" style={{ fontFamily: 'monospace', fontSize: '8pt' }} />
            </div>
            <div className="form-group uswds-slot-input">
              <PlanillaFieldLabel>Estándar de Sanitización Aplicado</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[NIST SP 800-88 Rev. 1 Purge (Overwrite Pseudorandom 3-Pass)]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3.0 REGISTRO DE SOFTWARE */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-3.0">
          3.0 REGISTRO DE SOFTWARE Y LOGS DE SANITIZACIÓN
        </PlanillaSectionTitle>
        <div style={{ padding: '10px 14px', backgroundColor: '#FEFCE8', borderLeft: '4px solid #D9A700', borderRadius: '4px', marginBottom: '10px', fontSize: '9pt', lineHeight: '1.6', textAlign: 'justify', color: '#1B2A4A' }}>
          Se ejecutó la herramienta Nwipe v0.34 (DoD 5220.22-M 3-Pass) y hdparm Secure Erase con registro de logs firmados criptográficamente por la clave privada del servidor.
        </div>
        <div className="form-group" style={{ marginTop: '8px' }}>
          <PlanillaFieldLabel style={{ fontSize: '8.5pt', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            REGISTRO DE HERRAMIENTA / LOGS DE EJECUCIÓN (puede escribir a mano o digitar):
          </PlanillaFieldLabel>
          <div contentEditable suppressContentEditableWarning style={{ minHeight: '80px', padding: '8px', fontSize: '9pt', lineHeight: '24px', border: '1px dashed #CBD5E1', borderRadius: '4px', fontFamily: 'monospace' }}>
            <span className="placeholder-field">[Inserte aquí el extracto relevante del log de sanitización]</span>
            <div className="dotted-line"></div>
            <div className="dotted-line"></div>
          </div>
        </div>
      </div>

      {/* 4.0 VERIFICACIÓN Y CERTIFICADO */}
      <div className="section">
        <PlanillaSectionTitle id="seccion-4.0">
          4.0 VERIFICACIÓN Y CERTIFICADO DE ZEROIZATION
        </PlanillaSectionTitle>
        <div style={{ padding: '10px 14px', backgroundColor: '#F0FDF4', borderLeft: '4px solid #008837', borderRadius: '4px', marginBottom: '10px', fontSize: '9pt', lineHeight: '1.6', textAlign: 'justify', color: '#1B2A4A' }}>
          Se certifica que una vez vencido el periodo reglamentario de retención y habiendo entregado el dictamen final al cliente, se ejecutó la destrucción irreversible de todas las
          copias de trabajo temporales en los servidores del laboratorio SHA256.US. Los bloques de memoria fueron sobreescritos y desasignados de forma no recuperable.
        </div>
      </div>

      {/* 5.0 FIRMAS */}
      <div className="signature-section" style={{ gap: '14mm', pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        {/* Oficial de Seguridad */}
        <div className="sig-detail-card">
          <div className="sig-detail-label">OFICIAL DE SEGURIDAD SHA256.US</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              {c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Oficial de Seguridad]</span>}
            </span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Cédula del Oficial]</span>
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
              <span className="placeholder-field">[Oficial de Seguridad &amp; Sanitización]</span>
            </span>
          </div>
          <div className="sig-line" style={{ marginTop: '16px' }} />
          <div className="sig-line-label">Firma del Oficial de Seguridad</div>
          <div className="fingerprint-row" style={{ margin: '12px 0 8px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
          <div style={{ fontSize: '8px', textAlign: 'center', marginTop: '6px', color: '#0F172A', fontWeight: 'bold' }}>
            Rol ISO/IEC 27037: [&nbsp;X&nbsp;] DEFR (Adquisición &amp; Imagen Forense) &nbsp;&nbsp;&nbsp;&nbsp; [&nbsp;&nbsp;] DES
          </div>
        </div>

        {/* Cliente / Auditor */}
        <div className="sig-detail-card">
          <div className="sig-detail-label">CLIENTE / AUDITOR DE CUMPLIMIENTO</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              {c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Nombre del Cliente]</span>}
            </span>
          </div>
          <div className="sig-field">
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>
              {c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula del Cliente]</span>}
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
          <div className="sig-line" style={{ marginTop: '32px' }} />
          <div className="sig-line-label">Firma del Receptor del Certificado</div>
          <div className="fingerprint-row" style={{ margin: '12px 0 8px 0' }}>
            <PlanillaThumbBox label="PULGAR DER." />
            <PlanillaThumbBox label="PULGAR IZQ." />
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
