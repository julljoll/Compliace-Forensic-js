import { useEffect } from 'react';
import './Planillas.css';
import { useCMSStore } from '../../store/cmsStore';

const ActaObtencionPage = () => {
  const { casos, casoSeleccionado } = useCMSStore();
  const activeCaso = casos.find(c => c.id === casoSeleccionado);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getBateriaValue = () => {
    if (!activeCaso?.dispositivo_bateria_estado) return '';
    const match = activeCaso.dispositivo_bateria_estado.match(/\d+/);
    return match ? match[0] : activeCaso.dispositivo_bateria_estado;
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
                <h1 className="acta-title">Acta de Obtención por Consignación</h1>
                <div className="acta-nro">N° EXPEDIENTE: <span className="box-inline" style={{ 'minWidth': '120px', 'textAlign': 'center', 'fontWeight': 'bold' }}>{activeCaso?.numeroCaso || ''}</span></div>
            </div>
        </header>

        {/*  I. IDENTIFICACIÓN  */}
        <div className="section">
            <div className="section-title">I. Datos del Consignante (Propietario/Poseedor)</div>
            <div className="grid-container">
                <div className="form-group"><div className="label">Apellidos y Nombres</div><div className="value">{activeCaso?.solicitante_nombre || ''}</div></div>
                <div className="form-group"><div className="label">Cédula de Identidad</div><div className="value">{activeCaso?.solicitante_cedula || ''}</div></div>
                <div className="form-group"><div className="label">Teléfono</div><div className="value">{activeCaso?.dispositivo_numero_tel || ''}</div></div>
                <div className="form-group"><div className="label">Dirección</div><div className="value">Lara, Venezuela</div></div>
            </div>
        </div>

        {/*  II. DESCRIPCIÓN DEL DISPOSITIVO  */}
        <div className="section">
            <div className="section-title">II. Descripción Técnica del Dispositivo (Android)</div>
            <table className="evidence-table">
                <tbody>
                    <tr><td>Marca / Modelo</td><td>{activeCaso?.dispositivo_marca ? `${activeCaso.dispositivo_marca} ${activeCaso.dispositivo_modelo || ''}` : ''}</td></tr>
                    <tr><td>IMEI 1 / Serial</td><td>{activeCaso?.dispositivo_imei || ''}</td></tr>
                    <tr><td>IMEI 2</td><td>{activeCaso?.dispositivo_imei2 || ''}</td></tr>
                    <tr><td>Nro. de Línea / Operadora</td><td>{activeCaso?.dispositivo_numero_tel || ''}</td></tr>
                    <tr>
                        <td>Estado Físico</td>
                        <td>
                            <div className="checkbox-group">
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
                            </div>
                        </td>
                    </tr>
                    <tr><td>Nivel Batería (%)</td><td><span className="box-inline" style={{ 'minWidth': '40px', 'textAlign': 'center' }}>{getBateriaValue()}</span> %</td></tr>
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
                    <div className="check-item">
                        <div className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                            {activeCaso?.tipoProyecto !== 'forense_whatsapp' ? '✓' : ''}
                        </div> <strong>ANÁLISIS TÉCNICO COMPLETO</strong> (Todo el contenido del dispositivo)
                    </div>
                </div>
                <div className="checkbox-group" style={{ 'margin': '5px 0' }}>
                    <div className="check-item">
                        <div className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                            {activeCaso?.tipoProyecto === 'forense_whatsapp' ? '✓' : ''}
                        </div> <strong>ANÁLISIS DELIMITADO</strong> (Únicamente archivos/chats de <strong>WHATSAPP</strong>)
                    </div>
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
                        <div className="check-item">
                            <div className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                                {activeCaso?.dispositivo_pantalla_estado?.toLowerCase().includes('pin') || activeCaso?.dispositivo_pantalla_estado?.toLowerCase().includes('patrón') || activeCaso?.dispositivo_pantalla_estado?.toLowerCase().includes('clave') ? '✓' : ''}
                            </div> PIN / Patrón: {activeCaso?.dispositivo_pantalla_estado?.includes(':') ? activeCaso.dispositivo_pantalla_estado.split(':')[1].trim() : ''}
                        </div>
                        <div className="check-item">
                            <div className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                                {activeCaso?.dispositivo_pantalla_estado?.toLowerCase().includes('sin') || activeCaso?.dispositivo_pantalla_estado?.toLowerCase().includes('ninguno') ? '✓' : ''}
                            </div> Sin Bloqueo
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="label">Estado de Conexión</div>
                    <div className="checkbox-group">
                        <div className="check-item">
                            <div className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                                {activeCaso?.dispositivo_modo_aislamiento?.toLowerCase().includes('avion') || activeCaso?.dispositivo_modo_aislamiento?.toLowerCase().includes('avión') ? '✓' : ''}
                            </div> Modo Avión Activado
                        </div>
                        <div className="check-item">
                            <div className="box" style={{ 'textAlign': 'center', 'lineHeight': '10px' }}>
                                {activeCaso?.dispositivo_modo_aislamiento?.toLowerCase().includes('faraday') || activeCaso?.dispositivo_modo_aislamiento?.toLowerCase().includes('apagado') ? '✓' : ''}
                            </div> WiFi/Datos Desactivados
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/*  V. MOTIVO  */}
        <div className="section">
            <div className="section-title">V. Motivo de la Consignación</div>
            <div className="form-group" style={{ 'height': '60px', 'padding': '5px', 'fontSize': '11px', 'lineHeight': '1.4' }}>
                {activeCaso?.descripcion || 'Extracción técnica forense y preservación digital de la evidencia para investigación penal.'}
            </div>
        </div>

        {/*  VI. FIRMAS  */}
        <div className="signature-section">
            <div className="sig-box">
                <div className="sig-label">EL CONSIGNANTE</div>
                <div className="sig-sub">Nombre: {activeCaso?.solicitante_nombre || '____________________'}</div>
                <div className="sig-sub">C.I.: <span className="box-inline" style={{ 'minWidth': '100px', 'textAlign': 'center' }}>{activeCaso?.solicitante_cedula || ''}</span></div>
            </div>
            <div className="sig-box">
                <div className="sig-label">PERITO RECEPTOR</div>
                <div className="sig-sub">SHA256 Forensic Lab</div>
                <div className="sig-sub">Perito: {activeCaso?.peritoLider || '____________________'}</div>
            </div>
        </div>

        <div className="footer">
            Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) <br />
            SHA256 Forensic Lab - Tecnología al servicio de la justicia.
        </div>
    </div>

    <div className="no-print" style={{ 'textAlign': 'center', 'marginTop': '10px', 'marginBottom': '20px' }}>
        <button onClick={() => { window.print() }} style={{ 'padding': '10px 20px', 'background': '#FECF06', 'color': '#181818', 'border': 'none', 'borderRadius': '4px', 'cursor': 'pointer', 'fontWeight': 'bold', 'fontFamily': '"Inter", sans-serif', 'boxShadow': '0 2px 4px rgba(0,0,0,0.2)' }}>
            🖨️ Imprimir Acta PDF (Tamaño Oficio)
        </button>
    </div>

    </div>
  );
};

export default ActaObtencionPage;
