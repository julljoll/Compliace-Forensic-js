#!/usr/bin/env node
/**
 * SHA256.US — Inventario de campos de planillas (línea base de paridad).
 *
 * Extrae, de cada planilla legado (web React + PDF @react-pdf), los campos de
 * `CasoCMS` consumidos (`c.campo` / `caso.campo`), los títulos de sección,
 * la cantidad de recuadros dactiloscópicos y de slots editables.
 *
 * Uso:
 *   node scripts/inventario-campos.mjs --root legacy_src --out docs/inventario-planillas.json
 *
 * El JSON resultante es la LÍNEA BASE contra la que `tests/unit/planillas/paridad.test.ts`
 * verifica que cada planilla `.astro` conserve todos los campos.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);
const ROOT = args.root || 'src';
const OUT = args.out || 'docs/inventario-planillas.json';

/** id canónico → archivos legado (web, pdf, form) */
export const PLANILLAS = {
  acta_obtencion: { web: 'ActaObtencion', pdf: 'ActaObtencionPdf', form: 'ActaObtencionForm' },
  prcc: { web: 'PlanillaPRCC', pdf: 'PlanillaPRCCPdf', form: 'PlanillaPRCCForm' },
  acta_entrevista: { web: 'ActaEntrevista', pdf: 'ActaEntrevistaPdf', form: 'ActaEntrevistaForm' },
  acta_dictamen: { web: 'ActaDictamen', pdf: 'ActaDictamenPdf', form: 'ActaDictamenForm' },
  acta_consentimiento: { web: 'ActaConsentimiento', pdf: 'ActaConsentimientoPdf' },
  acta_desprecintado: { web: 'ActaDesprecintado', pdf: 'ActaDesprecintadoPdf' },
  acta_entrega_resultados: { web: 'ActaEntregaResultados', pdf: 'ActaEntregaResultadosPdf', form: 'ActaEntregaResultadosForm' },
  acta_sanitizacion: { web: 'ActaSanitizacion', pdf: 'ActaSanitizacionPdf' },
  acta_auditoria_timeline: { web: 'ActaAuditoriaTimeline', pdf: 'ActaAuditoriaTimelinePdf' },
  planilla_evaluacion_ux: { web: 'PlanillaEvaluacionUX', pdf: 'PlanillaEvaluacionUXPdf' },
  informe_audio_sonic: { web: 'PlanillaAudioSonic', pdf: 'PlanillaAudioSonicPdf', form: 'PlanillaAudioSonicForm' },
  dictamen_imagenes: { pdf: 'DictamenImagenesPdf' },
  dictamen_audios: { pdf: 'DictamenAudiosPdf' },
};

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);

function camposDe(src) {
  if (!src) return [];
  const set = new Set();
  for (const m of src.matchAll(/\b(?:c|caso)\??\.([a-zA-Z_][a-zA-Z_0-9]*)/g)) {
    const f = m[1];
    if (['length', 'map', 'filter', 'find', 'toString', 'trim', 'slice'].includes(f)) continue;
    set.add(f);
  }
  return [...set].sort();
}

function seccionesDe(src) {
  if (!src) return [];
  const out = new Set();
  for (const m of src.matchAll(/\b(\d{1,2}\.\d)\s+([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 ,/&().\-—–:]{6,})/g)) {
    out.add(`${m[1]} ${m[2].trim()}`);
  }
  return [...out];
}

const count = (src, re) => (src ? (src.match(re) || []).length : 0);

const inventario = { generado: new Date().toISOString(), root: ROOT, planillas: {} };

for (const [id, f] of Object.entries(PLANILLAS)) {
  const web = f.web ? read(path.join(ROOT, 'components/organisms/Planillas', `${f.web}.tsx`)) : null;
  const pdf = read(path.join(ROOT, 'lib/pdf/documents', `${f.pdf}.tsx`));
  const form = f.form ? read(path.join(ROOT, 'components/organisms/Planillas/Forms', `${f.form}.tsx`)) : null;

  const campos = new Set([...camposDe(web), ...camposDe(pdf), ...camposDe(form)]);
  inventario.planillas[id] = {
    archivos: f,
    campos: [...campos].sort(),
    camposWeb: camposDe(web),
    camposPdf: camposDe(pdf),
    camposForm: camposDe(form),
    seccionesWeb: seccionesDe(web),
    huellasWeb: count(web, /PlanillaThumbBox label=/g),
    slotsEditablesWeb: count(web, /PlanillaEditableValue|contentEditable/g),
    firmasWeb: count(web, /sig-line"|PlanillaSigLine/g),
  };
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(inventario, null, 2) + '\n');
const total = Object.values(inventario.planillas).reduce((a, p) => a + p.campos.length, 0);
console.log(`✅ Inventario: ${Object.keys(PLANILLAS).length} planillas, ${total} referencias de campo → ${OUT}`);
