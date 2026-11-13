import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

describe('Verificación de Despliegue cPanel y Estructura en dist/', () => {
  const rootDir = path.resolve(__dirname, '../../..');
  const distDir = path.resolve(rootDir, 'dist');

  beforeAll(() => {
    if (!fs.existsSync(distDir) || !fs.existsSync(path.resolve(distDir, 'index.html'))) {
      execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
    }
  });

  it('debe existir el archivo database.sql con esquema relacional e inmutabilidad', () => {
    const sqlPath = path.resolve(rootDir, 'database.sql');
    expect(fs.existsSync(sqlPath)).toBe(true);
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `casos`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `fases_caso`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `auditoria`');
    expect(sql).toContain('trg_auditoria_no_update');
    expect(sql).toContain('trg_auditoria_no_delete');
  });

  it('dist/ debe contener .htaccess con reglas de Apache para URLs limpias y seguridad', () => {
    const htaccessPath = path.resolve(distDir, '.htaccess');
    expect(fs.existsSync(htaccessPath)).toBe(true);
    const htaccess = fs.readFileSync(htaccessPath, 'utf-8');
    expect(htaccess).toContain('RewriteEngine On');
    expect(htaccess).toContain('RewriteRule ^api/ - [L]');
    expect(htaccess).toContain('X-Frame-Options');
    expect(htaccess).toContain('X-Content-Type-Options');
  });

  it('dist/api/ debe contener todos los controladores y bibliotecas de PHP PDO', () => {
    const expectedPhp = [
      'casos.php',
      'avanzar-etapa.php',
      'auditoria.php',
      'auth.php',
      'config.php',
      'lib/canonical.php',
      'lib/db.php',
      'lib/auth.php',
    ];
    for (const file of expectedPhp) {
      const p = path.resolve(distDir, 'api', file);
      expect(fs.existsSync(p), `Debe existir dist/api/${file}`).toBe(true);
    }
  });

  it('dist/ debe contener todas las páginas principales compiladas en HTML estático', () => {
    const expectedPages = [
      'index.html',
      'dashboard.html',
      'casos.html',
      'flujo.html',
      'custodia.html',
      'normativa.html',
      'auditoria.html',
      'exportar.html',
      'planillas.html',
      'planillas/index.html',
    ];
    for (const page of expectedPages) {
      const p = path.resolve(distDir, page);
      expect(fs.existsSync(p), `Debe existir dist/${page}`).toBe(true);
    }
  });

  it('dist/planillas/ debe contener las 13 planillas oficiales en Folio (216x330mm)', () => {
    const expectedPlanillas = [
      'acta-consentimiento.html',
      'acta-entrevista.html',
      'acta-obtencion.html',
      'planilla-prcc.html',
      'acta-desprecintado.html',
      'acta-dictamen.html',
      'acta-entrega-resultados.html',
      'acta-sanitizacion.html',
      'acta-auditoria-timeline.html',
      'planilla-evaluacion-ux.html',
      'planilla-audio-sonic.html',
      'dictamen-imagenes.html',
      'dictamen-audios.html',
    ];
    for (const pl of expectedPlanillas) {
      const p = path.resolve(distDir, 'planillas', pl);
      expect(fs.existsSync(p), `Debe existir dist/planillas/${pl}`).toBe(true);

      const html = fs.readFileSync(p, 'utf-8');
      expect(html).toContain('folio-forense-aislado');
    }
  });

  it('dist/assets/uswds/ debe contener CSS compilado, JS y fuentes', () => {
    expect(fs.existsSync(path.resolve(distDir, 'assets/uswds/css/uswds.min.css'))).toBe(true);
    expect(fs.existsSync(path.resolve(distDir, 'assets/uswds/js/uswds.min.js'))).toBe(true);
    expect(fs.existsSync(path.resolve(distDir, 'assets/uswds/fonts'))).toBe(true);
  });
});
