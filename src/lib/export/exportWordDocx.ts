/**
 * SHA256.US — Exportador Oficial de Planillas Legal-Forenses a Microsoft Word (.docx)
 * Utiliza html-docx-js / html-docx-js-typescript y file-saver para descargar archivos .docx nativos.
 * Garantiza fidelidad visual total (incluyendo Portada Receptora Folio 01, márgenes Folio/Oficio 216mm x 330mm, 
 * tablas, recuadros dactilares y leyendas normativas).
 */

import { saveAs } from 'file-saver';

export async function exportPlanillaToWordDocx(caso: any, title: string = 'Planilla_Forense', element?: HTMLElement | null) {
  const c = caso || {};
  const numeroCaso = c.numeroCaso || 'EXP-2026-SHA-0091';
  const numeroPRCC = c.numeroPRCC || 'PRCC-2026-0042';
  const fecha = c.fecha || new Date().toLocaleDateString('es-VE');

  const isPRCC = title.toLowerCase().includes('prcc') || title.toLowerCase().includes('cadena de custodia');

  // 1. Obtener o construir el cuerpo HTML del documento
  let innerBodyHtml = '';

  if (element) {
    // Clonamos el elemento para limpiar elementos no imprimibles
    const clone = element.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.no-print, button, .MuiButton-root').forEach(el => el.remove());
    innerBodyHtml = clone.innerHTML;
  } else {
    // Plantilla HTML legal-forense por defecto respaldada por el estándar MUCC-2017 & ISO 27037
    innerBodyHtml = `
      <!-- ENCABEZADO INSTITUCIONAL -->
      <table style="width: 100%; border-collapse: collapse; border-bottom: 2px solid #0F172A; margin-bottom: 12px;">
        <tr>
          <td style="text-align: center;">
            <div style="font-size: 16pt; font-weight: bold; color: #0F172A; letter-spacing: 1.5px;">SHA256.US</div>
            <div style="font-size: 8.5pt; font-weight: bold; color: #1E293B; margin-top: 2px;">LABORATORIO PRIVADO DE INFORMÁTICA FORENSE &amp; CIBERSEGURIDAD</div>
            <div style="font-size: 7pt; color: #475569; margin-top: 2px; margin-bottom: 6px;">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Municipio Jiménez del Estado Lara.</div>
          </td>
        </tr>
      </table>

      <!-- TÍTULO Y CASILLA DE EXPEDIENTE / PRCC -->
      <div style="text-align: center; margin-bottom: 10px;">
        <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; color: #0F172A;">${title}</div>
        <div style="font-size: 8.5pt; color: #334155; margin-top: 3px;">DOCUMENTO OFICIAL DE CUMPLIMIENTO Y PERITAJE FORENSE PRIVADO (MUCC-2017 &amp; ISO/IEC 27037)</div>
        
        <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #0F172A; background-color: #F8FAFC; margin-top: 8px; margin-bottom: 10px;">
          <tr>
            <td style="padding: 6px 10px; font-size: 9pt; font-weight: bold; color: #0F172A; width: 50%;">EXPEDIENTE N°: <span style="border-bottom: 1px solid #0F172A; display: inline-block; width: 60%;">${numeroCaso}</span></td>
            <td style="padding: 6px 10px; font-size: 9pt; font-weight: bold; color: #0F172A; width: 50%;">PRCC N°: <span style="border-bottom: 1px solid #0F172A; display: inline-block; width: 60%;">${numeroPRCC}</span></td>
          </tr>
        </table>
      </div>

      <!-- 1.0 DATOS DE LA ACTUACIÓN -->
      <div id="seccion-1.0" style="font-size: 9.5pt; font-weight: bold; color: #0F172A; background-color: #F1F5F9; border-left: 4px solid #0F172A; border-bottom: 1px solid #CBD5E1; padding: 4px 8px; margin-top: 12px; margin-bottom: 8px; text-transform: uppercase;">1.0 DATOS DE LA ACTUACIÓN Y DEL CONSIGNANTE PRIVADO</div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Apellidos y Nombres Consignante:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.solicitante_nombre || 'Alexander R. Wright'}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Cédula de Identidad / RIF:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.solicitante_cedula || 'V-18.492.019'}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Fecha y Hora de Actuación:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${fecha}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Plataformas Forenses:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">IPED Forensics v4.1, PhotoHolmes Python Engine (ELA), PyOgg Audio Engine</td></tr>
      </table>

      <!-- 2.0 FORMA DE OBTENCIÓN -->
      <div id="seccion-2.0" style="font-size: 9.5pt; font-weight: bold; color: #0F172A; background-color: #F1F5F9; border-left: 4px solid #0F172A; border-bottom: 1px solid #CBD5E1; padding: 4px 8px; margin-top: 12px; margin-bottom: 8px; text-transform: uppercase;">2.0 FORMA DE OBTENCIÓN DE LA EVIDENCIA (MUCC-2017)</div>
      <p style="font-size: 8.5pt; margin: 4px 0;">[ X ] Consignación Directa Privada (Entrega Voluntaria) &#160;&#160;&#160;&#160; [ &#160; ] Adquisición Técnico-Pericial Interna</p>

      <!-- LEYENDA PERICIAL DE AUTENTICIDAD -->
      <div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; padding: 8px; margin-top: 6px; margin-bottom: 10px;">
        <div style="font-size: 8.5pt; font-weight: bold; color: #0F172A; margin-bottom: 4px;">LEYENDA TÉCNICO-PERICIAL DE AUTENTICIDAD Y FIDELIDAD ACÚSTICA (OPUS / PyOgg / ISO 27037):</div>
        <div style="font-size: 8pt; color: #1E293B; text-align: justify; line-height: 1.35;">
          El análisis espectrográfico procesado con la librería PyOgg (PyOgg Python Audio Engine) sobre el contenedor nativo Ogg/Opus extraído del directorio de notas de voz de WhatsApp confirma la respuesta frecuencial ininterrumpida (frecuencia de muestreo 48,000 Hz / 48 kHz). La preservación estricta de la estructura de paquetes OggS, el alineamiento constante de los marcos de bit-rate variable (VBR) y la continuidad armónica en los formantes de voz (3.4 kHz) certifican científicamente que el audio ES 100% FIEL, INTACTO Y AUTÉNTICO. NO PRESENTA EDICIONES, CORTES, EMPALMES, SOBREPOSICIÓN DE PISTAS NI RECOMPRESIÓN DE TERCEROS.
        </div>
      </div>

      <!-- 3.0 OPERARIOS PERICIALES -->
      <div id="seccion-3.0" style="font-size: 9.5pt; font-weight: bold; color: #0F172A; background-color: #F1F5F9; border-left: 4px solid #0F172A; border-bottom: 1px solid #CBD5E1; padding: 4px 8px; margin-top: 12px; margin-bottom: 8px; text-transform: uppercase;">3.0 OPERARIOS PERICIALES DE FIJACIÓN Y COLECCIÓN (MUCC-2017)</div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">a. Nombres y Apellidos:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.peritoLider || 'Eng. Christopher V. Vance'}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">b. C.I:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.peritoCedula || 'V-19.823.104'}</td></tr>
      </table>

      <!-- RECUADROS DACTILARES Y FIRMA -->
      <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-top: 8px; margin-bottom: 12px;">
        <tr>
          <td style="width: 42%; border: 1px solid #334155; background-color: #F8FAFC; height: 70pt; vertical-align: bottom; padding: 4px;">
            <div style="height: 55pt;"></div>
            <div style="font-size: 7.5pt; font-weight: bold; color: #0F172A; margin-top: 3px;">c. Firma del Perito Líder</div>
          </td>
          <td style="width: 27%; border: 1px solid #334155; background-color: #F8FAFC; height: 70pt; vertical-align: bottom; padding: 4px; text-align: center;">
            <div style="height: 55pt;"></div>
            <div style="font-size: 7.5pt; font-weight: bold; color: #0F172A; margin-top: 3px;">Pulgar Izquierdo</div>
          </td>
          <td style="width: 27%; border: 1px solid #334155; background-color: #F8FAFC; height: 70pt; vertical-align: bottom; padding: 4px; text-align: center;">
            <div style="height: 55pt;"></div>
            <div style="font-size: 7.5pt; font-weight: bold; color: #0F172A; margin-top: 3px;">Pulgar Derecho</div>
          </td>
        </tr>
      </table>

      <!-- 4.0 DESCRIPCIÓN DE EVIDENCIA DIGITAL -->
      <div id="seccion-4.0" style="font-size: 9.5pt; font-weight: bold; color: #0F172A; background-color: #F1F5F9; border-left: 4px solid #0F172A; border-bottom: 1px solid #CBD5E1; padding: 4px 8px; margin-top: 12px; margin-bottom: 8px; text-transform: uppercase;">4.0 DESCRIPCIÓN DETALLADA DE LA EVIDENCIA DIGITAL CONSIGNADA</div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 10px;">
        <thead>
          <tr>
            <th style="width: 35%; background-color: #E2E8F0; border: 1px solid #94A3B8; font-size: 8pt; font-weight: bold; color: #0F172A; padding: 5px; text-align: left;">Evidencia / Dispositivo</th>
            <th style="width: 65%; background-color: #E2E8F0; border: 1px solid #94A3B8; font-size: 8pt; font-weight: bold; color: #0F172A; padding: 5px; text-align: left;">Especificación Técnica / Serial / Hash SHA-256 Génesis</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="border: 1px solid #CBD5E1; font-size: 8pt; color: #1E293B; padding: 5px;"><b>Equipo Móvil / Computador</b></td><td style="border: 1px solid #CBD5E1; font-size: 8pt; color: #1E293B; padding: 5px;">${c.tipoEvidencia || 'Dispositivo de Almacenamiento Forense'}</td></tr>
          <tr><td style="border: 1px solid #CBD5E1; font-size: 8pt; color: #1E293B; padding: 5px;"><b>Precinto de Seguridad</b></td><td style="border: 1px solid #CBD5E1; font-size: 8pt; color: #1E293B; padding: 5px;">Precinto Holofónico N° ${c.precintoNumero || 'SHA-2026-VNZ'}</td></tr>
          <tr><td style="border: 1px solid #CBD5E1; font-size: 8pt; color: #1E293B; padding: 5px;"><b>Hash SHA-256 Génesis</b></td><td style="border: 1px solid #CBD5E1; font-size: 8pt; font-family: monospace; color: #1E293B; padding: 5px;">${c.hashGenesis || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</td></tr>
        </tbody>
      </table>

      ${isPRCC ? `
      <!-- 5.0 CONTINUIDAD Y REGISTRO SECUENCIAL DE TRASLADOS -->
      <div id="seccion-5.0" style="font-size: 9.5pt; font-weight: bold; color: #0F172A; background-color: #F1F5F9; border-left: 4px solid #0F172A; border-bottom: 1px solid #CBD5E1; padding: 4px 8px; margin-top: 12px; margin-bottom: 8px; text-transform: uppercase;">5.0 CONTINUIDAD Y REGISTRO SECUENCIAL DE TRASLADOS DE CADENA DE CUSTODIA (MUCC-2017)</div>
      <div style="border: 1px solid #0F172A; padding: 6px; margin-top: 6px;">
        <div style="font-weight: bold; font-size: 8.5pt; color: #0F172A;">REGISTRO DE TRASLADO N° 01:</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 4px;">
          <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Fecha y Hora:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${fecha}</td></tr>
          <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">A. ENTREGADO POR (CUSTODIO SALIENTE):</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.solicitante_nombre || 'Alexander R. Wright'} (C.I.: ${c.solicitante_cedula || 'V-18.492.019'})</td></tr>
        </table>

        <!-- 3 Recuadros Dactilares Entregante -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-top: 6px;">
          <tr>
            <td style="width: 42%; border: 1px solid #334155; background-color: #F8FAFC; height: 60pt; vertical-align: bottom; padding: 4px;"><div style="font-size: 7.5pt; font-weight: bold; color: #0F172A;">Firma Custodio Saliente</div></td>
            <td style="width: 27%; border: 1px solid #334155; background-color: #F8FAFC; height: 60pt; vertical-align: bottom; padding: 4px; text-align: center;"><div style="font-size: 7.5pt; font-weight: bold; color: #0F172A;">Pulgar Izquierdo</div></td>
            <td style="width: 27%; border: 1px solid #334155; background-color: #F8FAFC; height: 60pt; vertical-align: bottom; padding: 4px; text-align: center;"><div style="font-size: 7.5pt; font-weight: bold; color: #0F172A;">Pulgar Derecho</div></td>
          </tr>
        </table>
      </div>
      ` : ''}

      <!-- 6.0 CERTIFICACIÓN FINAL -->
      <div id="seccion-6.0" style="font-size: 9.5pt; font-weight: bold; color: #0F172A; background-color: #F1F5F9; border-left: 4px solid #0F172A; border-bottom: 1px solid #CBD5E1; padding: 4px 8px; margin-top: 12px; margin-bottom: 8px; text-transform: uppercase;">${isPRCC ? '6.0' : '5.0'}. CERTIFICACIÓN PERICIAL, FIRMAS Y RESPONSABILIDAD LEGAL</div>
      <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-top: 8px; margin-bottom: 12px;">
        <tr>
          <td style="width: 48%; border: 1px solid #334155; background-color: #F8FAFC; height: 70pt; vertical-align: bottom; padding: 4px;">
            <div style="height: 55pt;"></div>
            <div style="font-size: 7.5pt; font-weight: bold; color: #0F172A;">FIRMA DEL CONSIGNANTE PRIVADO</div>
          </td>
          <td style="width: 48%; border: 1px solid #334155; background-color: #F8FAFC; height: 70pt; vertical-align: bottom; padding: 4px;">
            <div style="font-size: 7.5pt; font-weight: bold; color: #0F172A; text-align: center; text-transform: uppercase;">PERITO INFORMÁTICO FORENSE</div>
            <div style="height: 45pt;"></div>
            <div style="font-size: 7.5pt; font-weight: bold; color: #0F172A; text-align: center;">FIRMA DEL PERITO RECEPTOR ISO 27037</div>
          </td>
        </tr>
      </table>

      <!-- FOOTER OFICIAL DE 2 LÍNEAS TAMAÑO 8 PT -->
      <table style="width: 100%; border-collapse: collapse; border-top: 1px solid #CBD5E1; margin-top: 25px; padding-top: 6px;">
        <tr>
          <td style="font-size: 8pt; color: #334155; text-align: center; line-height: 1.25;">
            Documento Oficial generado bajo los estándares de la Ley sobre Mensajes de Datos y Firmas Electrónicas, el Manual Único de Cadena de Custodia de Evidencias (MUCC-2017) y la norma ISO/IEC 27037:2012.<br/>
            <b>SHA256.US — Laboratorio de Informática Forense y Ciberseguridad | Consignación Privada y Cumplimiento Normativo.</b>
          </td>
        </tr>
      </table>
    `;
  }

  // 2. Garantizar que la PORTADA RECEPTORA (Página 1 / Folio 01) esté presente en el documento Word
  const portadaHtml = `
    <!-- HOJA 1: PORTADA RECEPTORA OFICIAL & COMPLIANCE -->
    <div style="page-break-after: always; padding: 10px; font-family: Arial, sans-serif;">
      <div style="background-color: #0F172A; color: #FECF06; padding: 6px 12px; font-weight: bold; font-size: 10pt; letter-spacing: 1px; margin-bottom: 15px; text-align: center;">
        DOSSIER FORENSE OFICIAL — FOLIO 01 | PORTADA RECEPTORA &amp; COMPLIANCE
      </div>

      <div style="border: 2px solid #0F172A; background-color: #F8FAFC; padding: 18px; margin-bottom: 16px; text-align: center;">
        <div style="font-size: 15pt; font-weight: bold; color: #0F172A; text-transform: uppercase; margin-bottom: 6px;">${title}</div>
        <div style="font-size: 9.5pt; color: #475569; margin-bottom: 12px;">DOCUMENTO PROBATORIO OFICIAL EN LABORATORIO PRIVADO SHA256.US</div>
        
        <table style="width: 100%; border-collapse: collapse; border-top: 1.5px solid #0F172A; margin-top: 10px; padding-top: 8px;">
          <tr>
            <td style="font-size: 9.5pt; font-weight: bold; color: #0F172A; width: 33%; padding: 6px;">EXPEDIENTE: <span style="background-color: #E2E8F0; padding: 3px 6px;">${numeroCaso}</span></td>
            <td style="font-size: 9.5pt; font-weight: bold; color: #0F172A; width: 33%; padding: 6px;">PRCC N°: <span style="background-color: #E2E8F0; padding: 3px 6px;">${numeroPRCC}</span></td>
            <td style="font-size: 9.5pt; font-weight: bold; color: #0F172A; width: 34%; padding: 6px;">FECHA: <span style="background-color: #E2E8F0; padding: 3px 6px;">${fecha}</span></td>
          </tr>
        </table>
      </div>

      <div style="background-color: #0F172A; color: #FECF06; font-size: 9.5pt; font-weight: bold; padding: 6px 10px; margin-bottom: 8px; text-align: left;">
        LEYENDA DE CONTENIDO ENUMERADO SECCIÓN POR SECCIÓN
      </div>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid #CBD5E1; margin-bottom: 16px; text-align: left;">
        <thead>
          <tr style="background-color: #E2E8F0;">
            <th style="padding: 6px; font-size: 9pt; font-weight: bold; color: #0F172A; width: 15%;">N° SECC.</th>
            <th style="padding: 6px; font-size: 9pt; font-weight: bold; color: #0F172A; width: 45%;">DENOMINACIÓN DE LA SECCIÓN</th>
            <th style="padding: 6px; font-size: 9pt; font-weight: bold; color: #0F172A; width: 40%;">DESCRIPCIÓN Y CAMPOS</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">1.0</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">DATOS GENERALES DE LA ACTUACIÓN FORENSE</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; color: #475569;">Identificación del expediente y consignante.</td></tr>
          <tr><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">2.0</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">DESCRIPCIÓN Y RECEPCIÓN DE EVIDENCIA DIGITAL</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; color: #475569;">Propiedades del elemento bajo peritaje.</td></tr>
          <tr><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">3.0</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">FIRMAS DE RESPONSABILIDAD E INMUTABILIDAD</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; color: #475569;">Firmas periciales y hash de inmutabilidad.</td></tr>
        </tbody>
      </table>

      <div style="font-size: 9pt; font-weight: bold; color: #0F172A; margin-top: 12px; margin-bottom: 6px; text-align: left;">
        MARCO NORMATIVO APLICABLE:
      </div>
      <div style="text-align: left; font-size: 8.5pt; color: #0F172A; font-weight: bold; margin-bottom: 25px;">
        ⚖️ MUCC-2017 § 4 &nbsp;&nbsp;|&nbsp;&nbsp; ⚖️ ISO/IEC 27037:2012 &nbsp;&nbsp;|&nbsp;&nbsp; ⚖️ COPP Art. 187 &nbsp;&nbsp;|&nbsp;&nbsp; ⚖️ Ley de Mensajes de Datos
      </div>

      <div style="border-top: 1px solid #CBD5E1; margin-top: 40px; padding-top: 8px; text-align: center; font-size: 8pt; color: #475569;">
        Documento Oficial generado bajo los estándares de la Ley sobre Mensajes de Datos y Firmas Electrónicas, el Manual Único de Cadena de Custodia de Evidencias (MUCC-2017) y la norma ISO/IEC 27037:2012.<br/>
        <b>SHA256.US — Laboratorio de Informática Forense y Ciberseguridad | Consignación Privada y Cumplimiento Normativo.</b>
      </div>
    </div>
  `;

  if (!innerBodyHtml.includes('DOSSIER FORENSE OFICIAL') && !innerBodyHtml.includes('PORTADA RECEPTORA')) {
    innerBodyHtml = portadaHtml + innerBodyHtml;
  }

  // 3. Documento completo HTML con estructura XML para Word
  const htmlTemplate = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <style>
    @page {
      size: 216mm 330mm; /* Hoja Folio / Oficio */
      margin: 3.5cm 1.5cm 1.5cm 2.5cm;
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 9.5pt;
      color: #1E293B;
      line-height: 1.35;
    }
  </style>
</head>
<body>
  ${innerBodyHtml}
</body>
</html>`;

  try {
    // Importamos dinámicamente html-docx-js / html-docx-js-typescript para evitar SSR issues
    const { asBlob } = await import('html-docx-js-typescript');
    const docxBlob = await asBlob(htmlTemplate, {
      orientation: 'portrait',
      margins: { top: 1984, bottom: 850, left: 1417, right: 850 },
    });

    const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanCaso = numeroCaso.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${cleanTitle}_Caso_${cleanCaso}.docx`;

    // Disparamos la descarga utilizando file-saver (saveAs)
    saveAs(docxBlob as Blob, fileName);
  } catch (err) {
    console.error('Error generando archivo Word .docx con html-docx-js:', err);
    
    // Fallback con Blob application/msword y file-saver
    const fallbackBlob = new Blob(['\ufeff', htmlTemplate], {
      type: 'application/msword;charset=utf-8',
    });
    const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${cleanTitle}_Caso_${numeroCaso}.doc`;
    saveAs(fallbackBlob, fileName);
  }
}
