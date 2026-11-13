import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import baseline from '../../../docs/inventario-planillas.json';

const ASTRO_PLANILLAS: Record<string, string> = {
  acta_obtencion: 'src/components/planillas/ActaObtencion.astro',
  prcc: 'src/components/planillas/PlanillaPRCC.astro',
  acta_entrevista: 'src/components/planillas/ActaEntrevista.astro',
  acta_dictamen: 'src/components/planillas/ActaDictamen.astro',
  acta_consentimiento: 'src/components/planillas/ActaConsentimiento.astro',
  acta_desprecintado: 'src/components/planillas/ActaDesprecintado.astro',
  acta_entrega_resultados: 'src/components/planillas/ActaEntregaResultados.astro',
  acta_sanitizacion: 'src/components/planillas/ActaSanitizacion.astro',
  acta_auditoria_timeline: 'src/components/planillas/ActaAuditoriaTimeline.astro',
  planilla_evaluacion_ux: 'src/components/planillas/PlanillaEvaluacionUX.astro',
  informe_audio_sonic: 'src/components/planillas/PlanillaAudioSonic.astro',
  dictamen_imagenes: 'src/components/planillas/DictamenImagenes.astro',
  dictamen_audios: 'src/components/planillas/DictamenAudios.astro',
};

describe('Paridad de Planillas Oficiales Folio (216mm x 330mm)', () => {
  it('contiene exactamente las 13 planillas oficiales del inventario', () => {
    const baseIds = Object.keys(baseline.planillas).sort();
    const astroIds = Object.keys(ASTRO_PLANILLAS).sort();
    expect(astroIds).toEqual(baseIds);
  });

  for (const [id, filepath] of Object.entries(ASTRO_PLANILLAS)) {
    it(`la planilla [${id}] existe, está encapsulada en .folio-forense-aislado y preserva sus campos clave`, () => {
      const fullPath = path.resolve(process.cwd(), filepath);
      expect(fs.existsSync(fullPath)).toBe(true);

      const content = fs.readFileSync(fullPath, 'utf8');
      expect(content).toContain('folio-forense-aislado');

      // Extraer campos mapeados en data-field o variables caso.*
      const fields = new Set<string>();
      for (const m of content.matchAll(/data-field="([a-zA-Z0-9_]+)"/g)) {
        fields.add(m[1]);
      }
      for (const m of content.matchAll(/caso\.([a-zA-Z0-9_]+)/g)) {
        fields.add(m[1]);
      }

      // Debe incluir campos esenciales de trazabilidad
      expect(fields.has('numeroCaso')).toBe(true);

      // Comprobar presencia de firmas o huellas
      const hasSignatures = content.includes('sig-detail-card') || content.includes('sig-line');
      expect(hasSignatures).toBe(true);
    });
  }
});
