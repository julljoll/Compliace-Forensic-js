/**
 * SHA256.US — Cadena de auditoría inmutable (ISO/IEC 27001 A.8.15 · ISO 37301 §9).
 *
 * hashActual = SHA-256( canonical({ accion, casoId, detalle, hashAnterior, nivel, seq, ts, usuario }) )
 * El primer eslabón enlaza con GENESIS_HASH. El servidor PHP aplica la misma fórmula.
 */
import { GENESIS_HASH, hashCanonical } from './canonical';

export type NivelAuditoria = 'info' | 'warning' | 'error' | 'success';

export interface EntradaAuditoria {
  seq: number;
  casoId: string | null;
  usuario: string;
  accion: string;
  detalle: string;
  nivel: NivelAuditoria;
  ts: string;
  hashAnterior: string;
  hashActual: string;
  /** true cuando el servidor PHP ya registró y re-encadenó este evento. */
  sincronizado?: boolean;
}

export type NuevaEntrada = Pick<EntradaAuditoria, 'casoId' | 'usuario' | 'accion' | 'detalle' | 'nivel'>;

export function contenidoEslabon(e: Omit<EntradaAuditoria, 'hashActual' | 'sincronizado'>) {
  return {
    accion: e.accion,
    casoId: e.casoId,
    detalle: e.detalle,
    hashAnterior: e.hashAnterior,
    nivel: e.nivel,
    seq: e.seq,
    ts: e.ts,
    usuario: e.usuario,
  };
}

export async function crearEslabon(
  nueva: NuevaEntrada,
  previo: EntradaAuditoria | undefined,
  ts: string = new Date().toISOString(),
): Promise<EntradaAuditoria> {
  const base = {
    ...nueva,
    seq: previo ? previo.seq + 1 : 1,
    ts,
    hashAnterior: previo ? previo.hashActual : GENESIS_HASH,
  };
  return { ...base, hashActual: await hashCanonical(contenidoEslabon(base)) };
}

export interface ResultadoVerificacion {
  valida: boolean;
  total: number;
  rotoEn?: number;
  motivo?: string;
}

/** Verifica la cadena completa ordenada por `seq`. */
export async function verificarCadena(entradas: EntradaAuditoria[]): Promise<ResultadoVerificacion> {
  const orden = [...entradas].sort((a, b) => a.seq - b.seq);
  let previo = GENESIS_HASH;
  for (let i = 0; i < orden.length; i++) {
    const e = orden[i];
    if (e.seq !== i + 1) return { valida: false, total: orden.length, rotoEn: e.seq, motivo: 'Secuencia discontinua' };
    if (e.hashAnterior !== previo) return { valida: false, total: orden.length, rotoEn: e.seq, motivo: 'Enlace hashAnterior roto' };
    const esperado = await hashCanonical(contenidoEslabon(e));
    if (esperado !== e.hashActual) return { valida: false, total: orden.length, rotoEn: e.seq, motivo: 'Contenido alterado' };
    previo = e.hashActual;
  }
  return { valida: true, total: orden.length };
}
