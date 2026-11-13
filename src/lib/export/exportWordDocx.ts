/**
 * SHA256.US — Exportador Oficial Canónico de Planillas Forenses a Microsoft Word (.docx)
 * Utiliza html-docx-js-typescript y file-saver para descargar archivos .docx nativos (OpenXML altChunk).
 * Formato Folio (216mm x 330mm) con márgenes reglamentarios (25mm izquierdo de encuadernación).
 * Pre-procesamiento DOM para compatibilidad absoluta con Microsoft Word:
 * - Conversión de rejillas Flexbox y Grid a tablas <table> de 2 columnas (firmas, huellas, membrete).
 * - Huelleros dactilares dobles bloqueados con medidas físicas (18mm × 24mm).
 * - Embebe logotipo institucional oficial como data:image/png;base64 para visualización 100% offline.
 * - Soporta tanto Modo Plantilla en Blanco (líneas de escritura manual) como Modo Con Datos de Caso.
 * - Saltos de página duros (mso-break-type: page-break) para planillas de múltiples hojas.
 */

import { saveAs } from 'file-saver';
import { LOGO_PNG_BASE64 } from './logoBase64';
import { phpApi } from '../data/phpApi';
import { idbGetAll } from '../data/idb';
import type { CasoCMS } from '../domain/types';

/**
 * Pre-procesa el árbol HTML de una planilla forense para compatibilidad total con Word
 */
export function transformPlanillaHtmlForWord(element: HTMLElement, docTitle: string = 'Planilla Forense'): string {
  // 1. Clonar el elemento para no alterar la interfaz de usuario visible
  const clone = element.cloneNode(true) as HTMLElement;

  // 2. Eliminar elementos no imprimibles, barras de navegación y controles
  clone.querySelectorAll('.no-print, .no-print-bar, button, .MuiButton-root, .watermark, script, style').forEach((el) => el.remove());

  // 3. Transformar membrete institucional (.header-institution-row) a tabla de 2 columnas
  clone.querySelectorAll('.header-institution-row').forEach((row) => {
    const badge = row.querySelector('.header-badge-legal');
    const badgeHtml = badge ? badge.innerHTML : 'CÓDIGO: FO-FOR<br>COPP ART. 187';

    const tableHeader = document.createElement('table');
    tableHeader.setAttribute('style', 'width: 100%; border-collapse: collapse; border-bottom: 2px solid #000000; margin-bottom: 6px;');
    tableHeader.innerHTML = `
      <tr>
        <td style="width: 72%; vertical-align: middle; border: none; padding: 2px 0;">
          <table style="border-collapse: collapse; border: none; margin: 0; padding: 0;">
            <tr>
              <td style="border: none; padding: 0 8px 0 0; vertical-align: middle; width: 40px;">
                <img src="data:image/png;base64,${LOGO_PNG_BASE64}" width="38" height="38" alt="SHA256.US" style="display: block;" />
              </td>
              <td style="border: none; padding: 0; vertical-align: middle;">
                <div style="font-family: Arial, sans-serif; font-size: 7.5pt; font-weight: bold; text-transform: uppercase; line-height: 1.15; color: #000000;">REPÚBLICA BOLIVARIANA DE VENEZUELA</div>
                <div style="font-family: Arial, sans-serif; font-size: 8.5pt; font-weight: bold; text-transform: uppercase; line-height: 1.15; color: #000000;">LABORATORIO DE INFORMÁTICA FORENSE SHA256.US</div>
                <div style="font-family: Arial, sans-serif; font-size: 6.5pt; text-transform: uppercase; line-height: 1.15; color: #000000;">DIVISIÓN PERICIAL DE EVIDENCIA DIGITAL &amp; CUMPLIMIENTO LEGAL</div>
              </td>
            </tr>
          </table>
        </td>
        <td style="width: 28%; vertical-align: middle; border: 1px solid #000000; background-color: #F0F0F0; padding: 3px 5px; text-align: center;">
          <div style="font-family: Arial, sans-serif; font-size: 6.5pt; font-weight: bold; line-height: 1.25; color: #000000;">
            ${badgeHtml}
          </div>
        </td>
      </tr>
    `;
    row.replaceWith(tableHeader);
  });

  // Reemplazar cualquier imagen con referencia a /logo.png por el data:URI base64
  clone.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (src.includes('logo') || src === '/logo.png') {
      img.setAttribute('src', `data:image/png;base64,${LOGO_PNG_BASE64}`);
      img.setAttribute('width', '38');
      img.setAttribute('height', '38');
    }
  });

  // 4. Estilizar el recuadro de título y norma (.header-title-box)
  clone.querySelectorAll('.header-title-box').forEach((box) => {
    const el = box as HTMLElement;
    el.setAttribute('style', 'border: 1.5px solid #000000; background-color: #F0F0F0; padding: 4px 6px; text-align: center; margin-bottom: 5px;');
    const titleEl = el.querySelector('.canonical-doc-title') as HTMLElement | null;
    if (titleEl) {
      titleEl.setAttribute('style', 'font-family: Arial, sans-serif; font-size: 9.5pt; font-weight: bold; text-transform: uppercase; margin: 0 0 2px 0; color: #000000;');
    }
    const normEl = el.querySelector('.canonical-doc-norm') as HTMLElement | null;
    if (normEl) {
      normEl.setAttribute('style', 'font-family: Arial, sans-serif; font-size: 6.5pt; font-weight: bold; color: #000000; margin: 0;');
    }
  });

  // 5. Encabezados de sección (.section-heading)
  clone.querySelectorAll('.section-heading').forEach((sh) => {
    const el = sh as HTMLElement;
    el.setAttribute('style', 'font-family: Arial, sans-serif; font-size: 7.2pt; font-weight: bold; text-transform: uppercase; background-color: #F0F0F0; border: 1px solid #000000; padding: 2.5px 5px; margin-top: 4px; margin-bottom: 3px; color: #000000;');
  });

  // 6. Tablas: header-meta-table, forense-cell-table, forense-table
  clone.querySelectorAll('table').forEach((tbl) => {
    tbl.setAttribute('style', 'width: 100%; border-collapse: collapse; border: 1px solid #000000; margin-bottom: 4px;');
    tbl.querySelectorAll('td, th').forEach((cell) => {
      const c = cell as HTMLElement;
      const isLabel = c.classList.contains('forense-cell-label') || c.classList.contains('header-meta-label') || c.tagName.toLowerCase() === 'th';
      const isMono = c.classList.contains('font-mono');
      const font = isMono ? "'Courier New', Courier, monospace" : 'Arial, sans-serif';

      const existingStyle = c.getAttribute('style') || '';
      const bg = isLabel ? 'background-color: #F0F0F0;' : 'background-color: #FFFFFF;';
      const weight = isLabel ? 'font-weight: bold;' : 'font-weight: normal;';
      const transform = isLabel ? 'text-transform: uppercase;' : '';

      c.setAttribute('style', `border: 1px solid #000000; padding: 2.5px 4px; font-family: ${font}; font-size: 7pt; color: #000000; ${bg} ${weight} ${transform} ${existingStyle}`);
    });
  });

  // 7. Líneas para escritura manual en modo blanco
  clone.querySelectorAll('.linea-manual').forEach((lm) => {
    const el = lm as HTMLElement;
    const content = el.textContent?.trim() || '';
    if (content) {
      el.setAttribute('style', 'font-family: Arial, sans-serif; font-size: 7.5pt; color: #000000;');
    } else {
      el.setAttribute('style', 'border-bottom: 1px solid #000000; min-height: 16px; display: block; width: 100%;');
      el.innerHTML = '&nbsp;';
    }
  });

  clone.querySelectorAll('.lineas-pautadas-2, .lineas-pautadas-3').forEach((lp) => {
    lp.querySelectorAll('.renglon-manual').forEach((rm) => {
      const el = rm as HTMLElement;
      el.setAttribute('style', 'border-bottom: 1px solid #000000; height: 18px; display: block; width: 100%; margin-bottom: 4px;');
      el.innerHTML = '&nbsp;';
    });
  });

  // 8. Transformar huelleros dactilares dobles (.fingerprint-container) a tabla
  clone.querySelectorAll('.fingerprint-container').forEach((fc) => {
    const tableFp = document.createElement('table');
    tableFp.setAttribute('style', 'width: 100%; border-collapse: collapse; margin-top: 4px; border-top: 1px dashed #888888;');
    tableFp.innerHTML = `
      <tr>
        <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding-top: 4px;">
          <table style="margin: 0 auto; width: 18mm; height: 24mm; border: 1.5px solid #000000; border-collapse: collapse; background-color: #FFFFFF;">
            <tr><td style="width: 18mm; height: 24mm; border: 1.5px solid #000000; padding: 0;">&nbsp;</td></tr>
          </table>
          <div style="font-family: Arial, sans-serif; font-size: 6pt; font-weight: bold; text-transform: uppercase; margin-top: 2px; color: #000000;">PULGAR DER.</div>
        </td>
        <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding-top: 4px;">
          <table style="margin: 0 auto; width: 18mm; height: 24mm; border: 1.5px solid #000000; border-collapse: collapse; background-color: #FFFFFF;">
            <tr><td style="width: 18mm; height: 24mm; border: 1.5px solid #000000; padding: 0;">&nbsp;</td></tr>
          </table>
          <div style="font-family: Arial, sans-serif; font-size: 6pt; font-weight: bold; text-transform: uppercase; margin-top: 2px; color: #000000;">PULGAR IZQ.</div>
        </td>
      </tr>
    `;
    fc.replaceWith(tableFp);
  });

  // 9. Transformar bloque de firmas bilaterales (.canonical-signatures) a tabla de 2 columnas
  clone.querySelectorAll('.canonical-signatures').forEach((cs) => {
    const sigBoxes = Array.from(cs.querySelectorAll('.sig-box'));
    const tableSig = document.createElement('table');
    tableSig.setAttribute('style', 'width: 100%; border-collapse: separate; border-spacing: 6px 0; margin-top: 6px; margin-bottom: 6px;');

    if (sigBoxes.length === 2) {
      tableSig.innerHTML = `
        <tr>
          <td style="width: 50%; vertical-align: top; border: 1px solid #000000; padding: 4px 6px; background-color: #FFFFFF;">
            ${sigBoxes[0].innerHTML}
          </td>
          <td style="width: 50%; vertical-align: top; border: 1px solid #000000; padding: 4px 6px; background-color: #FFFFFF;">
            ${sigBoxes[1].innerHTML}
          </td>
        </tr>
      `;
    } else if (sigBoxes.length === 3) {
      tableSig.innerHTML = `
        <tr>
          <td style="width: 33.3%; vertical-align: top; border: 1px solid #000000; padding: 4px 6px; background-color: #FFFFFF;">
            ${sigBoxes[0].innerHTML}
          </td>
          <td style="width: 33.3%; vertical-align: top; border: 1px solid #000000; padding: 4px 6px; background-color: #FFFFFF;">
            ${sigBoxes[1].innerHTML}
          </td>
          <td style="width: 33.3%; vertical-align: top; border: 1px solid #000000; padding: 4px 6px; background-color: #FFFFFF;">
            ${sigBoxes[2].innerHTML}
          </td>
        </tr>
      `;
    } else {
      let trHtml = '';
      const w = Math.floor(100 / (sigBoxes.length || 1));
      sigBoxes.forEach((sb) => {
        trHtml += `<td style="width: ${w}%; vertical-align: top; border: 1px solid #000000; padding: 4px 6px; background-color: #FFFFFF;">${sb.innerHTML}</td>`;
      });
      tableSig.innerHTML = `<tr>${trHtml}</tr>`;
    }

    // Estilizar títulos, líneas y leyendas de firmas
    tableSig.querySelectorAll('.sig-box-title').forEach((st) => {
      (st as HTMLElement).setAttribute('style', 'font-family: Arial, sans-serif; font-size: 7.5pt; font-weight: bold; text-transform: uppercase; text-align: center; border-bottom: 1px solid #000000; padding-bottom: 2px; margin-bottom: 4px; background-color: #F0F0F0; color: #000000;');
    });
    tableSig.querySelectorAll('.sig-data-row').forEach((sr) => {
      (sr as HTMLElement).setAttribute('style', 'font-family: Arial, sans-serif; font-size: 6.8pt; line-height: 1.35; margin-bottom: 2px; color: #000000;');
    });
    tableSig.querySelectorAll('.sig-line, .sig-line-solid').forEach((sl) => {
      (sl as HTMLElement).setAttribute('style', 'border-bottom: 1.5px solid #000000; height: 26px; width: 100%; margin-top: 10px; margin-bottom: 2px;');
      (sl as HTMLElement).innerHTML = '&nbsp;';
    });
    tableSig.querySelectorAll('.sig-legend').forEach((sg) => {
      (sg as HTMLElement).setAttribute('style', 'font-family: Arial, sans-serif; font-size: 6.2pt; font-weight: bold; text-transform: uppercase; text-align: center; margin-bottom: 4px; color: #000000;');
    });

    cs.replaceWith(tableSig);
  });

  // 10. Pie de página institucional (.canonical-footer)
  clone.querySelectorAll('.canonical-footer').forEach((ft) => {
    const el = ft as HTMLElement;
    const hashEl = el.querySelector('.footer-hash-box, .footer-hash-line');
    const hashHtml = hashEl ? hashEl.innerHTML : '';

    const tableFt = document.createElement('table');
    tableFt.setAttribute('style', 'width: 100%; border-collapse: collapse; border-top: 1.5px solid #000000; margin-top: 8px; padding-top: 4px;');
    tableFt.innerHTML = `
      <tr>
        <td style="border: none; text-align: center; vertical-align: middle; padding: 2px 0;">
          <div style="font-family: Arial, sans-serif; font-size: 6.8pt; font-weight: bold; color: #000000; text-transform: uppercase;">
            SHA256.US — LABORATORIO DE INFORMÁTICA FORENSE | CONSIGNACIÓN PRIVADA Y CUMPLIMIENTO NORMATIVO
          </div>
          <div style="font-family: Arial, sans-serif; font-size: 6pt; color: #333333; margin-top: 1px;">
            Documento Oficial generado bajo los estándares del MUCC-2017 (G.O. 41.247), ISO/IEC 27037 y la Ley sobre Mensajes de Datos.
          </div>
          ${hashHtml ? `<div style="font-family: 'Courier New', monospace; font-size: 6pt; color: #000000; margin-top: 2px;">${hashHtml}</div>` : ''}
        </td>
      </tr>
    `;
    el.replaceWith(tableFt);
  });

  // 11. Multi-página: Si hay múltiples clases .page, intercalar saltos duros de página Word
  const pages = Array.from(clone.querySelectorAll('.page'));
  if (pages.length > 1) {
    let combinedHtml = '';
    pages.forEach((pg, idx) => {
      if (idx > 0) {
        combinedHtml += '<br clear="all" style="page-break-before: always; mso-break-type: page-break;" />';
      }
      combinedHtml += pg.innerHTML;
    });
    return combinedHtml;
  }

  return clone.innerHTML;
}

/**
 * Genera el documento HTML completo con cabeceras XMLOffice y estilos Folio
 */
export function buildWordDocxHtmlTemplate(innerHtml: string, title: string = 'Planilla Forense'): string {
  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 216mm 330mm; /* Folio / Oficio Judicial */
      margin: 15mm 12mm 15mm 25mm; /* Margen izquierdo de 25mm para encuadernación */
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7.5pt;
      color: #000000;
      line-height: 1.25;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    td, th {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7.2pt;
      color: #000000;
      vertical-align: middle;
    }
    .font-mono {
      font-family: 'Courier New', Courier, monospace !important;
    }
    .page-break {
      page-break-before: always;
      mso-break-type: page-break;
      clear: both;
    }
  </style>
</head>
<body>
  ${innerHtml}
</body>
</html>`;
}

/**
 * Exporta un elemento HTML de planilla a archivo Microsoft Word (.docx) nativo
 */
export async function exportPlanillaElementToWordDocx(
  element: HTMLElement,
  fileName: string = 'Planilla_Forense.docx',
  title: string = 'Planilla Forense'
): Promise<Blob> {
  const transformedInner = transformPlanillaHtmlForWord(element, title);
  const fullHtml = buildWordDocxHtmlTemplate(transformedInner, title);

  const { asBlob } = await import('html-docx-js-typescript');
  const blobOrBuffer = await asBlob(fullHtml, {
    orientation: 'portrait',
    margins: {
      top: 850,    // ~15mm
      bottom: 850, // ~15mm
      left: 1417,  // ~25mm encuadernación
      right: 680,  // ~12mm
    },
  });

  const finalBlob = blobOrBuffer instanceof Blob
    ? blobOrBuffer
    : new Blob([blobOrBuffer as any], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

  if (typeof window !== 'undefined') {
    saveAs(finalBlob, fileName);
  }

  return finalBlob;
}

/**
 * Exporta la planilla actualmente desplegada en la pantalla activa (/planillas/[slug])
 */
export async function exportCurrentPlanillaToWordDocx(titleOverride?: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const container = document.getElementById('contenedor-planilla-activa') ||
                    document.querySelector('.folio-forense-aislado');

  if (!container) {
    alert('No se encontró ninguna planilla activa en la pantalla.');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const modo = urlParams.get('modo') || (urlParams.get('casoId') ? 'datos' : 'blanco');
  const slug = container.getAttribute('data-slug') || window.location.pathname.split('/').pop() || 'planilla';

  // Buscar título formal en la planilla
  const titleEl = container.querySelector('.canonical-doc-title') || document.querySelector('h1');
  const rawTitle = titleOverride || titleEl?.textContent?.trim() || slug;
  const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_');

  const casoId = urlParams.get('casoId');
  const sufijoModo = modo === 'blanco' ? 'blanco' : `Caso_${(casoId || 'datos').replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  const fileName = `${cleanTitle}_${sufijoModo}.docx`;

  await exportPlanillaElementToWordDocx(container as HTMLElement, fileName, rawTitle);
}

/**
 * Descarga cualquier planilla por su slug directamente desde el catálogo /planillas,
 * sin necesidad de navegar a la vista de detalle.
 */
export async function descargarPlanillaPorSlug(
  slug: string,
  modo: 'blanco' | 'datos' = 'blanco',
  casoId?: string,
  titulo?: string
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const url = `/planillas/${slug}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} al obtener la plantilla ${slug}`);
    }

    const htmlText = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const container = doc.getElementById('contenedor-planilla-activa') ||
                      doc.querySelector('.folio-forense-aislado');

    if (!container) {
      throw new Error(`No se encontró el contenedor de la planilla en ${url}`);
    }

    // Modo Blanco: limpiar placeholders [ ... ]
    if (modo === 'blanco' || !casoId) {
      container.querySelectorAll<HTMLElement>('[data-field]').forEach((el) => {
        const txt = el.textContent?.trim() || '';
        if (txt.startsWith('[') && txt.endsWith(']')) {
          el.textContent = '';
        }
      });
    } else {
      // Modo Datos: inyectar los datos reales del caso seleccionado
      let caso: CasoCMS | undefined;
      try {
        caso = await phpApi.obtenerCaso(casoId);
      } catch {
        const casos = await idbGetAll('casos');
        caso = casos.find((c) => c.id === casoId);
      }

      if (caso) {
        container.querySelectorAll<HTMLElement>('[data-field]').forEach((el) => {
          const field = el.getAttribute('data-field') as keyof CasoCMS;
          if (field && caso && (caso as any)[field] !== undefined && (caso as any)[field] !== null) {
            el.textContent = String((caso as any)[field]);
          }
        });
      }
    }

    const rawTitle = titulo || doc.querySelector('.canonical-doc-title')?.textContent?.trim() || slug;
    const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_');
    const sufijoModo = modo === 'blanco' ? 'blanco' : `Caso_${(casoId || 'datos').replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const fileName = `${cleanTitle}_${sufijoModo}.docx`;

    await exportPlanillaElementToWordDocx(container as HTMLElement, fileName, rawTitle);
  } catch (err: any) {
    console.error('Error al descargar planilla Word por slug:', err);
    alert(`No se pudo generar el archivo Word: ${err.message || 'Error desconocido'}`);
  }
}

/**
 * Función legacy mantenida para retrocompatibilidad total con llamadas anteriores
 */
export async function exportPlanillaToWordDocx(
  caso: any,
  title: string = 'Planilla_Forense',
  element?: HTMLElement | null
) {
  if (element) {
    const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const numCaso = (caso?.numeroCaso || 'EXP').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${cleanTitle}_Caso_${numCaso}.docx`;
    return exportPlanillaElementToWordDocx(element, fileName, title);
  }

  // Si no se proporcionó elemento, delegamos en la planilla activa en pantalla
  return exportCurrentPlanillaToWordDocx(title);
}
