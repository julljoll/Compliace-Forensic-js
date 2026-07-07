import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';

const ActaEntrevistaPage = () => {
  const [searchParams] = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    const camposRequeridos = [
      { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
      { valor: caso?.solicitante_nombre, nombre: 'Nombre del Entrevistado' },
      { valor: caso?.solicitante_cedula, nombre: 'Cédula del Entrevistado' },
      { valor: caso?.peritoLider, nombre: 'Nombre del Perito Forense' },
    ];
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
            <span className="address-text">
              Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quibor, Municipio Jiménez del Estado Lara.
            </span>
          </div>
            <div className="acta-header">
              <h1 className="acta-title">Acta de Entrevista de Testigo / Víctima</h1>
              <div className="acta-nro">
                N° EXPEDIENTE: <span className="box-inline" style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{caso?.numeroCaso ? caso.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}</span>
              </div>
            </div>
        </header>

        {/* I. IDENTIFICACIÓN DEL ENTREVISTADO */}
        <div className="section">
          <div className="section-title">I. Datos e Identificación del Entrevistado</div>
          <div className="grid-container">
            <div className="form-group"><div className="label">Apellidos y Nombres</div><div className="value">{caso?.solicitante_nombre ? caso.solicitante_nombre : <span className="placeholder-field">[Apellidos y Nombres]</span>}</div></div>
            <div className="form-group"><div className="label">Cédula de Identidad / Pasaporte</div><div className="value">{caso?.solicitante_cedula ? caso.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad]</span>}</div></div>
            <div className="form-group"><div className="label">Teléfono de Contacto</div><div className="value">{caso?.dispositivo_numero_tel ? caso.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono de Contacto]</span>}</div></div>
            <div className="form-group"><div className="label">Correo Electrónico</div><div className="value">{caso?.correo_investigar ? caso.correo_investigar : <span className="placeholder-field">[Correo Electrónico]</span>}</div></div>
          </div>
          <div className="grid-container" style={{ marginTop: '5px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}><div className="label">Dirección de Habitación Habitual</div><div className="value"><span className="placeholder-field">[Dirección de Habitación]</span></div></div>
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
                <td>Dispositivo Móvil / Almacenamiento</td>
                <td>
                  Marca/Modelo: <strong className="placeholder-field">{caso?.dispositivo_marca || caso?.dispositivo_modelo ? `${caso.dispositivo_marca || ''} ${caso.dispositivo_modelo || ''}`.trim() : '[Marca / Modelo]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Serial / IMEI: <strong className="placeholder-field">{caso?.dispositivo_imei ? caso.dispositivo_imei : '[Serial / IMEI]'}</strong>
                </td>
              </tr>
              <tr>
                <td>Línea Activa</td>
                <td>
                  Nro. Telefónico: <strong className="placeholder-field">{caso?.dispositivo_numero_tel ? caso.dispositivo_numero_tel : '[Nro. Telefónico]'}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; Operadora: <strong className="placeholder-field">[Operadora]</strong>
                </td>
              </tr>
              <tr>
                <td>Cuenta / Aplicación</td>
                <td>
                  <div className="checkbox-group" style={{ flexDirection: 'row', gap: '12px' }}>
                    <div className="check-item"><span className="box"></span> WhatsApp</div>
                    <div className="check-item"><span className="box"></span> Telegram</div>
                    <div className="check-item"><span className="box"></span> Correo Electrónico</div>
                    <div className="check-item"><span className="box"></span> Cuenta ID: <span style={{ textDecoration: 'underline' }} className="placeholder-field">[Cuenta / ID de la Aplicación]</span></div>
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
          <div style={{ fontSize: '9px', fontStyle: 'italic', color: 'var(--apple-text-muted)', marginBottom: '4px' }}>
            Indique de manera cronológica y detallada el origen de las comunicaciones de interés, contextualización de los chats, personas involucradas y la relación del dispositivo en estudio:
          </div>
          <div className="narrativa-box">
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
            <div className="sig-line" />
            <div className="sig-line-label">Firma del Entrevistado</div>
            <div className="sig-field">
              C.I.: <span className="sig-underline">{caso?.solicitante_cedula ? caso.solicitante_cedula : <span className="placeholder-field">[C.I. del Entrevistado]</span>}</span>
            </div>
            <div className="sig-field">
              Nombre: <span className="sig-underline">{caso?.solicitante_nombre ? caso.solicitante_nombre : <span className="placeholder-field">[Nombre del Entrevistado]</span>}</span>
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
              Nombre: <span className="sig-underline">{caso?.peritoLider ? caso.peritoLider : <span className="placeholder-field">[Nombre del Perito Forense]</span>}</span>
            </div>
            <div className="sig-field">
              Cargo: <span className="sig-underline"><span className="placeholder-field">[Experto Informático Forense]</span></span>
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
        <button onClick={handlePrint} className="print-button">
          🖨️ Imprimir Acta de Entrevista PDF (Tamaño Carta)
        </button>
      </div>
    </div>
  );
};

export default ActaEntrevistaPage;
