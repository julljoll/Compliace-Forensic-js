#!/usr/bin/env node
/**
 * SHA256.US — Compila el tema USWDS y copia sus activos a public/assets/uswds/
 * (css, js, fonts, img) para rutas relativas limpias en cPanel.
 *
 * Se ejecuta automáticamente en `predev` y `prebuild`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = path.join(root, 'node_modules/@uswds/uswds');
const dist = path.join(pkg, 'dist');
const out = path.join(root, 'public/assets/uswds');

fs.rmSync(out, { recursive: true, force: true });
for (const dir of ['js', 'fonts', 'img']) {
  fs.cpSync(path.join(dist, dir), path.join(out, dir), { recursive: true });
}
// No se distribuyen sourcemaps ni la fuente Source Sans (no usada por el tema)
fs.rmSync(path.join(out, 'fonts/source-sans-pro'), { recursive: true, force: true });
for (const f of fs.readdirSync(path.join(out, 'js'))) {
  if (f.endsWith('.map')) fs.rmSync(path.join(out, 'js', f));
}

const result = sass.compile(path.join(root, 'src/styles/uswds-theme.scss'), {
  loadPaths: [path.join(pkg, 'packages')],
  style: 'compressed',
  quietDeps: true,
  silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'legacy-js-api'],
});
fs.mkdirSync(path.join(out, 'css'), { recursive: true });
fs.writeFileSync(path.join(out, 'css/uswds.min.css'), result.css);

const kb = (fs.statSync(path.join(out, 'css/uswds.min.css')).size / 1024).toFixed(0);
console.log(`✅ USWDS compilado (${kb} KB) y activos copiados → public/assets/uswds/`);
