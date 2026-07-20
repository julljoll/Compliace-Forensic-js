# SHA256.US — LAB FORENSE
## Mapa de Arquitectura del CMS de Cumplimiento Forense v3.0.0

```
┌──────────────────────────────────────────────────────────────────┐
│             SHA256.US — LAB FORENSE (v3.0.0)                     │
│              CAPA DE PRESENTACIÓN (Next.js 16 App Router)        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │Dashboard │  │  Casos   │  │Compliance│  │   Planillas     │  │
│  │   KPIs   │  │ CRUD +   │  │ Checklist│  │ (6 imprimibles: │  │
│  │          │  │ Detalle  │  │ Normativo│  │ Acta, PRCC, etc)│  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │Auditoría │  │Normativas│  │ Personal │  │ Manuales Forenses│  │
│  │Hash Chain│  │  Legales │  │  Peritos │  │ Tutoriales ISO  │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│                    CAPA DE ESTADO (Zustand)                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │   cmsStore.ts  │  │  auditStore.ts │  │    authStore.ts    │  │
│  │  Casos, Tareas │  │  Log inmutable │  │  Autenticación +   │  │
│  │  Personal, etc │  │  + hash chain  │  │  Sesión PWA        │  │
│  └────────────────┘  └────────────────┘  └────────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│           CAPA HÍBRIDA DE PERSISTENCIA (Modo Dual)               │
│  ┌─────────────────────────────┐  ┌────────────────────────────┐ │
│  │   Entorno Local (Node.js)   │  │   Despliegue Portfolio     │ │
│  │  • Auto-init SQLite DB      │  │   (Vercel Cloud Serverless)│ │
│  │    (sha256_forense.sqlite)  │  │  • IndexedDB Browser PWA   │ │
│  │  • IndexedDB Browser PWA    │  │  • Neon PostgreSQL API     │ │
│  └─────────────────────────────┘  └────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│              CAPA DE CONOCIMIENTO (RAG Normativo)                │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  normativas_rag/ → 77 documentos normativos Markdown         ││
│  │  src/data/       → etapasForenses.ts + normativasEtapas.ts   ││
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

- Tema oscuro (`#000000` fondo, `rgba(28,28,30,0.82)` sidebar vibrancy)
- Tipografía: Ubuntu (Google Fonts, pesos 300/400/500/700)
- Iconos: Google Material Design Icons (Outlined)
- Animaciones suaves (fade-in, 300ms con Apple spring timing)
- Modo impresión con estilos específicos para planillas legales

---

*Versión: 2.0.0 — CMS de Cumplimiento Forense*  
*Mayo 2026*
