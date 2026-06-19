import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';

const ActaObtencionPage = () => {
  const [searchParams] = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fallbackCaso = {
    numeroCaso: 'N/A',
    solicitante_nombre: 'N/A',
    solicitante_cedula: 'N/A',
    dispositivo_marca: 'N/A',
    dispositivo_modelo: 'N/A',
    dispositivo_imei: 'N/A',
    dispositivo_imei2: 'N/A',
    dispositivo_numero_tel: 'N/A',
    dispositivo_sim_card: 'N/A',
    dispositivo_estado_fisico: 'N/A',
    dispositivo_bateria_estado: 'N/A',
    descripcion: 'N/A',
    peritoLider: 'Carlos Mendoza',
    tipoProyecto: '',
    discoduro_serial: 'N/A',
    discoduro_capacidad: 'N/A',
    discoduro_marca: 'N/A',
    discoduro_modelo: 'N/A',
  };

  const c = caso || fallbackCaso;
  const isDiscoDuro = c.tipoProyecto === 'forense_discoduro';

  const handlePrint = () => {
    const camposRequeridos = [
      { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
      { valor: caso?.solicitante_nombre, nombre: 'Nombre del Consignante' },
      { valor: caso?.solicitante_cedula, nombre: 'Cédula del Consignante' },
      { valor: caso?.peritoLider, nombre: 'Nombre del Perito Receptor' },
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
            <span className="address-text">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quibor, Municipio Jiménez del Estado Lara.</span>
          </div>
          <div className="acta-header">
            <h1 className="acta-title">Acta de Obtención por Consignación</h1>
            <div className="acta-nro">N° EXPEDIENTE: <span className="box-inline" style={{ 'minWidth': '120px', 'textAlign': 'center', 'fontWeight': 'bold' }}>{caso?.numeroCaso ? caso.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}</span></div>
          </div>
        </header>

        {/*  I. DATOS DEL CONSIGNANTE  */}
        <div className="section">
          <div className="section-title">I. Datos del Consignante (Propietario/Poseedor)</div>
          <div className="grid-container">
            <div className="form-group"><div className="label">Apellidos y Nombres</div><div className="value">{caso?.solicitante_nombre ? caso.solicitante_nombre : <span className="placeholder-field">[Apellidos y Nombres del Consignante]</span>}</div></div>
            <div className="form-group"><div className="label">Cédula de Identidad</div><div className="value">{caso?.solicitante_cedula ? caso.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad]</span>}</div></div>
            <div className="form-group"><div className="label">Teléfono</div><div className="value">{caso?.dispositivo_numero_tel ? caso.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono de Contacto]</span>}</div></div>
            <div className="form-group"><div className="label">Dirección</div><div className="value"><span className="placeholder-field">[Dirección de Residencia]</span></div></div>
          </div>
        </div>

        {/*  II. DESCRIPCIÓN DEL DISPOSITIVO  */}
        <div className="section">
          <div className="section-title">II. Descripción Técnica del Dispositivo ({isDiscoDuro ? 'Disco Duro' : 'Android'})</div>
          <table className="evidence-table">
            <tbody>
              <tr>
                <td>Marca / Modelo</td>
                <td>{caso?.dispositivo_marca || caso?.dispositivo_modelo ? `${caso.dispositivo_marca || ''} ${caso.dispositivo_modelo || ''}`.trim() : <span className="placeholder-field">[Marca / Modelo del Dispositivo]</span>}</td>
              </tr>
              <tr>
                <td>IMEI 1 / Serial</td>
                <td>{caso?.dispositivo_imei ? caso.dispositivo_imei : <span className="placeholder-field">[Serial / IMEI del Dispositivo]</span>}</td>
              </tr>
              <tr>
                <td>IMEI 2</td>
                <td>{caso?.dispositivo_imei2 ? caso.dispositivo_imei2 : <span className="placeholder-field">[Segundo IMEI (Si aplica)]</span>}</td>
              </tr>
              <tr>
                <td>Nro. de Línea / Operadora</td>
                <td>{caso?.dispositivo_numero_tel || caso?.dispositivo_sim_card ? `${caso.dispositivo_numero_tel || ''} (SIM: ${caso.dispositivo_sim_card || ''})` : <span className="placeholder-field">[Nro. de Línea / Operadora / SIM]</span>}</td>
              </tr>
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
              <tr><td>Nivel Batería (%)</td><td><span className="box-inline" style={{ 'minWidth': '40px', 'textAlign': 'center' }}><span className="placeholder-field">{caso?.dispositivo_bateria_estado ? caso.dispositivo_bateria_estado : '___'}</span></span> %</td></tr>
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
              <div className="check-item"><span className="box"></span> <strong>ANÁLISIS DELIMITADO</strong> (Únicamente chats de <strong>WHATSAPP</strong>)</div>
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
          <div className="form-group motive-box">
            <span className="placeholder-field">{caso?.descripcion ? caso.descripcion : '[Describa el motivo y las circunstancias de la consignación de la evidencia digital]'}</span>
          </div>
        </div>

        {/*  VI. FIRMAS  */}
        <div className="signature-section" style={{ 'gap': '14mm' }}>
          <div className="sig-detail-card">
            <div className="sig-detail-label">EL CONSIGNANTE</div>
            <div className="sig-line" />
            <div className="sig-line-label">Firma</div>
            <div className="sig-field">
              C.I.: <span className="sig-underline">{caso?.solicitante_cedula ? caso.solicitante_cedula : <span className="placeholder-field">[Cédula del Consignante]</span>}</span>
            </div>
            <div className="sig-field">
              Teléfono: <span className="sig-underline">{caso?.dispositivo_numero_tel ? caso.dispositivo_numero_tel : <span className="placeholder-field">[Teléfono]</span>}</span>
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
              Nombre: <span className="sig-underline">{caso?.peritoLider ? caso.peritoLider : <span className="placeholder-field">[Nombre del Perito Receptor]</span>}</span>
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
          Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) <br />
          SHA256 Forensic Lab - Tecnología al servicio de la justicia.
        </div>
      </div>

      <div className="no-print" style={{ 'textAlign': 'center', 'marginTop': '10px', 'marginBottom': '20px' }}>
        <button onClick={handlePrint} className="print-button">
          🖨️ Imprimir Acta PDF (Tamaño Oficio)
        </button>
      </div>
    </div>
  );
};

export default ActaObtencionPage;
