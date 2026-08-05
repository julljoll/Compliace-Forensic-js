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
    despachoFiscal: '',
    organismoOrdenante: '',
    solicitante_direccion: '',
    fechaCreacion: '',
    perito_cedula: '',
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
      title="PLANILLA DE REGISTRO DE CADENA DE CUSTODIA (PRCC)"
      nroLabel="N° PRCC:"
      nroValue={c.numeroPRCC ? c.numeroPRCC : <span className="placeholder-field">[PRCC]</span>}
      watermarkText="CADENA CUSTODIA"
      onClick={handleCheckboxClick}
    >
      {/* HEADER PRINCIPAL ESMERALDA */}
      <div className="prcc-top-header">
        PLANILLA DE REGISTRO DE CADENA DE CUSTODIA (PRCC) — MUCC-2017
      </div>

      {/* I. DATOS GENERALES */}
      <div className="section">
        <div className="prcc-banner-title">I. DATOS GENERALES</div>
        <div className="prcc-card">
          <div className="grid-container" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div className="form-group prcc-slot-input">
              <PlanillaFieldLabel>N° Expediente / Causa</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.numeroCaso} placeholder="[N° de Expediente / Causa]" />
            </div>
            <div className="form-group prcc-slot-input">
              <PlanillaFieldLabel>N° PRCC</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.numeroPRCC} placeholder="[N° PRCC]" />
            </div>
            <div className="form-group prcc-slot-input">
              <PlanillaFieldLabel>Despacho que instruye</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.despachoFiscal} placeholder="[Despacho que instruye]" />
            </div>
            <div className="form-group prcc-slot-input">
              <PlanillaFieldLabel>Organismo que instruye</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.organismoOrdenante} placeholder="[Organismo que instruye]" />
            </div>
            <div className="form-group prcc-slot-input">
              <PlanillaFieldLabel>Despacho que inicia la custodia</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Laboratorio Forense Digital SHA256.US]" />
            </div>
            <div className="form-group prcc-slot-input">
              <PlanillaFieldLabel>Organismo que inicia la custodia</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Servicio de Consultoría Pericial SHA256.US]" />
            </div>
            <div className="form-group prcc-slot-input" style={{ gridColumn: 'span 2' }}>
              <PlanillaFieldLabel>Dirección de Obtención</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_direccion} placeholder="[Dirección exacta de obtención]" />
            </div>
            <div className="form-group prcc-slot-input" style={{ gridColumn: 'span 2' }}>
              <PlanillaFieldLabel>Fecha y Hora</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.fechaCreacion} placeholder="[DD/MM/AAAA - HH:MM]" />
            </div>
          </div>
        </div>
      </div>

      {/* II. FORMAS DE OBTENCIÓN DE LA EVIDENCIA */}
      <div className="section">
        <div className="prcc-banner-title">II. FORMAS DE OBTENCIÓN DE LA EVIDENCIA</div>
        <div className="prcc-card" style={{ padding: '8px 12px' }}>
          <PlanillaCheckboxGroup
            style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            options={[
              { id: 'ob1', label: '1. Técnica' },
              { id: 'ob2', label: '2. Aseguramiento' },
              { id: 'ob3', label: '3. Consignación', checked: true },
              { id: 'ob4', label: '4. Derivación' },
            ]}
          />
        </div>
      </div>

      {/* III. FUNCIONARIOS QUE OBTIENEN LA EVIDENCIA */}
      <div className="section">
        <div className="prcc-banner-title">III. FUNCIONARIOS QUE OBTIENEN LA EVIDENCIA</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* Tarjeta A. FIJACIÓN */}
          <div className="prcc-card">
            <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#0F172A', marginBottom: '6px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px' }}>
              A. FIJACIÓN
            </div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '6px' }}>
              <PlanillaFieldLabel>Nombres y Apellidos</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.peritoLider} placeholder="[Operario que Fija]" />
            </div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '8px' }}>
              <PlanillaFieldLabel>C.I. o Credencial</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.perito_cedula} placeholder="[C.I. / Credencial]" />
            </div>
            <div className="prcc-triple-box-container">
              <div className="prcc-sig-box">
                <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#0F172A' }}>FIRMA</span>
              </div>
              <div className="prcc-thumb-box">
                <span>PULGAR IZQ.</span>
              </div>
              <div className="prcc-thumb-box">
                <span>PULGAR DER.</span>
              </div>
            </div>
          </div>

          {/* Tarjeta B. COLECCIÓN */}
          <div className="prcc-card">
            <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#0F172A', marginBottom: '6px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px' }}>
              B. COLECCIÓN
            </div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '6px' }}>
              <PlanillaFieldLabel>Nombres y Apellidos</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.peritoLider} placeholder="[Operario que Colecta]" />
            </div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '8px' }}>
              <PlanillaFieldLabel>C.I. o Credencial</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.perito_cedula} placeholder="[C.I. / Credencial]" />
            </div>
            <div className="prcc-triple-box-container">
              <div className="prcc-sig-box">
                <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#0F172A' }}>FIRMA</span>
              </div>
              <div className="prcc-thumb-box">
                <span>PULGAR IZQ.</span>
              </div>
              <div className="prcc-thumb-box">
                <span>PULGAR DER.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IV. DESCRIPCIÓN DE LA EVIDENCIA */}
      <div className="section">
        <div className="prcc-banner-title">IV. DESCRIPCIÓN DE LA EVIDENCIA</div>
        <div className="prcc-ruled-lines">
          <div>
            {c.dispositivo_marca ? `Dispositivo: ${c.dispositivo_marca} ${c.dispositivo_modelo || ''}` : 'Dispositivo objeto de peritaje:'}
          </div>
          <div>
            {c.dispositivo_imei ? `Serial / IMEI: ${c.dispositivo_imei}` : 'Serial / IMEI:'}
          </div>
          <div>
            Embalaje y Precinto de Seguridad: Tamper-Evident Seal con Hash génesis SHA-256 verificado.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '6px', fontSize: '8pt', gap: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>Continuación:</span>
          <PlanillaCheckboxGroup
            fontSize="8.5px"
            style={{ flexDirection: 'row', gap: '10px' }}
            options={[
              { id: 'cont_si', label: 'SÍ' },
              { id: 'cont_no', label: 'NO', checked: true },
              { id: 'cont_anexoa', label: '(Anexo A)' },
            ]}
          />
        </div>
      </div>

      {/* V. TRANSFERENCIA DE LA EVIDENCIA */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <div className="prcc-banner-title">V. TRANSFERENCIA DE LA EVIDENCIA</div>
        
        {/* a. MOTIVO */}
        <div className="prcc-card" style={{ marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '10px', marginBottom: '6px', color: '#0F172A' }}>a. MOTIVO</div>
          <PlanillaCheckboxGroup
            fontSize="8.5px"
            style={{ flexDirection: 'row', gap: '12px', marginBottom: '8px' }}
            options={[
              { id: 'm1', label: '1. Traslado' },
              { id: 'm2', label: '2. Peritaje' },
              { id: 'm3', label: '3. Resguardo', checked: true },
              { id: 'm4', label: '4. Disposición Judicial' },
              { id: 'm5', label: '5. Disposición Final' },
            ]}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group prcc-slot-input">
              <PlanillaFieldLabel>Fecha y Hora</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.fechaCreacion} placeholder="[DD/MM/AAAA - HH:MM]" />
            </div>
            <div className="form-group prcc-slot-input">
              <PlanillaFieldLabel>N° de Comunicación</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[N° Oficio / Memo]" />
            </div>
          </div>
        </div>

        {/* b. ENTREGA & c. RECIBE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* b. ENTREGA */}
          <div className="prcc-card">
            <div style={{ fontWeight: 'bold', fontSize: '10px', marginBottom: '6px', color: '#0F172A', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px' }}>b. ENTREGA</div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '6px' }}>
              <PlanillaFieldLabel>Nombres y Apellidos</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Consignante / Entregante]" />
            </div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '6px' }}>
              <PlanillaFieldLabel>C.I. o Credencial</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_cedula} placeholder="[C.I.]" />
            </div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '6px' }}>
              <PlanillaFieldLabel>Organismo</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Particular / Institución]" />
            </div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '8px' }}>
              <PlanillaFieldLabel>Despacho</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Despacho / Residencia]" />
            </div>
            <div className="prcc-triple-box-container">
              <div className="prcc-sig-box">
                <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#0F172A' }}>FIRMA</span>
              </div>
              <div className="prcc-thumb-box">
                <span>PULGAR IZQ.</span>
              </div>
              <div className="prcc-thumb-box">
                <span>PULGAR DER.</span>
              </div>
            </div>
          </div>

          {/* c. RECIBE */}
          <div className="prcc-card">
            <div style={{ fontWeight: 'bold', fontSize: '10px', marginBottom: '6px', color: '#0F172A', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px' }}>c. RECIBE</div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '6px' }}>
              <PlanillaFieldLabel>Nombres y Apellidos</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.peritoLider} placeholder="[Perito Receptor]" />
            </div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '6px' }}>
              <PlanillaFieldLabel>C.I. o Credencial</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.perito_cedula} placeholder="[C.I. Perito]" />
            </div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '6px' }}>
              <PlanillaFieldLabel>Organismo</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="SHA256.US" />
            </div>
            <div className="form-group prcc-slot-input" style={{ marginBottom: '8px' }}>
              <PlanillaFieldLabel>Despacho</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="Laboratorio Forense" />
            </div>
            <div className="prcc-triple-box-container">
              <div className="prcc-sig-box">
                <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#0F172A' }}>FIRMA</span>
              </div>
              <div className="prcc-thumb-box">
                <span>PULGAR IZQ.</span>
              </div>
              <div className="prcc-thumb-box">
                <span>PULGAR DER.</span>
              </div>
            </div>
          </div>
        </div>

        {/* d. OBSERVACIONES */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '10px', marginBottom: '4px', color: '#0F172A' }}>d. OBSERVACIONES</div>
          <div className="prcc-ruled-lines" style={{ minHeight: '60px', lineHeight: '20px' }}>
            <div>Recepción inicial para resguardo inmutable y peritaje informático forense.</div>
          </div>
        </div>
      </div>

      {/* ANEXO A — REGISTRO DE CONTINUIDAD */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <div className="prcc-banner-title" style={{ textAlign: 'center', fontSize: '11px' }}>ANEXO A - REGISTRO DE CONTINUIDAD</div>
        
        <div className="section" style={{ marginTop: '6px' }}>
          <div className="prcc-banner-title">I. DATOS DE CONTINUIDAD DEL REGISTRO DE LA CADENA DE CUSTODIA</div>
          <div className="prcc-card">
            <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group prcc-slot-input">
                <PlanillaFieldLabel>N° de Expediente / Causa</PlanillaFieldLabel>
                <PlanillaEditableValue value={c.numeroCaso} placeholder="[N° Expediente]" />
              </div>
              <div className="form-group prcc-slot-input">
                <PlanillaFieldLabel>N° PRCC</PlanillaFieldLabel>
                <PlanillaEditableValue value={c.numeroPRCC} placeholder="[N° PRCC]" />
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="prcc-banner-title">II. CONTINUIDAD DE RESPONSABILIDAD: COLECCIÓN</div>
          <div className="prcc-card">
            <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div className="form-group prcc-slot-input">
                <PlanillaFieldLabel>Nombres y Apellidos</PlanillaFieldLabel>
                <PlanillaEditableValue value={c.peritoLider} placeholder="[Operario]" />
              </div>
              <div className="form-group prcc-slot-input">
                <PlanillaFieldLabel>C.I. o Credencial</PlanillaFieldLabel>
                <PlanillaEditableValue value={c.perito_cedula} placeholder="[C.I.]" />
              </div>
            </div>
            <div className="prcc-triple-box-container">
              <div className="prcc-sig-box">
                <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#0F172A' }}>FIRMA</span>
              </div>
              <div className="prcc-thumb-box">
                <span>PULGAR IZQ.</span>
              </div>
              <div className="prcc-thumb-box">
                <span>PULGAR DER.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="prcc-banner-title">III. DESCRIPCIÓN DE LA EVIDENCIA</div>
          <div className="prcc-ruled-lines" style={{ minHeight: '220px' }}>
            <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>[Espacio destinado a la continuación de la descripción de evidencias]</div>
          </div>
        </div>

        <div className="section">
          <div className="prcc-banner-title">IV. OBSERVACIONES</div>
          <div className="prcc-ruled-lines" style={{ minHeight: '60px', lineHeight: '20px' }}>
            <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>[Sin observaciones adicionales]</div>
          </div>
        </div>
      </div>

      {/* ANEXO B — REGISTRO DE DERIVACIÓN */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <div className="prcc-banner-title" style={{ textAlign: 'center', fontSize: '11px' }}>ANEXO B - REGISTRO DE DERIVACIÓN</div>
        <div className="prcc-card" style={{ marginBottom: '10px' }}>
          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group prcc-slot-input">
              <PlanillaFieldLabel>N° de Expediente / Causa</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.numeroCaso} placeholder="[N° Expediente]" />
            </div>
            <div className="form-group prcc-slot-input">
              <PlanillaFieldLabel>N° PRCC</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.numeroPRCC} placeholder="[N° PRCC]" />
            </div>
          </div>
        </div>

        <table border={1} cellSpacing={0} cellPadding={6} className="tabla-datos" style={{ borderRadius: '6px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#0F172A', color: '#fff', textAlign: 'center', fontSize: '8.5px' }}>
              <th style={{ width: '12%' }}>Fecha</th>
              <th style={{ width: '22%' }}>Despacho que deriva</th>
              <th style={{ width: '22%' }}>Persona que deriva</th>
              <th style={{ width: '18%' }}>N° Experticia</th>
              <th>Evidencia que se deriva</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#F3F3F3' : '#FFFFFF' }}>
                <td><PlanillaEditableValue placeholder="[DD/MM/AA]" /></td>
                <td><PlanillaEditableValue placeholder="[Despacho]" /></td>
                <td><PlanillaEditableValue placeholder="[Nombre]" /></td>
                <td><PlanillaEditableValue placeholder="[N° Experticia]" /></td>
                <td><PlanillaEditableValue placeholder="[Descripción de la evidencia derivada]" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PlanillaFolioTemplate>
  );
}
