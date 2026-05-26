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
                <div className="form-nro">N° PRCC: <span style={{ marginLeft: '8px', borderBottom: '1px solid var(--border-color)', minWidth: '150px', display: 'inline-block', textAlign: 'center', fontWeight: 'bold' }}>{''}</span></div>
            </div>
        </header>

        {/*  SECCIÓN I  */}
        <div className="section">
            <div className="section-title">I. Datos del Consignante, del Caso y Organismo</div>
            <div className="grid-container">
                <div className="form-group"><div className="label">Apellidos y Nombres del Consignante</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">Cédula de Identidad</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">Teléfono de Contacto</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">N° de Expediente / Caso</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">N° PRCC</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">Organismo / Despacho que instruye</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">Lugar de Obtención (Dirección)</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">Fecha de Recepción</div><div className="value">{''}</div></div>
                <div className="form-group"><div className="label">Hora de Recepción</div><div className="value">{''}</div></div>
            </div>
        </div>

        {/*  SECCIÓN II  */}
        <div className="section">
            <div className="section-title">II. Forma de Obtención (MUCC-2017)</div>
            <div className="form-group">
                <div className="checkbox-group">
                    <div className="check-item"><span className="box"></span> <u>CONSIGNACIÓN</u> <span style={{ fontSize: '7px', color: 'var(--text-muted)' }}>(Entrega voluntaria)</span></div>
                    <div className="check-item"><span className="box"></span> TÉCNICA</div>
                    <div className="check-item"><span className="box"></span> ASEGURAMIENTO</div>
                    <div className="check-item"><span className="box"></span> DERIVACIÓN</div>
                </div>
            </div>
        </div>

        {/*  SECCIÓN III  */}
        <div className="section">
            <div className="section-title">III. Operarios (Perito Informático) — MUCC-2017</div>
            <div className="signature-grid">
                <div className="sig-card">
                    <div className="label">A. Fijación (Nombre, Cédula y Credencial)</div>
                    <div className="value" style={{ minHeight: '18px', fontWeight: 'bold', padding: '2px 5px' }}>{''}</div>
                    <div className="sig-row">
                        <div className="sig-firma-col">
                            <div className="sig-box" />
                            <span className="sig-label">FIRMA</span>
                        </div>
                        <div className="thumb-wrapper">
                            <div className="thumb-box" />
                            <span className="thumb-label">PULGAR DER.</span>
                        </div>
                    </div>
                </div>
                <div className="sig-card">
                    <div className="label">B. Colección (Nombre, Cédula y Credencial)</div>
                    <div className="value" style={{ minHeight: '18px', fontWeight: 'bold', padding: '2px 5px' }}>{''}</div>
                    <div className="sig-row">
                        <div className="sig-firma-col">
                            <div className="sig-box" />
                            <span className="sig-label">FIRMA</span>
                        </div>
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
                    <tr><td>Tipo de Dispositivo</td><td><div className="checkbox-group" style={{ flexDirection: 'row', gap: '15px', fontSize: '9px' }}>
                        <div className="check-item"><span className="box"></span> Teléfono Móvil Android</div>
                        <div className="check-item"><span className="box"></span> Computador</div>
                        <div className="check-item"><span className="box"></span> Tableta</div>
                        <div className="check-item"><span className="box"></span> Otro</div>
                    </div></td></tr>
                    <tr><td>Marca / Modelo</td><td>{''}</td></tr>
                    <tr><td>IMEI 1</td><td>{''}</td></tr>
                    <tr><td>IMEI 2</td><td>{''}</td></tr>
                    <tr><td>N° de Serie / Serial</td><td>{''}</td></tr>
                    <tr><td>N° de Línea / Teléfono</td><td>{''}</td></tr>
                    <tr><td>Tarjeta SIM</td><td>{''}</td></tr>
                    <tr><td>Estado Físico</td><td>
                        <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                            <div className="check-item"><span className="box"></span> Operativo</div>
                            <div className="check-item"><span className="box"></span> Daños en Pantalla</div>
                            <div className="check-item"><span className="box"></span> Batería Baja / Sin Batería</div>
                            <div className="check-item"><span className="box"></span> Golpe de Agua</div>
                            <div className="check-item"><span className="box"></span> Otros Daños Visibles</div>
                        </div>
                    </td></tr>
                    <tr><td>Modo Aislamiento Aplicado</td><td>
                        <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                            <div className="check-item"><span className="box"></span> Modo Avión Activado</div>
                            <div className="check-item"><span className="box"></span> Bolsa Faraday</div>
                            <div className="check-item"><span className="box"></span> SIM Extraída</div>
                        </div>
                    </td></tr>
                    <tr><td>N° Precinto / Sello de Seguridad</td><td>{''}</td></tr>
                    <tr><td>Tipo de Embalaje</td><td>
                        <div className="checkbox-group" style={{ flexDirection: 'row', gap: '10px', fontSize: '9px' }}>
                            <div className="check-item"><span className="box"></span> Bolsa Antiestática / Faraday</div>
                            <div className="check-item"><span className="box"></span> Caja de Cartón</div>
                            <div className="check-item"><span className="box"></span> Sobre de Evidencia</div>
                        </div>
                    </td></tr>
                    <tr><td>Accesorios Incluidos</td><td>{''}</td></tr>
                </tbody>
            </table>
            <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '9px' }}>
                ¿Continúa en Anexo A? <span className="box"></span> SI <span className="box"></span> NO
            </div>
        </div>

        {/*  SECCIÓN V  */}
        <div className="section">
            <div className="section-title">V. Recepción de la Evidencia — Consignación Voluntaria (MUCC-2017 Obtención por Consignación)</div>
            <table className="transfer-table">
                <tbody>
                    <tr>
                        <td style={{ width: '30%', verticalAlign: 'top' }}>
                            <div className="label">Motivo de la Consignación</div>
                            <div className="checkbox-group" style={{ flexDirection: 'column', gap: '4px', fontSize: '8px' }}>
                                <div className="check-item"><span className="box"></span> PERITAJE — Análisis Forense</div>
                                <div className="check-item"><span className="box"></span> RESGUARDO</div>
                            </div>
                        </td>
                        <td style={{ width: '35%', verticalAlign: 'top' }}>
                            <div className="sig-detail-card" style={{ minHeight: 'auto', border: 'none', padding: '0', background: 'transparent', gap: '4px' }}>
                                <div className="label">ENTREGA (Consignante)</div>
                                <div style={{ fontSize: '9px', marginBottom: '4px' }}>Nombre: <span style={{ fontWeight: 'bold' }}>____________________</span></div>
                                <div className="sig-line" style={{ height: '24px' }} />
                                <div className="sig-line-label" style={{ fontSize: '7px' }}>Firma</div>
                                <div className="sig-field" style={{ fontSize: '8px' }}>
                                    C.I.: <span className="sig-underline" style={{ minHeight: '16px' }}></span>
                                </div>
                                <div className="sig-field" style={{ fontSize: '8px' }}>
                                    Teléfono: <span className="sig-underline" style={{ minHeight: '16px' }}></span>
                                </div>
                                <div className="fingerprint-row" style={{ marginTop: '4px', paddingTop: '4px' }}>
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
                        </td>
                        <td style={{ width: '35%', verticalAlign: 'top' }}>
                            <div className="sig-detail-card" style={{ minHeight: 'auto', border: 'none', padding: '0', background: 'transparent', gap: '4px' }}>
                                <div className="label">RECIBE (Perito Informático)</div>
                                <div style={{ fontSize: '9px', marginBottom: '4px' }}>Nombre: <span style={{ fontWeight: 'bold' }}>____________________</span></div>
                                <div className="sig-line" style={{ height: '24px' }} />
                                <div className="sig-line-label" style={{ fontSize: '7px' }}>Firma</div>
                                <div className="sig-field" style={{ fontSize: '8px' }}>
                                    C.I.: <span className="sig-underline" style={{ minHeight: '16px' }}></span>
                                </div>
                                <div className="sig-field" style={{ fontSize: '8px' }}>
                                    Teléfono: <span className="sig-underline" style={{ minHeight: '16px' }}></span>
                                </div>
                                <div className="fingerprint-row" style={{ marginTop: '4px', paddingTop: '4px' }}>
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
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/*  DECLARACIÓN  */}
        <div className="section">
            <p style={{ fontSize: '7px', color: 'var(--text-muted)', textAlign: 'justify', marginTop: '5px', lineHeight: '1.2' }}>
                Yo, <span style={{ borderBottom: '1px solid var(--border-color)', minWidth: '200px', display: 'inline-block' }}>{' '}</span>, titular de la cédula de identidad N° <span style={{ borderBottom: '1px solid var(--border-color)', minWidth: '120px', display: 'inline-block' }}>{' '}</span>, 
                en pleno uso de mis facultades, declaro que hago entrega voluntaria del dispositivo móvil descrito en la Sección IV para su revisión técnica forense. 
                Autorizo al Laboratorio SHA256.US a realizar las pruebas técnicas necesarias sobre el equipo y su contenido digital, 
                conforme al <strong>Manual Único de Cadena de Custodia de Evidencias (MUCC-2017)</strong>, los <strong>Arts. 187 y 225 del COPP</strong>, 
                y la <strong>Ley sobre Mensajes de Datos y Firmas Electrónicas (Art. 4)</strong>. 
                Me comprometo a retirar el equipo una vez finalizado el peritaje, en un plazo no mayor a treinta (30) días continuos.
            </p>
        </div>

        <div className="footer">
            Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) — Obtención por Consignación — SHA256 Forensic Lab
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }} className="no-print">
            <button onClick={() => { window.print() }} className="print-button">🖨️ IMPRIMIR PLANILLA (TAMAÑO OFICIO)</button>
        </div>
    </div>

    </div>
  );
};

export default PlanillaPRCCPage;
