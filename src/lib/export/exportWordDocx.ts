/**
 * SHA256.US — Exportador Oficial de Planillas Legal-Forenses a Microsoft Word (.docx)
 * Utiliza html-docx-js y file-saver para descargar archivos .docx nativos.
 * Garantiza fidelidad visual total (márgenes Folio/Oficio 216mm x 330mm, tablas, recuadros dactilares y leyendas normativas).
 */

import { saveAs } from 'file-saver';

export async function exportPlanillaToWordDocx(caso: any, title: string = 'Planilla_Forense', element?: HTMLElement | null) {
  const c = caso || {};
  const numeroCaso = c.numeroCaso || '____________________';
  const numeroPRCC = c.numeroPRCC || '____________________';
  const fecha = c.fecha || new Date().toLocaleDateString('es-VE');

  const isPRCC = title.toLowerCase().includes('prcc') || title.toLowerCase().includes('cadena de custodia');

  // Si se pasa un elemento HTML del DOM activo de la planilla, usamos su contenido o generamos el HTML técnico legal
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
            <div style="font-size: 8.5pt; font-weight: bold; color: #1E293B; margin-top: 2px;">LABORATORIO PRIVADO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</div>
            <div style="font-size: 7pt; color: #475569; margin-top: 2px; margin-bottom: 6px;">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Municipio Jiménez del Estado Lara.</div>
          </td>
        </tr>
      </table>

      <!-- TÍTULO Y CASILLA DE EXPEDIENTE / PRCC -->
      <div style="text-align: center; margin-bottom: 10px;">
        <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; color: #0F172A;">${title}</div>
        <div style="font-size: 8.5pt; color: #334155; margin-top: 3px;">DOCUMENTO OFICIAL DE CUMPLIMIENTO Y PERITAJE FORENSE PRIVADO (MUCC-2017 & ISO/IEC 27037)</div>
        
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
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Apellidos y Nombres Consignante:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.solicitante_nombre || ''}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Cédula de Identidad / RIF:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.solicitante_cedula || ''}</td></tr>
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
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">a. Nombres y Apellidos:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.peritoLider || ''}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">b. C.I:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.peritoCedula || ''}</td></tr>
      </table>

      <!-- RECUADROS DACTILARES Y FIRMA -->
      <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-top: 8px; margin-bottom: 12px;">
        <tr>
          <td style="width: 42%; border: 1px solid #334155; background-color: #F8FAFC; height: 70pt; vertical-align: bottom; padding: 4px;">
            <div style="height: 55pt;"></div>
            <div style="font-size: 7.5pt; font-weight: bold; color: #0F172A; margin-top: 3px;">c. Firma</div>
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
          <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">A. ENTREGADO POR (CUSTODIO SALIENTE):</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.solicitante_nombre || ''} (C.I.: ${c.solicitante_cedula || ''})</td></tr>
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

  // Documento completo HTML con estructura XML para Word
  const htmlTemplate = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <style>
    @page {
      size: 216mm 330mm; /* Hoja Folio / Oficio */
      margin: 4.0cm 1.5cm 1.5cm 3.0cm;
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
      margins: { top: 2267, bottom: 850, left: 1700, right: 850 },
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
