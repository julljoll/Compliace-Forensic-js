import { describe, it, expect } from 'vitest'
import { PLANILLAS_REGISTRY, getPlanillaRegistry } from '@/data/planillasRegistry'

describe('planillasRegistry — Registro Unificado de Planillas Forenses', () => {
  it('debe contener todas las planillas oficiales requeridas', () => {
    const keys = Object.keys(PLANILLAS_REGISTRY)
    expect(keys).toContain('acta-obtencion')
    expect(keys).toContain('acta-consentimiento')
    expect(keys).toContain('prcc')
    expect(keys).toContain('acta-desprecintado')
    expect(keys).toContain('acta-entrevista')
    expect(keys).toContain('dictamen-imagenes')
    expect(keys).toContain('dictamen-audios')
    expect(keys).toContain('acta-sanitizacion')
    expect(keys).toContain('entrega-resultados')
    expect(keys).toContain('acta-auditoria-timeline')
    expect(keys).toContain('planilla-evaluacion-ux')
  })

  it('debe mapear correctamente la busqueda con getPlanillaRegistry', () => {
    const actaObtencion = getPlanillaRegistry('acta-obtencion')
    expect(actaObtencion.codigo).toBe('FO-SHA256-ACT-001')
    expect(actaObtencion.normativas).toContain('MUCC-2017 Fase 1')

    const dictamenAudios = getPlanillaRegistry('dictamen-audios')
    expect(dictamenAudios.codigo).toBe('FO-SHA256-DIC-002')

    // Búsqueda aproximada para dictamen audio/imagen
    const audioApprox = getPlanillaRegistry('dictamen-audio-test')
    expect(audioApprox.id).toBe('dictamen-audios')

    const imgApprox = getPlanillaRegistry('dictamen-test')
    expect(imgApprox.id).toBe('dictamen-imagenes')
  })

  it('cada planilla debe tener secciones numeradas y normativas definidas', () => {
    Object.values(PLANILLAS_REGISTRY).forEach((planilla) => {
      expect(planilla.codigo).toMatch(/^FO-SHA256-/)
      expect(planilla.normativas.length).toBeGreaterThan(0)
      expect(planilla.sections.length).toBeGreaterThan(0)

      planilla.sections.forEach((sec) => {
        expect(sec.numero).toMatch(/^\d+\.\d+$/)
        expect(sec.titulo).toBeTruthy()
      })
    })
  })
})
