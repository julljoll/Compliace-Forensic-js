import JSZip from 'jszip';
import { generatePdfBlobFromElement } from '@/lib/pdf/planillaPdfEngine';

let cachedCssText: string | null = null;

const getPlanillasCssText = async (): Promise<string> => {
  if (cachedCssText) return cachedCssText;
  try {
    const response = await fetch('/Planillas.css');
    cachedCssText = await response.text();
    return cachedCssText || '';
  } catch {
    return '';
  }
};

export const downloadPlanillaZip = async (fileNamePrefix: string, title: string) => {
  const element = document.querySelector('.planilla-container .page') as HTMLElement;
  if (!element) {
    alert('No se encontró el área imprimible de la planilla.');
    return;
  }

  // Generate PDF Blob
  let pdfBlob: Blob | null = null;
  try {
    pdfBlob = await generatePdfBlobFromElement(element, title);
  } catch (err) {
    console.error('Error generando PDF para el paquete:', err);
  }

  // Get the inner content of the page
  const contentHtml = element.innerHTML;

  // Clean up any button or "no-print" sections that shouldn't be exported
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentHtml, 'text/html');
  doc.querySelectorAll('.no-print, button').forEach(el => el.remove());
  const cleanContent = doc.body.innerHTML;

  // Get CSS text
  const planillasCssText = await getPlanillasCssText();

  // HTML file content
  const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    ${planillasCssText}
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: 'Times New Roman', Times, serif;
    }
    .page {
      border: none !important;
      box-shadow: none !important;
      padding: 40mm 15mm 15mm 30mm !important;
      margin: 0 auto !important;
      width: 216mm !important;
      min-height: 330mm !important;
    }
  </style>
</head>
<body>
  <div class="planilla-container">
    <div class="page">
      ${cleanContent}
    </div>
  </div>
</body>
</html>`;

  // Create Zip (Contiene unicamente HTML y PDF oficial)
  const zip = new JSZip();
  zip.file(`${fileNamePrefix}.html`, htmlTemplate);
  if (pdfBlob) {
    zip.file(`${fileNamePrefix}.pdf`, pdfBlob);
  }

  // Generate and trigger download
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileNamePrefix}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
