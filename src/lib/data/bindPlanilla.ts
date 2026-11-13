/**
 * SHA256.US — Data Binder para Planillas Oficiales en Astro.
 * Lee el caso desde IndexedDB / API según el query param `?casoId=xxx` o el caso activo,
 * rellena los campos marcados con `data-field="nombreCampo"`,
 * y sincroniza ediciones en tiempo real con guardado automático.
 */

import { phpApi } from './phpApi';
import type { CasoCMS } from '../domain/types';

export async function bindPlanilla(planillaId: string): Promise<CasoCMS | undefined> {
  if (typeof window === 'undefined') return undefined;

  const urlParams = new URLSearchParams(window.location.search);
  const casoId = urlParams.get('casoId') || urlParams.get('id');

  let caso: CasoCMS | undefined;
  if (casoId) {
    caso = await phpApi.obtenerCaso(casoId);
  } else {
    // Si no se pasó ID, tomar el primer caso disponible en caché
    const todos = await phpApi.listarCasos();
    caso = todos[0];
  }

  if (!caso) return undefined;

  // Llenar campos con data-field
  const elements = document.querySelectorAll<HTMLElement>('[data-field]');
  elements.forEach((el) => {
    const field = el.getAttribute('data-field') as keyof CasoCMS;
    if (field && caso && caso[field] !== undefined) {
      const val = caso[field];
      if (typeof val === 'string' || typeof val === 'number') {
        el.textContent = String(val);
      }
    }

    // Manejar ediciones contentEditable
    if (el.isContentEditable) {
      el.addEventListener('blur', async () => {
        const nuevoTexto = el.textContent?.trim() || '';
        if (caso && field) {
          (caso as any)[field] = nuevoTexto;
          await phpApi.guardarCaso(caso);
        }
      });
    }
  });

  return caso;
}
