import JSZip from 'jszip';
import planillasCssText from './Planillas.css?inline';

export const downloadPlanillaZip = async (fileNamePrefix: string, title: string) => {
  const element = document.querySelector('.planilla-container .page');
  if (!element) {
    alert('No se encontró el área imprimible de la planilla.');
    return;
  }

  // Get the inner content of the page
  const contentHtml = element.innerHTML;

  // Clean up any button or "no-print" sections that shouldn't be exported
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentHtml, 'text/html');
  doc.querySelectorAll('.no-print, button').forEach(el => el.remove());
  const cleanContent = doc.body.innerHTML;

  // HTML file content
  const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    ${planillasCssText}
    /* Set page margins for print/preview */
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: 'Courier New', Courier, monospace;
    }
    .page {
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      min-height: 0 !important;
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

  // Word (DOC) file content
  const wordTemplate = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
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
      size: legal; /* Legal maps to Oficio in Microsoft Word standard configurations */
      margin: 20mm 15mm 20mm 38mm;
    }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11pt;
      line-height: 1.5;
    }
    ${planillasCssText}
    /* Word specific resets & compatibility overrides (No Flexbox/Grid support in Word) */
    .page {
      width: 100% !important;
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    .grid-container, .signature-section, .signature-grid {
      display: block !important;
      width: 100% !important;
      clear: both !important;
    }
    .form-group {
      display: block !important;
      float: left !important;
      width: 48% !important;
      margin-right: 1% !important;
      margin-bottom: 8px !important;
    }
    .sig-detail-card, .sig-card {
      display: block !important;
      float: left !important;
      width: 48% !important;
      margin-right: 1% !important;
    }
    header {
      display: block !important;
      width: 100% !important;
      clear: both !important;
      border-bottom: 2px solid #000000 !important;
      padding-bottom: 10px !important;
      margin-bottom: 20px !important;
    }
    .logo-container {
      display: block !important;
      float: left !important;
      width: 60% !important;
    }
    .acta-header, .form-header-info {
      display: block !important;
      float: right !important;
      width: 38% !important;
      text-align: right !important;
    }
    .fingerprint-row {
      display: block !important;
      width: 100% !important;
      clear: both !important;
      margin-top: 4px !important;
    }
    .thumb-wrapper {
      display: block !important;
      float: left !important;
      width: 45% !important;
      margin-right: 5% !important;
      text-align: center !important;
    }
    .check-item {
      display: inline-block !important;
      margin-right: 15px !important;
      margin-bottom: 5px !important;
    }
    .checkbox-group {
      display: block !important;
      width: 100% !important;
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

  // Create Zip
  const zip = new JSZip();
  zip.file(`${fileNamePrefix}.html`, htmlTemplate);
  zip.file(`${fileNamePrefix}.doc`, wordTemplate);

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
