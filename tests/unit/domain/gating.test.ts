import { describe, it, expect } from 'vitest';
import {
  FASES_ISO,
  evaluarFase,
  sellarFase,
  estadoEfectivo,
  faseActual,
  porcentajeCumplimiento,
  migrarPasosLegado,
} from '../../../src/lib/domain/gating';
import type { CasoCMS } from '../../../src/lib/domain/types';

const casoBase: CasoCMS = {
  id: 'caso-test-1',
  tipoProyecto: 'forense_whatsapp',
  numeroCaso: 'EXP-2026-TEST',
  titulo: 'Test Forense WhatsApp',
  descripcion: 'Caso de prueba para gating ISO',
  estado: 'iniciado',
  prioridad: 'alta',
  fechaCreacion: '2026-11-13T10:00:00.000Z',
  fechaUltimaActualizacion: '2026-11-13T10:00:00.000Z',
  peritoLider: 'Ing. Carlos Perito',
  solicitante_nombre: 'Dra. María Abogada',
  solicitante_cedula: 'V-15.678.901',
  normativasAplicadas: ['n1', 'n2', 'n3'],
  fasesCompletadas: 0,
  totalFases: 6,
  porcentajeCompletado: 0,
  totalEvidencias: 1,
  nivelCumplimientoGeneral: 'conforme',
  etiquetas: ['WhatsApp', 'Test'],
  notas: 'Caso de test',
};

describe('Motor de Gating ISO', () => {
  it('contiene exactamente las 6 fases reglamentarias (F0 a F5)', () => {
    expect(FASES_ISO.map((f) => f.id)).toEqual(['F0', 'F1', 'F2', 'F3', 'F4', 'F5']);
  });

  it('inicia F0 como DISPONIBLE y F1..F5 como BLOQUEADAS', () => {
    expect(estadoEfectivo(casoBase, 'F0')).toBe('DISPONIBLE');
    expect(estadoEfectivo(casoBase, 'F1')).toBe('BLOQUEADA');
    expect(faseActual(casoBase)).toBe('F0');
  });

  it('impide sellar F0 si faltan controles requeridos', async () => {
    const res = await sellarFase(casoBase, 'F0', 'perito@sha256.us');
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.faltantes.length).toBeGreaterThan(0);
      expect(res.motivo).toBe('Controles ISO pendientes');
    }
  });

  it('permite sellar F0 cuando se completan sus controles requeridos y genera hash encadenado al génesis', async () => {
    const casoF0Listo: CasoCMS = {
      ...casoBase,
      fasesIso: {
        F0: {
          estado: 'EN_PROGRESO',
          controles: {
            f0_expediente: { ok: true, ts: '2026-11-13T10:00:00.000Z', por: 'perito' },
            f0_consignante: { ok: true, ts: '2026-11-13T10:00:00.000Z', por: 'perito' },
            f0_perito: { ok: true, ts: '2026-11-13T10:00:00.000Z', por: 'perito' },
            f0_consentimiento: { ok: true, ts: '2026-11-13T10:00:00.000Z', por: 'perito' },
            f0_entrevista: { ok: true, ts: '2026-11-13T10:00:00.000Z', por: 'perito' },
            f0_alcance: { ok: true, ts: '2026-11-13T10:00:00.000Z', por: 'perito' },
          },
        },
      },
    };

    const ev = evaluarFase(casoF0Listo, 'F0');
    expect(ev.puedeCompletar).toBe(true);

    const res = await sellarFase(casoF0Listo, 'F0', 'perito@sha256.us', '2026-11-13T10:15:00.000Z');
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.estado.estado).toBe('COMPLETADA');
      expect(res.estado.hashAnterior).toBe('0'.repeat(64));
      expect(res.estado.hash).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it('desbloquea F1 únicamente tras completar F0', () => {
    const casoConF0Completada: CasoCMS = {
      ...casoBase,
      fasesIso: {
        F0: {
          estado: 'COMPLETADA',
          hash: 'a'.repeat(64),
          controles: {},
        },
      },
    };
    expect(estadoEfectivo(casoConF0Completada, 'F1')).toBe('DISPONIBLE');
    expect(estadoEfectivo(casoConF0Completada, 'F2')).toBe('BLOQUEADA');
    expect(faseActual(casoConF0Completada)).toBe('F1');
  });

  it('migra casos con pasos legados preservando trazabilidad sin cerrar fases a ciegas', () => {
    const casoLegado: CasoCMS = {
      ...casoBase,
      completed_steps: { wp_step1: true },
    };
    const migrado = migrarPasosLegado(casoLegado);
    expect(migrado.fasesIso?.F0?.estado).toBe('EN_PROGRESO');
    expect(migrado.fasesIso?.F0?.controles?.f0_consentimiento?.origen).toBe('legado');
    expect(migrado.fasesIso?.F0?.controles?.f0_consentimiento?.ok).toBe(true);
  });
});
