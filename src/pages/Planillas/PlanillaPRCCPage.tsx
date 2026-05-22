import { useEffect } from 'react';
import './Planillas.css';

const PlanillaPRCCPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                <div className="form-nro">N° PRCC: <span style={{ 'marginLeft': '8px', 'borderBottom': '1px solid var(--border-color)', 'minWidth': '100px', 'display': 'inline-block' }}></span></div>
            </div>
        </header>

        {/*  SECCIÓN I  */}
        <div className="section">
            <div className="section-title">I. Datos del Consignante y del Caso</div>
            <div className="grid-container">
                <div className="form-group"><div className="label">Apellidos y Nombres del Consignante</div><div className="value"></div></div>
                <div className="form-group"><div className="label">Cédula de Identidad</div><div className="value"></div></div>
                <div className="form-group"><div className="label">Teléfono de Contacto</div><div className="value"></div></div>
                <div className="form-group"><div className="label">N° de Expediente / Caso</div><div className="value"></div></div>
                <div className="form-group"><div className="label">Fecha de Recepción</div><div className="value"></div></div>
                <div className="form-group"><div className="label">Hora de Recepción</div><div className="value"></div></div>
            </div>
        </div>

        {/*  SECCIÓN II  */}
        <div className="section">
            <div className="section-title">II. Forma de Obtención</div>
            <div className="form-group">
                <div className="checkbox-group">
                    <div className="check-item"><span className="box" style={{ 'background': 'rgba(254, 207, 6, 0.1)', 'color': 'var(--primary-color)' }}></span> <u>CONSIGNACIÓN</u></div>
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
                    <div className="value" style={{ 'minHeight': '18px' }}></div>
                    <div className="sig-row">
                        <div className="sig-box"><span className="sig-label">FIRMA</span></div>
                        <div className="thumb-box">PULGAR<br />DER.</div>
                    </div>
                </div>
                <div className="sig-card">
                    <div className="label">B. Colección (Nombre y Credencial)</div>
                    <div className="value" style={{ 'minHeight': '18px' }}></div>
                    <div className="sig-row">
                        <div className="sig-box"><span className="sig-label">FIRMA</span></div>
                        <div className="thumb-box">PULGAR<br />DER.</div>
                    </div>
                </div>
            </div>
        </div>

        {/*  SECCIÓN IV  */}
        <div className="section">
            <div className="section-title">IV. Descripción de la Evidencia Digital Consignada</div>
            <table className="evidence-table">
                <tr><td>Tipo de Dispositivo</td><td><div className="checkbox-group" style={{ 'flexDirection': 'row', 'gap': '15px', 'fontSize': '9px' }}>
                    <div className="check-item"><span className="box"></span> Teléfono Móvil</div>
                    <div className="check-item"><span className="box"></span> Computador</div>
                    <div className="check-item"><span className="box"></span> Tableta</div>
                    <div className="check-item"><span className="box"></span> Otro</div>
                </div></td></tr>
                <tr><td>Marca / Modelo</td><td></td></tr>
                <tr><td>IMEI / Serial</td><td></td></tr>
                <tr><td>Estado Físico</td><td>
                    <div className="checkbox-group" style={{ 'flexDirection': 'row', 'gap': '10px', 'fontSize': '9px' }}>
                        <div className="check-item"><div className="box"></div> Operativo</div>
                        <div className="check-item"><div className="box"></div> Daños Pantalla</div>
                        <div className="check-item"><div className="box"></div> Sin Batería</div>
                        <div className="check-item"><div className="box"></div> Golpe de Agua</div>
                    </div>
                </td></tr>
                <tr><td>Accesorios Incluidos</td><td></td></tr>
            </table>
            <div style={{ 'textAlign': 'right', 'marginTop': '5px', 'fontSize': '9px' }}>
                ¿Continúa en Anexo A? <span className="box"></span> SI <span className="box"></span> NO
            </div>
        </div>

        {/*  SECCIÓN V  */}
        <div className="section">
            <div className="section-title">V. Recepción de la Evidencia (Consignación Voluntaria)</div>
            <table className="transfer-table">
                <tr>
                    <td style={{ 'width': '30%' }}>
                        <div className="label">Motivo</div>
                        <div className="checkbox-group" style={{ 'flexDirection': 'column', 'gap': '4px', 'fontSize': '8px' }}>
                            <div className="check-item"><span className="box" style={{ 'background': 'rgba(254, 207, 6, 0.1)' }}></span> PERITAJE</div>
                            <div className="check-item"><span className="box"></span> RESGUARDO</div>
                        </div>
                    </td>
                    <td style={{ 'width': '35%' }}>
                        <div className="label">Entrega (Consignante)</div>
                        <div style={{ 'fontSize': '9px', 'marginBottom': '4px' }}>Nombre/C.I.:</div>
                        <div className="sig-row" style={{ 'marginTop': '0' }}>
                            <div className="sig-box" style={{ 'height': '35px' }}><span className="sig-label">FIRMA</span></div>
                            <div className="thumb-box" style={{ 'height': '45px', 'width': '35px', 'fontSize': '5px' }}>HUELLA</div>
                        </div>
                    </td>
                    <td style={{ 'width': '35%' }}>
                        <div className="label">Recibe (Perito)</div>
                        <div style={{ 'fontSize': '9px', 'marginBottom': '4px' }}>Nombre/Credencial:</div>
                        <div className="sig-row" style={{ 'marginTop': '0' }}>
                            <div className="sig-box" style={{ 'height': '35px' }}><span className="sig-label">FIRMA</span></div>
                            <div className="thumb-box" style={{ 'height': '45px', 'width': '35px', 'fontSize': '5px' }}>SELLO</div>
                        </div>
                    </td>
                </tr>
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

        <footer>
            Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) | SHA256 Forensic Lab
        </footer>

        <div style={{ 'textAlign': 'center', 'marginTop': '20px', 'marginBottom': '20px' }} className="no-print">
            <button onClick={() => { window.print() }}>🖨️ IMPRIMIR PLANILLA (TAMAÑO OFICIO)</button>
        </div>
    </div>

    </div>
  );
};

export default PlanillaPRCCPage;
