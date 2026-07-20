import { useState } from 'react';
import { CasoCMS } from '../../../store/cmsStore';

interface ActaEntregaResultadosProps {
  caso?: CasoCMS;
}

export default function ActaEntregaResultados({ caso }: ActaEntregaResultadosProps) {
  const fallbackCaso = {
    numeroCaso: '',
    numeroPRCC: '',
    solicitante_nombre: '',
    solicitante_cedula: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
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
  const [tipoEvidencia, setTipoEvidencia] = useState<'movil' | 'computadora'>(
    c.tipoProyecto === 'forense_discoduro' ? 'computadora' : 'movil'
  );

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
    <>
      {/* Regla de Word (Solo pantalla) */}
      <div className="word-ruler no-print">
        <div className="margin-left-shaded" title="Margen Izquierdo (38mm) — Área de Encuadernación" />
        <div className="ruler-text-zone">
          <div className="ruler-ticks" />
        </div>
        <div className="margin-right-shaded" title="Margen Derecho (15mm)" />
      </div>

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
          <h1 className="acta-title">Acta de Entrega de Resultados y Devolución</h1>
          <div className="acta-nro">
            N° CAUSA / EXPEDIENTE: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}</span>
          </div>
        </div>
      </header>

      {/* DATOS DE LA DEVOLUCIÓN */}
      <div className="section">
        <div className="section-title">Datos de la Entrega Material</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Lugar de Entrega / Devolución</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Quíbor, Estado Lara — Laboratorio Forense SHA256.US]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Fecha y Hora de la Entrega</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Fecha y Hora (ej: DD/MM/AAAA - HH:MM)]</span>
            </div>
          </div>
        </div>
      </div>

      {/*  I. DATOS DEL RECEPTOR  */}
      <div className="section">
        <div className="section-title">I. Datos e Identificación del Receptor (Propietario/Poseedor)</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Apellidos y Nombres</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Apellidos y Nombres del Receptor]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">Cédula de Identidad</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">N° de Teléfono</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono de Contacto]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">N° Registro Cadena de Custodia (PRCC)</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.numeroPRCC ? c.numeroPRCC : <span className="placeholder-field">[PRCC]</span>}
            </div>
          </div>
        </div>
      </div>

      {/*  II. ENTREGABLES  */}
      <div className="section">
        <div className="section-title">II. Documentos y Resultados Entregados</div>
        <div className="form-group">
          <div className="checkbox-group" style={{ flexDirection: 'column', gap: '5px' }}>
            <div className="check-item"><span className="box"></span> <strong>DICTAMEN FORENSE ORIGINAL</strong> (Documento físico en papel sellado)</div>
            <div className="check-item"><span className="box"></span> <strong>SOPORTE DIGITAL (DVD-R / Pendrive)</strong> conteniendo el reporte de extracción forense, chats recuperados y anexos fotográficos.</div>
            <div className="check-item"><span className="box"></span> <strong>ACTA DE DEVOLUCIÓN DEL DISPOSITIVO FÍSICO</strong></div>
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

      {/*  III. DETALLE DEL DISPOSITIVO DEVUELTO  */}
      <div className="section">
        <div className="section-title">III. Descripción del Dispositivo Devuelto ({tipoEvidencia === 'movil' ? 'Móvil' : 'Computador'})</div>
        
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Equipo / Dispositivo</td>
                <td contentEditable suppressContentEditableWarning>
                  Teléfono Móvil: <strong className="placeholder-field">{c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : '[Marca / Modelo]'}</strong>
                </td>
              </tr>
              <tr>
                <td>IMEI 1 / Serial</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_imei ? c.dispositivo_imei : <span className="placeholder-field">[IMEI / S/N]</span>}
                </td>
              </tr>
              <tr>
                <td>Línea Telefónica / SIM</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_numero_tel ? `${c.dispositivo_numero_tel} (SIM: ${c.dispositivo_sim_card || ''})` : <span className="placeholder-field">[Nro. Telefónico / SIM]</span>}
                </td>
              </tr>
              <tr>
                <td>Accesorios Devueltos</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '15px' }}>
                    <div className="check-item"><span className="box"></span> Cargador</div>
                    <div className="check-item"><span className="box"></span> Cable de Datos USB</div>
                    <div className="check-item"><span className="box"></span> Tarjeta SIM</div>
                    <div className="check-item"><span className="box"></span> Tarjeta MicroSD</div>
                    <div className="check-item"><span className="box"></span> Forro / Estuche</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Computador Devuelto</td>
                <td contentEditable suppressContentEditableWarning>
                  Equipo: <strong className="placeholder-field">{c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : '[HP, Dell Laptop]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Serial: <strong className="placeholder-field">{c.dispositivo_imei ? c.dispositivo_imei : '[Serial Placa/Equipo]'}</strong>
                </td>
              </tr>
              <tr>
                <td>Unidad de Disco Duro</td>
                <td contentEditable suppressContentEditableWarning>
                  Disco Interno: <strong className="placeholder-field">{c.discoduro_marca || c.discoduro_modelo ? `${c.discoduro_marca || ''} ${c.discoduro_modelo || ''}`.trim() : '[Marca y Modelo]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Capacidad: <strong className="placeholder-field">{c.discoduro_capacidad ? c.discoduro_capacidad : '[ej: 480 GB SSD]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Serial: <strong className="placeholder-field">{c.discoduro_serial ? c.discoduro_serial : '[S/N Disco]'}</strong>
                </td>
              </tr>
              <tr>
                <td>Memorias Externas / USB</td>
                <td contentEditable suppressContentEditableWarning>
                  <span className="placeholder-field">[Memorias USB / Tarjetas SD (Marca, Modelo, Capacidad, Serial)]</span>
                </td>
              </tr>
              <tr>
                <td>Accesorios Devueltos</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px' }}>
                    <div className="check-item"><span className="box"></span> Cargador / Cable de Poder</div>
                    <div className="check-item"><span className="box"></span> Teclado / Mouse</div>
                    <div className="check-item"><span className="box"></span> Estuche / Bolso</div>
                    <div className="check-item"><span className="box"></span> Cable de Red LAN</div>
                    <div className="check-item"><span className="box"></span> Discos de Drivers</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/*  IV. DECLARACIÓN DE CONFORMIDAD  */}
      <div className="section">
        <div className="section-title">IV. Declaración de Recepción Conforme y Descargo de Responsabilidad</div>
        <div className="legal-text">
          Yo, el ciudadano arriba identificado en la Sección I, mediante la firma de la presente acta, hago constar que he recibido a mi entera satisfacción los resultados técnicos y el dictamen pericial forense listados en la Sección II. <br />
          Asimismo, <strong>DECLARO RECIBIR CONFORME</strong> el dispositivo físico y/o medio de almacenamiento consignado, certificando que el valor Hash SHA-256 al momento de la devolución fue verificado y coincide exactamente con el registrado en el Acta de Obtención inicial y la PRCC. Manifiesto que la evidencia me es devuelta en el mismo estado físico y operacional de conservación. Libero al Laboratorio SHA256.US y a sus expertos forenses de toda responsabilidad posterior sobre la custodia y el estado de la referida evidencia digital.
        </div>
        <div className="form-group dev-observaciones-value" contentEditable suppressContentEditableWarning style={{ minHeight: '40px' }}>
          Observaciones del Propietario / Consignante (Si aplica): <span className="placeholder-field">[Ninguna. Recibo conforme con verificación Hash SHA-256 idéntica y sin daños]</span>
        </div>
      </div>

      {/*  V. FIRMAS Y HUELLAS DACTILARES  */}
      <div className="signature-section" style={{ gap: '14mm', marginTop: '8mm' }}>
        <div className="sig-detail-card">
          <div className="sig-detail-label">EL RECEPTOR</div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Receptor</div>
          <div className="sig-field">
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Nombre del Receptor]</span>}</span>
          </div>
          <div className="sig-field">
            C.I.: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula del Receptor]</span>}</span>
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
          <div className="sig-detail-label">ENTREGADO POR (PERITO)</div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Perito Forense</div>
          <div className="sig-field">
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito]</span>}</span>
          </div>
          <div className="sig-field">
            C.I. / Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[C.I. - Experto Forense]</span></span>
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

    {/* Barra de Estado de Word (Solo pantalla) */}
    <div className="word-status-bar no-print">
      <div className="left-info">
        <div className="status-item">Página 1 de 1</div>
        <div className="status-item">|</div>
        <div className="status-item">Ubuntu (11pt)</div>
        <div className="status-item">|</div>
        <div className="status-item">Llenado Manual: [Activo]</div>
      </div>
      <div className="right-info">
        <div className="status-item">Formato: Oficio Venezolano (216x330mm)</div>
      </div>
    </div>
  </>
  );
}
