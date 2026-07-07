import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import { downloadPlanillaZip } from './downloadPlanillaZip';
import PlanillaToolbar from '../../components/molecules/PlanillaToolbar';

const ActaEntregaResultadosPage = () => {
  const [searchParams] = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Manejador interactivo para marcar casillas con una "X" al hacer clic
    const handleCheckboxClick = (e: MouseEvent) => {
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

    document.addEventListener('click', handleCheckboxClick);
    return () => {
      document.removeEventListener('click', handleCheckboxClick);
    };
  }, []);

  const fallbackCaso = {
    numeroCaso: '',
    solicitante_nombre: '',
    solicitante_cedula: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
    dispositivo_numero_tel: '',
    peritoLider: 'Carlos Mendoza',
  };

  const c = caso || fallbackCaso;

  const camposRequeridos = [
    { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
    { valor: caso?.solicitante_nombre, nombre: 'Nombre del Consignante' },
    { valor: caso?.solicitante_cedula, nombre: 'Cédula del Consignante' },
    { valor: caso?.peritoLider, nombre: 'Nombre del Perito Forense' },
  ];

  const handlePrint = () => {
    const faltantes = camposRequeridos.filter(f => !f.valor || f.valor === 'N/A' || !f.valor.trim());
    if (faltantes.length > 0) {
      const confirmar = window.confirm(
        `Campos incompletos en el expediente:\n${faltantes.map(f => `• ${f.nombre}`).join('\n')}\n\n¿Desea proceder con la impresión para llenarla a mano?`
      );
      if (!confirmar) return;
    }
    window.print();
  };

  return (
    <div className="planilla-container">
      <div className="page">
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
            <h1 className="acta-title">Acta de Entrega de Resultados y Devolución de Dispositivo</h1>
            <div className="acta-nro">
              N° EXPEDIENTE: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}</span>
            </div>
          </div>
        </header>

        {/*  I. DATOS DEL CONSIGNANTE  */}
        <div className="section">
          <div className="section-title">I. Datos del Consignante</div>
          <div className="grid-container">
            <div className="form-group">
              <div className="label">Apellidos y Nombres</div>
              <div className="value" contentEditable suppressContentEditableWarning>
                {c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Apellidos y Nombres]</span>}
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
              <div className="label">Dirección</div>
              <div className="value" contentEditable suppressContentEditableWarning>
                <span className="placeholder-field">[Dirección de Habitación]</span>
              </div>
            </div>
          </div>
        </div>

        {/*  II. DATOS DEL CASO  */}
        <div className="section">
          <div className="section-title">II. Datos del Caso</div>
          <div className="grid-container">
            <div className="form-group">
              <div className="label">N° de Expediente / Caso</div>
              <div className="value" contentEditable suppressContentEditableWarning>
                {c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[N° de Expediente]</span>}
              </div>
            </div>
            <div className="form-group">
              <div className="label">N° PRCC</div>
              <div className="value" contentEditable suppressContentEditableWarning>
                <span className="placeholder-field">[N° PRCC]</span>
              </div>
            </div>
            <div className="form-group">
              <div className="label">N° Dictamen Pericial</div>
              <div className="value" contentEditable suppressContentEditableWarning>
                <span className="placeholder-field">[N° Dictamen]</span>
              </div>
            </div>
            <div className="form-group">
              <div className="label">Fecha de Entrega</div>
              <div className="value" contentEditable suppressContentEditableWarning>
                <span className="placeholder-field">[Fecha de Entrega]</span>
              </div>
            </div>
          </div>
        </div>

        {/*  III. DISPOSITIVO DEVUELTO  */}
        <div className="section">
          <div className="section-title">III. Dispositivo Devuelto y Accesorios</div>
          <table className="evidence-table">
            <tbody>
              <tr>
                <td>Tipo de Dispositivo</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '15px', fontSize: '9px' }}>
                    <div className="check-item"><span className="box"></span> Teléfono Móvil</div>
                    <div className="check-item"><span className="box"></span> Computador / Unidad</div>
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
                <td>IMEI / Serial</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_imei ? c.dispositivo_imei : <span className="placeholder-field">[Serial / IMEI del Dispositivo]</span>}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="form-group" style={{ marginTop: '8px' }}>
            <div className="label">Accesorios Entregados</div>
            <div className="checkbox-group" style={{ flexDirection: 'row', gap: '12px', fontSize: '9px' }}>
              <div className="check-item"><span className="box"></span> Cargador</div>
              <div className="check-item"><span className="box"></span> Cable USB</div>
              <div className="check-item"><span className="box"></span> Funda / Estuche</div>
              <div className="check-item"><span className="box"></span> Audífonos</div>
              <div className="check-item"><span className="box"></span> Tarjeta SIM</div>
              <div className="check-item"><span className="box"></span> Memoria SD</div>
              <div className="check-item">
                <span className="box"></span> Otros: <span contentEditable suppressContentEditableWarning style={{ borderBottom: '1px dashed #515154', minWidth: '80px', display: 'inline-block' }}></span>
              </div>
            </div>
          </div>
        </div>

        {/*  IV. DOCUMENTOS Y RESULTADOS ENTREGADOS  */}
        <div className="section">
          <div className="section-title">IV. Documentos y Resultados Entregados</div>
          <div className="form-group">
            <div className="checkbox-group" style={{ flexDirection: 'column', gap: '6px', fontSize: '10px' }}>
              <div className="check-item"><span className="box"></span> Dictamen Pericial Informático (original firmado)</div>
              <div className="check-item"><span className="box"></span> Copia del Acta de Obtención por Consignación</div>
              <div className="check-item"><span className="box"></span> Copia de la Planilla PRCC</div>
              <div className="check-item"><span className="box"></span> Reporte de Extracción Forense (digital)</div>
              <div className="check-item"><span className="box"></span> Reporte de Análisis de Artefactos (digital)</div>
              <div className="check-item"><span className="box"></span> Transcripción de Conversaciones / Audios</div>
              <div className="check-item">
                <span className="box"></span> Otros: <span contentEditable suppressContentEditableWarning style={{ borderBottom: '1px dashed #515154', minWidth: '150px', display: 'inline-block' }}></span>
              </div>
            </div>
          </div>
        </div>

        {/*  V. ESTADO DEL DISPOSITIVO AL MOMENTO DE LA DEVOLUCIÓN  */}
        <div className="section">
          <div className="section-title">V. Estado del Dispositivo al Momento de la Devolución</div>
          <div className="legal-text" style={{ fontSize: '9px' }}>
            El dispositivo se entrega en el mismo estado físico en que fue recibido, a excepción de lo señalado a continuación:
          </div>
          <div className="form-group" style={{ marginTop: '8px' }}>
            <div className="label">Observaciones sobre el estado actual</div>
            <div className="value dev-observaciones-value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">[Describa las observaciones sobre el estado físico y operativo actual del dispositivo al momento de ser devuelto]</span>
            </div>
          </div>
        </div>

        {/*  VI. DECLARACIÓN  */}
        <div className="section">
          <div className="section-title">VI. Declaración</div>
          <div className="legal-text" style={{ fontSize: '8px' }}>
            <p>Yo, <strong className="placeholder-field" contentEditable suppressContentEditableWarning>{c.solicitante_nombre ? c.solicitante_nombre : '[Apellidos y Nombres]'}</strong>, titular de la cédula de identidad N° <strong className="placeholder-field" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : '[C.I.]'}</strong>, 
            declaro que he recibido conforme el dispositivo y los documentos descritos en la presente acta. 
            El Laboratorio SHA256.US ha cumplido con el servicio forense solicitado, entregando los resultados 
            del peritaje técnico legal conforme al <strong>Manual Único de Cadena de Custodia de Evidencias (2017)</strong>, 
            el <strong>Art. 187 del COPP</strong> y demás normativas aplicables.</p>
            <p style={{ marginTop: '8px' }}>Declaro además que no tengo reclamos ni observaciones que formular en cuanto al servicio prestado 
            y al estado en que se me devuelve el dispositivo, eximiendo al laboratorio de toda responsabilidad 
            posterior a la presente entrega.</p>
          </div>
        </div>

        {/*  VII. FIRMAS  */}
        <div className="signature-section" style={{ gap: '14mm' }}>
          <div className="sig-detail-card">
            <div className="sig-detail-label">PERITO FORENSE</div>
            <div className="sig-line" />
            <div className="sig-line-label">Firma</div>
            <div className="sig-field">
              Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito Forense]</span>}</span>
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
          <div className="sig-detail-card">
            <div className="sig-detail-label">EL CONSIGNANTE (RECIBÍ CONFORME)</div>
            <div className="sig-line" />
            <div className="sig-line-label">Firma</div>
            <div className="sig-field">
              C.I.: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[C.I. del Consignante]</span>}</span>
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
        </div>

        <div className="footer">
          Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) | SHA256 Forensic Lab<br />
          Tecnología al servicio de la justicia.
        </div>
      </div>

      <PlanillaToolbar
        onPrint={handlePrint}
        onDownloadZip={() => downloadPlanillaZip(`ActaEntrega_${c.numeroCaso || 'caso'}`, 'Acta de Entrega de Resultados')}
        tituloDocumento="Acta de Entrega de Resultados"
        camposRequeridos={camposRequeridos}
        casoId={casoId}
      />
    </div>
  );
};

export default ActaEntregaResultadosPage;
