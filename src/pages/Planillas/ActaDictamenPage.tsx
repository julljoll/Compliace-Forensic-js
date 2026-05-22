import { useEffect } from 'react';
import './Planillas.css';

const ActaDictamenPage = () => {
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
                <h1 className="acta-title">Dictamen Pericial Informático</h1>
                <div className="acta-nro">N° EXPEDIENTE: <span className="box-inline" style={{ 'minWidth': '80px' }}></span></div>
            </div>
        </header>

        {/*  I. DATOS DEL CASO  */}
        <div className="section">
            <div className="section-title">I. Datos del Consignante y del Caso</div>
            <div className="grid-container">
                <div className="form-group"><div className="label">Apellidos y Nombres del Consignante</div><div className="value"></div></div>
                <div className="form-group"><div className="label">Cédula de Identidad</div><div className="value"></div></div>
                <div className="form-group"><div className="label">N° de Expediente / Caso</div><div className="value"></div></div>
                <div className="form-group"><div className="label">Fecha del Dictamen</div><div className="value"></div></div>
            </div>
        </div>

        {/*  II. DISPOSITIVO EXAMINADO  */}
        <div className="section">
            <div className="section-title">II. Dispositivo Examinado</div>
            <table className="evidence-table">
                <tr><td>Tipo de Dispositivo</td><td></td></tr>
                <tr><td>Marca / Modelo</td><td></td></tr>
                <tr><td>IMEI / Serial</td><td></td></tr>
                <tr><td>N° PRCC Asociado</td><td></td></tr>
            </table>
        </div>

        {/*  III. METODOLOGÍA  */}
        <div className="section">
            <div className="section-title">III. Metodología Aplicada</div>
            <div className="legal-text">
                <p>La presente peritación se realizó siguiendo los lineamientos del <strong>Manual Único de Cadena de Custodia de Evidencias Digitales (2017)</strong>, 
                la norma <strong>ISO/IEC 27037:2012</strong> para identificación, recopilación, adquisición y preservación de evidencia digital, 
                y la guía <strong>NIST SP 800-101 r1</strong> para forensia en dispositivos móviles.</p>
            </div>
            <div className="form-group" style={{ 'marginTop': '10px' }}>
                <div className="label">Herramientas Forenses Utilizadas</div>
                <div className="value" style={{ 'minHeight': '40px' }}></div>
            </div>
        </div>

        {/*  IV. EXÁMENES PRACTICADOS  */}
        <div className="section">
            <div className="section-title">IV. Exámenes Practicados</div>
            <div className="form-group">
                <div className="value" style={{ 'minHeight': '80px' }}></div>
            </div>
            <div className="legal-text" style={{ 'marginTop': '8px' }}>
                <strong>Resguardo de Integridad:</strong> Se generaron los siguientes valores hash para garantizar la inalterabilidad de la evidencia:
                <div style={{ 'fontFamily': 'monospace', 'marginTop': '4px', 'fontSize': '9px' }}>
                    SHA-256 Original: _________________________________<br />
                    SHA-256 Copia: _________________________________<br />
                    MD5: _________________________________
                </div>
            </div>
        </div>

        {/*  V. RESULTADOS Y HALLAZGOS  */}
        <div className="section">
            <div className="section-title">V. Resultados y Hallazgos</div>
            <div className="form-group">
                <div className="value" style={{ 'minHeight': '100px' }}></div>
            </div>
        </div>

        {/*  VI. CONCLUSIONES TÉCNICAS  */}
        <div className="section">
            <div className="section-title">VI. Conclusiones Técnicas</div>
            <div className="legal-text">
                En virtud de los exámenes practicados y los resultados obtenidos, se concluye:
            </div>
            <div className="form-group" style={{ 'marginTop': '8px' }}>
                <div className="value" style={{ 'minHeight': '80px' }}></div>
            </div>
        </div>

        {/*  VII. FUNDAMENTACIÓN LEGAL  */}
        <div className="section">
            <div className="section-title">VII. Fundamentación Legal</div>
            <div className="legal-text" style={{ 'fontSize': '8px' }}>
                <p>El presente dictamen se emite con fundamento en:</p>
                <ul style={{ 'margin': '4px 0', 'paddingLeft': '20px', 'lineHeight': '1.6' }}>
                    <li><strong>Artículo 187 del Código Orgánico Procesal Penal (COPP)</strong> — Cadena de Custodia de Evidencias Digitales.</li>
                    <li><strong>Artículo 4 de la Ley sobre Mensajes de Datos y Firmas Electrónicas</strong> — Eficacia probatoria de los mensajes de datos.</li>
                    <li><strong>Ley Especial de Delitos Informáticos (LEDI-2001)</strong> — Tipificación de delitos informáticos.</li>
                    <li><strong>Manual Único de Cadena de Custodia de Evidencias Digitales (MUCC-2017)</strong> — Procedimientos de obtención, resguardo y peritaje.</li>
                    <li><strong>ISO/IEC 27037:2012</strong> — Directrices para identificación, recopilación, adquisición y preservación de evidencia digital.</li>
                    <li><strong>ISO/IEC 27042:2015</strong> — Directrices para el análisis e interpretación de evidencia digital.</li>
                    <li><strong>NIST SP 800-101 r1</strong> — Guidelines on Mobile Device Forensics.</li>
                </ul>
            </div>
        </div>

        {/*  VIII. DECLARACIÓN DEL PERITO  */}
        <div className="section">
            <div className="section-title">VIII. Declaración del Perito</div>
            <div className="legal-text" style={{ 'fontSize': '8px' }}>
                El perito actuante declara que los exámenes fueron realizados conforme a los principios científicos y técnicos 
                de la informática forense, utilizando metodologías validadas y herramientas forenses reconocidas. 
                La evidencia digital fue manejada bajo estrictas normas de cadena de custodia, garantizando su integridad e inalterabilidad. 
                El presente dictamen se emite de buena fe, con objetividad e imparcialidad técnica.
            </div>
        </div>

        {/*  IX. FIRMAS  */}
        <div className="signature-section">
            <div className="sig-box">
                <div className="sig-label">EL PERITO FORENSE</div>
                <div className="sig-sub">SHA256 Forensic Lab</div>
                <div className="sig-sub">Nombre: ____________________</div>
                <div className="sig-sub">Credencial: ________________</div>
                <div className="sig-sub" style={{ 'marginTop': '15px', 'fontSize': '8px' }}>Firma y Sello</div>
            </div>
            <div className="sig-box">
                <div className="sig-label">EL CONSIGNANTE</div>
                <div className="sig-sub">Nombre: ____________________</div>
                <div className="sig-sub">C.I.: <span className="box-inline" style={{ 'minWidth': '100px' }}></span></div>
                <div className="sig-sub" style={{ 'marginTop': '15px', 'fontSize': '8px' }}>Recibí Conforme</div>
            </div>
        </div>

        <div className="footer">
            Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) | SHA256 Forensic Lab<br />
            Tecnología al servicio de la justicia.
        </div>
    </div>

    <div className="no-print" style={{ 'textAlign': 'center', 'marginTop': '10px', 'marginBottom': '20px' }}>
        <button onClick={() => { window.print() }} style={{ 'padding': '10px 20px', 'background': '#FECF06', 'color': '#181818', 'border': 'none', 'borderRadius': '4px', 'cursor': 'pointer', 'fontWeight': 'bold', 'fontFamily': '"Inter", sans-serif', 'boxShadow': '0 2px 4px rgba(0,0,0,0.2)' }}>
            🖨️ Imprimir Dictamen (Tamaño Oficio)
        </button>
    </div>

    </div>
  );
};

export default ActaDictamenPage;
