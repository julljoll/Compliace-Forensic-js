import { useEffect } from 'react';
import './Planillas.css';
import { useCMSStore } from '../../store/cmsStore';

const ActaEntregaResultadosPage = () => {
  const { casos, casoSeleccionado } = useCMSStore();
  const activeCaso = casos.find(c => c.id === casoSeleccionado);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('es');
  };

  return (
    <div className="planilla-container">

    <div className="page">
        <header>
            <div className="logo-container">
                <span className="logo-text">SHA256.US</span>
                <span className="logo-subtext">Laboratorio de Informática Forense y Ciberseguridad</span>
                <span className="address-text">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quibor, Municipio Jiménez del Estado Lara.</span>
            </div>
            <div className="acta-header">
                <h1 className="acta-title">Acta de Entrega de Resultados y Devolución de Dispositivo</h1>
                <div className="acta-nro">N° EXPEDIENTE: <span className="box-inline" style={{ 'minWidth': '120px', 'textAlign': 'center', 'fontWeight': 'bold' }}>{activeCaso?.numeroCaso || ''}</span></div>
            </div>
        </header>

        {/*  I. DATOS DEL CONSIGNANTE  */}
        <div className="section">
            <div className="section-title">I. Datos del Consignante</div>
            <div className="grid-container">
                <div className="form-group"><div className="label">Apellidos y Nombres</div><div className="value">{activeCaso?.solicitante_nombre || ''}</div></div>
                <div className="form-group"><div className="label">Cédula de Identidad</div><div className="value">{activeCaso?.solicitante_cedula || ''}</div></div>
                <div className="form-group"><div className="label">Teléfono de Contacto</div><div className="value">{activeCaso?.dispositivo_numero_tel || ''}</div></div>
                <div className="form-group"><div className="label">Dirección</div><div className="value">Lara, Venezuela</div></div>
            </div>
        </div>

        {/*  II. DATOS DEL CASO  */}
        <div className="section">
            <div className="section-title">II. Datos del Caso</div>
            <div className="grid-container">
                <div className="form-group"><div className="label">N° de Expediente / Caso</div><div className="value">{activeCaso?.numeroCaso || ''}</div></div>
                <div className="form-group"><div className="label">N° PRCC</div><div className="value">{activeCaso?.numeroPRCC || activeCaso?.numeroCaso || ''}</div></div>
                <div className="form-group"><div className="label">N° Dictamen Pericial</div><div className="value">DP-{activeCaso?.numeroCaso || ''}</div></div>
                <div className="form-group"><div className="label">Fecha de Entrega</div><div className="value">{getFormattedDate()}</div></div>
            </div>
        </div>

        {/*  III. DISPOSITIVO DEVUELTO  */}
        <div className="section">
            <div className="section-title">III. Dispositivo Devuelto y Accesorios</div>
            <table className="evidence-table">
                <tbody>
                    <tr><td>Tipo de Dispositivo</td><td>
                        <div className="checkbox-group" style={{ 'flexDirection': 'row', 'gap': '15px', 'fontSize': '9px' }}>
                            <div className="check-item">
                                <span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                                    {activeCaso?.dispositivo_marca ? '✓' : ''}
                                </span> Teléfono Móvil
                            </div>
                            <div className="check-item"><span className="box"></span> Computador</div>
                            <div className="check-item"><span className="box"></span> Tableta</div>
                            <div className="check-item"><span className="box"></span> Otro</div>
                        </div>
                    </td></tr>
                    <tr><td>Marca / Modelo</td><td>{activeCaso?.dispositivo_marca ? `${activeCaso.dispositivo_marca} ${activeCaso.dispositivo_modelo || ''}` : ''}</td></tr>
                    <tr><td>IMEI / Serial</td><td>{activeCaso?.dispositivo_imei || ''}</td></tr>
                </tbody>
            </table>
            <div className="form-group" style={{ 'marginTop': '8px' }}>
                <div className="label">Accesorios Entregados</div>
                <div className="checkbox-group" style={{ 'flexDirection': 'row', 'gap': '12px', 'fontSize': '9px' }}>
                    <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> Cargador</div>
                    <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> Cable USB</div>
                    <div className="check-item"><span className="box"></span> Funda / Estuche</div>
                    <div className="check-item"><span className="box"></span> Audífonos</div>
                    <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>{activeCaso?.dispositivo_sim_card ? '✓' : ''}</span> Tarjeta SIM</div>
                    <div className="check-item"><span className="box"></span> Memoria SD</div>
                    <div className="check-item"><span className="box"></span> Otros: ____</div>
                </div>
            </div>
        </div>

        {/*  IV. DOCUMENTOS Y RESULTADOS ENTREGADOS  */}
        <div className="section">
            <div className="section-title">IV. Documentos y Resultados Entregados</div>
            <div className="form-group">
                <div className="checkbox-group" style={{ 'flexDirection': 'column', 'gap': '6px', 'fontSize': '10px' }}>
                    <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> Dictamen Pericial Informático (original firmado)</div>
                    <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> Copia del Acta de Obtención por Consignación</div>
                    <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> Copia de la Planilla PRCC</div>
                    <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> Reporte de Extracción Forense (digital)</div>
                    <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> Reporte de Análisis de Artefactos (digital)</div>
                    <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> Transcripción de Conversaciones / Audios</div>
                    <div className="check-item"><span className="box"></span> Otros: ______________________________</div>
                </div>
            </div>
        </div>

        {/*  V. ESTADO DEL DISPOSITIVO AL MOMENTO DE LA DEVOLUCIÓN  */}
        <div className="section">
            <div className="section-title">V. Estado del Dispositivo al Momento de la Devolución</div>
            <div className="legal-text" style={{ 'fontSize': '9px' }}>
                El dispositivo se entrega en el mismo estado físico en que fue recibido, a excepción de lo señalado a continuación:
            </div>
            <div className="form-group" style={{ 'marginTop': '8px' }}>
                <div className="label">Observaciones sobre el estado actual</div>
                <div className="value" style={{ 'minHeight': '40px', 'padding': '5px', 'fontSize': '11px' }}>
                    Dispositivo apagado y embalado con precinto de seguridad forense recalculado e intacto.
                </div>
            </div>
        </div>

        {/*  VI. DECLARACIÓN  */}
        <div className="section">
            <div className="section-title">VI. Declaración</div>
            <div className="legal-text" style={{ 'fontSize': '8px' }}>
                <p>Yo, <strong>{activeCaso?.solicitante_nombre || '____________________'}</strong>, titular de la cédula de identidad N° <strong>{activeCaso?.solicitante_cedula || '________________'}</strong>, 
                declaro que he recibido conforme el dispositivo y los documentos descritos en la presente acta. 
                El Laboratorio SHA256.US ha cumplido con el servicio forense solicitado, entregando los resultados 
                del peritaje técnico legal conforme al <strong>Manual Único de Cadena de Custodia de Evidencias (2017)</strong>, 
                el <strong>Art. 187 del COPP</strong> y demás normativas aplicables.</p>
                <p style={{ 'marginTop': '8px' }}>Declaro además que no tengo reclamos ni observaciones que formular en cuanto al servicio prestado 
                y al estado en que se me devuelve el dispositivo, eximiendo al laboratorio de toda responsabilidad 
                posterior a la presente entrega.</p>
            </div>
        </div>

        {/*  VII. FIRMAS  */}
        <div className="signature-section" style={{ 'gap': '14mm' }}>
            <div className="sig-detail-card">
                <div className="sig-detail-label">PERITO FORENSE</div>
                <div className="sig-line" />
                <div className="sig-line-label">Firma</div>
                <div className="sig-field">
                    C.I.: <span className="sig-underline"></span>
                </div>
                <div className="sig-field">
                    Teléfono: <span className="sig-underline"></span>
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
                    C.I.: <span className="sig-underline">{activeCaso?.solicitante_cedula || ''}</span>
                </div>
                <div className="sig-field">
                    Teléfono: <span className="sig-underline">{activeCaso?.dispositivo_numero_tel || ''}</span>
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

    <div className="no-print" style={{ 'textAlign': 'center', 'marginTop': '10px', 'marginBottom': '20px' }}>
        <button onClick={() => { window.print() }} style={{ 'padding': '10px 20px', 'background': '#0071E3', 'color': '#ffffff', 'border': 'none', 'borderRadius': '4px', 'cursor': 'pointer', 'fontWeight': 'bold', 'fontFamily': '"Inter", sans-serif', 'boxShadow': '0 2px 4px rgba(0,0,0,0.2)' }}>
            🖨️ Imprimir Acta de Entrega (Tamaño Oficio)
        </button>
    </div>

    </div>
  );
};

export default ActaEntregaResultadosPage;
