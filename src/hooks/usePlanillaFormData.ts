'use client';

import { useCMSStore, CasoCMS } from '@/store/cmsStore';

export type PlanillaId =
  | 'prcc'
  | 'acta_obtencion'
  | 'acta_entrevista'
  | 'acta_dictamen'
  | 'acta_entrega_resultados'
  | 'acta_consentimiento'
  | 'acta_desprecintado'
  | 'acta_sanitizacion'
  | 'acta_auditoria_timeline'
  | 'planilla_evaluacion_ux'
  | 'informe_audio_sonic';

export function usePlanillaFormData(casoId: string, _planillaId?: PlanillaId) {
  const { casos, updateCasoFormData, updateCaso } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  const save = (overrides: Partial<CasoCMS>) => {
    if (casoId) {
      updateCasoFormData(casoId, overrides);
    }
  };

  return { caso, save, updateCaso };
}
