import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuditStore } from '@/store/auditStore'

// Mock de indexedDBStorage para pruebas en memoria
vi.mock('@/db/indexedDB', () => {
  const memoryDB = new Map<string, any[]>()
  return {
    indexedDBStorage: {
      setItem: vi.fn(async (storeName: string, item: any) => {
        const list = memoryDB.get(storeName) || []
        list.push(item)
        memoryDB.set(storeName, list)
      }),
      getAll: vi.fn(async (storeName: string) => {
        return memoryDB.get(storeName) || []
      }),
      clear: vi.fn(async (storeName: string) => {
        memoryDB.set(storeName, [])
      }),
      exportToJSON: vi.fn(async (storeName: string) => {
        return JSON.stringify(memoryDB.get(storeName) || [])
      }),
    },
  }
})

describe('useAuditStore - Cadena Criptográfica Inmutable SHA-256', () => {
  beforeEach(async () => {
    await useAuditStore.getState().clearLogs()
  })

  it('debe registrar entradas de auditoría con hashes SHA-256 encadenados', async () => {
    const store = useAuditStore.getState()

    await store.addEntry({
      usuario: 'Perito Forense 01',
      accion: 'RECEPCION_EVIDENCIA',
      detalle: 'Recepción de dispositivo HDD 1TB',
      nivel: 'info',
      casoId: 'CASO-2026-001',
    })

    const updatedLogs = useAuditStore.getState().logs
    expect(updatedLogs.length).toBe(1)
    
    const entry1 = updatedLogs[0]
    expect(entry1.hashAnterior).toBe('')
    expect(entry1.hashActual).toHaveLength(64) // Longitud de hash SHA-256 hex
    expect(entry1.usuario).toBe('Perito Forense 01')

    await useAuditStore.getState().addEntry({
      usuario: 'Fiscal 02',
      accion: 'DESPRECINTADO',
      detalle: 'Apertura de bolsa de evidencia N° 4421',
      nivel: 'warning',
      casoId: 'CASO-2026-001',
    })

    const logs2 = useAuditStore.getState().logs
    expect(logs2.length).toBe(2)
    const entry2 = logs2[0] // Orden descendente en store
    expect(entry2.hashAnterior).toBe(entry1.hashActual)
    expect(entry2.hashActual).not.toBe(entry1.hashActual)
  })

  it('debe verificar exitosamente una cadena de auditoría válida e inalterada', async () => {
    await useAuditStore.getState().addEntry({
      usuario: 'Sistema',
      accion: 'INICIO_PERITAJE',
      detalle: 'Inicialización de cadena de custodia',
      nivel: 'info',
    })

    await useAuditStore.getState().addEntry({
      usuario: 'Perito 01',
      accion: 'EXTRACCION_IMAGEN',
      detalle: 'Adquisición bit-a-bit FTK Imager',
      nivel: 'success',
    })

    const result = await useAuditStore.getState().verifyChain()
    expect(result.valid).toBe(true)
    expect(result.brokenAt).toBeUndefined()
  })

  it('debe detectar alteración (tampering) en los datos de la cadena de auditoría', async () => {
    await useAuditStore.getState().addEntry({
      usuario: 'Sistema',
      accion: 'INICIO_PERITAJE',
      detalle: 'Registro inicial',
      nivel: 'info',
    })

    await useAuditStore.getState().addEntry({
      usuario: 'Perito 01',
      accion: 'COPIA_FORENSE',
      detalle: 'Copia forense generada',
      nivel: 'info',
    })

    // Alterar maliciosamente la entrada en el estado para simular manipulación
    const logs = [...useAuditStore.getState().logs]
    logs[1] = {
      ...logs[1],
      detalle: 'Registro alterado de forma no autorizada',
    }

    useAuditStore.setState({ logs })

    const result = await useAuditStore.getState().verifyChain()
    expect(result.valid).toBe(false)
    expect(result.brokenAt).toBe(logs[1].id)
  })

  it('debe filtrar registros por caso correctamente', async () => {
    await useAuditStore.getState().addEntry({
      usuario: 'Perito A',
      accion: 'VERIFICACION',
      detalle: 'Caso 1',
      nivel: 'info',
      casoId: 'CASO-100',
    })

    await useAuditStore.getState().addEntry({
      usuario: 'Perito B',
      accion: 'VERIFICACION',
      detalle: 'Caso 2',
      nivel: 'info',
      casoId: 'CASO-200',
    })

    const logsCaso100 = useAuditStore.getState().getLogsByCaso('CASO-100')
    expect(logsCaso100.length).toBe(1)
    expect(logsCaso100[0].casoId).toBe('CASO-100')
  })
})
