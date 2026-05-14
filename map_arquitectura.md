# 🗺️ Mapa de Arquitectura — SHA256.US CMS Compliance Officer

## Descripción General

Este documento mapea la arquitectura completa del **CMS de Compliance Forense SHA256.US**, un sistema de gestión de cumplimiento normativo para el proceso técnico-forense en dispositivos móviles Android.

El sistema opera en dos capas:
1. **CMS Compliance** (ruta `/`): Panel de mando para el Compliance Officer
2. **Módulos Forenses** (ruta `/forense`): Herramientas operativas del perito

---

## Estructura de Archivos

```
SHA256.US/
├── RAG/                               # Base de conocimiento (INTACTA)
│   ├── manual_unico_unificado.yaml    # YAML maestro + Fluent Design
│   ├── arquitectura_cadena_custodia.yaml
│   ├── proceso-desarrollo-forense.yaml
│   ├── manual-procedimiento.yaml
│   ├── arquitectura_sitio.yaml
│   ├── Formato_Planilla_PRCC.yaml
│   ├── Formato_acta_consignacion.yaml
│   ├── Skill_electron.yaml
│   ├── skill_claude.json
│   └── *.pdf                          # 16 documentos normativos fuente
│
├── componente/                         # Componentes YAML modulares (7)
│   ├── fase_inicial/
│   ├── fase_laboratorio/
│   ├── fase_disposicion_judicial/
│   ├── fase_disposicion_final/
│   ├── resguardo/
│   ├── herramientas/
│   └── traslado/
│
├── src/                                # Código React
│   ├── components/
│   │   ├── CMSLayout.tsx              # Layout CMS Compliance (principal)
│   │   ├── Layout.tsx                 # Layout Fluent (forense original)
│   │   ├── Laboratorio/
│   │   ├── MarcoLegal/
│   │   ├── Obtencion/
│   │   ├── Prcc/
│   │   ├── DisposicionJudicial/
│   │   └── DisposicionFinal/
│   │
│   ├── pages/                          # 14 páginas totales
│   │   ├── DashboardPage.tsx          # CMS: Panel de mando
│   │   ├── CasosPage.tsx             # CMS: Gestión de casos
│   │   ├── CompliancePage.tsx        # CMS: Control de cumplimiento
│   │   ├── NormativasPage.tsx        # CMS: Marco normativo
│   │   ├── AuditoriaPage.tsx         # CMS: Log de auditoría
│   │   ├── ManualAvillaPage.tsx      # CMS: Manual Avilla Forensics
│   │   ├── HomePage.tsx              # Forense: Dashboard original
│   │   ├── ConsignacionPage.tsx      # Forense: Registro evidencia
│   │   ├── PrccPage.tsx              # Forense: Cadena de custodia
│   │   ├── AdquisicionPage.tsx       # Forense: Extracción
│   │   ├── AnalisisPage.tsx          # Forense: Análisis ALEAPP
│   │   ├── InformePage.tsx           # Forense: Dictamen pericial
│   │   ├── DisposicionJudicialPage   # Forense: Fase judicial
│   │   └── DisposicionFinalPage      # Forense: Cierre
│   │
│   ├── store/
│   │   ├── cmsStore.ts               # Estado CMS (Zustand + persist)
│   │   └── forenseStore.ts           # Estado forense original
│   │
│   ├── index.css                      # Estilos (Fluent + CMS)
│   ├── App.tsx                        # Router dual
│   └── main.tsx                       # Entry point
│
├── electron/
│   ├── main.js                        # Proceso principal + IPC handlers
│   └── preload.js                     # Bridge seguro contextBridge
│
├── skill_avilla.md                    # Documentación Avilla Forensics
├── map_arquitectura.md                # Este archivo
├── tailwind.config.js                 # Tokens de diseño
└── package.json                       # Dependencias y scripts
```

---

## Arquitectura del Sistema

### Capas de la Aplicación

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │   CMS Compliance (/) │  │  Módulos Forenses (/forense) │ │
│  │   • Dashboard        │  │  • Consignación              │ │
│  │   • Gestión Casos    │  │  • PRCC                      │ │
│  │   • Compliance       │  │  • Adquisición               │ │
│  │   • Normativas       │  │  • Análisis                  │ │
│  │   • Auditoría        │  │  • Informe                   │ │
│  │   • Manual Avilla    │  │  • Disposición               │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE ESTADO                            │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │  cmsStore.ts         │  │  forenseStore.ts             │ │
│  │  (Zustand + persist) │  │  (Zustand)                   │ │
│  │  • Casos             │  │  • Caso actual               │ │
│  │  • Evidencias        │  │  • Dispositivo               │ │
│  │  • Tareas            │  │  • PRCC                      │ │
│  │  • Normativas        │  │  • Adquisición               │ │
│  │  • AuditLogs         │  │                              │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                CAPA DE SERVICIOS (Electron)                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  electron/main.js   (ipcMain handlers)                 │ │
│  │  • andriller:start  → child_process.spawn              │ │
│  │  • aleapp:start     → child_process.spawn              │ │
│  │  • hash:calculate   → crypto SHA-256                   │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                CAPA DE CONOCIMIENTO (RAG)                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  RAG/ → 16 PDFs + 9 YAMLs + skill_claude.json          │ │
│  │  componente/ → 7 módulos YAML por fase forense         │ │
│  │  skill_avilla.md → Referencia Avilla Forensics         │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Modelo de Datos del CMS (cmsStore.ts)

### Relaciones entre Entidades

```
CasoCMS (caso principal)
├── normativasAplicadas[] ──→ Normativa[]
├── pertiLider / fiscal ──→ Personal[]
│
├── Evidencia[] (por casoId)
│   ├── tipo, marca, modelo, IMEI
│   ├── hashSHA256, hashMD5
│   └── sellado, etiquetado, ubicación
│
├── TareaForense[] (por casoId)
│   ├── asignadoA, prioridad, estado
│   └── normativasRelacionadas[]
│
├── FaseForense[] (por casoId, ordenadas)
│   ├── responsable, normativasAplicadas[]
│   └── ChecklistItem[]
│       ├── normativaId → Normativa
│       ├── cumplimiento (conforme|parcial|no_conforme|no_aplica)
│       └── verificadoPor, fechaVerificacion
│
└── AuditLog[] (por casoId)
    ├── accion, detalle, timestamp
    └── nivel (info|warning|error|success)
```

### Estados del Caso

```
iniciado → en_proceso → analisis → informe → cerrado → archivado
```

### Prioridades

```
critica (🔴) > alta (🟠) > media (🟡) > baja (🟢)
```

---

## Flujo de Datos del Proceso Forense

### Ciclo de Vida de la Evidencia

```
[OBTENCIÓN] → [RESGUARDO] → [PERITACIÓN] → [JUDICIAL] → [DISPOSICIÓN FINAL]
     │               │              │             │              │
  fase_inicial   resguardo    fase_laboratorio  fase_judicial  fase_final
     │               │              │             │              │
  ConsignPage    PRCC Page     AnalisisPage   DispJudPage   DispFinalPage
```

### Ciclo de Compliance

```
CASO CREADO → NORMATIVAS ASIGNADAS → FASES DEFINIDAS → CHECKLIST → EVALUACIÓN
                                                           │
                                                    ┌──────┴──────┐
                                                    │  CONFORME   │
                                                    │  PARCIAL    │
                                                    │ NO CONFORME │
                                                    └─────────────┘
```

---

## Enrutamiento (App.tsx)

```
/                          → CMSLayout + DashboardPage
├── /casos                 → CasosPage
├── /compliance            → CompliancePage
├── /normativas            → NormativasPage
├── /auditoria             → AuditoriaPage
├── /manual-avilla         → ManualAvillaPage
├── /tareas                → (stub - en construcción)
└── /personal              → (stub - en construcción)

/forense                   → Layout (Fluent) + HomePage
├── /forense/consignacion  → ConsignacionPage
├── /forense/prcc          → PrccPage
├── /forense/adquisicion   → AdquisicionPage
├── /forense/analisis      → AnalisisPage
├── /forense/informe       → InformePage
├── /forense/disposicion-judicial → DisposicionJudicialPage
└── /forense/disposicion-final    → DisposicionFinalPage
```

---

## Sistemas de Diseño

### CMS Compliance (tokens `cms-*`)

| Token | Valor | Uso |
|-------|-------|-----|
| `cms-bg` | `#0f1117` | Fondo principal |
| `cms-sidebar` | `#141721` | Panel lateral |
| `cms-card` | `#1a1f2e` | Tarjetas |
| `cms-surface` | `#1e2436` | Superficies |
| `cms-border` | `rgba(255,255,255,0.07)` | Bordes |
| `cms-accent` | `#4f8ef7` | Acento primario |
| `cms-accent2` | `#7c4dff` | Acento secundario |
| `cms-textMuted` | `#5a6478` | Texto secundario |

### Fluent UI (tokens `fluent-*`)

| Token | Valor | Uso |
|-------|-------|-----|
| `fluent-bg` | `#202020` | Fondo Mica |
| `fluent-accent` | `#0078D4` | Azul Windows |
| `fluent-accent-light` | `#60CDFF` | Acento claro |
| Motion | `167ms` | Transiciones |

### Clases CSS Compartidas

| Clase | Sistema | Propósito |
|-------|---------|-----------|
| `.cms-card` | CMS | Tarjeta con borde y sombra |
| `.cms-btn` / `.cms-btn-primary` | CMS | Botones con estados |
| `.cms-input` | CMS | Campos de formulario |
| `.cms-label` | CMS | Etiquetas uppercase |
| `.forensic-card` | Fluent | Tarjeta forense |
| `.forensic-btn` | Fluent | Botón forense |
| `.forensic-input` | Fluent | Input forense |

---

## Marco Legal Aplicado

### Legislación Nacional (Venezuela)
- **Constitución Nacional (1999)**: Art. 2, 48, 49
- **COPP (2012)**: Art. 187-188, 202
- **Ley Delitos Informáticos (2001)**: Tipificación
- **Ley de Infogobierno (2013)**: Validez tecnológica
- **Ley de Mensajes de Datos (2001)**: Eficacia probatoria
- **CENIF (2012)**: Creación del centro forense

### Estándares Internacionales
- **ISO/IEC 27037:2012**: Identificación y preservación
- **ISO/IEC 27042:2015**: Análisis e interpretación
- **NIST SP 800-101 r1**: Forense móvil
- **ACPO v5**: Buenas prácticas evidencia digital

---

## Herramientas Forenses Integradas

| Herramienta | Función | Integración |
|-------------|---------|-------------|
| **Avilla Forensics** | APK Downgrade, WhatsApp Parser, Image Finder | Manual operativo en CMS |
| **Andriller** | Extracción lógica Android | IPC en electron/main.js |
| **ALEAPP** | Parseo de artefactos Android | IPC en electron/main.js |
| **IPED** | Análisis forense indexado | Referencia en skill_avilla.md |
| **scrcpy** | Espejo de dispositivo | Referencia |
| **libimobiledevice** | Extracción iOS | Referencia |

---

## Operarios / Roles del Sistema

| Rol | Responsabilidad en CMS |
|-----|----------------------|
| **Compliance Officer** | Supervisar cumplimiento, evaluar casos, auditar procesos |
| **Perito Líder** | Ejecutar fases forenses, registrar evidencias |
| **Perito Asistente** | Apoyo en adquisición y análisis |
| **Fiscal** | Ordenar experticia, supervisar cadena de custodia |
| **Coordinador** | Asignar recursos y prioridades |

---

## Glosario de Términos

| Término | Definición |
|---------|-----------|
| **CMS** | Content Management System — Sistema de gestión de contenido |
| **PRCC** | Planilla de Registro de Cadena de Custodia |
| **Compliance** | Cumplimiento de normativas y estándares |
| **Evidencia Digital** | Elemento informático susceptible de análisis forense |
| **Cadena de Custodia** | Garantía legal del manejo ininterrumpido de evidencias |
| **Hash** | Función criptográfica para verificar integridad |
| **APK Downgrade** | Técnica para acceder a datos de apps sin Root |
| **AuditLog** | Registro cronológico e inmutable de acciones del sistema |
| **Normativa** | Instrumento legal o estándar técnico de referencia |

---

*Última actualización: 14/May/2026 — Arquitectura CMS Compliance Officer + Manual Avilla Forensics*