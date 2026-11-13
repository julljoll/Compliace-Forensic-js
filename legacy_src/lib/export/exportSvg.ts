/**
 * SHA256.US — Exportador Oficial de Planillas Legal-Forenses a Paquete de Imágenes Vectoriales SVG (.zip)
 * Invoca el motor estandarizado exportSvgEngine para generar archivos SVG independientes por hoja.
 */

import { exportPlanillaToSvgZip } from './exportSvgEngine';

export async function exportPlanillaToSvg(caso: any, title: string = 'Planilla_Forense', element?: HTMLElement | null) {
  return exportPlanillaToSvgZip({ caso, title, element });
}
