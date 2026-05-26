import { useEffect } from 'react';
import './Planillas.css';
import { useCMSStore } from '../../store/cmsStore';

const PlanillaPRCCPage = () => {
  const { casos, casoSeleccionado } = useCMSStore();
  const activeCaso = casos.find(c => c.id === casoSeleccionado);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getFormattedDate = () => {
    if (!activeCaso?.fechaCreacion) return '';
    return new Date(activeCaso.fechaCreacion).toLocaleDateString('es');
  };

  const getFormattedTime = () => {
    if (!activeCaso?.fechaCreacion) return '';
    return new Date(activeCaso.fechaCreacion).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="planilla-container">

    <div className="page">
        <div className="watermark">CONSIGNACIÓN</div>

        <header>
            <div className="logo-container">
                <span className="logo-text">SHA256.US</span>
                <span className="logo-subtext">Laboratorio de Informática Forense y Ciberseguridad</span>
                <span className="address-text">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quibor, Municipio Jiménez del Estado Lara.</span>
            </div>
            <div className="form-header-info">
                <h1 className="form-title-main">Planilla de Registro de Cadena de Custodia (PRCC)</h1>
                <div className="form-nro">N° PRCC: <span style={{ 'marginLeft': '8px', 'borderBottom': '1px solid var(--border-color)', 'minWidth': '150px', 'display': 'inline-block', 'textAlign': 'center', 'fontWeight': 'bold' }}>{activeCaso?.numeroPRCC || activeCaso?.numeroCaso || ''}</span></div>
            </div>
        </header>

        {/*  SECCIÓN I  */}
        <div className="section">
            <div className="section-title">I. Datos del Consignante y del Caso</div>
            <div className="grid-container">
                <div className="form-group"><div className="label">Apellidos y Nombres del Consignante</div><div className="value">{activeCaso?.solicitante_nombre || ''}</div></div>
                <div className="form-group"><div className="label">Cédula de Identidad</div><div className="value">{activeCaso?.solicitante_cedula || ''}</div></div>
                <div className="form-group"><div className="label">Teléfono de Contacto</div><div className="value">{activeCaso?.dispositivo_numero_tel || ''}</div></div>
                <div className="form-group"><div className="label">N° de Expediente / Caso</div><div className="value">{activeCaso?.numeroCaso || ''}</div></div>
                <div className="form-group"><div className="label">Fecha de Recepción</div><div className="value">{getFormattedDate()}</div></div>
                <div className="form-group"><div className="label">Hora de Recepción</div><div className="value">{getFormattedTime()}</div></div>
            </div>
        </div>

        {/*  SECCIÓN II  */}
        <div className="section">
            <div className="section-title">II. Forma de Obtención</div>
            <div className="form-group">
                <div className="checkbox-group">
                    <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> <u>CONSIGNACIÓN</u></div>
                    <div className="check-item"><span className="box"></span> TÉCNICA</div>
                    <div className="check-item"><span className="box"></span> ASEGURAMIENTO</div>
                </div>
            </div>
        </div>

        {/*  SECCIÓN III  */}
        <div className="section">
            <div className="section-title">III. Operarios (Perito Informático)</div>
            <div className="signature-grid">
                <div className="sig-card">
                    <div className="label">A. Fijación (Nombre y Credencial)</div>
                    <div className="value" style={{ 'minHeight': '18px', 'fontWeight': 'bold', 'padding': '2px 5px' }}>{activeCaso?.peritoLider || ''}</div>
                    <div className="sig-row">
                        <div className="sig-box"><span className="sig-label">FIRMA</span></div>
                        <div className="thumb-wrapper">
                            <div className="thumb-box" />
                            <span className="thumb-label">PULGAR DER.</span>
                        </div>
                    </div>
                </div>
                <div className="sig-card">
                    <div className="label">B. Colección (Nombre y Credencial)</div>
                    <div className="value" style={{ 'minHeight': '18px', 'fontWeight': 'bold', 'padding': '2px 5px' }}>{activeCaso?.peritoLider || ''}</div>
                    <div className="sig-row">
                        <div className="sig-box"><span className="sig-label">FIRMA</span></div>
                        <div className="thumb-wrapper">
                            <div className="thumb-box" />
                            <span className="thumb-label">PULGAR DER.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/*  SECCIÓN IV  */}
        <div className="section">
            <div className="section-title">IV. Descripción de la Evidencia Digital Consignada</div>
            <table className="evidence-table">
                <tbody>
                    <tr><td>Tipo de Dispositivo</td><td><div className="checkbox-group" style={{ 'flexDirection': 'row', 'gap': '15px', 'fontSize': '9px' }}>
                        <div className="check-item">
                            <span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                                {activeCaso?.tipoProyecto === 'forense_whatsapp' || activeCaso?.dispositivo_marca ? '✓' : ''}
                            </span> Teléfono Móvil
                        </div>
                        <div className="check-item"><span className="box"></span> Computador</div>
                        <div className="check-item"><span className="box"></span> Tableta</div>
                        <div className="check-item"><span className="box"></span> Otro</div>
                    </div></td></tr>
                    <tr><td>Marca / Modelo</td><td>{activeCaso?.dispositivo_marca ? `${activeCaso.dispositivo_marca} ${activeCaso.dispositivo_modelo || ''}` : ''}</td></tr>
                    <tr><td>IMEI / Serial</td><td>{activeCaso?.dispositivo_imei || ''}</td></tr>
                    <tr><td>Estado Físico</td><td>
                        <div className="checkbox-group" style={{ 'flexDirection': 'row', 'gap': '10px', 'fontSize': '9px' }}>
                            <div className="check-item">
                                <div className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                                    {activeCaso?.dispositivo_estado_fisico?.toLowerCase().includes('operativo') || activeCaso?.dispositivo_estado_fisico?.toLowerCase().includes('bueno') ? '✓' : ''}
                                </div> Operativo
                            </div>
                            <div className="check-item">
                                <div className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                                    {activeCaso?.dispositivo_pantalla_estado?.toLowerCase().includes('dañ') || activeCaso?.dispositivo_danos_visibles?.toLowerCase().includes('pantalla') ? '✓' : ''}
                                </div> Daños Pantalla
                            </div>
                            <div className="check-item">
                                <div className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                                    {activeCaso?.dispositivo_bateria_estado?.toLowerCase().includes('sin') || activeCaso?.dispositivo_bateria_estado?.toLowerCase().includes('baja') ? '✓' : ''}
                                </div> Sin Batería
                            </div>
                            <div className="check-item"><div className="box"></div> Golpe de Agua</div>
                        </div>
                    </td></tr>
                    <tr><td>Accesorios Incluidos</td><td>Batería, Tarjeta SIM {activeCaso?.dispositivo_sim_card ? `(${activeCaso.dispositivo_sim_card})` : ''}</td></tr>
                </tbody>
            </table>
            <div style={{ 'textAlign': 'right', 'marginTop': '5px', 'fontSize': '9px' }}>
                ¿Continúa en Anexo A? <span className="box"></span> SI <span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> NO
            </div>
        </div>

        {/*  SECCIÓN V  */}
        <div className="section">
            <div className="section-title">V. Recepción de la Evidencia (Consignación Voluntaria)</div>
            <table className="transfer-table">
                <tbody>
                    <tr>
                        <td style={{ 'width': '30%', 'verticalAlign': 'top' }}>
                            <div className="label">Motivo</div>
                            <div className="checkbox-group" style={{ 'flexDirection': 'column', 'gap': '4px', 'fontSize': '8px' }}>
                                <div className="check-item"><span className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>✓</span> PERITAJE</div>
                                <div className="check-item"><span className="box"></span> RESGUARDO</div>
                            </div>
                        </td>
                        <td style={{ 'width': '35%', 'verticalAlign': 'top' }}>
                            <div className="sig-detail-card" style={{ 'minHeight': 'auto', 'border': 'none', 'padding': '0', 'background': 'transparent', 'gap': '4px' }}>
                                <div className="label">Entrega (Consignante)</div>
                                <div style={{ 'fontSize': '9px', 'marginBottom': '4px' }}>Nombre: <span style={{ 'fontWeight': 'bold' }}>{activeCaso?.solicitante_nombre || '____________________'}</span></div>
                                <div className="sig-line" style={{ 'height': '24px' }} />
                                <div className="sig-line-label" style={{ 'fontSize': '7px' }}>Firma</div>
                                <div className="sig-field" style={{ 'fontSize': '8px' }}>
                                    C.I.: <span className="sig-underline" style={{ 'minHeight': '16px' }}>{activeCaso?.solicitante_cedula || ''}</span>
                                </div>
                                <div className="sig-field" style={{ 'fontSize': '8px' }}>
                                    Teléfono: <span className="sig-underline" style={{ 'minHeight': '16px' }}>{activeCaso?.dispositivo_numero_tel || ''}</span>
                                </div>
                                <div className="fingerprint-row" style={{ 'marginTop': '4px', 'paddingTop': '4px' }}>
                                    <div className="thumb-wrapper">
                                        <div className="thumb-box" style={{ 'height': '45px', 'width': '35px' }} />
                                        <span className="thumb-label">PULGAR DER.</span>
                                    </div>
                                    <div className="thumb-wrapper">
                                        <div className="thumb-box" style={{ 'height': '45px', 'width': '35px' }} />
                                        <span className="thumb-label">PULGAR IZQ.</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td style={{ 'width': '35%', 'verticalAlign': 'top' }}>
                            <div className="sig-detail-card" style={{ 'minHeight': 'auto', 'border': 'none', 'padding': '0', 'background': 'transparent', 'gap': '4px' }}>
                                <div className="label">Recibe (Perito)</div>
                                <div style={{ 'fontSize': '9px', 'marginBottom': '4px' }}>Nombre: <span style={{ 'fontWeight': 'bold' }}>{activeCaso?.peritoLider || '____________________'}</span></div>
                                <div className="sig-line" style={{ 'height': '24px' }} />
                                <div className="sig-line-label" style={{ 'fontSize': '7px' }}>Firma</div>
                                <div className="sig-field" style={{ 'fontSize': '8px' }}>
                                    C.I.: <span className="sig-underline" style={{ 'minHeight': '16px' }}></span>
                                </div>
                                <div className="sig-field" style={{ 'fontSize': '8px' }}>
                                    Teléfono: <span className="sig-underline" style={{ 'minHeight': '16px' }}></span>
                                </div>
                                <div className="fingerprint-row" style={{ 'marginTop': '4px', 'paddingTop': '4px' }}>
                                    <div className="thumb-wrapper">
                                        <div className="thumb-box" style={{ 'height': '45px', 'width': '35px' }} />
                                        <span className="thumb-label">PULGAR DER.</span>
                                    </div>
                                    <div className="thumb-wrapper">
                                        <div className="thumb-box" style={{ 'height': '45px', 'width': '35px' }} />
                                        <span className="thumb-label">PULGAR IZQ.</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/*  DECLARACIÓN  */}
        <div className="section">
            <p style={{ 'fontSize': '7px', 'color': 'var(--text-muted)', 'textAlign': 'justify', 'marginTop': '5px', 'lineHeight': '1.2' }}>
                Yo, el consignante arriba identificado, declaro que hago entrega voluntaria del dispositivo descrito para su revisión técnica forense. 
                Autorizo al Laboratorio SHA256.US a realizar las pruebas técnicas necesarias sobre el equipo y su contenido digital, 
                conforme al <strong>Manual Único de Cadena de Custodia de Evidencias (2017)</strong> y el <strong>Art. 187 del COPP</strong>. 
                Me comprometo a retirar el equipo una vez finalizado el peritaje, en un plazo no mayor a treinta (30) días continuos.
            </p>
        </div>

        <div className="footer">
            Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) | SHA256 Forensic Lab
        </div>

        <div style={{ 'textAlign': 'center', 'marginTop': '20px', 'marginBottom': '20px' }} className="no-print">
            <button onClick={() => { window.print() }} style={{ 'padding': '10px 20px', 'background': '#0071E3', 'color': '#ffffff', 'border': 'none', 'borderRadius': '4px', 'cursor': 'pointer', 'fontWeight': 'bold', 'fontFamily': '"Inter", sans-serif', 'boxShadow': '0 2px 4px rgba(0,0,0,0.2)' }}>🖨️ IMPRIMIR PLANILLA (TAMAÑO OFICIO)</button>
        </div>
    </div>

    </div>
  );
};

export default PlanillaPRCCPage;
