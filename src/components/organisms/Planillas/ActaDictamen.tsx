import { useState } from 'react';
import { CasoCMS } from '../../../store/cmsStore';

interface ActaDictamenProps {
  caso?: CasoCMS;
}

export default function ActaDictamen({ caso }: ActaDictamenProps) {
  const fallbackCaso = {
    numeroCaso: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
    dispositivo_numero_tel: '',
    dispositivo_sim_card: '',
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
          <h1 className="acta-title">Dictamen Pericial Informático</h1>
          <div className="acta-nro">
            N° CAUSA / EXPEDIENTE: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}</span>
          </div>
        </div>
      </header>

      {/*  I. IDENTIFICACIÓN DEL EXPERTO  */}
      <div className="section">
        <div className="section-title">I. Identificación del Perito Forense Actuante</div>
        <div className="grid-container">
          <div className="form-group">
            <div className="label">Nombres y Apellidos</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              {c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito Forense]</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="label">Cédula de Identidad</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[C.I. del Perito]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Título / Acreditación Académica</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[ej: Ingeniero de Computación / Lic. en Informática]</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">Acreditación Forense / N° Perito</div>
            <div className="value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[ej: Perito Judicial Acreditado N° 5192-TSJ]</span>
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

      {/*  II. IDENTIFICACIÓN DE LA EVIDENCIA  */}
      <div className="section">
        <div className="section-title">II. Identificación de la Evidencia Técnica Examinada</div>
        
        {tipoEvidencia === 'movil' ? (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Evidencia Digital</td>
                <td contentEditable suppressContentEditableWarning>
                  Teléfono Móvil: <strong className="placeholder-field">{c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : '[Marca / Modelo]'}</strong>
                </td>
              </tr>
              <tr>
                <td>Serial / IMEI 1</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_imei ? c.dispositivo_imei : <span className="placeholder-field">[IMEI / S/N]</span>}
                </td>
              </tr>
              <tr>
                <td>Línea / SIM Card</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_numero_tel ? `${c.dispositivo_numero_tel} (SIM: ${c.dispositivo_sim_card || ''})` : <span className="placeholder-field">[Nro. Telefónico / SIM]</span>}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
            <tbody>
              <tr>
                <td>Computador Examinado</td>
                <td contentEditable suppressContentEditableWarning>
                  Equipo: <strong className="placeholder-field">{c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : '[HP, Dell Laptop]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Serial: <strong className="placeholder-field">{c.dispositivo_imei ? c.dispositivo_imei : '[Serial Placa/Equipo]'}</strong>
                </td>
              </tr>
              <tr>
                <td>Unidad de Disco Duro</td>
                <td contentEditable suppressContentEditableWarning>
                  Marca/Modelo: <strong className="placeholder-field">{c.discoduro_marca || c.discoduro_modelo ? `${c.discoduro_marca || ''} ${c.discoduro_modelo || ''}`.trim() : '[Marca y Modelo]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Capacidad: <strong className="placeholder-field">{c.discoduro_capacidad ? c.discoduro_capacidad : '[ej: 500 GB]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; S/N: <strong className="placeholder-field">{c.discoduro_serial ? c.discoduro_serial : '[Serial Disco]'}</strong>
                </td>
              </tr>
              <tr>
                <td>Memorias Externas / USB</td>
                <td contentEditable suppressContentEditableWarning>
                  <span className="placeholder-field">[Memorias USB / SD peritadas (Marca, Capacidad, Serial)]</span>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/*  III. METODOLOGÍA Y HERRAMIENTAS APLICADAS  */}
      <div className="section">
        <div className="section-title">III. Metodología Científica y Herramientas Forenses</div>
        <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
          <tbody>
            <tr>
              <td>Estándares Técnicos</td>
              <td>
                <div className="checkbox-group" style={{ flexDirection: 'column', gap: '4px' }}>
                  <div className="check-item"><span className="box"></span> <strong>ISO/IEC 27037:2012:</strong> Directrices para identificación, colección y adquisición forense.</div>
                  <div className="check-item"><span className="box"></span> <strong>ISO/IEC 27042:2015:</strong> Directrices para análisis e interpretación de evidencia digital.</div>
                  <div className="check-item"><span className="box"></span> <strong>NIST SP 800-101:</strong> Guidelines on Mobile Device Forensics.</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Software Utilizado</td>
              <td>
                <div className="checkbox-group" style={{ flexDirection: 'column', gap: '4px' }}>
                  <div className="check-item"><span className="box"></span> Andriller / ALEAPP / IPED Forensics (Adquisición, Triaje y Análisis Completo)</div>
                  <div className="check-item"><span className="box"></span> FTK Imager (Verificación de Integridad y Clonado Bit a Bit)</div>
                  <div className="check-item"><span className="box"></span> AVILLA Forensics (Adquisición/Extracción Forense Móvil)</div>
                  <div className="check-item"><span className="box"></span> Samurai Linux / PALADIN (Respuesta a Incidentes y Adquisición en Campo)</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/*  IV. INTEGRIDAD CRYPTOGRÁFICA  */}
      <div className="section">
        <div className="section-title">IV. Tabla de Integridad Forense (Firmas Hash)</div>
        <table border={1} cellSpacing={0} cellPadding={8} className="evidence-table">
          <tbody>
            <tr className="transfer-header">
              <th style={{ border: '1px solid #1d1d1f', padding: '4px 6px', fontSize: '9.5pt', width: '35%', textAlign: 'left' }}>Medio / Imagen Obtenida</th>
              <th style={{ border: '1px solid #1d1d1f', padding: '4px 6px', fontSize: '9.5pt', width: '45%', textAlign: 'left' }}>Valor Hash SHA-256 (Inalterable)</th>
              <th style={{ border: '1px solid #1d1d1f', padding: '4px 6px', fontSize: '9.5pt', width: '20%', textAlign: 'left' }}>Algoritmo Auxiliar (MD5)</th>
            </tr>
            <tr>
              <td>Adquisición Bit a Bit (Original)</td>
              <td contentEditable suppressContentEditableWarning style={{ fontSize: '9px', fontFamily: 'monospace' }}><span className="placeholder-field">[Hash SHA-256 Original (64 hex)]</span></td>
              <td contentEditable suppressContentEditableWarning style={{ fontSize: '9px', fontFamily: 'monospace' }}><span className="placeholder-field">[Hash MD5]</span></td>
            </tr>
            <tr>
              <td>Copia de Trabajo (Análisis)</td>
              <td contentEditable suppressContentEditableWarning style={{ fontSize: '9px', fontFamily: 'monospace' }}><span className="placeholder-field">[Hash SHA-256 Copia (debe coincidir con original)]</span></td>
              <td contentEditable suppressContentEditableWarning style={{ fontSize: '9px', fontFamily: 'monospace' }}><span className="placeholder-field">[Hash MD5]</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/*  V. EXÁMENES Y NARRATIVA TÉCNICA  */}
      <div className="section">
        <div className="section-title">V. Exámenes Practicados y Hallazgos Forenses</div>
        <div className="form-group examenes-value" contentEditable suppressContentEditableWarning style={{ minHeight: '60px' }}>
          <span className="placeholder-field">[Detalle aquí las operaciones técnicas de análisis de archivos, recuperación de borrados, logs de chat y extracción practicada]</span>
        </div>
      </div>

      {/*  VI. CONCLUSIONES  */}
      <div className="section">
        <div className="section-title">VI. Conclusiones y Fundamentación Jurídica (Consignación Voluntaria Privada)</div>
        <div className="legal-text">
          Las operaciones técnicas sobre la evidencia obtenida mediante <strong>Consignación Voluntaria Privada</strong> se realizaron en estricto apego al <strong>Manual Único de Cadena de Custodia de Evidencias (MUCC-2017)</strong> y el <strong>Artículo 187 del COPP</strong>, resguardando la trazabilidad del medio digital. La correspondencia exacta de los valores hash SHA-256 en las etapas de adquisición, duplicado de trabajo y dictamen (ISO/IEC 27037:2012 e ISO/IEC 27042:2015) garantiza científicamente la inalterabilidad de los datos. Los elementos probatorios extraídos gozan de plena validez conforme al <strong>Artículo 4 de la Ley sobre Mensajes de Datos y Firmas Electrónicas</strong> (Eficacia Probatoria) y los tipos de la <strong>Ley Especial contra los Delitos Informáticos</strong>.
        </div>
        <div className="form-group conclusiones-value" contentEditable suppressContentEditableWarning style={{ minHeight: '60px', marginTop: '6px' }}>
          <strong className="placeholder-field">CONCLUSIONES DEFINITIVAS: [Indique de manera taxativa las conclusiones forenses del peritaje informático]</strong>
        </div>
      </div>

      {/*  VII. DECLARACIÓN JURADA Y CIERRE FORMAL  */}
      <div className="section">
        <div className="section-title">VII. Declaración Jurada y Cierre Formal del Perito</div>
        <div className="legal-text">
          Declaro bajo juramento de ley, con plena conciencia y responsabilidad científica, que he procedido con absoluta imparcialidad, objetividad y apego a las técnicas criminalísticas de la informática forense. Que los hechos y resultados reportados corresponden fielmente a los hallazgos extraídos del dispositivo/computador examinado.
        </div>
        <div style={{ marginTop: '10px', fontSize: '11pt' }} contentEditable suppressContentEditableWarning>
          Se expide y firma el presente dictamen pericial en la ciudad de Quíbor, Estado Lara, a los <span className="placeholder-field">[Día]</span> días del mes de <span className="placeholder-field">[Mes]</span> del año <span className="placeholder-field">[Año]</span>.
        </div>
      </div>

      {/*  FIRMAS  */}
      <div className="signature-section" style={{ gap: '14mm', marginTop: '8mm' }}>
        <div className="sig-detail-card" style={{ gridColumn: 'span 2', maxWidth: '350px', margin: '0 auto' }}>
          <div className="sig-detail-label">PERITO FORENSE ACTUANTE</div>
          <div className="sig-line" />
          <div className="sig-line-label">Firma del Experto Forense</div>
          <div className="sig-field">
            Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito]</span>}</span>
          </div>
          <div className="sig-field">
            C.I. / Credencial: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[C.I. del Perito]</span></span>
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
