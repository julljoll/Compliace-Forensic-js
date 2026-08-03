/**
 * SHA256.US — Motor Optimizado de Generación y Exportación de Archivos SVG (.ZIP)
 * Transforma cada hoja/folio de cualquier planilla legal-forense en un archivo SVG independiente 
 * de máxima resolución y fidelidad vectorial, empaquetándolas en un archivo comprimido .zip.
 * Incluye sanitización estricta de entidades XML (&nbsp; -> &#160;) para compatibilidad total en visores SVG.
 */

import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export interface SvgExportOptions {
  caso?: any;
  title?: string;
  element?: HTMLElement | null;
}

/**
 * Sanitiza texto SVG/XML reemplazando entidades HTML no definidas en la especificación XML (&nbsp;, etc.)
 */
function sanitizeSvgXml(svgText: string): string {
  if (!svgText) return svgText;
  return svgText
    .replace(/&nbsp;/g, '&#160;')
    .replace(/&deg;/g, '&#176;')
    .replace(/&copy;/g, '&#169;')
    .replace(/&reg;/g, '&#174;')
    .replace(/&trade;/g, '&#8482;');
}

export async function exportPlanillaToSvgZip(options: SvgExportOptions) {
  const { caso, title = 'Planilla_Forense', element } = options;
  const c = caso || {};
  const numeroCaso = c.numeroCaso || 'EXP-2026-SHA-0091';
  const numeroPRCC = c.numeroPRCC || 'PRCC-2026-0042';
  const fecha = c.fecha || new Date().toLocaleDateString('es-VE');

  const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanCaso = numeroCaso.replace(/[^a-zA-Z0-9_-]/g, '_');
  const zipFilename = `${cleanTitle}_Caso_${cleanCaso}_SVG_Hojas.zip`;

  const zip = new JSZip();

  // 1. Detección y captura directa desde los elementos DOM en pantalla
  const container = element || (document.querySelector('.planilla-container') as HTMLElement);

  if (container) {
    let pageNodes = Array.from(
      container.querySelectorAll('.page, .planilla-cover-page, [data-page-index], .MuiPaper-root')
    ) as HTMLElement[];

    // Filtrar subnodos repetidos para mantener solo contenedores principales de hojas
    pageNodes = pageNodes.filter((node, index, self) => 
      !self.some((other, otherIdx) => otherIdx !== index && other.contains(node))
    );

    if (pageNodes.length === 0 && container.offsetHeight > 0) {
      pageNodes = [container];
    }

    if (pageNodes.length > 0) {
      try {
        const { toSvg } = await import('html-to-image');
        let capturedCount = 0;

        for (let i = 0; i < pageNodes.length; i++) {
          const pageNode = pageNodes[i];
          try {
            const dataUrl = await toSvg(pageNode, {
              quality: 0.98,
              filter: (node) => {
                if (node instanceof HTMLElement) {
                  if (
                    node.classList.contains('no-print') ||
                    node.tagName === 'BUTTON' ||
                    node.classList.contains('MuiButton-root')
                  ) {
                    return false;
                  }
                }
                return true;
              },
              style: {
                background: '#ffffff',
              },
            });

            if (dataUrl && dataUrl.startsWith('data:image/svg')) {
              const res = await fetch(dataUrl);
              const svgText = await res.text();
              const isCover =
                i === 0 &&
                (pageNode.textContent?.includes('DOSSIER') || pageNode.textContent?.includes('PORTADA'));

              const pageFileName = isCover
                ? `Hoja_01_Portada.svg`
                : `Hoja_${String(i + 1).padStart(2, '0')}_Contenido.svg`;

              // Sanitizar cualquier entidad HTML como &nbsp; antes de empaquetar
              zip.file(pageFileName, sanitizeSvgXml(svgText));
              capturedCount++;
            }
          } catch (errPage) {
            console.warn(`[SVG Engine] Aviso al procesar hoja DOM ${i + 1}:`, errPage);
          }
        }

        if (capturedCount > 0) {
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          saveAs(zipBlob, zipFilename);
          return;
        }
      } catch (err) {
        console.warn('[SVG Engine] Fallback a motor estructurado multi-hoja:', err);
      }
    }
  }

  // 2. Motor de Respaldo Vectorial Estructurado Multi-Hoja (Fallback directo)

  // HOJA 1: PORTADA RECEPTORA OFICIAL (FOLIO 01)
  const hoja1PortadaSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="816" height="1247" viewBox="0 0 816 1247">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&amp;family=Fira+Code:wght@400;700&amp;display=swap');
    body { margin: 0; padding: 25px; background: #ffffff; color: #1e293b; font-family: 'Ubuntu', Arial, sans-serif; box-sizing: border-box; }
  </style>
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="background:#ffffff; padding: 25px; width: 100%; height: 100%; box-sizing: border-box; position: relative;">
      <div style="background-color: #0F172A; padding: 6px 12px; border-radius: 4px; margin-bottom: 12px; text-align: center;">
        <span style="color: #FECF06; font-size: 9pt; font-weight: bold; letter-spacing: 1px;">DOSSIER FORENSE OFICIAL — FOLIO 01 | PORTADA RECEPTORA &amp; COMPLIANCE</span>
      </div>

      <div style="border: 2px solid #0F172A; background-color: #F8FAFC; border-radius: 6px; padding: 16px; text-align: center; margin-bottom: 16px;">
        <div style="font-size: 14pt; font-weight: bold; color: #0F172A; text-transform: uppercase; margin-bottom: 6px;">${title}</div>
        <div style="font-size: 9pt; color: #475569; margin-bottom: 12px;">DOCUMENTO PROBATORIO OFICIAL EN LABORATORIO PRIVADO SHA256.US</div>
        
        <table style="width: 100%; border-collapse: collapse; border-top: 1px solid #CBD5E1; padding-top: 8px;">
          <tr>
            <td style="font-size: 9pt; font-weight: bold; color: #0F172A; width: 33%;">EXPEDIENTE: <span style="background-color: #E2E8F0; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${numeroCaso}</span></td>
            <td style="font-size: 9pt; font-weight: bold; color: #0F172A; width: 33%;">PRCC N°: <span style="background-color: #E2E8F0; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${numeroPRCC}</span></td>
            <td style="font-size: 9pt; font-weight: bold; color: #0F172A; width: 34%;">FECHA: <span style="background-color: #E2E8F0; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${fecha}</span></td>
          </tr>
        </table>
      </div>

      <div style="background-color: #0F172A; color: #FECF06; font-size: 9pt; font-weight: bold; padding: 6px 10px; margin-bottom: 8px;">
        LEYENDA DE CONTENIDO ENUMERADO SECCIÓN POR SECCIÓN
      </div>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid #CBD5E1; margin-bottom: 16px;">
        <thead>
          <tr style="background-color: #E2E8F0;">
            <th style="padding: 6px; font-size: 8.5pt; font-weight: bold; color: #0F172A; width: 15%; text-align: left;">N° SECC.</th>
            <th style="padding: 6px; font-size: 8.5pt; font-weight: bold; color: #0F172A; width: 45%; text-align: left;">DENOMINACIÓN DE LA SECCIÓN</th>
            <th style="padding: 6px; font-size: 8.5pt; font-weight: bold; color: #0F172A; width: 40%; text-align: left;">DESCRIPCIÓN Y CAMPOS</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8pt; font-weight: bold;">1.0</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8pt; font-weight: bold;">DATOS GENERALES DE LA ACTUACIÓN FORENSE</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8pt; color: #475569;">Identificación del expediente y consignante.</td></tr>
          <tr><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8pt; font-weight: bold;">2.0</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8pt; font-weight: bold;">DESCRIPCIÓN Y RECEPCIÓN DE EVIDENCIA DIGITAL</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8pt; color: #475569;">Propiedades del elemento bajo peritaje.</td></tr>
          <tr><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8pt; font-weight: bold;">3.0</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8pt; font-weight: bold;">FIRMAS DE RESPONSABILIDAD E INMUTABILIDAD</td><td style="padding: 6px; border-bottom: 1px solid #E2E8F0; font-size: 8pt; color: #475569;">Firmas periciales y hash de inmutabilidad.</td></tr>
        </tbody>
      </table>

      <div style="font-size: 8pt; font-weight: bold; color: #0F172A; margin-top: 10px; margin-bottom: 6px;">
        MARCO NORMATIVO APLICABLE:
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <span style="background-color: #F1F5F9; border: 1px solid #CBD5E1; padding: 4px 8px; border-radius: 4px; font-size: 7.5pt; font-weight: bold;">⚖️ MUCC-2017 § 4</span>
        <span style="background-color: #F1F5F9; border: 1px solid #CBD5E1; padding: 4px 8px; border-radius: 4px; font-size: 7.5pt; font-weight: bold;">⚖️ ISO/IEC 27037:2012</span>
        <span style="background-color: #F1F5F9; border: 1px solid #CBD5E1; padding: 4px 8px; border-radius: 4px; font-size: 7.5pt; font-weight: bold;">⚖️ COPP Art. 187</span>
        <span style="background-color: #F1F5F9; border: 1px solid #CBD5E1; padding: 4px 8px; border-radius: 4px; font-size: 7.5pt; font-weight: bold;">⚖️ Ley de Mensajes de Datos</span>
      </div>

      <footer role="contentinfo" aria-label="Pie de página legal SHA256.US" itemscope itemtype="https://schema.org/Organization" style="position: absolute; bottom: 25px; left: 25px; right: 25px; border-top: 1px solid #CBD5E1; padding-top: 6px; text-align: center;">
        <meta itemprop="name" content="SHA256.US — Lab. Informática Forense" />
        <div style="font-size: 8.5pt; font-weight: bold; color: #0F172A;">SHA256.US — Laboratorio de Informática Forense | Consignación Privada y Cumplimiento Normativo</div>
        <div style="font-size: 7.5pt; color: #334155; margin-top: 2px;">Documento Oficial generado bajo los estándares de la Ley sobre Mensajes de Datos, el MUCC-2017 y la norma ISO/IEC 27037:2012.</div>
        <address itemprop="address" itemscope itemtype="https://schema.org/PostalAddress" style="font-style: normal; font-size: 7pt; color: #475569; margin-top: 3px;">
          <span itemprop="streetAddress">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8</span>, <span itemprop="addressLocality">Quíbor</span>, <span itemprop="addressRegion">Estado Lara</span>, <span itemprop="addressCountry">Venezuela</span>.
        </address>
      </footer>
    </div>
  </foreignObject>
</svg>`;

  // HOJA 2: ACTA PRINCIPAL DE ACTUACIÓN FORENSE (FOLIO 02)
  const hoja2ActaSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="816" height="1247" viewBox="0 0 816 1247">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&amp;family=Fira+Code:wght@400;700&amp;display=swap');
    body { margin: 0; padding: 25px; background: #ffffff; color: #1e293b; font-family: 'Ubuntu', Arial, sans-serif; box-sizing: border-box; }
  </style>
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="background:#ffffff; padding: 25px; width: 100%; height: 100%; box-sizing: border-box; position: relative;">
      <!-- ENCABEZADO INSTITUCIONAL -->
      <table style="width: 100%; border-collapse: collapse; border-bottom: 2px solid #0F172A; margin-bottom: 12px;">
        <tr>
          <td style="text-align: center;">
            <div style="font-size: 16pt; font-weight: bold; color: #0F172A; letter-spacing: 1.5px;">SHA256.US</div>
            <div style="font-size: 8.5pt; font-weight: bold; color: #1E293B; margin-top: 2px;">Lab. Informática Forense</div>
          </td>
        </tr>
      </table>

      <!-- TÍTULO Y CASILLA DE EXPEDIENTE -->
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
      <div style="font-size: 9.5pt; font-weight: bold; color: #0F172A; background-color: #F1F5F9; border-left: 4px solid #0F172A; border-bottom: 1px solid #CBD5E1; padding: 4px 8px; margin-top: 12px; margin-bottom: 8px; text-transform: uppercase;">1.0 DATOS DE LA ACTUACIÓN FORENSE Y DEL CONSIGNANTE PRIVADO</div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Apellidos y Nombres Consignante:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.solicitante_nombre || 'Alexander R. Wright'}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Cédula de Identidad / RIF:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${c.solicitante_cedula || 'V-18.492.019'}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Fecha y Hora de Actuación:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">${fecha}</td></tr>
        <tr><td style="font-weight: bold; font-size: 8.5pt; color: #0F172A; width: 35%; padding: 3px 0;">Plataformas Forenses:</td><td style="border-bottom: 1px solid #64748B; font-size: 8.5pt; color: #0F172A; width: 65%; padding: 3px 0;">IPED Forensics v4.1, PhotoHolmes Python Engine (ELA), PyOgg Audio Engine</td></tr>
      </table>

      <!-- 2.0 FORMA DE OBTENCIÓN -->
      <div style="font-size: 9.5pt; font-weight: bold; color: #0F172A; background-color: #F1F5F9; border-left: 4px solid #0F172A; border-bottom: 1px solid #CBD5E1; padding: 4px 8px; margin-top: 12px; margin-bottom: 8px; text-transform: uppercase;">2.0 FORMA DE OBTENCIÓN DE LA EVIDENCIA (MUCC-2017)</div>
      <p style="font-size: 8.5pt; margin: 4px 0;">[ X ] Consignación Directa Privada (Entrega Voluntaria) &#160;&#160;&#160;&#160; [ &#160; ] Adquisición Técnico-Pericial Interna</p>

      <!-- 3.0 OPERARIOS PERICIALES Y RECUADROS DACTILARES -->
      <div style="font-size: 9.5pt; font-weight: bold; color: #0F172A; background-color: #F1F5F9; border-left: 4px solid #0F172A; border-bottom: 1px solid #CBD5E1; padding: 4px 8px; margin-top: 12px; margin-bottom: 8px; text-transform: uppercase;">3.0 OPERARIOS PERICIALES Y REGISTRO DACTILAR</div>
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

      <footer role="contentinfo" aria-label="Pie de página legal SHA256.US" itemscope itemtype="https://schema.org/Organization" style="position: absolute; bottom: 25px; left: 25px; right: 25px; border-top: 1px solid #CBD5E1; padding-top: 6px; text-align: center;">
        <meta itemprop="name" content="SHA256.US — Lab. Informática Forense" />
        <div style="font-size: 8.5pt; font-weight: bold; color: #0F172A;">SHA256.US — Laboratorio de Informática Forense | Consignación Privada y Cumplimiento Normativo</div>
        <div style="font-size: 7.5pt; color: #334155; margin-top: 2px;">Documento Oficial generado bajo los estándares de la Ley sobre Mensajes de Datos, el MUCC-2017 y la norma ISO/IEC 27037:2012.</div>
        <address itemprop="address" itemscope itemtype="https://schema.org/PostalAddress" style="font-style: normal; font-size: 7pt; color: #475569; margin-top: 3px;">
          <span itemprop="streetAddress">Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8</span>, <span itemprop="addressLocality">Quíbor</span>, <span itemprop="addressRegion">Estado Lara</span>, <span itemprop="addressCountry">Venezuela</span>.
        </address>
      </footer>
    </div>
  </foreignObject>
</svg>`;

  zip.file('Hoja_01_Portada.svg', sanitizeSvgXml(hoja1PortadaSvg));
  zip.file('Hoja_02_Acta_Forense.svg', sanitizeSvgXml(hoja2ActaSvg));

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, zipFilename);
}
