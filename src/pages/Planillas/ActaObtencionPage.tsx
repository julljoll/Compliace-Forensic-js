import { useEffect } from 'react';
import './Planillas.css';

const ActaObtencionPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                <h1 className="acta-title">Acta de Obtención por Consignación</h1>
                <div className="acta-nro">N° EXPEDIENTE: <span className="box-inline" style={{ 'minWidth': '120px', 'textAlign': 'center', 'fontWeight': 'bold' }}>{''}</span></div>
            </div>
        </header>

        {/*  I. IDENTIFICACIÓN  */}
        <div className="section">
            <div className="section-title">I. Datos del Consignante (Propietario/Poseedor)</div>
            <div className="grid-container">
                <div className="form-group"><div className="label">Apellidos y Nombres</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">Cédula de Identidad</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">Teléfono</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">Dirección</div><div className="value">{''}</div></div>
            </div>
        </div>

        {/*  II. DESCRIPCIÓN DEL DISPOSITIVO  */}
        <div className="section">
            <div className="section-title">II. Descripción Técnica del Dispositivo (Android)</div>
            <table className="evidence-table">
                <tbody>
                    <tr><td>Marca / Modelo</td><td>{''}</td></tr>
                    <tr><td>IMEI 1 / Serial</td><td>{''}</td></tr>
                    <tr><td>IMEI 2</td><td>{''}</td></tr>
                    <tr><td>Nro. de Línea / Operadora</td><td>{''}</td></tr>
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
                    <tr><td>Nivel Batería (%)</td><td><span className="box-inline" style={{ 'minWidth': '40px', 'textAlign': 'center' }}>{''}</span> %</td></tr>
                </tbody>
            </table>
        </div>

        {/*  III. AUTORIZACIÓN Y ALCANCE  */}
        <div className="section">
            <div className="section-title">III. Autorización y Alcance de la Consignación</div>
            <div className="legal-text">
                Yo, el arriba identificado, en pleno uso de mis facultades, hago entrega material voluntaria del dispositivo descrito (Obtención por Consignación) según el <strong>Manual Único de Cadena de Custodia (2017)</strong>. 
                <strong>AUTORIZO EXPRESA Y VOLUNTARIAMENTE</strong> al experto informático de SHA256 para que aplique herramientas forenses (Andriller, ALEAPP o similares) con el fin de realizar la extracción lógica/física de "Mensajes de Datos" (Art. 4, Ley sobre Mensajes de Datos y Firmas Electrónicas), renunciando temporalmente a la privacidad de las comunicaciones (Art. 48 CRBV) bajo los límites de esta autorización:
            </div>
            <div className="form-group">
                <div className="label">Alcance de la Autorización (Marque uno)</div>
                <div className="checkbox-group" style={{ 'margin': '5px 0' }}>
                    <div className="check-item"><span className="box"></span> <strong>ANÁLISIS TÉCNICO COMPLETO</strong> (Todo el contenido del dispositivo)</div>
                </div>
                <div className="checkbox-group" style={{ 'margin': '5px 0' }}>
                    <div className="check-item"><span className="box"></span> <strong>ANÁLISIS DELIMITADO</strong> (Únicamente archivos/chats de <strong>WHATSAPP</strong>)</div>
                </div>
            </div>
        </div>

        {/*  IV. REQUERIMIENTOS DE ACCESO  */}
        <div className="section">
            <div className="section-title">IV. Requerimientos de Acceso y Preservación</div>
            <div className="grid-container">
                <div className="form-group">
                    <div className="label">Bloqueo de Pantalla</div>
                    <div className="checkbox-group">
                        <div className="check-item"><span className="box"></span> PIN / Patrón: __________</div>
                        <div className="check-item"><span className="box"></span> Sin Bloqueo</div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="label">Estado de Conexión</div>
                    <div className="checkbox-group">
                        <div className="check-item"><span className="box"></span> Modo Avión Activado</div>
                        <div className="check-item"><span className="box"></span> WiFi/Datos Desactivados</div>
                    </div>
                </div>
            </div>
        </div>

        {/*  V. MOTIVO  */}
        <div className="section">
            <div className="section-title">V. Motivo de la Consignación</div>
            <div className="form-group" style={{ 'height': '60px', 'padding': '5px', 'fontSize': '11px', 'lineHeight': '1.4' }}>
                {''}
            </div>
        </div>

        {/*  VI. FIRMAS  */}
        <div className="signature-section" style={{ 'gap': '14mm' }}>
            <div className="sig-detail-card">
                <div className="sig-detail-label">EL CONSIGNANTE</div>
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
                <div className="sig-detail-label">PERITO RECEPTOR</div>
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
        </div>

        <div className="footer">
            Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) <br />
            SHA256 Forensic Lab - Tecnología al servicio de la justicia.
        </div>
    </div>

    <div className="no-print" style={{ 'textAlign': 'center', 'marginTop': '10px', 'marginBottom': '20px' }}>
        <button onClick={() => { window.print() }} className="print-button">
            🖨️ Imprimir Acta PDF (Tamaño Oficio)
        </button>
    </div>

    </div>
  );
};

export default ActaObtencionPage;
