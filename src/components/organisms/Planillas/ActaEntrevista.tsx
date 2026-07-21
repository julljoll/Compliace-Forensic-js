import { useState } from 'react';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
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
          <h1 className="acta-title">Acta de Entrevista de Testigo / Víctima</h1>
          <div className="acta-nro">
            N° EXPEDIENTE: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}</span>
          </div>
        </div>
      </header>

      {/* DATOS DE LA ENTREVISTA */}
      <div className="section">
        <div className="section-title">Datos del Procedimiento (Entrevista)</div>
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          <div className="form-group">
            <div className="label">Lugar de la Entrevista</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ fontSize: '9.5pt' }}>
              <span className="placeholder-field">[Quíbor, Lara — SHA256.US]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Fecha de Entrevista</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ fontSize: '9.5pt' }}>
              <span className="placeholder-field">[DD/MM/AAAA]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Hora Inicio</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ fontSize: '9.5pt' }}>
              <span className="placeholder-field">[HH:MM]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Hora Término</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ fontSize: '9.5pt' }}>
              <span className="placeholder-field">[HH:MM]</span>
            </div>
          </div>
        </div>
      </div>

      {/* I. IDENTIFICACIÓN DEL ENTREVISTADO */}
      <div className="section">
        <div className="section-title">I. Datos e Identificación del Entrevistado</div>
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <div className="label">Apellidos y Nombres</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ fontSize: '9.5pt' }}>
              {c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Apellidos y Nombres]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">Cédula / Pasaporte</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ fontSize: '9.5pt' }}>
              {c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">Teléfono Contacto</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ fontSize: '9.5pt' }}>
              {c.dispositivo_numero_tel ? c.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono]</span>}
            </div>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <div className="label">Correo Electrónico</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ fontSize: '9.5pt' }}>
              {c.correo_investigar ? c.correo_investigar : <span className="placeholder-field">[Correo Electrónico]</span>}
            </div>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <div className="label">Dirección de Habitación Habitual</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ fontSize: '9.5pt' }}>
              <span className="placeholder-field">[Dirección de Habitación]</span>
            </div>
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '5px', padding: '4px 8px' }}>
          <div className="label">Condición / Rol en la Investigación</div>
          <div className="checkbox-group" style={{ flexDirection: 'row', gap: '12px', fontSize: '8.5pt' }}>
            <div className="check-item"><span className="box"></span> Víctima</div>
            <div className="check-item"><span className="box"></span> Testigo / Denunciante</div>
            <div className="check-item"><span className="box"></span> Propietario de la Evidencia</div>
            <div className="check-item"><span className="box"></span> Poseedor / Consignatario</div>
          </div>
        </div>
      </div>

      {/* Conmutador interactivo Cyber-Legal Blueprint MUI v6 (Solo en pantalla) */}
      <Box className="no-print" sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, backgroundColor: '#1E1800', border: '1px solid rgba(254, 207, 6, 0.3)', borderRadius: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#FECF06', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          TIPO DE EVIDENCIA:
        </span>
        <ToggleButtonGroup
          value={tipoEvidencia}
          exclusive
          onChange={(_, nextValue) => {
            if (nextValue) setTipoEvidencia(nextValue);
          }}
          size="small"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(254, 207, 6, 0.2)',
            '& .MuiToggleButton-root': {
              color: '#AEAEB2',
              fontSize: '11px',
              fontWeight: 700,
              px: 2,
              py: 0.5,
              textTransform: 'none',
              border: 'none',
              '&.Mui-selected': {
                backgroundColor: '#FECF06',
                color: '#000000',
                '&:hover': { backgroundColor: '#e0b700' },
              },
            },
          }}
        >
          <ToggleButton value="movil">
            <SmartphoneIcon sx={{ fontSize: 16, mr: 0.8 }} /> Dispositivo Móvil
          </ToggleButton>
          <ToggleButton value="computadora">
            <LaptopMacIcon sx={{ fontSize: 16, mr: 0.8 }} /> Computador / Almacenamiento
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* II. RELACIÓN DEL DISPOSITIVO Y CUENTAS ASOCIADAS */}
      <div className="section">
        <div className="section-title">II. Relación del Dispositivo y Cuentas de Interés Forense</div>
        
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={4} className="evidence-table" style={{ fontSize: '9.5pt' }}>
            <tbody>
              <tr>
                <td style={{ padding: '3px 8px' }}>Marca del Dispositivo Móvil</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">{c.dispositivo_marca ? c.dispositivo_marca : '[Marca (ej: Samsung, Xiaomi, Apple)]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Modelo del Dispositivo Móvil</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">{c.dispositivo_modelo ? c.dispositivo_modelo : '[Modelo (ej: Galaxy A54, iPhone 13)]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Serial / IMEI (IMEI 1 / IMEI 2)</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">{c.dispositivo_imei ? c.dispositivo_imei : '[Número IMEI / Serial]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Número Telefónico de la Línea</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">{c.dispositivo_numero_tel ? c.dispositivo_numero_tel : '[Nro. Telefónico (+58...)]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Operadora de Servicio de Telecomunicaciones</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">[Operadora (ej: Movistar, Digitel, Movilnet)]</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Cuentas / Aplicaciones de Interés Forense</td>
                <td style={{ padding: '3px 8px' }}>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px' }}>
                    <div className="check-item"><span className="box"></span> WhatsApp</div>
                    <div className="check-item"><span className="box"></span> Telegram</div>
                    <div className="check-item"><span className="box"></span> Correo Electrónico</div>
                    <div className="check-item"><span className="box"></span> Redes Sociales</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Cuenta / ID de la Aplicación Específica</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">[Indique la Cuenta, Nombre de Usuario o ID de la Aplicación a investigar]</strong>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={4} className="evidence-table" style={{ fontSize: '9.5pt' }}>
            <tbody>
              <tr>
                <td style={{ padding: '3px 8px' }}>Marca del Computador / Equipo</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">{c.dispositivo_marca ? c.dispositivo_marca : '[Marca del Computador (ej: HP, Dell, Lenovo)]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Modelo del Computador / Equipo</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">{c.dispositivo_modelo ? c.dispositivo_modelo : '[Modelo del Equipo]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Serial del Equipo / PC</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">{c.dispositivo_imei ? c.dispositivo_imei : '[Serial del Computador / Chasis]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Tipo de Unidad de Almacenamiento</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">{c.discoduro_marca || c.discoduro_modelo ? `${c.discoduro_marca || ''} ${c.discoduro_modelo || ''}`.trim() : '[Tipo de Disco (ej: SSD NVMe, HDD SATA, USB)]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Capacidad de la Unidad de Almacenamiento</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">{c.discoduro_capacidad ? c.discoduro_capacidad : '[Capacidad de Almacenamiento (ej: 512 GB / 1 TB)]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Serial de la Unidad de Disco Duro / USB</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">{c.discoduro_serial ? c.discoduro_serial : '[Serial S/N del Disco o Memoria]'}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Servicios / Cuentas de Interés Forense</td>
                <td style={{ padding: '3px 8px' }}>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px' }}>
                    <div className="check-item"><span className="box"></span> Correo Corporativo</div>
                    <div className="check-item"><span className="box"></span> Historial de Navegación</div>
                    <div className="check-item"><span className="box"></span> Archivos del Sistema</div>
                    <div className="check-item"><span className="box"></span> Registros de Eventos (Logs)</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '3px 8px' }}>Ruta / Carpeta / ID de Cuenta Específica</td>
                <td style={{ padding: '3px 8px' }} contentEditable suppressContentEditableWarning>
                  <strong className="placeholder-field">[Indique la Ruta de Directorio, Correo o ID de Usuario Específico a examinar]</strong>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* III. FUNDAMENTACIÓN LEGAL Y CONSENTIMIENTO INFORMADO (EN PÁGINA SIGUIENTE) */}
      <div className="section" style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '10px' }}>
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
          <div className="sig-line-label">Firma del Entrevistado</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
            C.I. N°: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[C.I. del Entrevistado]</span>}</span>
          </div>
          <div className="sig-field">
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Nombre del Entrevistado]</span>}</span>
          </div>
        </div>
        <div className="sig-detail-card">
          <div className="sig-detail-label">PERITO FORENSE RECEPTOR</div>
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
          <div className="sig-line-label">Firma del Experto Forense</div>
          <div className="sig-field" style={{ marginTop: '8px' }}>
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
