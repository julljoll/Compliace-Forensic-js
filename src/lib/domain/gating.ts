/**
 * SHA256.US — Motor de gating del ciclo pericial ISO (puro, determinista, sin I/O).
 *
 * Reglas (ISO 37301 §8 · ISO/IEC 27001 A.5.36):
 *  1. Una fase solo puede iniciarse si la anterior está COMPLETADA.
 *  2. Una fase solo puede completarse si todos sus controles requeridos aplicables están marcados
 *     y, cuando el control exige campos del expediente, éstos cumplen su regla.
 *  3. El cierre produce un hash SHA-256 encadenado al hash de la fase anterior.
 * El servidor PHP (`public/api/avanzar-etapa.php`) aplica exactamente las mismas reglas.
 */
import catalogo from '../../data/fases-iso.json';
import type { CasoCMS, ControlMarcado, FaseIsoEstado, FaseIsoId, PlanillaId, TipoProyecto } from './types';
import { GENESIS_HASH, SHA256_RE, hashCanonical } from '../crypto/canonical';

export type ReglaCampo = 'requerido' | 'sha256' | 'verdadero';

export interface ControlIso {
  id: string;
  texto: string;
  norma: string;
  campos?: { campo: keyof CasoCMS & string; regla: ReglaCampo }[];
  planilla?: PlanillaId;
  tipologias?: TipoProyecto[];
  requerido?: boolean;
}

export interface FaseIso {
  id: FaseIsoId;
  orden: number;
  nombre: string;
  corto: string;
  normas: string[];
  objetivo: string;
  planillas: PlanillaId[];
  pasosLegado: Record<TipoProyecto, string[]>;
  controles: ControlIso[];
}

export const FASES_ISO = catalogo.fases as unknown as FaseIso[];
export const CATALOGO_VERSION: string = catalogo.version;
export const FASE_IDS: FaseIsoId[] = FASES_ISO.map((f) => f.id);

export const getFase = (id: FaseIsoId): FaseIso => {
  const f = FASES_ISO.find((x) => x.id === id);
  if (!f) throw new Error(`Fase ISO desconocida: ${id}`);
  return f;
};

export const faseAnterior = (id: FaseIsoId): FaseIsoId | null => {
  const i = FASE_IDS.indexOf(id);
  return i > 0 ? FASE_IDS[i - 1] : null;
};
export const faseSiguiente = (id: FaseIsoId): FaseIsoId | null => {
  const i = FASE_IDS.indexOf(id);
  return i >= 0 && i < FASE_IDS.length - 1 ? FASE_IDS[i + 1] : null;
};

export function controlesAplicables(fase: FaseIso, tipo: TipoProyecto): ControlIso[] {
  return fase.controles.filter((c) => !c.tipologias || c.tipologias.length === 0 || c.tipologias.includes(tipo));
}

export function evaluarRegla(valor: unknown, regla: ReglaCampo): boolean {
  switch (regla) {
    case 'verdadero':
      return valor === true;
    case 'sha256':
      return typeof valor === 'string' && SHA256_RE.test(valor.trim().toLowerCase());
    case 'requerido':
    default:
      return valor !== undefined && valor !== null && String(valor).trim() !== '';
  }
}

export const DESCRIPCION_REGLA: Record<ReglaCampo, string> = {
  requerido: 'es obligatorio',
  sha256: 'debe ser un hash SHA-256 válido (64 hex)',
  verdadero: 'debe confirmarse como MATCH',
};

export interface Faltante {
  controlId: string;
  texto: string;
  norma: string;
  motivo: string;
  tipo: 'campo' | 'marca' | 'planilla';
  campo?: string;
  planilla?: PlanillaId;
}

/** Campos del expediente que bloquean un control (independiente de la marca del perito). */
export function camposFaltantes(caso: Partial<CasoCMS>, control: ControlIso): Faltante[] {
  return (control.campos || [])
    .filter((c) => !evaluarRegla((caso as Record<string, unknown>)[c.campo], c.regla))
    .map((c) => ({
      controlId: control.id,
      texto: control.texto,
      norma: control.norma,
      motivo: `Campo «${c.campo}» ${DESCRIPCION_REGLA[c.regla]}`,
      tipo: 'campo' as const,
      campo: c.campo,
    }));
}

export function estadoFase(caso: Partial<CasoCMS>, id: FaseIsoId): FaseIsoEstado {
  const guardado = caso.fasesIso?.[id];
  if (guardado) return guardado;
  const prev = faseAnterior(id);
  const prevOk = !prev || caso.fasesIso?.[prev]?.estado === 'COMPLETADA';
  return { estado: prevOk ? 'DISPONIBLE' : 'BLOQUEADA', controles: {} };
}

/** Estado efectivo: una fase guardada nunca puede estar abierta si su predecesora no está completada. */
export function estadoEfectivo(caso: Partial<CasoCMS>, id: FaseIsoId): FaseIsoEstado['estado'] {
  const e = estadoFase(caso, id);
  if (e.estado === 'COMPLETADA') return 'COMPLETADA';
  const prev = faseAnterior(id);
  if (prev && estadoEfectivo(caso, prev) !== 'COMPLETADA') return 'BLOQUEADA';
  return e.estado === 'BLOQUEADA' ? 'DISPONIBLE' : e.estado;
}

export function faseActual(caso: Partial<CasoCMS>): FaseIsoId {
  return FASE_IDS.find((id) => estadoEfectivo(caso, id) !== 'COMPLETADA') ?? 'F5';
}

export function expedienteCerrado(caso: Partial<CasoCMS>): boolean {
  return FASE_IDS.every((id) => estadoEfectivo(caso, id) === 'COMPLETADA');
}

export interface EvaluacionFase {
  fase: FaseIso;
  estado: FaseIsoEstado['estado'];
  aplicables: ControlIso[];
  requeridos: ControlIso[];
  completados: number;
  faltantes: Faltante[];
  puedeCompletar: boolean;
  bloqueadaPor?: FaseIsoId;
}

export function evaluarFase(caso: Partial<CasoCMS>, id: FaseIsoId): EvaluacionFase {
  const fase = getFase(id);
  const tipo = (caso.tipoProyecto || 'forense_whatsapp') as TipoProyecto;
  const estado = estadoEfectivo(caso, id);
  const guardado = estadoFase(caso, id);
  const aplicables = controlesAplicables(fase, tipo);
  const requeridos = aplicables.filter((c) => c.requerido !== false);
  const faltantes: Faltante[] = [];
  let completados = 0;

  for (const c of requeridos) {
    const porCampo = camposFaltantes(caso, c);
    const marcado = guardado.controles[c.id]?.ok === true;
    if (porCampo.length === 0 && marcado) {
      completados++;
      continue;
    }
    faltantes.push(...porCampo);
    if (!marcado) {
      faltantes.push({
        controlId: c.id,
        texto: c.texto,
        norma: c.norma,
        tipo: c.planilla ? 'planilla' : 'marca',
        planilla: c.planilla,
        motivo: c.planilla ? 'Planilla pendiente de emisión y firma' : 'Pendiente de verificación por el perito',
      });
    }
  }

  const prev = faseAnterior(id);
  const bloqueadaPor = estado === 'BLOQUEADA' && prev ? prev : undefined;
  return {
    fase,
    estado,
    aplicables,
    requeridos,
    completados,
    faltantes,
    puedeCompletar: estado !== 'BLOQUEADA' && estado !== 'COMPLETADA' && faltantes.length === 0,
    bloqueadaPor,
  };
}

export function porcentajeCumplimiento(caso: Partial<CasoCMS>): number {
  let total = 0;
  let ok = 0;
  for (const id of FASE_IDS) {
    const ev = evaluarFase(caso, id);
    total += ev.requeridos.length;
    ok += ev.estado === 'COMPLETADA' ? ev.requeridos.length : ev.completados;
  }
  return total === 0 ? 0 : Math.round((ok / total) * 100);
}

// ── Sellado criptográfico de fases ───────────────────────────────────────────

export function contenidoSelloFase(args: {
  casoId: string;
  fase: FaseIsoId;
  controles: Record<string, ControlMarcado>;
  completadaEn: string;
  completadaPor: string;
  hashAnterior: string;
}) {
  const controles: Record<string, { ok: boolean; por: string; ts: string }> = {};
  for (const k of Object.keys(args.controles)) {
    const c = args.controles[k];
    controles[k] = { ok: c.ok === true, por: c.por, ts: c.ts };
  }
  return {
    casoId: args.casoId,
    completadaEn: args.completadaEn,
    completadaPor: args.completadaPor,
    controles,
    fase: args.fase,
    hashAnterior: args.hashAnterior,
  };
}

export function hashAnteriorDe(caso: Partial<CasoCMS>, id: FaseIsoId): string | null {
  const prev = faseAnterior(id);
  if (!prev) return GENESIS_HASH;
  const p = caso.fasesIso?.[prev];
  return p?.estado === 'COMPLETADA' && p.hash ? p.hash : null;
}

export async function sellarFase(
  caso: CasoCMS,
  id: FaseIsoId,
  usuario: string,
  ahora: string = new Date().toISOString(),
): Promise<{ ok: true; estado: FaseIsoEstado } | { ok: false; faltantes: Faltante[]; motivo: string }> {
  const ev = evaluarFase(caso, id);
  if (!ev.puedeCompletar) {
    return {
      ok: false,
      faltantes: ev.faltantes,
      motivo: ev.estado === 'BLOQUEADA' ? `Fase bloqueada: complete primero ${ev.bloqueadaPor}` : 'Controles ISO pendientes',
    };
  }
  const hashAnterior = hashAnteriorDe(caso, id);
  if (!hashAnterior) return { ok: false, faltantes: [], motivo: 'Hash de la fase anterior ausente' };
  const actual = estadoFase(caso, id);
  const hash = await hashCanonical(
    contenidoSelloFase({ casoId: caso.id, fase: id, controles: actual.controles, completadaEn: ahora, completadaPor: usuario, hashAnterior }),
  );
  return {
    ok: true,
    estado: { ...actual, estado: 'COMPLETADA', completadaEn: ahora, completadaPor: usuario, hashAnterior, hash, sellada: false },
  };
}

// ── Migración desde el modelo de pasos legado (wp_step*, em_step*, hd_step*, img_paso_*) ──

/**
 * Pre-marca (origen «legado») los controles de las fases cuyos pasos legado estaban completados.
 * Nunca sella fases automáticamente: el perito debe revisar y cerrar cada fase en orden.
 */
export function migrarPasosLegado(caso: CasoCMS, ahora: string = new Date().toISOString()): CasoCMS {
  if (caso.fasesIso && Object.keys(caso.fasesIso).length > 0) return caso;
  const tipo = caso.tipoProyecto;
  const completado = (stepId: string) => caso.steps?.[stepId]?.estado === 'completado' || caso.completed_steps?.[stepId] === true;
  const fasesIso: CasoCMS['fasesIso'] = {};
  for (const fase of FASES_ISO) {
    const pasos = fase.pasosLegado[tipo] || [];
    if (pasos.length === 0 || !pasos.every(completado)) continue;
    const controles: Record<string, ControlMarcado> = {};
    for (const c of controlesAplicables(fase, tipo)) {
      controles[c.id] = { ok: true, ts: ahora, por: 'migracion-v3', origen: 'legado' };
    }
    fasesIso[fase.id] = { estado: 'EN_PROGRESO', controles, iniciadaEn: ahora };
  }
  return { ...caso, fasesIso };
}
