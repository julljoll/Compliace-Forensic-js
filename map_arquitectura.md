# Mapa de Arquitectura — SHA256.US CMS de Cumplimiento Forense

## Descripción General

CMS de cumplimiento normativo para procesos de peritaje digital.  
El sistema permite gestionar casos, controlar el cumplimiento legal paso a paso, auditar cada acción con trazabilidad inmutable e imprimir las planillas oficiales requeridas en cada fase del proceso.

---

## Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN (PWA)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │Dashboard │  │  Casos   │  │Compliance│  │   Planillas      │  │
│  │   KPIs   │  │ CRUD +   │  │ Checklist│  │ (Acta, PRCC,     │  │
│  │          │  │ Detalle  │  │ Normativo│  │  Seguimiento)    │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │Auditoría │  │Normativas│  │  Correo  │  │   Manual Avilla  │  │
│  │Hash Chain│  │  Legales │  │ Forense  │  │   Referencia     │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│                    CAPA DE ESTADO (Zustand)                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │   cmsStore.ts  │  │  auditStore.ts │  │    authStore.ts    │  │
│  │  Casos, Tareas │  │  Log inmutable │  │  Autenticación +   │  │
│  │  Personal, etc │  │  + hash chain  │  │  Sesión PWA        │  │
│  └────────────────┘  └────────────────┘  └────────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│                    CAPA DE PERSISTENCIA                           │
│  ┌────────────────────────────┐  ┌─────────────────────────────┐ │
│  │       IndexedDB            │  │   Neon PostgreSQL (opcional)│ │
│  │  (almacenamiento durable   │  │   Sincronización en la nube │ │
│  │   local, offline-first)    │  │                             │ │
│  └────────────────────────────┘  └─────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│              CAPA DE CONOCIMIENTO (RAG)                           │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  RAG/ → 16 PDFs normativos + 9 YAMLs de arquitectura       ││
│  │  src/data/ → etapasForenses.ts + normativasEtapas.ts       ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

```
USUARIO → Login → Dashboard → Casos → Seguimiento Compliance
                                            ↓
                ┌───────────────────────────────────────────┐
                │  Paso 1: Identificación ← Imprimir Acta   │
                │  Paso 2: Preservación   ← Imprimir PRCC   │
                │  Paso 3: Adquisición    ← Imprimir Acta   │
                │  Paso 4: Cadena Cust.   ← Imprimir PRCC   │
                │  ...                                      │
                │  Paso 9: Cierre         ← Imprimir Inf.   │
                └───────────────────────────────────────────┘
                            ↓
                    AUDITORÍA INMUTABLE
                    (hash chain SHA-256)
                            ↓
                    REPORTE DE CIERRE
```

---

## Entidades del CMS

| Entidad | Almacenamiento | Descripción |
|---------|---------------|-------------|
| **CasoCMS** | IndexedDB + Neon | Caso con número, prioridad, estado, dispositivo |
| **Evidencia** | IndexedDB | Dispositivo con hash, sellado, cadena de custodia |
| **TareaForense** | IndexedDB | Actividad con fecha límite y normativas |
| **FaseForense** | IndexedDB | Etapa del proceso con checklist |
| **Normativa** | cmsStore (memoria) | Instrumento legal (9 precargados) |
| **AuditEntry** | IndexedDB (solo-append) | Log con hash chain SHA-256 |
| **Personal** | IndexedDB | Peritos, fiscales, compliance officers |

---

## Enrutamiento

```
/                          → DashboardPage
├── /casos                 → CasosPage
├── /casos/:id             → CasoDetailPage
├── /control/seguimiento-compliance → SeguimientoCompliancePage
├── /normativas            → NormativasPage
├── /auditoria             → AuditoriaPage
├── /tareas                → TareasPage
├── /personal              → PersonalPage
├── /correo-forense        → CorreoForensePage
├── /forense/manual-avilla → ManualAvillaPage
├── /forense/manual-serverless → ManualServerlessPage
└── /planillas/*           → Planillas imprimibles (Acta Obtención, Acta Entrevista, PRCC, Dictamen, Entrega)
```

---

## Seguridad y Trazabilidad

- **Auditoría con hash chain**: cada entrada contiene `hashActual` (SHA-256 del contenido + `hashAnterior`), formando una cadena inmutable verificable con `verifyChain()`
- **Modo de operación visible**: badge `PRODUCCIÓN` / `SIMULACIÓN` en el header
- **Contraseñas hasheadas**: SHA-256 mediante Web Crypto API
- **Hash verificable**: cuando no hay archivo real, se retorna error explícito con advertencia visual

---

## Diseño Visual

- Tema oscuro (`#0f1117` fondo, `#141721` sidebar)
- Tipografía: Segoe UI Variable / Inter
- Iconos: Lucide React
- Animaciones suaves (fade-in, 300ms)
- Modo impresión con estilos específicos para planillas legales

---

*Versión: 2.0.0 — CMS de Cumplimiento Forense*  
*Mayo 2026*
