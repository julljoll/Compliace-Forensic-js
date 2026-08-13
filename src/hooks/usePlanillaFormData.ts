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
<<<<<<< HEAD
  | 'acta_auditoria_timeline'
  | 'planilla_evaluacion_ux';
=======
  | 'acta_auditoria_timeline';
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862

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
