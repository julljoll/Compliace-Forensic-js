import { useState } from 'react';
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
  const [tipoEvidencia, setTipoEvidencia] = useState<'movil' | 'computadora'>(
    c.tipoProyecto === 'forense_discoduro' ? 'computadora' : 'movil'
  );

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

      {/* DATOS DE LA ACTUACIÓN */}
      <div className="section">
        <div className="section-title">Datos de la Actuación Forense</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Lugar de Actuación / Sede</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Lara, Venezuela — Laboratorio Forense SHA256.US]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Fecha y Hora de la Consignación</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Fecha y Hora (ej: DD/MM/AAAA - HH:MM)]</span>
            </div>
          </div>
        </div>
      </div>

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

      {/* Conmutador interactivo (Solo en pantalla) */}
      <div className="no-print flex gap-2.5 my-4 p-2.5 rounded-lg bg-white/5 border border-white/10">
        <span className="text-[11px] font-bold text-gray-400 self-center uppercase tracking-wider">Tipo de Evidencia:</span>
        <button 
          type="button"
          onClick={() => setTipoEvidencia('movil')} 
          className={`px-3 py-1.5 rounded text-[11px] font-bold border transition-colors ${tipoEvidencia === 'movil' ? 'bg-[#0a84ff] border-[#0a84ff] text-white' : 'bg-white border-gray-300 text-black'}`}
        >
          📱 Dispositivo Móvil
        </button>
        <button 
          type="button"
          onClick={() => setTipoEvidencia('computadora')} 
          className={`px-3 py-1.5 rounded text-[11px] font-bold border transition-colors ${tipoEvidencia === 'computadora' ? 'bg-[#0a84ff] border-[#0a84ff] text-white' : 'bg-white border-gray-300 text-black'}`}
        >
          💻 Computador / Almacenamiento
        </button>
      </div>

      {/*  II. DESCRIPCIÓN DEL DISPOSITIVO  */}
      <div className="section">
        <div className="section-title">II. Descripción Técnica de la Evidencia ({tipoEvidencia === 'movil' ? 'Dispositivo Móvil' : 'Computador / Almacenamiento'})</div>
        
        {tipoEvidencia === 'movil' ? (
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
        ) : (
          <table className="evidence-table">
            <tbody>
              <tr>
                <td>Marca / Modelo del Computador</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : <span className="placeholder-field">[Marca / Modelo del Computador (ej. HP ProBook 450 G8)]</span>}
                </td>
              </tr>
              <tr>
                <td>Número de Serie del Computador</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_imei ? c.dispositivo_imei : <span className="placeholder-field">[Serial del Equipo / Placa (ej. S/N: 5CD1234567)]</span>}
                </td>
              </tr>
              <tr>
                <td>Unidad de Disco Duro (Marca / Modelo)</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.discoduro_marca || c.discoduro_modelo ? `${c.discoduro_marca || ''} ${c.discoduro_modelo || ''}`.trim() : <span className="placeholder-field">[Marca / Modelo del Disco (ej. Kingston A400 SSD)]</span>}
                </td>
              </tr>
              <tr>
                <td>Capacidad del Disco Duro</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.discoduro_capacidad ? c.discoduro_capacidad : <span className="placeholder-field">[Capacidad (ej. 480 GB SSD / 1 TB HDD)]</span>}
                </td>
              </tr>
              <tr>
                <td>Número de Serie del Disco Duro</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.discoduro_serial ? c.discoduro_serial : <span className="placeholder-field">[Serial del Disco Duro (S/N)]</span>}
                </td>
              </tr>
              <tr>
                <td>Unidad USB / Tarjetas Externas</td>
                <td contentEditable suppressContentEditableWarning>
                  <span className="placeholder-field">[Memorias USB / Tarjetas SD consignadas (Marca, Capacidad, Serial)]</span>
                </td>
              </tr>
              <tr>
                <td>Estado Físico del Equipo</td>
                <td>
                  <div className="checkbox-group">
                    <div className="check-item"><span className="box"></span> Operativo</div>
                    <div className="check-item"><span className="box"></span> Daños Pantalla</div>
                    <div className="check-item"><span className="box"></span> Faltan Componentes</div>
                    <div className="check-item"><span className="box"></span> Carcasa Quebrada</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/*  III. AUTORIZACIÓN Y ALCANCE  */}
      <div className="section">
        <div className="section-title">III. Autorización y Alcance de la Consignación</div>
        <div className="legal-text">
          Yo, el arriba identificado, en pleno uso de mis facultades, hago entrega material voluntaria del dispositivo descrito (Obtención por Consignación) según el <strong>Manual Único de Cadena de Custodia (2017)</strong>. 
          <strong>AUTORIZO EXPRESA Y VOLUNTARIAMENTE</strong> al experto informático de SHA256 para que aplique herramientas forenses con el fin de realizar la extracción lógica/física de "Mensajes de Datos" (Art. 4, Ley sobre Mensajes de Datos y Firmas Electrónicas), renunciando temporalmente a la privacidad de las comunicaciones (Art. 48 CRBV) bajo los límites de esta autorización:
        </div>
        <div className="form-group">
          <div className="label">Alcance de la Autorización (Marque uno)</div>
          <div className="checkbox-group" style={{ margin: '5px 0' }}>
            <div className="check-item"><span className="box"></span> <strong>ANÁLISIS TÉCNICO COMPLETO</strong> (Todo el contenido del dispositivo/computador)</div>
          </div>
          <div className="checkbox-group" style={{ margin: '5px 0' }}>
            <div className="check-item"><span className="box"></span> <strong>ANÁLISIS DELIMITADO</strong> (Únicamente chats de <strong>WHATSAPP</strong> / Archivos específicos)</div>
          </div>
        </div>
      </div>

      {/*  IV. REQUERIMIENTOS DE ACCESO  */}
      <div className="section">
        <div className="section-title">IV. Requerimientos de Acceso y Preservación</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Claves de Acceso / Bloqueo</div>
            <div className="checkbox-group">
              <div className="check-item"><span className="box"></span> Contraseña / PIN: <span contentEditable suppressContentEditableWarning style={{ borderBottom: '1px dashed #515154', minWidth: '80px', display: 'inline-block' }}></span></div>
              <div className="check-item"><span className="box"></span> Sin Bloqueo</div>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Estado de Aislamiento / Conexión</div>
            <div className="checkbox-group">
              <div className="check-item"><span className="box"></span> Modo Avión Activado / WiFi Apagado</div>
              <div className="check-item"><span className="box"></span> Unidad Desconectada de Red</div>
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
        Documento generado bajo los estándares de la Ley de Mensajes de Datos y Firmas Electrónicas y el Manual Único de Cadena de Custodia de Evidencias <br />
        SHA256 Forensic Lab - Informática Forense y Ciberseguridad al servicio de la justicia.
      </div>
    </div>
  );
}
