import { CasoCMS } from '../../../store/cmsStore';

interface ActaObtencionProps {
  caso?: CasoCMS;
}

export default function ActaObtencion({ caso }: ActaObtencionProps) {
  const fallbackCaso = {
    numeroCaso: '',
    solicitante_nombre: '',
    solicitante_cedula: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
    dispositivo_imei2: '',
    dispositivo_numero_tel: '',
    dispositivo_sim_card: '',
    dispositivo_estado_fisico: '',
    dispositivo_bateria_estado: '',
    descripcion: '',
    peritoLider: 'Carlos Mendoza',
    tipoProyecto: '',
    discoduro_serial: '',
    discoduro_capacidad: '',
    discoduro_marca: '',
    discoduro_modelo: '',
  };

  const c = caso || fallbackCaso;
  const isDiscoDuro = c.tipoProyecto === 'forense_discoduro';

  // Manejador interactivo para marcar casillas con una "X" al hacer clic
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
      <header>
        <div className="logo-container">
          <div className="logo-branding">
            <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="SHA256.US Logo" className="logo-img" />
            <span className="logo-text">SHA256.US</span>
          </div>
          <span className="logo-subtext">Laboratorio de Informática Forense y Ciberseguridad</span>
          <span className="address-text">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quibor, Municipio Jiménez del Estado Lara.</span>
        </div>
        <div className="acta-header">
          <h1 className="acta-title">Acta de Obtención por Consignación</h1>
          <div className="acta-nro">
            N° EXPEDIENTE: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}</span>
          </div>
        </div>
      </header>

      {/*  I. DATOS DEL CONSIGNANTE  */}
      <div className="section">
        <div className="section-title">I. Datos del Consignante (Propietario/Poseedor)</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Apellidos y Nombres</div>
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
            <div className="label">Teléfono</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono de Contacto]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">Dirección</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Dirección de Residencia]</span>
            </div>
          </div>
        </div>
      </div>

      {/*  II. DESCRIPCIÓN DEL DISPOSITIVO  */}
      <div className="section">
        <div className="section-title">II. Descripción Técnica del Dispositivo ({isDiscoDuro ? 'Disco Duro' : 'Android'})</div>
        <table className="evidence-table">
          <tbody>
            <tr>
              <td>Marca / Modelo</td>
              <td contentEditable suppressContentEditableWarning>
                {c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : <span className="placeholder-field">[Marca / Modelo del Dispositivo]</span>}
              </td>
            </tr>
            <tr>
              <td>IMEI 1 / Serial</td>
              <td contentEditable suppressContentEditableWarning>
                {c.dispositivo_imei ? c.dispositivo_imei : <span className="placeholder-field">[Serial / IMEI del Dispositivo]</span>}
              </td>
            </tr>
            <tr>
              <td>IMEI 2</td>
              <td contentEditable suppressContentEditableWarning>
                {c.dispositivo_imei2 ? c.dispositivo_imei2 : <span className="placeholder-field">[Segundo IMEI (Si aplica)]</span>}
              </td>
            </tr>
            <tr>
              <td>Nro. de Línea / Operadora</td>
              <td contentEditable suppressContentEditableWarning>
                {c.dispositivo_numero_tel || c.dispositivo_sim_card ? `${c.dispositivo_numero_tel || ''} (SIM: ${c.dispositivo_sim_card || ''})` : <span className="placeholder-field">[Nro. de Línea / Operadora / SIM]</span>}
              </td>
            </tr>
            <tr>
              <td>Estado Físico</td>
              <td>
                <div className="checkbox-group">
                  <div className="check-item"><span className="box"></span> Operativo</div>
                  <div className="check-item"><span className="box"></span> Daños Pantalla</div>
                  <div className="check-item"><span className="box"></span> Sin Batería</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Nivel Batería (%)</td>
              <td>
                <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '40px', textAlign: 'center' }}>
                  <span className="placeholder-field">{c.dispositivo_bateria_estado ? c.dispositivo_bateria_estado : '___'}</span>
                </span> %
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/*  III. AUTORIZACIÓN Y ALCANCE  */}
      <div className="section">
        <div className="section-title">III. Autorización y Alcance de la Consignación</div>
        <div className="legal-text">
          Yo, el arriba identificado, en pleno uso de mis facultades, hago entrega material voluntaria del dispositivo descrito (Obtención por Consignación) según el <strong>Manual Único de Cadena de Custodia (2017)</strong>. 
          <strong>AUTORIZO EXPRESA Y VOLUNTARIAMENTE</strong> al experto informático de SHA256 para que aplique herramientas forenses (Andriller, ALEAPP o similares) con el fin de realizar la extracción lógica/física de "Mensajes de Datos" (Art. 4, Ley sobre Mensajes de Datos y Firmas Electrónicas), renunciando temporalmente a la privacidad de las comunicaciones (Art. 48 CRBV) bajo los límites de esta autorización:
        </div>
        <div className="form-group">
          <div className="label">Alcance de la Autorización (Marque uno)</div>
          <div className="checkbox-group" style={{ margin: '5px 0' }}>
            <div className="check-item"><span className="box"></span> <strong>ANÁLISIS TÉCNICO COMPLETO</strong> (Todo el contenido del dispositivo)</div>
          </div>
          <div className="checkbox-group" style={{ margin: '5px 0' }}>
            <div className="check-item"><span className="box"></span> <strong>ANÁLISIS DELIMITADO</strong> (Únicamente chats de <strong>WHATSAPP</strong>)</div>
          </div>
        </div>
      </div>

      {/*  IV. REQUERIMIENTOS DE ACCESO  */}
      <div className="section">
        <div className="section-title">IV. Requerimientos de Acceso y Preservación</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Bloqueo de Pantalla</div>
            <div className="checkbox-group">
              <div className="check-item"><span className="box"></span> PIN / Patrón: <span contentEditable suppressContentEditableWarning style={{ borderBottom: '1px dashed #515154', minWidth: '60px', display: 'inline-block' }}></span></div>
              <div className="check-item"><span className="box"></span> Sin Bloqueo</div>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Estado de Conexión</div>
            <div className="checkbox-group">
              <div className="check-item"><span className="box"></span> Modo Avión Activado</div>
              <div className="check-item"><span className="box"></span> WiFi/Datos Desactivados</div>
            </div>
          </div>
        </div>
      </div>

      {/*  V. MOTIVO  */}
      <div className="section">
        <div className="section-title">V. Motivo de la Consignación</div>
        <div className="form-group motive-box" contentEditable suppressContentEditableWarning>
          <span className="placeholder-field">{c.descripcion ? c.descripcion : '[Describa el motivo y las circunstancias de la consignación de la evidencia digital]'}</span>
        </div>
      </div>

      {/*  VI. FIRMAS  */}
      <div className="signature-section" style={{ gap: '14mm' }}>
        <div className="sig-detail-card">
          <div className="sig-detail-label">EL CONSIGNANTE</div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma</div>
          <div className="sig-field">
            C.I.: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula del Consignante]</span>}</span>
          </div>
          <div className="sig-field">
            Teléfono: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono]</span>}</span>
          </div>
          <div className="fingerprint-row">
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
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO RECEPTOR</div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma</div>
          <div className="sig-field">
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito Receptor]</span>}</span>
          </div>
          <div className="sig-field">
            Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Experto Informático Forense]</span></span>
          </div>
          <div className="fingerprint-row">
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
      </div>

      <div className="footer">
        Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) <br />
        SHA256 Forensic Lab - Tecnología al servicio de la justicia.
      </div>
    </div>
  );
}
