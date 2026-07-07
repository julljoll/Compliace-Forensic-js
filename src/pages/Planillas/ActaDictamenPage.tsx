import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import { downloadPlanillaZip } from './downloadPlanillaZip';
import PlanillaToolbar from '../../components/molecules/PlanillaToolbar';

const ActaDictamenPage = () => {
  const [searchParams] = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Manejador interactivo para marcar casillas con una "X" al hacer clic
    const handleCheckboxClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const box = target.closest('.check-item .box, .check-item');
      if (box) {
        const spanBox = box.classList.contains('box') ? box : box.querySelector('.box');
        if (spanBox) {
          if (spanBox.textContent === 'X') {
            spanBox.textContent = '';
          } else {
            spanBox.textContent = 'X';
          }
        }
      }
    };

    document.addEventListener('click', handleCheckboxClick);
    return () => {
      document.removeEventListener('click', handleCheckboxClick);
    };
  }, []);

  const fallbackCaso = {
    numeroCaso: '',
    solicitante_nombre: '',
    solicitante_cedula: '',
    dispositivo_marca: '',
    dispositivo_modelo: '',
    dispositivo_imei: '',
    peritoLider: 'Carlos Mendoza',
    tipoProyecto: '',
  };

  const c = caso || fallbackCaso;

  const camposRequeridos = [
    { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
    { valor: caso?.solicitante_nombre, nombre: 'Nombre del Consignante' },
    { valor: caso?.solicitante_cedula, nombre: 'Cédula del Consignante' },
    { valor: caso?.peritoLider, nombre: 'Nombre del Perito Forense' },
  ];

  const handlePrint = () => {
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
            <h1 className="acta-title">Dictamen Pericial Informático</h1>
            <div className="acta-nro">
              N° EXPEDIENTE: <span className="box-inline" contentEditable suppressContentEditableWarning style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>{c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}</span>
            </div>
          </div>
        </header>

        {/*  I. DATOS DEL CASO  */}
        <div className="section">
          <div className="section-title">I. Datos del Consignante y del Caso</div>
          <div className="grid-container">
            <div className="form-group">
              <div className="label">Apellidos y Nombres del Consignante</div>
              <div className="value" contentEditable suppressContentEditableWarning>
                {c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Apellidos y Nombres del Consignante]</span>}
              </div>
            </div>
            <div className="form-group">
              <div className="label">Cédula de Identidad</div>
              <div className="value" contentEditable suppressContentEditableWarning>
                {c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[Cédula de Identidad]</span>}
              </div>
            </div>
            <div className="form-group">
              <div className="label">N° de Expediente / Caso</div>
              <div className="value" contentEditable suppressContentEditableWarning>
                {c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}
              </div>
            </div>
            <div className="form-group">
              <div className="label">Fecha del Dictamen</div>
              <div className="value" contentEditable suppressContentEditableWarning>
                <span className="placeholder-field">[Fecha del Dictamen]</span>
              </div>
            </div>
          </div>
        </div>

        {/*  II. DISPOSITIVO EXAMINADO  */}
        <div className="section">
          <div className="section-title">II. Dispositivo Examinado</div>
          <table className="evidence-table">
            <tbody>
              <tr>
                <td>Tipo de Dispositivo</td>
                <td contentEditable suppressContentEditableWarning>{c.tipoProyecto === 'forense_discoduro' ? 'Disco Duro' : 'Móvil / Android'}</td>
              </tr>
              <tr>
                <td>Marca / Modelo</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_marca || c.dispositivo_modelo ? `${c.dispositivo_marca || ''} ${c.dispositivo_modelo || ''}`.trim() : <span className="placeholder-field">[Marca / Modelo del Dispositivo]</span>}
                </td>
              </tr>
              <tr>
                <td>IMEI / Serial</td>
                <td contentEditable suppressContentEditableWarning>
                  {c.dispositivo_imei ? c.dispositivo_imei : <span className="placeholder-field">[Serial / IMEI del Dispositivo]</span>}
                </td>
              </tr>
              <tr>
                <td>N° PRCC Asociado</td>
                <td contentEditable suppressContentEditableWarning><span className="placeholder-field">[N° PRCC Asociado]</span></td>
              </tr>
            </tbody>
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
          <div className="form-group" style={{ marginTop: '10px' }}>
            <div className="label">Herramientas Forenses Utilizadas</div>
            <div className="value" contentEditable suppressContentEditableWarning style={{ minHeight: '40px', padding: '5px', fontSize: '11px', fontWeight: 'bold' }}>
              <span className="placeholder-field">[Herramientas forenses aplicadas: Andriller, FTK Imager, Autopsy, etc.]</span>
            </div>
          </div>
        </div>

        {/*  IV. EXÁMENES PRACTICADOS  */}
        <div className="section">
          <div className="section-title">IV. Exámenes Practicados</div>
          <div className="form-group">
            <div className="value examenes-value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">
                [Describa cronológica y técnicamente los exámenes forenses y las operaciones aplicadas sobre el dispositivo para la adquisición y análisis]
              </span>
            </div>
          </div>
          <div className="legal-text" style={{ marginTop: '8px' }}>
            <strong>Resguardo de Integridad:</strong> Se generaron los siguientes valores hash para garantizar la inalterabilidad de la evidencia:
            <div style={{ fontFamily: 'monospace', marginTop: '4px', fontSize: '9px', fontWeight: 'bold' }} contentEditable suppressContentEditableWarning>
              SHA-256 Original: <span className="placeholder-field">[Ingrese el hash SHA-256 original de la evidencia]</span><br />
              SHA-256 Copia: <span className="placeholder-field">[Ingrese el hash SHA-256 copia de respaldo]</span><br />
              MD5: <span className="placeholder-field">[MD5 (Opcional)]</span>
            </div>
          </div>
        </div>

        {/*  V. RESULTADOS Y HALLAZGOS  */}
        <div className="section">
          <div className="section-title">V. Resultados y Hallazgos</div>
          <div className="form-group">
            <div className="value hallazgos-value" contentEditable suppressContentEditableWarning>
              El análisis forense digital realizado al dispositivo y/o almacenamiento ha arrojado los siguientes hallazgos de interés criminalístico:
              <br /><br />
              <strong>Detalle técnico:</strong> <span className="placeholder-field">[Describa los resultados, hallazgos, chats y registros forenses de interés criminalístico]</span>
              <br /><br />
              Se han verificado y extraído los registros de comunicaciones correspondientes en orden cronológico, confirmando la existencia de las evidencias digitales asociadas al caso investigado, resguardando la cadena de custodia inalterable.
            </div>
          </div>
        </div>

        {/*  VI. CONCLUSIONES TÉCNICAS  */}
        <div className="section">
          <div className="section-title">VI. Conclusiones Técnicas</div>
          <div className="legal-text">
            En virtud de los exámenes practicados y los resultados obtenidos, se concluye:
          </div>
          <div className="form-group" style={{ marginTop: '8px' }}>
            <div className="value conclusiones-value" contentEditable suppressContentEditableWarning>
              <span className="placeholder-field">
                [Describa las conclusiones técnicas de la investigación forense digital]
              </span>
            </div>
          </div>
        </div>

        {/*  VII. FUNDAMENTACIÓN LEGAL  */}
        <div className="section">
          <div className="section-title">VII. Fundamentación Legal</div>
          <div className="legal-text" style={{ fontSize: '8px' }}>
            <p>El presente dictamen se emite con fundamento en:</p>
            <ul style={{ margin: '4px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
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
          <div className="legal-text" style={{ fontSize: '8px' }}>
            El perito actuante declara que los exámenes fueron realizados conforme a los principios científicos y técnicos 
            de la informática forense, utilizando metodologías validadas y herramientas forenses reconocidas. 
            La evidencia digital fue manejada bajo estrictas normas de cadena de custodia, garantizando su integridad e inalterabilidad. 
            El presente dictamen se emite de buena fe, con objetividad e imparcialidad técnica.
          </div>
        </div>

        {/*  IX. FIRMAS  */}
        <div className="signature-section" style={{ gap: '14mm' }}>
          <div className="sig-detail-card">
            <div className="sig-detail-label">PERITO FORENSE</div>
            <div className="sig-line" />
            <div className="sig-line-label">Firma</div>
            <div className="sig-field">
              Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.peritoLider ? c.peritoLider : <span className="placeholder-field">[Nombre del Perito Forense]</span>}</span>
            </div>
            <div className="sig-field">
              Cargo: <span className="sig-underline" contentEditable suppressContentEditableWarning><span className="placeholder-field">[Experto Informático Forense]</span></span>
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
            <div className="sig-detail-label">EL CONSIGNANTE</div>
            <div className="sig-line" />
            <div className="sig-line-label">Firma</div>
            <div className="sig-field">
              Nombre: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_nombre ? c.solicitante_nombre : <span className="placeholder-field">[Nombre del Consignante]</span>}</span>
            </div>
            <div className="sig-field">
              C.I.: <span className="sig-underline" contentEditable suppressContentEditableWarning>{c.solicitante_cedula ? c.solicitante_cedula : <span className="placeholder-field">[C.I.]</span>}</span>
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
          Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) | SHA256 Forensic Lab<br />
          Tecnología al servicio de la justicia.
        </div>
      </div>

      <PlanillaToolbar
        onPrint={handlePrint}
        onDownloadZip={() => downloadPlanillaZip(`DictamenPericial_${c.numeroCaso || 'caso'}`, 'Dictamen Pericial Informático')}
        tituloDocumento="Dictamen Pericial Informático"
        camposRequeridos={camposRequeridos}
        casoId={casoId}
      />
    </div>
  );
};

export default ActaDictamenPage;
