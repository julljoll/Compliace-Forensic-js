import { useState } from 'react';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import { CasoCMS } from '../../../store/cmsStore';

interface ActaObtencionProps {
  caso?: CasoCMS;
  tipoEvidencia?: 'movil' | 'computadora';
}

export default function ActaObtencion({ caso, tipoEvidencia: externalTipoEvidencia }: ActaObtencionProps) {
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
    peritoLider: '',
    tipoProyecto: '',
    discoduro_serial: '',
    discoduro_capacidad: '',
    discoduro_marca: '',
    discoduro_modelo: '',
  };

  const c = caso || fallbackCaso;
  const [internalTipoEvidencia] = useState<'movil' | 'computadora'>(
    c.tipoProyecto === 'forense_discoduro' ? 'computadora' : 'movil'
  );
  const tipoEvidencia = externalTipoEvidencia || internalTipoEvidencia;

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
        <div className="section-title">I. Datos e Identificación del Consignante (Entrega Voluntaria)</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Apellidos y Nombres</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Apellidos y Nombres del Consignante]</span>}
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
            <div className="label">Dirección de Habitación / Sede</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Dirección del Consignante]</span>
            </div>
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '5px' }}>
          <div className="label">Condición Jurídica / Carácter del Consignante (Marque la que corresponda)</div>
          <div className="checkbox-group" style={{ flexDirection: 'row', gap: '12px', fontSize: '8.5px' }}>
            <div className="check-item"><span className="box"></span> Propietario Legítimo / Personal</div>
            <div className="check-item"><span className="box"></span> Representante Legal (con Poder / RIF)</div>
            <div className="check-item"><span className="box"></span> Custodio / Asignatario Corporativo (Empleado)</div>
            <div className="check-item"><span className="box"></span> Poseedor / Tercero Autorizado</div>
          </div>
        </div>
      </div>



      {/*  II. DESCRIPCIÓN DEL DISPOSITIVO  */}
      <div className="section">
        <div className="section-title">II. Descripción Técnica de la Evidencia ({tipoEvidencia === 'movil' ? 'Dispositivo Móvil' : 'Computador / Almacenamiento'})</div>
        
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
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
                <td>Precinto de Seguridad</td>
                <td>
                  N°: <span contentEditable suppressContentEditableWarning className="placeholder-field" style={{ borderBottom: '1px dashed #ccc', minWidth: '80px', display: 'inline-block' }}>[Precinto]</span>
                  &nbsp;&nbsp;&nbsp;&nbsp; Estado:
                  <div className="checkbox-group" style={{ display: 'inline-flex', marginLeft: '8px', gap: '8px', fontSize: '8.5px' }}>
                    <div className="check-item"><span className="box"></span> Intacto</div>
                    <div className="check-item"><span className="box"></span> Alterado</div>
                    <div className="check-item"><span className="box"></span> N/A</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
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
                <td>Precinto de Seguridad</td>
                <td>
                  N°: <span contentEditable suppressContentEditableWarning className="placeholder-field" style={{ borderBottom: '1px dashed #ccc', minWidth: '80px', display: 'inline-block' }}>[Precinto]</span>
                  &nbsp;&nbsp;&nbsp;&nbsp; Estado:
                  <div className="checkbox-group" style={{ display: 'inline-flex', marginLeft: '8px', gap: '8px', fontSize: '8.5px' }}>
                    <div className="check-item"><span className="box"></span> Intacto</div>
                    <div className="check-item"><span className="box"></span> Alterado</div>
                    <div className="check-item"><span className="box"></span> N/A</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/*  III. REGISTRO DE INTEGRIDAD CRIPTOGRÁFICA DE RECEPCIÓN (ISO/IEC 27037:2012 / MUCC-2017)  */}
      <div className="section">
        <div className="section-title">III. Registro de Integridad Forense Inicial (Hash SHA-256 de Consignación)</div>
        <table border={1} cellSpacing={0} cellPadding={6} className="evidence-table">
          <tbody>
            <tr>
              <td style={{ width: '30%', fontWeight: 'bold' }}>Hash SHA-256 Inicial (Adquisición / Medio)</td>
              <td contentEditable suppressContentEditableWarning style={{ fontSize: '9px', fontFamily: 'monospace' }}>
                <span className="placeholder-field">[Valor Hash SHA-256 de 64 caracteres hex generado al recibir/clonar]</span>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Algoritmo Auxiliar (MD5)</td>
              <td contentEditable suppressContentEditableWarning style={{ fontSize: '9px', fontFamily: 'monospace' }}>
                <span className="placeholder-field">[Valor Hash MD5]</span>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Herramienta / Software de Cálculo</td>
              <td contentEditable suppressContentEditableWarning>
                <span className="placeholder-field">[ej: FTK Imager / Guymager / HashMyFiles / Cellebrite / dd]</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/*  IV. AUTORIZACIÓN Y CONSENTIMIENTO DE CONSIGNACIÓN VOLUNTARIA  */}
      <div className="section">
        <div className="section-title">IV. Autorización y Consentimiento de Consignación Voluntaria (Sin Coacción)</div>
        <div className="legal-text">
          Yo, el consignante arriba identificado, en pleno uso de mis facultades mentales y actuando en mi nombre o en representación legítima de la entidad consignante, hago entrega material voluntaria (Obtención por Consignación Directa Privada) de la evidencia descrita conforme al <strong>Manual Único de Cadena de Custodia (MUCC-2017)</strong> y los <strong>Arts. 187 y 225 del COPP</strong>.
          Declaro bajo juramento que realizo esta consignación <strong>LIBRE DE TODA COACCIÓN, VIOLENCIA, DOLO, AMENAZA O CONSTREÑIMIENTO</strong>.
          <strong>AUTORIZO EXPRESA Y VOLUNTARIAMENTE</strong> al equipo pericial de SHA256.US para la extracción lógica/física de "Mensajes de Datos" (Art. 4, Ley sobre Mensajes de Datos y Firmas Electrónicas), duplicación pericial y análisis forense, delimitado al siguiente alcance:
        </div>
        <div className="form-group">
          <div className="label">Alcance de la Autorización (Marque uno)</div>
          <div className="checkbox-group" style={{ margin: '5px 0' }}>
            <div className="check-item"><span className="box"></span> <strong>ANÁLISIS TÉCNICO COMPLETO</strong> (Todo el contenido del dispositivo/computador)</div>
          </div>
          <div className="checkbox-group" style={{ margin: '5px 0' }}>
            <div className="check-item"><span className="box"></span> <strong>ANÁLISIS DELIMITADO</strong> (Únicamente chats de <strong>WHATSAPP</strong> / Archivos específicos)</div>
          </div>
          <div style={{ marginTop: '8px', padding: '8px', border: '1px dashed #1d1d1f', backgroundColor: '#fafafa' }}>
            <div className="label" style={{ fontSize: '8pt', color: '#1d1d1f', fontWeight: 'bold' }}>
              ESPECIFICACIÓN DE ELEMENTOS A VERIFICAR (Chat, Teléfono/Contacto, Nota de Voz, Imagen o Archivo Específico):
            </div>
            <div contentEditable suppressContentEditableWarning style={{ minHeight: '80px', padding: '6px', fontSize: '10pt', lineHeight: '22px' }}>
              <span className="placeholder-field">[Indique detalladamente el chat/contacto, notas de voz, imágenes o fechas específicas a verificar]</span>
              <div className="dotted-line"></div>
              <div className="dotted-line"></div>
              <div className="dotted-line"></div>
            </div>
          </div>
        </div>
      </div>

      {/*  V. REQUERIMIENTOS DE ACCESO  */}
      <div className="section">
        <div className="section-title">V. Requerimientos de Acceso y Preservación</div>
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

      {/*  VI. MOTIVO DE LA CONSIGNACIÓN (EN PÁGINA SIGUIENTE)  */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
        <div className="section-title">VI. Motivo de la Consignación y Pormenores de la Actuación</div>
        <div className="form-group motive-box" contentEditable suppressContentEditableWarning style={{ minHeight: '360px', padding: '12px', lineHeight: '24px' }}>
          <p style={{ margin: 0 }}>
            <span className="placeholder-field">{c.descripcion ? c.descripcion : '[Describa detalladamente el motivo, antecedentes y pormenores de la consignación de la evidencia digital]'}</span>
          </p>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
          <div className="dotted-line"></div>
        </div>
      </div>

      {/*  VII. FIRMAS  */}
      <div className="signature-section" style={{ gap: '14mm' }}>
        <div className="sig-detail-card">
          <div className="sig-detail-label">EL CONSIGNANTE</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0' }}>
            <div className="thumb-wrapper">
              <div className="thumb-box" />
              <span className="thumb-label">PULGAR DER.</span>
            </div>
            <div className="thumb-wrapper">
              <div className="thumb-box" />
              <span className="thumb-label">PULGAR IZQ.</span>
            </div>
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Consignante</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad del Consignante]</span>}</span>
          </div>
          <div className="sig-field">
            Teléfono: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Número de Teléfono]</span>}</span>
          </div>
        </div>
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO RECEPTOR</div>
          <div className="fingerprint-row" style={{ margin: '6px 0 10px 0' }}>
            <div className="thumb-wrapper">
              <div className="thumb-box" />
              <span className="thumb-label">PULGAR DER.</span>
            </div>
            <div className="thumb-wrapper">
              <div className="thumb-box" />
              <span className="thumb-label">PULGAR IZQ.</span>
            </div>
          </div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Perito Receptor</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre y Apellido del Perito]</span>}</span>
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
          <div className="checkbox-group" style={{ gap: '8px', fontSize: '8px', justifyContent: 'center', marginTop: '6px' }}>
            <span style={{ fontWeight: 'bold' }}>Rol ISO 27037:</span>
            <div className="check-item"><span className="box"></span> DEFR</div>
            <div className="check-item"><span className="box"></span> DES</div>
          </div>
        </div>
      </div>

      <div className="footer">
        Documento Oficial generado bajo los estándares de la Ley sobre Mensajes de Datos y Firmas Electrónicas, el Manual Único de Cadena de Custodia de Evidencias (MUCC-2017) y la norma ISO/IEC 27037:2012.<br />
        SHA256.US — Laboratorio de Informática Forense y Ciberseguridad | Consignación Privada y Cumplimiento Normativo.
      </div>
    </div>

    {/* Barra de Estado de Word (Solo pantalla) */}
    <div className="word-status-bar no-print">
      <div className="left-info">
        <div className="status-item">Página 1 de 2</div>
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
