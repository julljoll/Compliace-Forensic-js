import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Genera un Blob PDF de alta fidelidad a partir de un elemento DOM de planilla forense (.planilla-container .page).
 * Tamaño exacto de hoja: Oficio (216mm x 330mm).
 */
export async function generatePdfBlobFromElement(
  element: HTMLElement,
  title: string = 'Planilla_Forense'
): Promise<Blob> {
  // Asegurar que las imágenes y fuentes estén cargadas
  await document.fonts.ready;

  // Renderizar canvas con alta resolución (scale: 2)
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    windowWidth: 1024,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // Dimensiones del papel Oficio en milímetros: 216mm x 330mm
  const pdfWidth = 216;
  const pdfHeight = 330;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfWidth, pdfHeight],
    compress: true,
  });

  // Calcular alto proporcional en mm
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Primera página
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pdfHeight;

  // Páginas adicionales si el contenido sobrepasa la longitud de 1 hoja Oficio
  while (heightLeft > 5) {
    position = heightLeft - imgHeight;
    pdf.addPage([pdfWidth, pdfHeight], 'portrait');
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
  }

  // Establecer metadatos del documento PDF
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
