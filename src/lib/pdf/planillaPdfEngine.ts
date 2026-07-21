import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Genera un Blob PDF de alta fidelidad a partir de elementos DOM de planilla forense (.planilla-container .page).
 * Tamaño exacto de hoja: Folio / Oficio (216mm x 330mm).
 * - Página 1: Margen superior 4cm (40mm), izquierdo 3cm (30mm), inferior 1.5cm (15mm), derecho 1.5cm (15mm).
 * - Páginas 2+: Margen superior 1.5cm (15mm), izquierdo 3cm (30mm), inferior 1.5cm (15mm), derecho 1.5cm (15mm).
 */
export async function generatePdfBlobFromElement(
  element: HTMLElement,
  title: string = 'Planilla_Forense'
): Promise<Blob> {
  await document.fonts.ready;

  const pdfWidth = 216;
  const pdfHeight = 330;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfWidth, pdfHeight],
    compress: true,
  });

  // Buscar todas las hojas .page dentro del contenedor
  let pageElements = Array.from(element.querySelectorAll<HTMLElement>('.page'));
  if (pageElements.length === 0 && element.classList.contains('page')) {
    pageElements = [element];
  }
  if (pageElements.length === 0) {
    const parentContainer = element.closest('.planilla-container');
    if (parentContainer) {
      pageElements = Array.from(parentContainer.querySelectorAll<HTMLElement>('.page'));
    }
  }

  if (pageElements.length > 0) {
    for (let i = 0; i < pageElements.length; i++) {
      const pageEl = pageElements[i];
      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (i > 0) {
        pdf.addPage([pdfWidth, pdfHeight], 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }
  } else {
    // Fallback si no hay estructura .page explícita
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage([pdfWidth, pdfHeight], 'portrait');
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }
  }

  pdf.setProperties({
    title: title,
    subject: 'Planilla Pericial Forense Digital — SHA256.US',
    author: 'Compliance Forensic CMS',
    creator: 'SHA256.US Cyber-Legal Engine',
  });

  return pdf.output('blob');
}

/**
 * Descarga directamente un archivo PDF generado a partir de un Blob.
 */
export function downloadPdfBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Abre el diálogo de impresión nativa del sistema usando un objeto Blob PDF cargado en un iframe oculto.
 */
export function printPdfBlob(blob: Blob): void {
  const blobUrl = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = blobUrl;

  document.body.appendChild(iframe);

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    }, 250);
  };
}
