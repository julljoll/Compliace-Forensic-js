/**
 * SHA256.US — Exportador Oficial de Planillas Legal-Forenses a Documento HTML Email (Generar HTML)
 * Genera un archivo .html 100% autosuficiente, formateado en HTML estructurado para envíos por correo electrónico,
 * manteniendo las dimensiones de la hoja Folio/Oficio (216mm x 330mm) y los márgenes exactos de la vista previa.
 */

import { saveAs } from 'file-saver';

export async function exportPlanillaToHtmlEmail(caso: any, title: string = 'Planilla_Forense', element?: HTMLElement | null) {
  const c = caso || {};
  const numeroCaso = c.numeroCaso || 'EXP-2026-SHA-0091';
  const numeroPRCC = c.numeroPRCC || 'PRCC-2026-0042';
  const fecha = c.fecha || new Date().toLocaleDateString('es-VE');

  let innerContentHtml = '';

  if (element) {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.no-print, button, .MuiButton-root, .MuiIconButton-root').forEach(el => el.remove());
    innerContentHtml = clone.innerHTML;
  }

  // Plantilla HTML estructurada para correo electrónico manteniendo las dimensiones Folio (216mm x 330mm) y márgenes exactos
  const emailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — SHA256.US</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    @page {
      size: 216mm 330mm; /* Hoja Folio / Oficio */
      margin: 4.0cm 1.5cm 1.5cm 3.0cm;
    }

    body {
      height: 100% !important;
      margin: 0 !important;
      padding: 20px 0 !important;
      width: 100% !important;
      background-color: #0D1117;
      font-family: Arial, Helvetica, sans-serif;
      color: #1E293B;
    }

    /* Envoltorio principal con tamaño Folio (216mm x 330mm) y márgenes periciales de vista previa */
    .paper-folio {
      width: 216mm;
      max-width: 100%;
      min-height: 330mm;
      margin: 0 auto;
      background-color: #ffffff;
      box-sizing: border-box;
      padding: 35px 30px;
      border: 1px solid #30363d;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
      border-radius: 4px;
    }

    .header-banner {
      background-color: #0F172A;
      color: #FECF06;
      padding: 8px 14px;
      text-align: center;
      font-weight: bold;
      font-size: 10.5pt;
      letter-spacing: 1px;
      border-radius: 4px;
      margin-bottom: 14px;
    }

    .title-box {
      border: 2px solid #0F172A;
      background-color: #F8FAFC;
      padding: 18px;
      margin-bottom: 16px;
      text-align: center;
      border-radius: 6px;
    }

    .section-header {
      background-color: #F1F5F9;
      border-left: 4px solid #0F172A;
      border-bottom: 1px solid #CBD5E1;
      color: #0F172A;
      padding: 6px 10px;
      font-weight: bold;
      font-size: 9.5pt;
      text-transform: uppercase;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    .evidence-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 12px;
    }

    .evidence-table th {
      background-color: #E2E8F0;
      border: 1px solid #94A3B8;
      padding: 6px;
      font-size: 8.5pt;
      font-weight: bold;
      color: #0F172A;
      text-align: left;
    }

    .evidence-table td {
      border: 1px solid #CBD5E1;
      padding: 6px;
      font-size: 8.5pt;
      color: #1E293B;
    }

    .hash-text {
      font-family: 'Courier New', Courier, monospace;
      font-size: 8.5pt;
      font-weight: bold;
      color: #0F172A;
      word-break: break-all;
    }

    .footer-note {
      border-top: 1px solid #CBD5E1;
      padding-top: 10px;
      text-align: center;
      font-size: 8pt;
      color: #475569;
      line-height: 1.35;
      margin-top: 30px;
    }

    .page-break {
      page-break-before: always;
      mso-break-type: page-break;
    }
  </style>
</head>
<body>
  <!-- CONTENEDOR FOLIO (216mm x 330mm) DENTRO DE ESTRUCTURA EMAIL -->
  <div class="paper-folio">
    
    <!-- HOJA 1: PORTADA RECEPTORA OFICIAL (FOLIO 01) -->
    <div class="header-banner">
      DOSSIER FORENSE OFICIAL — FOLIO 01 | PORTADA RECEPTORA &amp; COMPLIANCE
    </div>

    <div class="title-box">
      <div style="font-size: 15pt; font-weight: bold; color: #0F172A; text-transform: uppercase; margin-bottom: 6px;">${title}</div>
      <div style="font-size: 9.5pt; color: #475569; margin-bottom: 12px;">DOCUMENTO PROBATORIO OFICIAL EN LABORATORIO PRIVADO SHA256.US</div>
      
      <table style="width: 100%; border-collapse: collapse; border-top: 1.5px solid #0F172A; margin-top: 10px; padding-top: 8px;">
        <tr>
          <td style="font-size: 9.5pt; font-weight: bold; color: #0F172A; width: 33%; padding: 6px 0;">EXPEDIENTE: <span style="background-color: #E2E8F0; padding: 3px 6px; font-family: monospace;">${numeroCaso}</span></td>
          <td style="font-size: 9.5pt; font-weight: bold; color: #0F172A; width: 33%; padding: 6px 0;">PRCC N°: <span style="background-color: #E2E8F0; padding: 3px 6px; font-family: monospace;">${numeroPRCC}</span></td>
          <td style="font-size: 9.5pt; font-weight: bold; color: #0F172A; width: 34%; padding: 6px 0;">FECHA: <span style="background-color: #E2E8F0; padding: 3px 6px; font-family: monospace;">${fecha}</span></td>
        </tr>
      </table>
    </div>

    <div style="background-color: #0F172A; color: #FECF06; font-size: 9.5pt; font-weight: bold; padding: 6px 10px; margin-bottom: 8px; text-align: left;">
      LEYENDA DE CONTENIDO ENUMERADO SECCIÓN POR SECCIÓN
    </div>

    <table style="width: 100%; border-collapse: collapse; border: 1px solid #CBD5E1; margin-bottom: 18px; text-align: left;">
      <thead>
        <tr style="background-color: #E2E8F0;">
          <th style="padding: 6px; font-size: 9pt; font-weight: bold; color: #0F172A; width: 9%;">N° SECC.</th>
          <th style="padding: 6px; font-size: 9pt; font-weight: bold; color: #0F172A; width: 51%;">DENOMINACIÓN DE LA SECCIÓN</th>
          <th style="padding: 6px; font-size: 9pt; font-weight: bold; color: #0F172A; width: 40%;">DESCRIPCIÓN Y CAMPOS</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">1.0</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">DATOS GENERALES DE LA ACTUACIÓN FORENSE</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; color: #475569;">Identificación del expediente y consignante.</td></tr>
        <tr><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">2.0</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">DESCRIPCIÓN Y RECEPCIÓN DE EVIDENCIA DIGITAL</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; color: #475569;">Propiedades del elemento bajo peritaje.</td></tr>
        <tr><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">3.0</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; font-weight: bold;">FIRMAS DE RESPONSABILIDAD E INMUTABILIDAD</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8.5pt; color: #475569;">Firmas periciales y hash de inmutabilidad.</td></tr>
      </tbody>
    </table>

    <div style="font-size: 9pt; font-weight: bold; color: #0F172A; margin-top: 14px; margin-bottom: 6px;">
      MARCO NORMATIVO APLICABLE:
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
      <tr>
        <td style="padding: 5px 8px; background-color: #F1F5F9; border: 1px solid #CBD5E1; font-size: 8pt; font-weight: bold; color: #0F172A; text-align: center; width: 24%;">⚖️ MUCC-2017 § 4</td>
        <td style="width: 1%;"></td>
        <td style="padding: 5px 8px; background-color: #F1F5F9; border: 1px solid #CBD5E1; font-size: 8pt; font-weight: bold; color: #0F172A; text-align: center; width: 24%;">⚖️ ISO/IEC 27037</td>
        <td style="width: 1%;"></td>
        <td style="padding: 5px 8px; background-color: #F1F5F9; border: 1px solid #CBD5E1; font-size: 8pt; font-weight: bold; color: #0F172A; text-align: center; width: 24%;">⚖️ COPP Art. 187</td>
        <td style="width: 1%;"></td>
        <td style="padding: 5px 8px; background-color: #F1F5F9; border: 1px solid #CBD5E1; font-size: 8pt; font-weight: bold; color: #0F172A; text-align: center; width: 24%;">⚖️ Ley Mensajes Datos</td>
      </tr>
    </table>

    <!-- FOOTER DE PORTADA -->
    <div class="footer-note" style="margin-bottom: 30px;">
      Documento Oficial generado bajo los estándares de la Ley sobre Mensajes de Datos y Firmas Electrónicas, el Manual Único de Cadena de Custodia de Evidencias (MUCC-2017) y la norma ISO/IEC 27037:2012.<br/>
      <b>SHA256.US — Laboratorio de Informática Forense y Ciberseguridad | Consignación Privada y Cumplimiento Normativo.</b>
    </div>

    <!-- SALTO DE PÁGINA ENTRE PORTADA Y CUERPO -->
    <hr class="page-break" style="border: 0; border-top: 2px dashed #CBD5E1; margin: 30px 0;" />

    <!-- CUERPO DE LA PLANILLA (HOJAS SIGUIENTES EN MÁRGENES DE VISTA PREVIA) -->
    ${innerContentHtml || `
      <div class="section-header">1.0 DATOS DE LA ACTUACIÓN FORENSE PRIVADA Y DEL CONSIGNANTE</div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 4px 0;">Apellidos y Nombres Consignante:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 4px 0;">${c.solicitante_nombre || 'Alexander R. Wright'}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 4px 0;">Cédula de Identidad / RIF:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 4px 0;">${c.solicitante_cedula || 'V-18.492.019'}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 4px 0;">Fecha y Hora de Actuación:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 4px 0;">${fecha}</td></tr>
      </table>

      <div class="section-header">2.0 FORMA DE OBTENCIÓN DE LA EVIDENCIA (MUCC-2017)</div>
      <p style="font-size: 8.5pt; margin: 4px 0;">[ X ] Consignación Directa Privada (Entrega Voluntaria) &#160;&#160;&#160;&#160; [ &#160; ] Adquisición Técnico-Pericial Interna</p>

      <div class="section-header">3.0 OPERARIOS PERICIALES Y REGISTRO DACTILAR</div>
      <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-top: 10px; margin-bottom: 14px;">
        <tr>
          <td style="width: 42%; border: 1.5px solid #0F172A; background-color: #F8FAFC; height: 75pt; vertical-align: bottom; padding: 4px;">
            <div style="font-size: 7.5pt; font-weight: bold; color: #0F172A;">c. Firma del Perito Líder</div>
          </td>
          <td style="width: 27%; border: 1.5px solid #0F172A; background-color: #F8FAFC; height: 75pt; vertical-align: bottom; padding: 4px; text-align: center;">
            <div style="font-size: 7.5pt; font-weight: bold; color: #0F172A;">Pulgar Izquierdo</div>
          </td>
          <td style="width: 27%; border: 1.5px solid #0F172A; background-color: #F8FAFC; height: 75pt; vertical-align: bottom; padding: 4px; text-align: center;">
            <div style="font-size: 7.5pt; font-weight: bold; color: #0F172A;">Pulgar Derecho</div>
          </td>
        </tr>
      </table>

      <div class="section-header">4.0 DESCRIPCIÓN DETALLADA DE LA EVIDENCIA DIGITAL CONSIGNADA</div>
      <table class="evidence-table">
        <thead>
          <tr>
            <th>Evidencia / Dispositivo</th>
            <th>Especificación Técnica / Serial / Hash SHA-256 Génesis</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><b>Equipo / Almacenamiento</b></td><td>${c.tipoEvidencia || 'Dispositivo de Almacenamiento Forense'}</td></tr>
          <tr><td><b>Precinto de Seguridad</b></td><td>Precinto Holofónico N° ${c.precintoNumero || 'SHA-2026-VNZ'}</td></tr>
          <tr><td><b>Hash SHA-256 Génesis</b></td><td class="hash-text">${c.hashGenesis || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</td></tr>
        </tbody>
      </table>

      <div class="footer-note">
        Documento Oficial generado bajo los estándares de la Ley sobre Mensajes de Datos y Firmas Electrónicas, el Manual Único de Cadena de Custodia de Evidencias (MUCC-2017) y la norma ISO/IEC 27037:2012.<br/>
        <b>SHA256.US — Laboratorio de Informática Forense y Ciberseguridad | Consignación Privada y Cumplimiento Normativo.</b>
      </div>
    `}

  </div>
</body>
</html>`;

  const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanCaso = numeroCaso.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${cleanTitle}_Caso_${cleanCaso}_EmailReady.html`;

  const blob = new Blob([emailHtml], { type: 'text/html;charset=utf-8' });
  saveAs(blob, fileName);
}
