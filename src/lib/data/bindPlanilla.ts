/**
 * SHA256.US — Data Binder para Planillas Oficiales en Astro.
 * Gestiona el modo 'blanco' (para impresión limpia y llenado manual a bolígrafo)
 * y el modo 'datos' (rellena con los datos reales del expediente pericial).
 */

import { phpApi } from './phpApi';
import type { CasoCMS } from '../domain/types';

export async function bindPlanilla(planillaId: string): Promise<CasoCMS | undefined> {
  if (typeof window === 'undefined') return undefined;

  const urlParams = new URLSearchParams(window.location.search);
  const casoId = urlParams.get('casoId') || urlParams.get('id');
  const modo = urlParams.get('modo') || (casoId ? 'datos' : 'blanco');

  // Modo Blanco: No cargar datos ficticios, asegurar campos limpios para escritura a mano
  if (modo === 'blanco' || !casoId) {
    const elements = document.querySelectorAll<HTMLElement>('[data-field]');
    elements.forEach((el) => {
      const current = el.textContent?.trim() || '';
      // Limpiar texto de placeholder entre corchetes
      if (current.startsWith('[') && current.endsWith(']')) {
        el.textContent = '';
      }
    });
    return undefined;
  }

  // Modo Datos: Cargar el caso solicitado desde MySQL / IndexedDB
  const caso = await phpApi.obtenerCaso(casoId);
  if (!caso) return undefined;

  // Llenar campos con data-field
  const elements = document.querySelectorAll<HTMLElement>('[data-field]');
  elements.forEach((el) => {
    const field = el.getAttribute('data-field') as keyof CasoCMS;
    if (field && caso && caso[field] !== undefined && caso[field] !== null) {
      const val = caso[field];
      if (typeof val === 'string' || typeof val === 'number') {
        el.textContent = String(val);
      }
    }

    // Manejar ediciones contentEditable en pantalla
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
