import { CasoCMS } from '../../../store/cmsStore';

interface PlanillaPRCCProps {
  caso?: CasoCMS;
}

export default function PlanillaPRCC({ caso }: PlanillaPRCCProps) {
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
    peritoLider: 'Carlos Mendoza',
  };

  const c = caso || fallbackCaso;

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
    <div className="page" onClick={handleCheckboxClick}>
      <div className="watermark">CONSIGNACIÓN</div>

      <header>
        <div className="logo-container">
          <div className="logo-branding">
            <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="SHA256.US Logo" className="logo-img" />
            <span className="logo-text">SHA256.US</span>
          </div>
          <span className="logo-subtext">Laboratorio de Informática Forense y Ciberseguridad</span>
          <span className="address-text">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quibor, Municipio Jiménez del Estado Lara.</span>
        </div>
        <div className="form-header-info">
          <h1 className="form-title-main">Planilla de Registro de Cadena de Custodia (PRCC)</h1>
          <div className="form-nro">
            N° PRCC: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{c.numeroPRCC ? c.numeroPRCC : <span className="placeholder-field">[PRCC]</span>}</span>
          </div>
        </div>
      </header>

      {/*  SECCIÓN I  */}
      <div className="section">
        <div className="section-title">I. Datos del Consignante, del Caso y Organismo</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Apellidos y Nombres del Consignante</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Apellidos y Nombres del Consignante]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">Cédula de Identidad</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">Teléfono de Contacto</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono de Contacto]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">N° de Expediente / Caso</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">N° PRCC</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.numeroPRCC ? c.numeroPRCC : <span className="placeholder-field">[PRCC]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">Organismo / Despacho que instruye</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Organismo / Despacho que instruye]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Lugar de Obtención (Dirección)</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Lugar de Obtención (Dirección)]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Fecha de Recepción</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Fecha]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Hora de Recepción</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Hora]</span>
            </div>
          </div>
        </div>
      </div>

      {/*  SECCIÓN II  */}
      <div className="section">
        <div className="section-title">II. Forma de Obtención (MUCC-2017)</div>
        <div className="form-group">
          <div className="checkbox-group">
            <div className="check-item"><span className="box"></span> <u>CONSIGNACIÓN</u> <span style={{ fontSize: '7px', color: '#8e8e93' }}>(Entrega voluntaria)</span></div>
            <div className="check-item"><span className="box"></span> TÉCNICA</div>
            <div className="check-item"><span className="box"></span> ASEGURAMIENTO</div>
            <div className="check-item"><span className="box"></span> DERIVACIÓN</div>
          </div>
        </div>
      </div>

      {/*  SECCIÓN III  */}
      <div className="section">
        <div className="section-title">III. Operarios (Perito Informático) — MUCC-2017</div>
        <div className="signature-grid">
          <div className="sig-card">
            <div className="label">A. Fijación (Nombre y Credencial)</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ minHeight: '18px', fontWeight: 'bold', padding: '2px 5px' }}>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito]</span>}</div>
            <div className="sig-row">
              <div className="sig-firma-col">
                <div className="sig-box" />
                <span className="sig-label">FIRMA</span>
              </div>
              <div className="thumb-wrapper">
                <div className="thumb-box" />
                <span className="thumb-label">PULGAR DER.</span>
              </div>
            </div>
          </div>
          <div className="sig-card">
            <div className="label">B. Colección (Nombre y Credencial)</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ minHeight: '18px', fontWeight: 'bold', padding: '2px 5px' }}>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito]</span>}</div>
            <div className="sig-row">
              <div className="sig-firma-col">
                <div className="sig-box" />
                <span className="sig-label">FIRMA</span>
              </div>
              <div className="thumb-wrapper">
                <div className="thumb-box" />
                <span className="thumb-label">PULGAR DER.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  SECCIÓN IV  */}
      <div className="section">
        <div className="section-title">IV. Descripción de la Evidencia Digital Consignada</div>
        <table className="evidence-table">
          <tbody>
            <tr>
              <td>Tipo de Dispositivo</td>
              <td>
                <div className="checkbox-group" style={{ flexDirection: 'row', gap: '15px', fontSize: '9px' }}>
                  <div className="check-item"><span className="box"></span> Teléfono Móvil Android</div>
                  <div className="check-item"><span className="box"></span> Computador / Disco Duro</div>
                  <div className="check-item"><span className="box"></span> Tableta</div>
                  <div className="check-item"><span className="box"></span> Otro</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Marca / Modelo</td>
              <td contentEditable suppressContentEditableWarning>
                {c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : <span className="placeholder-field">[Marca / Modelo del Dispositivo]</span>}
              </td>
            </tr>
            <tr>
              <td>IMEI 1</td>
              <td contentEditable suppressContentEditableWarning>
                {c.dispositivo_imei ? c.dispositivo_imei : <span className="placeholder-field">[IMEI 1 / Serial]</span>}
              </td>
            </tr>
            <tr>
              <td>IMEI 2</td>
              <td contentEditable suppressContentEditableWarning>
                {c.dispositivo_imei2 ? c.dispositivo_imei2 : <span className="placeholder-field">[IMEI 2]</span>}
              </td>
            </tr>
            <tr>
              <td>N° de Serie / Serial</td>
              <td contentEditable suppressContentEditableWarning>
                {c.dispositivo_imei ? c.dispositivo_imei : <span className="placeholder-field">[Serial / IMEI]</span>}
              </td>
            </tr>
            <tr>
              <td>N° de Línea / Teléfono</td>
              <td contentEditable suppressContentEditableWarning>
                {c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono de Contacto]</span>}
              </td>
            </tr>
            <tr>
              <td>Tarjeta SIM</td>
              <td contentEditable suppressContentEditableWarning>
                {c.dispositivo_sim_card ? c.dispositivo_sim_card : <span className="placeholder-field">[Tarjeta SIM]</span>}
              </td>
            </tr>
            <tr>
              <td>Estado Físico</td>
              <td>
                <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                  <div className="check-item"><span className="box"></span> Operativo</div>
                  <div className="check-item"><span className="box"></span> Daños en Pantalla</div>
                  <div className="check-item"><span className="box"></span> Sin Batería</div>
                  <div className="check-item"><span className="box"></span> Golpe de Agua</div>
                  <div className="check-item"><span className="box"></span> Otros Daños Visibles</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Modo Aislamiento Aplicado</td>
              <td>
                <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                  <div className="check-item"><span className="box"></span> Modo Avión Activado</div>
                  <div className="check-item"><span className="box"></span> Bolsa Faraday</div>
                  <div className="check-item"><span className="box"></span> SIM Extraída</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>N° Precinto / Sello de Seguridad</td>
              <td contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° Precinto]</span></td>
            </tr>
            <tr>
              <td>Tipo de Embalaje</td>
              <td>
                <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                  <div className="check-item"><span className="box"></span> Bolsa Antiestática / Faraday</div>
                  <div className="check-item"><span className="box"></span> Caja de Cartón</div>
                  <div className="check-item"><span className="box"></span> Sobre de Evidencia</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Accesorios Incluidos</td>
              <td contentEditable suppressContentEditableWarning><span className="placeholder-field">[Accesorios Incluidos]</span></td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '9px' }}>
          ¿Continúa en Anexo A? <span className="box"></span> SI <span className="box"></span> NO
        </div>
      </div>

      {/*  SECCIÓN V  */}
      <div className="section">
        <div className="section-title">V. Recepción de la Evidencia — Consignación Voluntaria (MUCC-2017 Obtención por Consignación)</div>
        <table className="transfer-table">
          <tbody>
            <tr>
              <td style={{ width: '30%', verticalAlign: 'top' }}>
                <div className="label">Motivo de la Consignación</div>
                <div className="checkbox-group" style={{ flexDirection: 'column', gap: '4px', fontSize: '8px' }}>
                  <div className="check-item"><span className="box"></span> PERITAJE — Análisis Forense</div>
                  <div className="check-item"><span className="box"></span> RESGUARDO</div>
                </div>
              </td>
              <td style={{ width: '35%', verticalAlign: 'top' }}>
                <div className="sig-detail-card" style={{ minHeight: 'auto', border: 'none', padding: '0', background: 'transparent', gap: '4px' }}>
                  <div className="label">ENTREGA (Consignante)</div>
                  <div style={{ fontSize: '9px', marginBottom: '4px' }}>Nombre: <span style={{ fontWeight: 'bold' }} contentEditable suppressContentEditableWarning>{c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Nombre]</span>}</span></div>
                  <div className="sig-line" style={{ height: '24px' }} />
                  <div className="sig-line-label" style={{ fontSize: '7px' }}>Firma</div>
                  <div className="sig-field" style={{ fontSize: '8px' }}>
                    C.I.: <span className="sig-underline" contentEditable suppressContentEditableWarning style={{ minHeight: '16px' }}>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula]</span>}</span>
                  </div>
                  <div className="sig-field" style={{ fontSize: '8px' }}>
                    Teléfono: <span className="sig-underline" contentEditable suppressContentEditableWarning style={{ minHeight: '16px' }}>{c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono]</span>}</span>
                  </div>
                  <div className="fingerprint-row" style={{ marginTop: '4px', paddingTop: '4px' }}>
                    <div className="thumb-wrapper">
                      <div className="thumb-box" />
                      <span className="thumb-label">PULGAR DER.</span>
                    </div>
                    <div className="thumb-wrapper">
                      <div className="thumb-box" />
                      <span className="thumb-label">PULGAR IZQ.</span>
                    </div>
                  </div>
                </div>
              </td>
              <td style={{ width: '35%', verticalAlign: 'top' }}>
                <div className="sig-detail-card" style={{ minHeight: 'auto', border: 'none', padding: '0', background: 'transparent', gap: '4px' }}>
                  <div className="label">RECIBE (Perito Informático)</div>
                  <div style={{ fontSize: '9px', marginBottom: '4px' }}>Nombre: <span style={{ fontWeight: 'bold' }} contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito]</span>}</span></div>
                  <div className="sig-line" style={{ height: '24px' }} />
                  <div className="sig-line-label" style={{ fontSize: '7px' }}>Firma</div>
                  <div className="sig-field" style={{ fontSize: '8px' }}>
                    C.I.: <span className="sig-underline" contentEditable suppressContentEditableWarning style={{ minHeight: '16px' }}><span className="placeholder-field">[Cédula]</span></span>
                  </div>
                  <div className="sig-field" style={{ fontSize: '8px' }}>
                    Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning style={{ minHeight: '16px' }}><span className="placeholder-field">[Cargo]</span></span>
                  </div>
                  <div className="fingerprint-row" style={{ marginTop: '4px', paddingTop: '4px' }}>
                    <div className="thumb-wrapper">
                      <div className="thumb-box" />
                      <span className="thumb-label">PULGAR DER.</span>
                    </div>
                    <div className="thumb-wrapper">
                      <div className="thumb-box" />
                      <span className="thumb-label">PULGAR IZQ.</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/*  DECLARACIÓN  */}
      <div className="section">
        <p style={{ fontSize: '7px', color: '#8e8e93', textAlign: 'justify', marginTop: '5px', lineHeight: '1.2' }}>
          Yo, <strong style={{ borderBottom: '1px solid #1d1d1f', minWidth: '200px', display: 'inline-block' }} contentEditable suppressContentEditableWarning>{c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Apellidos y Nombres del Consignante]</span>}</strong>, titular de la cédula de identidad N° <strong style={{ borderBottom: '1px solid #1d1d1f', minWidth: '120px', display: 'inline-block' }} contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad]</span>}</strong>, 
          en pleno uso de mis facultades, declaro que hago entrega voluntaria del dispositivo móvil descrito en la Sección IV para su revisión técnica forense. 
          Autorizo al Laboratorio SHA256.US a realizar las pruebas técnicas necesarias sobre el equipo y su contenido digital, 
          conforme al <strong>Manual Único de Cadena de Custodia de Evidencias (MUCC-2017)</strong>, los <strong>Arts. 187 y 225 del COPP</strong>, 
          y la <strong>Ley sobre Mensajes de Datos y Firmas Electrónicas (Art. 4)</strong>. 
          Me comprometo a retirar el equipo una vez finalizado el peritaje, en un plazo no mayor a treinta (30) días continuos.
        </p>
      </div>
    </div>
  );
}
