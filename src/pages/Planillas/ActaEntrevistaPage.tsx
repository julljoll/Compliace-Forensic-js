import { useEffect } from 'react';
import './Planillas.css';

const ActaEntrevistaPage = () => {
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
            <span className="address-text">
              Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quibor, Municipio Jiménez del Estado Lara.
            </span>
          </div>
          <div className="acta-header">
            <h1 className="acta-title">Acta de Entrevista de Testigo / Víctima</h1>
            <div className="acta-nro">
              N° EXPEDIENTE: <span className="box-inline" style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{''}</span>
            </div>
          </div>
        </header>

        {/* I. IDENTIFICACIÓN DEL ENTREVISTADO */}
        <div className="section">
          <div className="section-title">I. Datos e Identificación del Entrevistado</div>
          <div className="grid-container">
            <div className="form-group"><div className="label">Apellidos y Nombres</div><div className="value">{''}</div></div>
            <div className="form-group"><div className="label">Cédula de Identidad / Pasaporte</div><div className="value">{''}</div></div>
            <div className="form-group"><div className="label">Teléfono de Contacto</div><div className="value">{''}</div></div>
            <div className="form-group"><div className="label">Correo Electrónico</div><div className="value">{''}</div></div>
          </div>
          <div className="grid-container" style={{ marginTop: '5px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}><div className="label">Dirección de Habitación Habitual</div><div className="value">{''}</div></div>
          </div>
          <div className="form-group" style={{ marginTop: '5px' }}>
            <div className="label">Condición / Rol en la Investigación</div>
            <div className="checkbox-group" style={{ flexDirection: 'row', gap: '15px', fontSize: '9px' }}>
              <div className="check-item"><span className="box"></span> Víctima</div>
              <div className="check-item"><span className="box"></span> Testigo / Denunciante</div>
              <div className="check-item"><span className="box"></span> Propietario de la Evidencia</div>
              <div className="check-item"><span className="box"></span> Poseedor / Consignatario</div>
            </div>
          </div>
        </div>

        {/* II. RELACIÓN DEL DISPOSITIVO Y CUENTAS ASOCIADAS */}
        <div className="section">
          <div className="section-title">II. Relación del Dispositivo y Cuentas de Interés Forense</div>
          <table className="evidence-table">
            <tbody>
              <tr>
                <td>Dispositivo Móvil</td>
                <td>
                  Marca/Modelo: <span style={{ textDecoration: 'underline' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  &nbsp;&nbsp;&nbsp;&nbsp; Serial / IMEI: <span style={{ textDecoration: 'underline' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </td>
              </tr>
              <tr>
                <td>Línea Activa</td>
                <td>
                  Nro. Telefónico: <span style={{ textDecoration: 'underline' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  &nbsp;&nbsp;&nbsp;&nbsp; Operadora: <span style={{ textDecoration: 'underline' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </td>
              </tr>
              <tr>
                <td>Cuenta / Aplicación</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '12px' }}>
                    <div className="check-item"><span className="box"></span> WhatsApp</div>
                    <div className="check-item"><span className="box"></span> Telegram</div>
                    <div className="check-item"><span className="box"></span> Correo Electrónico</div>
                    <div className="check-item"><span className="box"></span> Cuenta ID: <span style={{ textDecoration: 'underline' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* III. FUNDAMENTACIÓN LEGAL Y CONSENTIMIENTO INFORMADO */}
        <div className="section">
          <div className="section-title">III. Fundamentación Legal y Autorización Voluntaria</div>
          <div className="legal-text">
            En cumplimiento con el <strong>Manual Único de Cadena de Custodia de Evidencias Físicas (2017)</strong> y de conformidad con los 
            <strong> Artículos 187 y 225 del Código Orgánico Procesal Penal (COPP)</strong>, en concordancia con el derecho a la inviolabilidad 
            de las comunicaciones privadas consagrado en el <strong>Artículo 48 de la Constitución de la República Bolivariana de Venezuela (CRBV)</strong> 
            y los principios del <strong>Artículo 4 de la Ley sobre Mensajes de Datos y Firmas Electrónicas</strong>, yo, el ciudadano entrevistado arriba 
            identificado, manifiesto de manera <strong>LIBRE, EXPRESA, INFORMADA Y VOLUNTARIA</strong> mi consentimiento y autorización para que los peritos 
            del Laboratorio Forense SHA256.US procedan a realizar el examen técnico, análisis informático forense y la respectiva extracción lógica/física 
            de los datos contenidos en el dispositivo y/o cuentas de mensajería anteriormente descritos. Entiendo que los resultados de esta peritación 
            formarán parte del expediente de investigación técnica del caso.
          </div>
        </div>

        {/* IV. NARRATIVA Y RELATO DE LOS HECHOS */}
        <div className="section">
          <div className="section-title">IV. Narrativa del Entrevistado y Relato de los Hechos de Interés Forense</div>
          <div style={{ fontSize: '9px', fontStyle: 'italic', color: '#444', marginBottom: '4px' }}>
            Indique de manera cronológica y detallada el origen de las comunicaciones de interés, contextualización de los chats, personas involucradas y la relación del dispositivo en estudio:
          </div>
          <div style={{ border: '1px solid #000', padding: '10px', minHeight: '220px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
            <div style={{ borderBottom: '1px dotted #999', height: '1px' }}></div>
          </div>
        </div>

        {/* V. FIRMAS Y HUELLAS DACTILARES */}
        <div className="signature-section" style={{ gap: '14mm', marginTop: '6mm' }}>
          <div className="sig-detail-card">
            <div className="sig-detail-label">CIUDADANO ENTREVISTADO</div>
            <div className="sig-line" />
            <div className="sig-line-label">Firma del Entrevistado</div>
            <div className="sig-field">
              C.I.: <span className="sig-underline"></span>
            </div>
            <div className="sig-field">
              Nombre: <span className="sig-underline"></span>
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
            <div className="sig-detail-label">PERITO FORENSE RECEPTOR</div>
            <div className="sig-line" />
            <div className="sig-line-label">Firma del Experto Forense</div>
            <div className="sig-field">
              C.I.: <span className="sig-underline"></span>
            </div>
            <div className="sig-field">
              Credencial / Nombre: <span className="sig-underline"></span>
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
          Documento redactado y generado bajo las directrices del Manual Único de Cadena de Custodia de Evidencias Físicas (V. 2017) <br />
          SHA256 Forensic Lab - Informática Forense y Ciberseguridad al servicio de la justicia.
        </div>
      </div>

      <div className="no-print" style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>
        <button onClick={() => { window.print(); }} className="print-button">
          🖨️ Imprimir Acta de Entrevista PDF (Tamaño Oficio)
        </button>
      </div>
    </div>
  );
};

export default ActaEntrevistaPage;
