import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('🏛️ Ejecutando postbuild para cPanel / LiteSpeed...');

// 1. Asegurar dist/planillas/index.html a partir de dist/planillas.html
const planillasHtml = path.resolve(distDir, 'planillas.html');
const planillasDir = path.resolve(distDir, 'planillas');
const planillasIndex = path.resolve(planillasDir, 'index.html');

if (fs.existsSync(planillasHtml)) {
  if (!fs.existsSync(planillasDir)) {
    fs.mkdirSync(planillasDir, { recursive: true });
  }
  fs.copyFileSync(planillasHtml, planillasIndex);
  console.log('✅ dist/planillas/index.html generado exitosamente desde planillas.html');
} else {
  console.warn('⚠️ No se encontró dist/planillas.html');
}

// 2. Asegurar que .htaccess existe en dist/
const publicHtaccess = path.resolve(rootDir, 'public/.htaccess');
const distHtaccess = path.resolve(distDir, '.htaccess');
if (fs.existsSync(publicHtaccess)) {
  fs.copyFileSync(publicHtaccess, distHtaccess);
  console.log('✅ dist/.htaccess verificado y sincronizado');
}

console.log('✨ Postbuild finalizado con éxito.');
