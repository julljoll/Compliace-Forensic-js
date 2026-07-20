import { useState } from 'react';
import { CasoCMS } from '../../../store/cmsStore';

interface ActaEntrevistaProps {
  caso?: CasoCMS;
}

export default function ActaEntrevista({ caso }: ActaEntrevistaProps) {
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
          <span className="address-text">
            Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quíbor, Municipio Jiménez del Estado Lara.
          </span>
        </div>
        <div className="acta-header">
          <h1 className="acta-title">Acta de Entrevista de Testigo / Víctima</h1>
          <div className="acta-nro">
            N° EXPEDIENTE: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}</span>
          </div>
        </div>
      </header>

      {/* DATOS DE LA ENTREVISTA */}
      <div className="section">
        <div className="section-title">Datos del Procedimiento (Entrevista)</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Lugar de la Entrevista</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Quíbor, Estado Lara — Laboratorio Forense SHA256.US]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Fecha de la Entrevista</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Fecha (ej: DD/MM/AAAA)]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Hora de Inicio</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Hora Inicio (ej: HH:MM)]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Hora de Término</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Hora Cierre (ej: HH:MM)]</span>
            </div>
          </div>
        </div>
      </div>

      {/* I. IDENTIFICACIÓN DEL ENTREVISTADO */}
      <div className="section">
        <div className="section-title">I. Datos e Identificación del Entrevistado</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Apellidos y Nombres</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Apellidos y Nombres]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">Cédula de Identidad / Pasaporte</div>
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
            <div className="label">Correo Electrónico</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.correo_investigar ? c.correo_investigar : <span className="placeholder-field">[Correo Electrónico]</span>}
            </div>
          </div>
        </div>
        <div className="grid-container" style={{ marginTop: '5px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <div className="label">Dirección de Habitación Habitual</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Dirección de Habitación]</span>
            </div>
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '5px' }}>
          <div className="label">Condición / Rol en la Investigación</div>
          <div className="checkbox-group" style={{ flexDirection: 'row', gap: '15px', fontSize: '9px' }}>
            <div className="check-item"><span className="box"></span> Víctima</div>
            <div className="check-item"><span className="box"></span> Testigo / Denunciante</div>
            <div className="check-item"><span className="box"></span> Propietario de la Evidencia</div>
            <div className="check-item"><span className="box"></span> Poseedor / Consignatario</div>
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

      {/* II. RELACIÓN DEL DISPOSITIVO Y CUENTAS ASOCIADAS */}
      <div className="section">
        <div className="section-title">II. Relación del Dispositivo y Cuentas de Interés Forense</div>
        
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Dispositivo Móvil / Almacenamiento</td>
                <td contentEditable suppressContentEditableWarning>
                  Marca/Modelo: <strong className="placeholder-field">{c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : '[Marca / Modelo]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Serial / IMEI: <strong className="placeholder-field">{c.dispositivo_imei ? c.dispositivo_imei : '[Serial / IMEI]'}</strong>
                </td>
              </tr>
              <tr>
                <td>Línea Activa</td>
                <td contentEditable suppressContentEditableWarning>
                  Nro. Telefónico: <strong className="placeholder-field">{c.dispositivo_numero_tel ? c.dispositivo_numero_tel : '[Nro. Telefónico]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Operadora: <strong className="placeholder-field">[Operadora]</strong>
                </td>
              </tr>
              <tr>
                <td>Cuenta / Aplicación de Interés</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '12px' }}>
                    <div className="check-item"><span className="box"></span> WhatsApp</div>
                    <div className="check-item"><span className="box"></span> Telegram</div>
                    <div className="check-item"><span className="box"></span> Correo Electrónico</div>
                    <div className="check-item">
                      <span className="box"></span> Cuenta ID: <span contentEditable suppressContentEditableWarning style={{ textDecoration: 'underline' }} className="placeholder-field">[Cuenta / ID de la Aplicación]</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Computador / Almacenamiento</td>
                <td contentEditable suppressContentEditableWarning>
                  Marca/Modelo: <strong className="placeholder-field">{c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : '[HP, Dell, etc.]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Serial del Equipo: <strong className="placeholder-field">{c.dispositivo_imei ? c.dispositivo_imei : '[Serial del Computador]'}</strong>
                </td>
              </tr>
              <tr>
                <td>Unidad de Disco Duro / USB</td>
                <td contentEditable suppressContentEditableWarning>
                  Unidad: <strong className="placeholder-field">{c.discoduro_marca || c.discoduro_modelo ? `${c.discoduro_marca || ''} ${c.discoduro_modelo || ''}`.trim() : '[SSD/HDD/USB]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Capacidad: <strong className="placeholder-field">{c.discoduro_capacidad ? c.discoduro_capacidad : '[Capacidad (ej: 480 GB)]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Serial Unidad: <strong className="placeholder-field">{c.discoduro_serial ? c.discoduro_serial : '[Serial S/N]'}</strong>
                </td>
              </tr>
              <tr>
                <td>Servicios / Cuentas de Interés</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '12px' }}>
                    <div className="check-item"><span className="box"></span> Correo Corporativo</div>
                    <div className="check-item"><span className="box"></span> Historial de Navegación</div>
                    <div className="check-item"><span className="box"></span> Archivos del Sistema</div>
                    <div className="check-item">
                      <span className="box"></span> Ruta/ID: <span contentEditable suppressContentEditableWarning style={{ textDecoration: 'underline' }} className="placeholder-field">[Carpeta / ID / Correo]</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* III. FUNDAMENTACIÓN LEGAL Y CONSENTIMIENTO INFORMADO */}
      <div className="section">
        <div className="section-title">III. Fundamentación Legal y Consentimiento Informado (Sin Coacción)</div>
        <div className="legal-text">
          En cumplimiento con el <strong>Manual Único de Cadena de Custodia de Evidencias Físicas (MUCC-2017)</strong> y de conformidad con los 
          <strong> Artículos 187 y 225 del Código Orgánico Procesal Penal (COPP)</strong>, el <strong>Artículo 48 de la Constitución (CRBV)</strong> 
          y el <strong>Artículo 4 de la Ley sobre Mensajes de Datos y Firmas Electrónicas</strong>, yo, el ciudadano entrevistado arriba 
          identificado, manifiesto de manera <strong>LIBRE, EXPRESA, INFORMADA Y LIBRE DE TODA COACCIÓN FÍSICA O MORAL</strong> mi consentimiento y autorización para que los peritos 
          del Laboratorio Forense SHA256.US procedan a realizar la entrevista, examen técnico, análisis informático forense y la respectiva extracción lógica/física 
          de los datos contenidos en el dispositivo y/o cuentas consignadas.
        </div>
      </div>

      {/* IV. NARRATIVA Y RELATO DE LOS HECHOS */}
      <div className="section">
        <div className="section-title">IV. Narrativa del Entrevistado y Relato de los Hechos de Interés Forense</div>
        <div style={{ fontSize: '9px', fontStyle: 'italic', color: '#515154', marginBottom: '4px' }}>
          Indique de manera cronológica y detallada el origen de las comunicaciones de interés, contextualización de los chats, personas involucradas y la relación del dispositivo en estudio:
        </div>
        <div className="narrativa-box" contentEditable suppressContentEditableWarning>
          <p style={{ margin: 0, fontWeight: 'medium' }}>
            <strong>Relato inicial:</strong> <span className="placeholder-field">[Describa detalladamente el relato de los hechos]</span>
          </p>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
        </div>
      </div>

      {/* V. FIRMAS Y HUELLAS DACTILARES */}
      <div className="signature-section" style={{ gap: '14mm', marginTop: '6mm' }}>
        <div className="sig-detail-card">
          <div className="sig-detail-label">CIUDADANO ENTREVISTADO</div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Entrevistado</div>
          <div className="sig-field">
            C.I.: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[C.I. del Entrevistado]</span>}</span>
          </div>
          <div className="sig-field">
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Nombre del Entrevistado]</span>}</span>
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
          <div className="sig-detail-label">PERITO FORENSE RECEPTOR</div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Experto Forense</div>
          <div className="sig-field">
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito Forense]</span>}</span>
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
        Documento Oficial generado bajo los estándares de la Ley sobre Mensajes de Datos y Firmas Electrónicas, el Manual Único de Cadena de Custodia de Evidencias (MUCC-2017) y las normas ISO/IEC 27037:2012 / 27042:2015.<br />
        SHA256.US — Laboratorio de Informática Forense y Ciberseguridad | Consignación Privada y Cumplimiento Normativo.
      </div>
    </div>

    {/* Barra de Estado de Word (Solo pantalla) */}
    <div className="word-status-bar no-print">
      <div className="left-info">
        <div className="status-item">Página 1 de 1</div>
        <div className="status-item">|</div>
        <div className="status-item">Times New Roman (11pt)</div>
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
