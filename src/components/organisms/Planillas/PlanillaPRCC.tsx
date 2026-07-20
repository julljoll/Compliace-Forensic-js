import { useState } from 'react';
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
      <div className="watermark">CONSIGNACIÓN</div>

      <header>
        <div className="header-top-row">
          <div className="header-logo-brand">
            <img src="/logo.png" alt="SHA256.US Logo" className="logo-img" />
            <span className="logo-text">SHA256.US</span>
          </div>
          <div className="header-lab-info">
            <div className="lab-title">LABORATORIO DE INFORMÁTICA FORENSE Y CIBERSEGURIDAD</div>
            <div className="lab-address">
              Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quíbor, Municipio Jiménez del Estado Lara.
            </div>
          </div>
        </div>
        <div className="header-title-row">
          <h1 className="acta-title">Planilla de Registro de Cadena de Custodia (PRCC)</h1>
          <div className="acta-nro">
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
            <div className="label">Entidad / Departamento Solicitante</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Compliance / Dirección Jurídica / Solicitante Privado]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Lugar de Obtención (Dirección)</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Lugar de Obtención (Dirección)]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Coordenadas GPS (Latitud / Longitud)</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[ej. 9.9324° N, 69.6083° W]</span>
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
        <div className="section-title">II. Forma de Obtención (MUCC-2017 — Consignación Privada)</div>
        <div className="form-group">
          <div className="checkbox-group" style={{ flexDirection: 'row', gap: '15px' }}>
            <div className="check-item"><span className="box">X</span> <strong>CONSIGNACIÓN DIRECTA (ENTREGA VOLUNTARIA)</strong></div>
            <div className="check-item"><span className="box"></span> TÉCNICA (Análisis Pericial Interno)</div>
            <div className="check-item"><span className="box"></span> DERIVACIÓN CORPORATIVA</div>
          </div>
          <div style={{ fontSize: '7.5pt', color: '#666', fontStyle: 'italic', marginTop: '3px' }}>
            *Nota: Como laboratorio de informática forense privado, la obtención de evidencias se realiza exclusivamente mediante consignación voluntaria del titular, representante o custodio autorizado.
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
            <div className="checkbox-group" style={{ marginTop: '6px', gap: '8px', fontSize: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Rol:</span>
              <div className="check-item"><span className="box"></span> DEFR (1er Respondedor)</div>
              <div className="check-item"><span className="box"></span> DES (Especialista)</div>
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
            <div className="checkbox-group" style={{ marginTop: '6px', gap: '8px', fontSize: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Rol:</span>
              <div className="check-item"><span className="box"></span> DEFR (1er Respondedor)</div>
              <div className="check-item"><span className="box"></span> DES (Especialista)</div>
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

      {/*  SECCIÓN IV  */}
      <div className="section">
        <div className="section-title">IV. Descripción de la Evidencia Digital Consignada ({tipoEvidencia === 'movil' ? 'Móvil' : 'Computador'})</div>
        
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Tipo de Dispositivo</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '15px', fontSize: '9px' }}>
                    <div className="check-item"><span className="box"></span> Teléfono Móvil Android</div>
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
                <td>Estado de Volatilidad</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                    <div className="check-item"><span className="box"></span> Encendido</div>
                    <div className="check-item"><span className="box"></span> Apagado</div>
                    <div className="check-item"><span className="box"></span> Suspensión / Bloqueado</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>N° Precinto / Sello de Seguridad</td>
                <td>
                  <span contentEditable suppressContentEditableWarning className="placeholder-field" style={{ borderBottom: '1px dashed #ccc', minWidth: '100px', display: 'inline-block' }}>[N° Precinto]</span>
                  <div className="checkbox-group" style={{ display: 'inline-flex', marginLeft: '12px', gap: '8px', fontSize: '8.5px' }}>
                    <span>Estado:</span>
                    <div className="check-item"><span className="box"></span> Intacto</div>
                    <div className="check-item"><span className="box"></span> Alterado</div>
                    <div className="check-item"><span className="box"></span> N/A</div>
                  </div>
                </td>
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
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Tipo de Dispositivo</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '15px', fontSize: '9px' }}>
                    <div className="check-item"><span className="box"></span> Computador de Escritorio / Servidor</div>
                    <div className="check-item"><span className="box"></span> Computador Portátil (Laptop)</div>
                    <div className="check-item"><span className="box"></span> Unidad de Almacenamiento Externa</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Marca / Modelo del Equipo</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : <span className="placeholder-field">[Marca / Modelo del Computador]</span>}
                </td>
              </tr>
              <tr>
                <td>Número de Serie del Equipo</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_imei ? c.dispositivo_imei : <span className="placeholder-field">[Serial del Equipo / Placa]</span>}
                </td>
              </tr>
              <tr>
                <td>Disco Duro (Marca / Modelo)</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.discoduro_marca || c.discoduro_modelo ? `${c.discoduro_marca || ''} ${c.discoduro_modelo || ''}`.trim() : <span className="placeholder-field">[Marca y Modelo del Disco Interno (ej. Western Digital HDD)]</span>}
                </td>
              </tr>
              <tr>
                <td>Capacidad del Disco Duro</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.discoduro_capacidad ? c.discoduro_capacidad : <span className="placeholder-field">[Capacidad (ej: 1 TB / 240 GB)]</span>}
                </td>
              </tr>
              <tr>
                <td>Número de Serie del Disco</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.discoduro_serial ? c.discoduro_serial : <span className="placeholder-field">[S/N del Disco Duro]</span>}
                </td>
              </tr>
              <tr>
                <td>Unidades USB / Tarjetas SD</td>
                <td contentEditable suppressContentEditableWarning>
                  <span className="placeholder-field">[Memorias USB / Tarjetas SD (Marca, Modelo, Capacidad, Serial)]</span>
                </td>
              </tr>
              <tr>
                <td>Estado Físico del Equipo</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                    <div className="check-item"><span className="box"></span> Operativo</div>
                    <div className="check-item"><span className="box"></span> Pantalla rota / Daños</div>
                    <div className="check-item"><span className="box"></span> Faltan Piezas / Cables</div>
                    <div className="check-item"><span className="box"></span> Carcasa Quebrada</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Aislamiento Aplicado</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                    <div className="check-item"><span className="box"></span> Bolsa Faraday / Antiestática</div>
                    <div className="check-item"><span className="box"></span> Desconectado de Red LAN/WiFi</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Estado de Volatilidad</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                    <div className="check-item"><span className="box"></span> Encendido</div>
                    <div className="check-item"><span className="box"></span> Apagado</div>
                    <div className="check-item"><span className="box"></span> Suspensión / Hibernación</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>N° Precinto de Seguridad</td>
                <td>
                  <span contentEditable suppressContentEditableWarning className="placeholder-field" style={{ borderBottom: '1px dashed #ccc', minWidth: '100px', display: 'inline-block' }}>[N° Precinto]</span>
                  <div className="checkbox-group" style={{ display: 'inline-flex', marginLeft: '12px', gap: '8px', fontSize: '8.5px' }}>
                    <span>Estado:</span>
                    <div className="check-item"><span className="box"></span> Intacto</div>
                    <div className="check-item"><span className="box"></span> Alterado</div>
                    <div className="check-item"><span className="box"></span> N/A</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Tipo de Embalaje</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                    <div className="check-item"><span className="box"></span> Caja de Cartón Rígida</div>
                    <div className="check-item"><span className="box"></span> Sobre plástico de seguridad</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Accesorios / Cables / Fuentes</td>
                <td contentEditable suppressContentEditableWarning><span className="placeholder-field">[Fuentes de Poder, Cables de Red, Cargador, Estuche]</span></td>
              </tr>
            </tbody>
          </table>
        )}
        <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '9px' }}>
          ¿Continúa en Anexo A? <span className="box"></span> SI <span className="box"></span> NO
        </div>
      </div>

      {/*  SECCIÓN V  */}
      <div className="section">
        <div className="section-title">V. Recepción de la Evidencia — Consignación Voluntaria (MUCC-2017 Obtención por Consignación)</div>
        <table border={1} cellSpacing={0} cellPadding={6} className="transfer-table">
          <tbody>
            <tr>
              <td style={{ width: '30%', verticalAlign: 'top' }}>
                <div className="label">Motivo de la Consignación</div>
                <div className="checkbox-group" style={{ flexDirection: 'column', gap: '4px', fontSize: '8px' }}>
                  <div className="check-item"><span className="box"></span> PERITAJE — Análisis Forense</div>
                  <div className="check-item"><span className="box"></span> RESGUARDO</div>
                </div>
                <div className="label" style={{ marginTop: '8px' }}>Condiciones de Resguardo</div>
                <div className="checkbox-group" style={{ flexDirection: 'column', gap: '4px', fontSize: '7.5px' }}>
                  <div className="check-item"><span className="box"></span> Temp. Controlada</div>
                  <div className="check-item"><span className="box"></span> Humedad Controlada</div>
                  <div className="check-item"><span className="box"></span> Libre de Magnetismo</div>
                </div>
              </td>
              <td style={{ width: '35%', verticalAlign: 'top' }}>
                <div className="sig-detail-card" style={{ minHeight: 'auto', border: 'none', padding: '0', background: 'transparent', gap: '4px' }}>
                  <div className="label">ENTREGA (Consignante)</div>
                  <div className="fingerprint-row" style={{ marginTop: '4px', paddingBottom: '4px' }}>
                    <div className="thumb-wrapper">
                      <div className="thumb-box" />
                      <span className="thumb-label">PULGAR DER.</span>
                    </div>
                    <div className="thumb-wrapper">
                      <div className="thumb-box" />
                      <span className="thumb-label">PULGAR IZQ.</span>
                    </div>
                  </div>
                  <div className="sig-line" style={{ height: '24px' }} />
                  <div className="sig-line-label" style={{ fontSize: '7px' }}>Firma del Consignante</div>
                  <div style={{ fontSize: '9px', marginTop: '4px', marginBottom: '4px' }}>Nombre: <span style={{ fontWeight: 'bold' }} contentEditable suppressContentEditableWarning>{c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Nombre]</span>}</span></div>
                  <div className="sig-field" style={{ fontSize: '8px' }}>
                    C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning style={{ minHeight: '16px' }}>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula]</span>}</span>
                  </div>
                  <div className="sig-field" style={{ fontSize: '8px' }}>
                    Teléfono: <span className="sig-underline" contentEditable suppressContentEditableWarning style={{ minHeight: '16px' }}>{c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono]</span>}</span>
                  </div>
                </div>
              </td>
              <td style={{ width: '35%', verticalAlign: 'top' }}>
                <div className="sig-detail-card" style={{ minHeight: 'auto', border: 'none', padding: '0', background: 'transparent', gap: '4px' }}>
                  <div className="label">RECIBE (Perito Informático)</div>
                  <div className="fingerprint-row" style={{ marginTop: '4px', paddingBottom: '4px' }}>
                    <div className="thumb-wrapper">
                      <div className="thumb-box" />
                      <span className="thumb-label">PULGAR DER.</span>
                    </div>
                    <div className="thumb-wrapper">
                      <div className="thumb-box" />
                      <span className="thumb-label">PULGAR IZQ.</span>
                    </div>
                  </div>
                  <div className="sig-line" style={{ height: '24px' }} />
                  <div className="sig-line-label" style={{ fontSize: '7px' }}>Firma del Perito Informático</div>
                  <div style={{ fontSize: '9px', marginTop: '4px', marginBottom: '4px' }}>Nombre: <span style={{ fontWeight: 'bold' }} contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito]</span>}</span></div>
                  <div className="sig-field" style={{ fontSize: '8px' }}>
                    C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning style={{ minHeight: '16px' }}><span className="placeholder-field">[Cédula]</span></span>
                  </div>
                  <div className="sig-field" style={{ fontSize: '8px' }}>
                    CIV N°: <span className="sig-underline" contentEditable suppressContentEditableWarning style={{ minHeight: '16px' }}><span className="placeholder-field">[N° CIV]</span></span>
                  </div>
                  <div className="sig-field" style={{ fontSize: '8px' }}>
                    INPREABOGADO: <span className="sig-underline" contentEditable suppressContentEditableWarning style={{ minHeight: '16px' }}><span className="placeholder-field">[Inpreabogado]</span></span>
                  </div>
                  <div className="sig-field" style={{ fontSize: '8px' }}>
                    Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning style={{ minHeight: '16px' }}><span className="placeholder-field">[Cargo]</span></span>
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
          en pleno uso de mis facultades, declaro que hago entrega voluntaria del dispositivo móvil/computador descrito en la Sección IV para su revisión técnica forense. 
          Autorizo al Laboratorio SHA256.US a realizar las pruebas técnicas necesarias sobre el equipo y su contenido digital, 
          conforme al <strong>Manual Único de Cadena de Custodia de Evidencias (MUCC-2017)</strong>, los <strong>Arts. 187 y 225 del COPP</strong>, 
          y la <strong>Ley sobre Mensajes de Datos y Firmas Electrónicas (Art. 4)</strong>. 
          Me comprometo a retirar el equipo una vez finalizado el peritaje, en un plazo no mayor a treinta (30) días continuos.
        </p>
      </div>

      {/* TABLA DE CONTINUIDAD DE LA CADENA DE CUSTODIA (MUCC-2017) */}
      <div className="section">
        <div className="section-title">VI. Continuidad de la Cadena de Custodia (Trazabilidad de Custodios)</div>
        <table border={1} cellSpacing={0} cellPadding={6} className="transfer-table" style={{ marginTop: '5px' }}>
          <thead>
            <tr className="transfer-header">
              <th style={{ border: '1px solid #1d1d1f', padding: '4px 6px', fontSize: '8pt', width: '12%', textAlign: 'left' }}>Fecha / Hora</th>
              <th style={{ border: '1px solid #1d1d1f', padding: '4px 6px', fontSize: '8pt', width: '24%', textAlign: 'left' }}>Entregado Por (Remitente)</th>
              <th style={{ border: '1px solid #1d1d1f', padding: '4px 6px', fontSize: '8pt', width: '24%', textAlign: 'left' }}>Recibido Por (Receptor)</th>
              <th style={{ border: '1px solid #1d1d1f', padding: '4px 6px', fontSize: '8pt', width: '20%', textAlign: 'left' }}>Motivo del Traspaso</th>
              <th style={{ border: '1px solid #1d1d1f', padding: '4px 6px', fontSize: '8pt', width: '20%', textAlign: 'left' }}>Firmas / Huellas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontSize: '8pt', height: '48px', verticalAlign: 'middle' }} contentEditable suppressContentEditableWarning></td>
              <td style={{ fontSize: '8pt', verticalAlign: 'top' }} contentEditable suppressContentEditableWarning>Nombres:<br />C.I.:</td>
              <td style={{ fontSize: '8pt', verticalAlign: 'top' }} contentEditable suppressContentEditableWarning>Nombres:<br />C.I.:</td>
              <td style={{ fontSize: '8pt', verticalAlign: 'top' }} contentEditable suppressContentEditableWarning>Traslado para análisis forense en laboratorio</td>
              <td style={{ fontSize: '7.5pt', textAlign: 'center', verticalAlign: 'middle' }}>Entregué: __________<br />Recibí:  __________</td>
            </tr>
            <tr>
              <td style={{ fontSize: '8pt', height: '48px', verticalAlign: 'middle' }} contentEditable suppressContentEditableWarning></td>
              <td style={{ fontSize: '8pt', verticalAlign: 'top' }} contentEditable suppressContentEditableWarning>Nombres:<br />C.I.:</td>
              <td style={{ fontSize: '8pt', verticalAlign: 'top' }} contentEditable suppressContentEditableWarning>Nombres:<br />C.I.:</td>
              <td style={{ fontSize: '8pt', verticalAlign: 'top' }} contentEditable suppressContentEditableWarning>Resguardo y custodia en bóveda de evidencias</td>
              <td style={{ fontSize: '7.5pt', textAlign: 'center', verticalAlign: 'middle' }}>Entregué: __________<br />Recibí:  __________</td>
            </tr>
          </tbody>
        </table>
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
