import React, { useEffect } from 'react';
import './Planillas.css';

const PlanillaPRCCPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="planilla-container">

    <div className="page">
        <div className="watermark">DERIVACIÓN</div>

        <header>
            <div className="logo-container">
                <span className="logo-text">SHA256.US</span>
                <span className="logo-subtext">Laboratorio de Informática Forense y Ciberseguridad</span>
                <span className="address-text">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quibor, Municipio Jiménez del Estado Lara.</span>
            </div>
            <div className="form-header-info">
                <h1 className="form-title-main">Planilla de Cadena de Custodia</h1>
                <div className="form-nro">N° PRCC: <span style={{ 'marginLeft': '8px', 'borderBottom': '1px solid var(--border-color)', 'minWidth': '100px', 'display': 'inline-block' }}></span></div>
            </div>
        </header>

        {/*  SECCIÓN I  */}
        <div className="section">
            <div className="section-title">I. Datos Generales (Obtención por Derivación)</div>
            <div className="grid-container">
                <div className="form-group"><div className="label">N° de Expediente / Causa</div><div className="value"></div></div>
                <div className="form-group" style={{ 'background': 'rgba(254, 207, 6, 0.05)' }}><div className="label" style={{ 'color': 'var(--primary-color)' }}>Nueva PRCC (Correlativo Derivado)</div><div className="value"></div></div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}><div className="label">Organismo / Despacho que Instruye</div><div className="value"></div></div>
                <div className="form-group"><div className="label">Despacho que inicia custodia</div><div className="value"></div></div>
                <div className="form-group"><div className="label">Fecha de Obtención</div><div className="value"></div></div>
                <div className="form-group"><div className="label">Hora de Obtención</div><div className="value"></div></div>
            </div>
        </div>

        {/*  SECCIÓN II  */}
        <div className="section">
            <div className="section-title">II. Forma de Obtención</div>
            <div className="form-group">
                <div className="checkbox-group">
                    <div className="check-item"><span className="box"></span> TÉCNICA</div>
                    <div className="check-item"><span className="box"></span> ASEGURAMIENTO</div>
                    <div className="check-item"><span className="box"></span> CONSIGNACIÓN</div>
                    <div className="check-item"><span className="box" style={{ 'background': 'rgba(254, 207, 6, 0.1)', 'color': 'var(--primary-color)' }}></span> <u>DERIVACIÓN</u></div>
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
            <div className="section-title">IV. Descripción de la Evidencia Digital Derivada</div>
            <div className="form-group">
                <div className="value" style={{ 'minHeight': '80px', 'fontSize': '11px', 'color': 'var(--text-muted)' }}>
                </div>
                <div style={{ 'textAlign': 'right', 'marginTop': '5px', 'fontSize': '9px' }}>
                    ¿Continúa en Anexo A? <span className="box"></span> SI <span className="box"></span> NO
                </div>
            </div>
        </div>

        {/*  SECCIÓN V  */}
        <div className="section">
            <div className="section-title">V. Transferencia de la Evidencia</div>
            <table className="transfer-table">
                <tr>
                    <td style={{ 'width': '30%' }}>
                        <div className="label">Motivo</div>
                        <div className="checkbox-group" style={{ 'flexDirection': 'column', 'gap': '4px', 'fontSize': '8px' }}>
                            <div className="check-item"><span className="box"></span> TRASLADO</div>
                            <div className="check-item"><span className="box"></span> PERITAJE</div>
                            <div className="check-item"><span className="box"></span> RESGUARDO</div>
                        </div>
                    </td>
                    <td style={{ 'width': '35%' }}>
                        <div className="label">Entrega</div>
                        <div style={{ 'fontSize': '9px', 'marginBottom': '4px' }}>Nombre/C.I.:</div>
                        <div className="sig-row" style={{ 'marginTop': '0' }}>
                            <div className="sig-box" style={{ 'height': '35px' }}><span className="sig-label">FIRMA</span></div>
                            <div className="thumb-box" style={{ 'height': '45px', 'width': '35px', 'fontSize': '5px' }}>HUELLA</div>
                        </div>
                    </td>
                    <td style={{ 'width': '35%' }}>
                        <div className="label">Recibe</div>
                        <div style={{ 'fontSize': '9px', 'marginBottom': '4px' }}>Nombre/C.I.:</div>
                        <div className="sig-row" style={{ 'marginTop': '0' }}>
                            <div className="sig-box" style={{ 'height': '35px' }}><span className="sig-label">FIRMA</span></div>
                            <div className="thumb-box" style={{ 'height': '45px', 'width': '35px', 'fontSize': '5px' }}>HUELLA</div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        {/*  ANEXO B  */}
        <div className="anexo-derivacion">
            <div className="anexo-header">Anexo B: Trazabilidad de Derivación Forense</div>
            <div className="grid-container" style={{ 'gridTemplateColumns': '2fr 1fr 1.5fr' }}>
                <div className="form-group"><div className="label">Forense que deriva</div><div className="value"></div></div>
                <div className="form-group"><div className="label">Fecha/Hora</div><div className="value"></div></div>
                <div className="form-group"><div className="label">N° Dictamen Pericial Origen</div><div className="value"></div></div>
            </div>
            <div className="form-group" style={{ 'marginTop': '8px' }}>
                <div className="label">Relación de Archivos y Hashes (Derivados del Matriz)</div>
                <div className="value" style={{ 'minHeight': '50px' }}></div>
            </div>
            <p style={{ 'fontSize': '7px', 'color': 'var(--text-muted)', 'textAlign': 'justify', 'marginTop': '5px', 'lineHeight': '1.1' }}>
                Se deja constancia de que la data digital aquí descrita es producto de una extracción técnica validada, manteniendo la integridad inalterable del dispositivo de origen y cumpliendo con el Manual Único de Cadena de Custodia (2017).
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
