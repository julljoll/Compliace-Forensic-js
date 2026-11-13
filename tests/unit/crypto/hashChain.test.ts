import { describe, it, expect } from 'vitest';
import { crearEslabon, verificarCadena, type EntradaAuditoria } from '../../../src/lib/crypto/hashChain';
import { GENESIS_HASH } from '../../../src/lib/crypto/canonical';

describe('hashChain', () => {
  it('crea el primer eslabón enlazado al hash génesis', async () => {
    const e1 = await crearEslabon(
      { casoId: 'c1', usuario: 'perito@sha256.us', accion: 'APERTURA', detalle: 'Apertura de caso', nivel: 'info' },
      undefined,
      '2026-11-13T10:00:00.000Z'
    );
    expect(e1.seq).toBe(1);
    expect(e1.hashAnterior).toBe(GENESIS_HASH);
    expect(e1.hashActual).toMatch(/^[a-f0-9]{64}$/);

    const v1 = await verificarCadena([e1]);
    expect(v1.valida).toBe(true);
    expect(v1.total).toBe(1);
  });

  it('encadena múltiples eslabones en secuencia criptográfica', async () => {
    const e1 = await crearEslabon(
      { casoId: 'c1', usuario: 'perito@sha256.us', accion: 'APERTURA', detalle: 'Apertura', nivel: 'info' },
      undefined,
      '2026-11-13T10:00:00.000Z'
    );
    const e2 = await crearEslabon(
      { casoId: 'c1', usuario: 'perito@sha256.us', accion: 'RECEPCION', detalle: 'Recepción móvil', nivel: 'info' },
      e1,
      '2026-11-13T10:05:00.000Z'
    );
    const e3 = await crearEslabon(
      { casoId: 'c1', usuario: 'perito@sha256.us', accion: 'PRCC', detalle: 'Apertura PRCC', nivel: 'success' },
      e2,
      '2026-11-13T10:10:00.000Z'
    );

    expect(e2.hashAnterior).toBe(e1.hashActual);
    expect(e3.hashAnterior).toBe(e2.hashActual);

    const res = await verificarCadena([e1, e2, e3]);
    expect(res.valida).toBe(true);
    expect(res.total).toBe(3);
  });

  it('detecta alteración en el contenido de un eslabón intermedio', async () => {
    const e1 = await crearEslabon(
      { casoId: 'c1', usuario: 'perito@sha256.us', accion: 'A', detalle: 'det 1', nivel: 'info' },
      undefined,
      '2026-11-13T10:00:00.000Z'
    );
    const e2 = await crearEslabon(
      { casoId: 'c1', usuario: 'perito@sha256.us', accion: 'B', detalle: 'det 2', nivel: 'info' },
      e1,
      '2026-11-13T10:05:00.000Z'
    );

    const corrupto: EntradaAuditoria = { ...e1, detalle: 'detalle ADULTERADO' };
    const res = await verificarCadena([corrupto, e2]);
    expect(res.valida).toBe(false);
    expect(res.rotoEn).toBe(1);
    expect(res.motivo).toBe('Contenido alterado');
  });

  it('detecta ruptura del enlace hashAnterior', async () => {
    const e1 = await crearEslabon(
      { casoId: 'c1', usuario: 'perito@sha256.us', accion: 'A', detalle: 'det 1', nivel: 'info' },
      undefined,
      '2026-11-13T10:00:00.000Z'
    );
    const e2 = await crearEslabon(
      { casoId: 'c1', usuario: 'perito@sha256.us', accion: 'B', detalle: 'det 2', nivel: 'info' },
      e1,
      '2026-11-13T10:05:00.000Z'
    );

    const roto: EntradaAuditoria = { ...e2, hashAnterior: 'f'.repeat(64) };
    const res = await verificarCadena([e1, roto]);
    expect(res.valida).toBe(false);
    expect(res.rotoEn).toBe(2);
    expect(res.motivo).toBe('Enlace hashAnterior roto');
  });
});
