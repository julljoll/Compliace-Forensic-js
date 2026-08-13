const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '../public/logo.png');
const logoB64 = fs.readFileSync(logoPath).toString('base64');
const logoDataUri = `data:image/png;base64,${logoB64}`;

const files = [
  path.join(__dirname, '../public/svg/planillas/MATRIZ_VALIDACION_HIPOTESIS_FORENSE_FOLIO.svg'),
  path.join(__dirname, '../public/svg/planillas/PLANILLA_EVALUACION_UX_FORENSE_FOLIO.svg')
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('xmlns:xlink')) {
    content = content.replace('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ');
  }
  
  // Replace the image tag with embedded base64 data URI
  const oldImageRegex = /<image href="[^"]*" x="6" y="6" width="63" height="63" preserveAspectRatio="xMidYMid meet" \/>/g;
  const newImageTag = `<image href="${logoDataUri}" xlink:href="${logoDataUri}" x="6" y="6" width="63" height="63" preserveAspectRatio="xMidYMid meet" />`;
  
  content = content.replace(oldImageRegex, newImageTag);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Logo embebido en base64 exitosamente en: ${path.basename(filePath)}`);
});
