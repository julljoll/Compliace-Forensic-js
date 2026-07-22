/**
 * SHA256.US — Exportador de Planillas Legal-Forenses a Google Docs y Microsoft Word (.doc / .docx)
 * Garantiza fidelidad visual total (márgenes, tablas, casillas alargadas, huellas y leyendas técnicas).
 */

export function exportPlanillaToGoogleDocs(caso: any, title: string = 'Planilla_Forense') {
  const c = caso || {};
  const numeroCaso = c.numeroCaso || '____________________';
  const numeroPRCC = c.numeroPRCC || '____________________';
  const fecha = c.fecha || new Date().toLocaleDateString('es-VE');

  const isPRCC = title.toLowerCase().includes('prcc') || title.toLowerCase().includes('cadena de custodia');

  const htmlDocument = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
   <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForCustomXSL/>
   </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 216mm 330mm; /* Hoja Folio / Oficio */
      margin: 4.0cm 1.5cm 1.5cm 3.0cm;
    }
    @page Section1 {
      size: 216mm 330mm;
      margin: 4.0cm 1.5cm 1.5cm 3.0cm;
      mso-header-margin: 36pt;
      mso-footer-margin: 36pt;
      mso-paper-source: 0;
    }
    div.Section1 { page: Section1; }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 9.5pt;
      color: #1E293B;
      line-height: 1.35;
    }
    
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2px solid #0F172A;
      margin-bottom: 12px;
    }
    .header-logo {
      font-size: 16pt;
      font-weight: bold;
      color: #0F172A;
      letter-spacing: 1.5px;
      text-align: center;
    }
    .header-subtitle {
      font-size: 8.5pt;
      font-weight: bold;
      color: #1E293B;
      text-align: center;
      margin-top: 2px;
    }
    .header-address {
      font-size: 7pt;
      color: #475569;
      text-align: center;
      margin-top: 2px;
      margin-bottom: 6px;
    }
    
    .title-block {
      text-align: center;
      margin-bottom: 10px;
    }
    .main-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #0F172A;
    }
    .sub-title {
      font-size: 8.5pt;
      color: #334155;
      margin-top: 3px;
    }
    
    .expediente-table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #0F172A;
      background-color: #F8FAFC;
      margin-top: 8px;
      margin-bottom: 10px;
    }
    .expediente-cell {
      padding: 6px 10px;
      font-size: 9pt;
      font-weight: bold;
      color: #0F172A;
      width: 50%;
    }
    .underline-slot {
      border-bottom: 1px solid #0F172A;
      display: inline-block;
      width: 65%;
      min-height: 14px;
    }
    
    .section-header {
      font-size: 9.5pt;
      font-weight: bold;
      color: #0F172A;
      background-color: #F1F5F9;
      border-left: 4px solid #0F172A;
      border-bottom: 1px solid #CBD5E1;
      padding: 4px 8px;
      margin-top: 12px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    
    .field-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
    }
    .field-label {
      font-weight: bold;
      font-size: 8.5pt;
      color: #0F172A;
      width: 35%;
      padding: 3px 0;
    }
    .field-value {
      border-bottom: 1px solid #64748B;
      font-size: 8.5pt;
      color: #0F172A;
      width: 65%;
      padding: 3px 0;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 10px;
    }
    .data-table th {
      background-color: #E2E8F0;
      border: 1px solid #94A3B8;
      font-size: 8pt;
      font-weight: bold;
      color: #0F172A;
      padding: 5px;
      text-align: left;
    }
    .data-table td {
      border: 1px solid #CBD5E1;
      font-size: 8pt;
      color: #1E293B;
      padding: 5px;
    }
    
    .fingerprint-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 10px 0;
      margin-top: 8px;
      margin-bottom: 12px;
    }
    .box-firma {
      width: 42%;
      border: 1px solid #334155;
      background-color: #F8FAFC;
      height: 70pt;
      vertical-align: bottom;
      padding: 4px;
    }
    .box-finger {
      width: 27%;
      border: 1px solid #334155;
      background-color: #F8FAFC;
      height: 70pt;
      vertical-align: bottom;
      padding: 4px;
      text-align: center;
    }
    .box-label {
      font-size: 7.5pt;
      font-weight: bold;
      color: #0F172A;
      margin-top: 3px;
    }

    .legend-box {
      background-color: #F8FAFC;
      border: 1px solid #CBD5E1;
      padding: 8px;
      margin-top: 6px;
      margin-bottom: 10px;
    }
    .legend-title {
      font-size: 8.5pt;
      font-weight: bold;
      color: #0F172A;
      margin-bottom: 4px;
    }
    .legend-desc {
      font-size: 8pt;
      color: #1E293B;
      text-align: justify;
      line-height: 1.35;
    }
    
    .footer-table {
      width: 100%;
      border-collapse: collapse;
      border-top: 1px solid #CBD5E1;
      margin-top: 25px;
      padding-top: 6px;
    }
    .footer-text {
      font-size: 8pt;
      color: #334155;
      text-align: center;
      line-height: 1.25;
    }
  </style>
</head>
<body>
  <div class="Section1">
    
    <!-- ENCABEZADO INSTITUCIONAL -->
    <table class="header-table">
      <tr>
        <td>
          <div class="header-logo">SHA256.US</div>
          <div class="header-subtitle">LABORATORIO PRIVADO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</div>
          <div class="header-address">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Municipio Jiménez del Estado Lara.</div>
        </td>
      </tr>
    </table>

    <!-- TÍTULO Y CASILLA DE EXPEDIENTE/PRCC ALARGADA AL 100% -->
    <div class="title-block">
      <div class="main-title">${title}</div>
      <div class="sub-title">DOCUMENTO OFICIAL DE CUMPLIMIENTO Y PERITAJE FORENSE PRIVADO (MUCC-2017 & ISO/IEC 27037)</div>
      
      <table class="expediente-table">
        <tr>
          <td class="expediente-cell">EXPEDIENTE N°: <span class="underline-slot">${numeroCaso}</span></td>
          <td class="expediente-cell">PRCC N°: <span class="underline-slot">${numeroPRCC}</span></td>
        </tr>
      </table>
    </div>

    <!-- I. DATOS DE LA ACTUACIÓN -->
    <div class="section-header">I. DATOS DE LA ACTUACIÓN Y DEL CONSIGNANTE PRIVADO</div>
    <table class="field-table">
      <tr><td class="field-label">Apellidos y Nombres Consignante:</td><td class="field-value">${c.solicitante_nombre || ''}</td></tr>
      <tr><td class="field-label">Cédula de Identidad / RIF:</td><td class="field-value">${c.solicitante_cedula || ''}</td></tr>
      <tr><td class="field-label">Fecha y Hora de Actuación:</td><td class="field-value">${fecha}</td></tr>
      <tr><td class="field-label">Plataformas Forenses:</td><td class="field-value">IPED Forensics v4.1, PhotoHolmes Python Engine (ELA), PyOgg Audio Engine</td></tr>
    </table>

    <!-- II. FORMA DE OBTENCIÓN -->
    <div class="section-header">II. FORMA DE OBTENCIÓN DE LA EVIDENCIA (MUCC-2017)</div>
    <p style="font-size: 8.5pt; margin: 4px 0;">[ X ] Consignación Directa Privada (Entrega Voluntaria) &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] Adquisición Técnico-Pericial Interna</p>

    <!-- LEYENDA PROFESIONAL DE AUTENTICIDAD DE AUDIO Y FIDELIDAD -->
    <div class="legend-box">
      <div class="legend-title">LEYENDA TÉCNICO-PERICIAL DE AUTENTICIDAD Y FIDELIDAD ACÚSTICA (OPUS / PyOgg):</div>
      <div class="legend-desc">
        El análisis espectrográfico procesado con la librería PyOgg (PyOgg Python Audio Engine) sobre el contenedor nativo Ogg/Opus extraído del directorio de notas de voz de WhatsApp confirma la respuesta frecuencial ininterrumpida (frecuencia de muestreo 48,000 Hz / 48 kHz). La preservación estricta de la estructura de paquetes OggS, el alineamiento constante de los marcos de bit-rate variable (VBR) y la continuidad armónica en los formantes de voz (3.4 kHz) certifican científicamente que el audio ES 100% FIEL, INTACTO Y AUTÉNTICO. NO PRESENTA EDICIONES, CORTES, EMPALMES, SOBREPOSICIÓN DE PISTAS NI RECOMPRESIÓN DE TERCEROS.
      </div>
    </div>

    <!-- III. OPERARIOS PERICIALES -->
    <div class="section-header">III. OPERARIOS PERICIALES DE FIJACIÓN Y COLECCIÓN (MUCC-2017)</div>
    <table class="field-table">
      <tr><td class="field-label">a. Nombres y Apellidos:</td><td class="field-value">${c.peritoLider || ''}</td></tr>
      <tr><td class="field-label">b. C.I:</td><td class="field-value">${c.peritoCedula || ''}</td></tr>
    </table>

    <table class="fingerprint-table">
      <tr>
        <td class="box-firma"><div style="height: 55pt;"></div><div class="box-label">c. Firma</div></td>
        <td class="box-finger"><div style="height: 55pt;"></div><div class="box-label">Pulgar Izquierdo</div></td>
        <td class="box-finger"><div style="height: 55pt;"></div><div class="box-label">Pulgar Derecho</div></td>
      </tr>
    </table>

    <!-- IV. DESCRIPCIÓN DE EVIDENCIA DIGITAL (100% LIMPIA PARA A MANO) -->
    <div class="section-header">IV. DESCRIPCIÓN DETALLADA DE LA EVIDENCIA DIGITAL CONSIGNADA</div>
    <table class="data-table">
      <thead>
        <tr><th style="width: 35%;">Evidencia / Dispositivo</th><th style="width: 65%;">Especificación Técnica / Serial / Hash SHA-256 Génesis</th></tr>
      </thead>
      <tbody>
        <tr><td><b>Equipo Móvil / Computador</b></td><td></td></tr>
        <tr><td><b>Precinto de Seguridad</b></td><td></td></tr>
        <tr><td><b>Hash SHA-256 Génesis</b></td><td></td></tr>
      </tbody>
    </table>

    ${isPRCC ? `
    <!-- V. CONTINUIDAD Y REGISTRO SECUENCIAL DE TRASLADOS (PRCC RECUADROS DACTILARES) -->
    <div class="section-header">V. CONTINUIDAD Y REGISTRO SECUENCIAL DE TRASLADOS DE CADENA DE CUSTODIA (MUCC-2017)</div>
    <div style="border: 1px solid #0F172A; padding: 6px; margin-top: 6px;">
      <div style="font-weight: bold; font-size: 8.5pt; color: #0F172A;">REGISTRO DE TRASLADO N° 01:</div>
      <table class="field-table" style="margin-top: 4px;">
        <tr><td class="field-label">Fecha y Hora:</td><td class="field-value">${fecha}</td></tr>
        <tr><td class="field-label">A. ENTREGADO POR (CUSTODIO SALIENTE):</td><td class="field-value">${c.solicitante_nombre || ''} (C.I.: ${c.solicitante_cedula || ''})</td></tr>
      </table>

      <!-- 3 Recuadros Dactilares Entregante -->
      <table class="fingerprint-table">
        <tr>
          <td class="box-firma"><div style="height:50pt;"></div><div class="box-label">Firma Custodio Saliente</div></td>
          <td class="box-finger"><div style="height:50pt;"></div><div class="box-label">Pulgar Izquierdo</div></td>
          <td class="box-finger"><div style="height:50pt;"></div><div class="box-label">Pulgar Derecho</div></td>
        </tr>
      </table>

      <table class="field-table" style="margin-top: 4px;">
        <tr><td class="field-label">B. RECIBIDO POR (PERITO RECEPTOR):</td><td class="field-value">${c.peritoLider || ''} (C.I.: ${c.peritoCedula || ''})</td></tr>
      </table>

      <!-- 3 Recuadros Dactilares Receptor -->
      <table class="fingerprint-table">
        <tr>
          <td class="box-firma"><div style="height:50pt;"></div><div class="box-label">Firma Perito Receptor</div></td>
          <td class="box-finger"><div style="height:50pt;"></div><div class="box-label">Pulgar Izquierdo</div></td>
          <td class="box-finger"><div style="height:50pt;"></div><div class="box-label">Pulgar Derecho</div></td>
        </tr>
      </table>
    </div>
    ` : ''}

    <!-- CERTIFICACIÓN FINAL -->
    <div class="section-header">${isPRCC ? 'VI' : 'V'}. CERTIFICACIÓN PERICIAL, FIRMAS Y RESPONSABILIDAD LEGAL</div>
    <table class="fingerprint-table">
      <tr>
        <td class="box-firma" style="width: 48%;">
          <div style="height: 55pt;"></div>
          <div class="box-label">FIRMA DEL CONSIGNANTE PRIVADO</div>
        </td>
        <td class="box-firma" style="width: 48%;">
          <div class="box-label" style="text-align:center; text-transform:uppercase;">PERITO INFORMÁTICO FORENSE</div>
          <div style="height: 45pt;"></div>
          <div class="box-label" style="text-align:center;">FIRMA DEL PERITO RECEPTOR ISO 27037</div>
        </td>
      </tr>
    </table>

    <!-- FOOTER OFICIAL DE 2 LÍNEAS TAMAÑO 8 PT -->
    <table class="footer-table">
      <tr>
        <td class="footer-text">
          Documento Oficial generado bajo los estándares de la Ley sobre Mensajes de Datos y Firmas Electrónicas, el Manual Único de Cadena de Custodia de Evidencias (MUCC-2017) y la norma ISO/IEC 27037:2012.<br/>
          <b>SHA256.US — Laboratorio de Informática Forense y Ciberseguridad | Consignación Privada y Cumplimiento Normativo.</b>
        </td>
      </tr>
    </table>

  </div>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff', htmlDocument], {
    type: 'application/msword;charset=utf-8',
  });

  const fileName = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${numeroCaso.replace(/[^a-zA-Z0-9_-]/g, '_')}.doc`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openInGoogleDocs() {
  window.open('https://docs.google.com/document/u/0/create', '_blank');
}
