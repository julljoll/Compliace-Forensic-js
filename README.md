# SHA256.US — CMS de Cumplimiento Forense

**Sistema de gestión de cumplimiento normativo para procesos de peritaje digital.**  
Diseñado para que el **Compliance Officer** lleve el seguimiento comprobable de cada caso, genere los reportes exigidos por la ley e imprima las planillas oficiales en cada etapa del proceso.

> Basado en: Manual Único de Cadena de Custodia (Venezuela, 2017), ISO/IEC 27037, NIST SP 800-101, COPP, Ley de Mensajes de Datos y Firmas Electrónicas, y normativas SUSCERTE.

---

## Propósito

Esta app **no realiza análisis forense**. Es un **gestor de contenido (CMS)** que ayuda al perito auditor a:

- **Crear y gestionar casos** con toda la metadata del dispositivo y las partes involucradas.
- **Controlar el cumplimiento normativo** paso a paso según los instrumentos legales precargados.
- **Imprimir planillas oficiales** en tamaño Carta con proporciones de papel sellado.
- **Exportar en ZIP** formatos editables HTML y Microsoft Word (.doc) con estilos inlined.
- **Auditar cada acción** con trazabilidad inmutable mediante encadenamiento de hashes SHA-256 (hash chain).
- **Generar reportes de auditoría** con línea de tiempo imprimible para presentar en tribunales.

---

## Stack Tecnológico

| Capa | Tecnología | Versión | Detalles |
|------|-----------|---------|----------|
| **Framework** | Next.js (App Router) | ^16.2.10 | Server-side rendering, generación estática y routing por archivos en `src/app/`. |
| **Frontend** | React | ^19.2.7 | Arquitectura tipada modular con hooks. |
| **Lenguaje** | TypeScript | ^6.0.3 | Tipado estricto en todo el proyecto. |
| **Estilos** | Tailwind CSS | ^3.4.17 | Modo Oscuro Permanente (selector de modo claro removido). |
| **Tipografía** | Ubuntu (Google Fonts) | — | Pesos 300, 400, 500, 700 — tipografía global del sistema. |
| **Iconografía** | Google Material Design Icons (Outlined) | — | Integrado vía `AppleIcon.tsx`. |
| **Estado** | Zustand | ^5.0.12 | Gestión reactiva de datos con persistencia. |
| **Persistencia** | IndexedDB + Neon PostgreSQL | — | Offline-first con sincronización en la nube. |
| **HTTP Client** | Axios | ^1.15.2 | Comunicación con APIs externas. |
| **Fechas** | date-fns | ^4.1.0 | Utilidades de manipulación de fechas. |
| **ZIP** | jszip | ^3.10.1 | Generación de archivos ZIP para planillas. |
| **Deploy** | Vercel | — | Despliegue perimetral global con output `standalone`. |

---

## Instalación y Uso

### Requisitos previos

- Node.js 18+
- npm, yarn o pnpm

### Comandos disponibles

```bash
# Instalar dependencias
npm install

# Desarrollo local (http://localhost:3000)
npm run dev

# Build de producción (Turbopack)
npm run build

# Servidor de producción
npm run start

# Linting con ESLint
npm run lint

# Actualizar metadatos de agentes
npm run update-agent
```

### Variables de entorno

Copiar `.env.example` a `.env` y configurar:

```env
# Neon PostgreSQL (opcional — funciona offline con IndexedDB)
NEON_DATABASE_URL=postgresql://usuario:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

> **Nota:** El sistema funciona completamente sin conexión. IndexedDB almacena todos los datos localmente. Neon PostgreSQL es opcional para sincronización en la nube.

### Autenticación

El sistema utiliza autenticación por correo electrónico. Los usuarios autorizados se almacenan en la tabla `authorized_users` de Neon PostgreSQL. Credenciales por defecto: `admin` / `admin`.

---

## Estructura del Proyecto

```
SHA256.US/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (Ubuntu, Material Icons, dark mode)
│   │   ├── page.tsx                # Redirect a /dashboard o /login
│   │   ├── loading.tsx             # Loading state global
│   │   ├── not-found.tsx           # 404 page
│   │   ├── (auth)/
│   │   │   └── login/page.tsx      # Login page
│   │   └── (dashboard)/            # Rutas protegidas con CMSLayout
│   │       ├── layout.tsx          # Auth guard + CMSLayout wrapper
│   │       ├── dashboard/page.tsx  # /dashboard — KPIs y resumen
│   │       ├── casos/
│   │       │   ├── page.tsx        # /casos — Directorio de casos
│   │       │   └── [id]/page.tsx   # /casos/[id] — Detalle del caso
│   │       ├── control/
│   │       │   └── seguimiento-compliance/page.tsx  # /control/seguimiento-compliance
│   │       ├── normativas/page.tsx # /normativas — Marco normativo
│   │       ├── auditoria/page.tsx  # /auditoria — Logs inmutables
│   │       ├── personal/page.tsx   # /personal — Gestión de peritos
│   │       ├── forense/
│   │       │   └── tutoriales/page.tsx  # /forense/tutoriales
│   │       └── planillas/          # 6 planillas imprimibles
│   │           ├── acta-obtencion/
│   │           ├── acta-entrevista/
│   │           ├── dictamen/
│   │           ├── entrega-resultados/
│   │           ├── prcc/
│   │           └── timeline-compliance/
│   ├── components/                 # Atomic Design
│   │   ├── atoms/                  # 12 componentes base
│   │   │   ├── AppleIcon.tsx       # Mapeo centralizado de iconos
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── HashDisplay.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── StatusDot.tsx
│   │   │   └── Toast.tsx
│   │   ├── molecules/              # 3 componentes compuestos
│   │   │   ├── KpiCard.tsx
│   │   │   ├── NormativaAccordion.tsx
│   │   │   └── PlanillaToolbar.tsx
│   │   ├── organisms/              # 5 secciones complejas
│   │   │   ├── Casos/
│   │   │   │   ├── CasoCard.tsx
│   │   │   │   └── CasosFilters.tsx
│   │   │   ├── CommandPalette.tsx
│   │   │   ├── Compliance/
│   │   │   │   └── ComplianceKPIs.tsx
│   │   │   ├── MarcoLegal/
│   │   │   │   ├── marco_legal.yaml
│   │   │   │   └── ReferenciaLegal.tsx
│   │   │   └── Planillas/
│   │   │       ├── ActaDictamen.tsx
│   │   │       ├── ActaEntregaResultados.tsx
│   │   │       ├── ActaEntrevista.tsx
│   │   │       ├── ActaObtencion.tsx
│   │   │       └── PlanillaPRCC.tsx
│   │   └── templates/
│   │       └── CMSLayout.tsx       # Layout principal con sidebar
│   ├── page-components/            # Componentes de página (legacy, en migración)
│   │   ├── DashboardPage.tsx
│   │   ├── CasosPage.tsx           # CRUD completo (1069 líneas)
│   │   ├── CasoDetailPage.tsx      # Detalle con 6 tabs
│   │   ├── Control/
│   │   │   └── SeguimientoCompliancePage.tsx
│   │   ├── NormativasPage.tsx
│   │   ├── AuditoriaPage.tsx       # Hash chain SHA-256
│   │   ├── PersonalPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── Forense/
│   │   │   ├── TutorialesForensesPage.tsx
│   │   │   ├── ManualAvillaPage.tsx
│   │   │   └── ManualServerlessPage.tsx
│   │   └── Planillas/             # 9 archivos de planillas
│   │       ├── ActaObtencionPage.tsx
│   │       ├── ActaEntrevistaPage.tsx
│   │       ├── PlanillaPRCCPage.tsx
│   │       ├── ActaDictamenPage.tsx
│   │       ├── ActaEntregaResultadosPage.tsx
│   │       ├── ActaAuditoriaTimelinePage.tsx
│   │       ├── TimelineCompliancePage.tsx
│   │       ├── downloadPlanillaZip.ts
│   │       └── Planillas.css
│   ├── store/                      # Zustand stores
│   │   ├── cmsStore.ts             # Estado principal (1200+ líneas)
│   │   ├── auditStore.ts           # Auditoría con hash chain SHA-256
│   │   └── authStore.ts            # Autenticación por email
│   ├── data/                       # Datos estáticos
│   │   ├── normativasEtapas.ts     # 9 normativas pre-cargadas
│   │   ├── tiposProyecto.ts        # 3 tipos de proyectos forenses
│   │   ├── compliance/             # Subdirectorios por fase
│   │   └── manuales-sistemas/      # Manuales de referencia
│   ├── db/                         # Capa de persistencia
│   │   ├── indexedDB.ts            # Almacenamiento offline (6 stores)
│   │   ├── neonClient.ts           # Neon PostgreSQL (SQL directo)
│   │   ├── neonRestClient.ts       # Neon REST API client
│   │   └── platformAPI.ts          # Abstracción browser/Electron
│   ├── hooks/                      # Custom hooks
│   │   ├── useInstallPrompt.ts     # PWA install prompt
│   │   └── usePWA.ts              # PWA lifecycle hook
│   └── index.css                   # Estilos globales (968 líneas)
├── normativas_rag/                 # 77 documentos normativos (Markdown)
├── .opencode/                      # Configuración de agentes OpenCode
│   ├── agents/                     # 3 subagentes definidos
│   └── skills/                     # 8 skills especializados
├── docs/
│   ├── design_tokens.md            # Tokens de diseño del sistema
│   └── map_arquitectura.md         # Mapa de arquitectura
├── scripts/
│   └── update-agent-instructions.js
├── public/                         # Assets estáticos (favicon, PWA icons)
├── next.config.ts                  # Configuración Next.js
├── tailwind.config.js              # Configuración Tailwind
├── tsconfig.json                   # Configuración TypeScript
├── package.json
└── AGENTS.md                       # Instrucciones principales del agente
```

---

## Rutas Activas (17)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Root | Redirect a `/dashboard` o `/login` según autenticación |
| `/login` | LoginPage | Autenticación por correo electrónico |
| `/dashboard` | DashboardPage | KPIs, casos recientes, resumen normativo |
| `/casos` | CasosPage | Directorio de casos con CRUD completo |
| `/casos/[id]` | CasoDetailPage | Detalle del caso con 6 tabs |
| `/control/seguimiento-compliance` | SeguimientoCompliancePage | Seguimiento forense paso a paso |
| `/normativas` | NormativasPage | Visor de 9 instrumentos normativos |
| `/auditoria` | AuditoriaPage | Logs inmutables con hash chain SHA-256 |
| `/personal` | PersonalPage | Gestión de peritos, fiscales y compliance officers |
| `/forense/tutoriales` | TutorialesForensesPage | Manuales y tutoriales forenses |
| `/planillas/acta-obtencion` | ActaObtencionPage | Planilla de obtención de evidencia |
| `/planillas/acta-entrevista` | ActaEntrevistaPage | Planilla de entrevista |
| `/planillas/prcc` | PlanillaPRCCPage | Planilla de Cadena de Custodia |
| `/planillas/dictamen` | ActaDictamenPage | Planilla de dictamen pericial |
| `/planillas/entrega-resultados` | ActaEntregaResultadosPage | Planilla de entrega de resultados |
| `/planillas/timeline-compliance` | TimelineCompliancePage | Línea de tiempo de cumplimiento |

---

## Módulos Funcionales

### 1. Dashboard

Panel principal con KPIs en tiempo real:
- Total de casos activos
- Casos por estado (Pendiente, En Progreso, Completado)
- Porcentaje de cumplimiento normativo
- Últimos casos registrados
- Resumen de normativas aplicables

### 2. Gestión de Casos (CRUD Completo)

Sistema completo de administración de casos forenses:
- **Crear** nuevos casos con metadata completa (número de caso, prioridad, dispositivo, partes involucradas)
- **Leer** directorio de casos con filtros y búsqueda
- **Actualizar** estado, prioridad y información del caso
- **Eliminar** casos con confirmación
- **Detalle** del caso con 6 tabs: Información General, Evidencia, Tareas, Fases, Auditoría, Documentos

### 3. Tipos de Proyectos Forenses

El sistema soporta 3 tipos de proyectos con flujos predefinidos:

#### Forense WhatsApp (9 pasos, 4 fases)
1. **Fase Obtención:** Recepción → Cadena de Custodia → Extracción Forense (Avilla/Andriller) → Preservación de Evidencia
2. **Fase Laboratorio:** Procesamiento ALEAPP/IPED → Análisis WhatsApp (msgstore.db) → Informe Pericial
3. **Fase Disposición Judicial:** Presentación ante tribunales
4. **Fase Disposición Final:** Cierre del caso

#### Forense Email (7 pasos, 4 fases)
1. **Fase Identificación:** Identificación de fuente → Extracción de buzón PST/OST
2. **Fase Análisis Técnico:** Análisis de cabeceras → Extracción de adjuntos → Metadatos y línea de tiempo
3. **Fase Documentación:** Informe pericial
4. **Fase Disposición Final:** Cierre

#### Forense Disco Duro (8 pasos, 4 fases)
1. **Fase Recepción:** Recepción del dispositivo → Cadena de Custodia
2. **Fase Adquisición Forense:** Conexión con write-blocker → Imagen bit a bit (DD/E01)
3. **Fase Análisis:** Análisis de particiones → Recuperación de archivos eliminados
4. **Fase Documentación:** Informe pericial → Cierre

### 4. Seguimiento de Cumplimiento (Compliance)

Sistema de pasos secuenciales con gating:
- **Flujo:** initSteps → startStep → verifyStepCompletion → completeStep → unlockNextStep
- **Checklist normativo** por cada paso (verificación de requisitos legales)
- **Bloqueo secuencial** — no se puede saltar ningún paso
- **Validación** de cumplimiento antes de avanzar

### 5. Planillas Oficiales (6 planillas imprimibles)

Todas las planillas se imprimen en formato **Carta (Letter)** con márgenes de papel sellado:

| Planilla | Descripción |
|----------|-------------|
| **Acta de Obtención** | Documento de obtención de evidencia digital |
| **Acta de Entrevista** | Registro de entrevista a testigos/peritos |
| **PRCC** | Planilla de Registro de Cadena de Custodia |
| **Dictamen Pericial** | Informe técnico pericial |
| **Entrega de Resultados** | Acta de entrega de hallazgos |
| **Timeline de Cumplimiento** | Línea de tiempo del proceso forense |

**Características:**
- Botones de **Imprimir** y **Descargar ZIP** (HTML + Word)
- Estilo de impresión con fondo blanco y texto negro (aislado del dark mode)
- Tipografía Ubuntu globalmente (sin Courier New)
- Contenido editable antes de imprimir/exportar

### 6. Auditoría Inmutable (Hash Chain SHA-256)

Sistema de trazabilidad basado en encadenamiento de hashes:
- Cada acción genera un registro de auditoría con:
  - `hashActual`: SHA-256 del contenido + `hashAnterior`
  - `hashAnterior`: Hash del registro previo
  - `timestamp`: Marca de tiempo
  - `accion`: Tipo de acción realizada
  - `detalles`: Descripción de la acción
- **Append-only** — los logs nunca se eliminan ni modifican
- `verifyChain()` — función para validar la integridad de toda la cadena
- `exportToJSON()` — exportación de respaldo

### 7. Normativas Pre-cargadas (9 instrumentos)

| Normativa | Descripción |
|-----------|-------------|
| ISO/IEC 27037:2012 | Identificación, recolección, adquisición y preservación de evidencia digital |
| ISO/IEC 27042:2015 | Análisis e interpretación de evidencia digital |
| NIST SP 800-101 | Guide to Mobile Device Forensics |
| NIST SP 800-86 | Guide to Integrating Forensic Techniques into Incident Response |
| MUCC-2017 | Manual Único de Cadena de Custodia (Venezuela) |
| ACPO Good Practice Guide | Good Practice Guide for Digital Evidence v5 |
| LEDI | Ley Especial de Delitos Informáticos (Venezuela, 2001) |
| LMDFE | Ley de Mensajes de Datos y Firmas Electrónicas (Venezuela, 1999) |
| COPP | Código Orgánico Procesal Penal (Venezuela) |

### 8. Base Documental RAG (77 documentos)

El directorio `normativas_rag/` contiene **77 documentos normativos** en formato Markdown:

- **Constitución Nacional** de Venezuela (2019)
- **Códigos:** Penal, Civil, COPP, Comercio, Orgánico Tributario
- **Leyes Orgánicas:** 30+ leyes orgánicas (Poder Judicial, Ministerio Público, Seguridad Ciudadana, Telecomunicaciones, etc.)
- **Estándares ISO:** 27001:2022, 27002:2022, 27037:2012, 27042:2015
- **Estándares NIST:** SP 800-86, SP 800-101
- **Otros:** RFC 3227, ACPO Good Practice Guide v5, MUCC-2017
- **Leyes Especiales:** Ley de Delitos Informáticos, Ley de Mensajes de Datos y Firmas Electrónicas
- **Decreto CENIF (2012):** Creación del Centro Nacional de Informática Forense

### 9. Gestión de Personal

Administración de peritos, fiscales y compliance officers:
- Registro con datos personales y profesionales
- Asignación de roles y permisos
- Historial de participación en casos

### 10. Tutoriales Forenses

Manuales de referencia para herramientas forenses:
- **Manual Avilla Forensics:** Guía de uso de la herramienta de extracción
- **Manual Serverless:** Configuración y uso en entorno serverless
- **Tutoriales generales:** Procedimientos estándar de forensía digital

---

## Sistema de Diseño

### Modo Oscuro Permanente

El proyecto está configurado exclusivamente para funcionar en **Modo Oscuro**. La clase `dark` siempre está presente en el elemento `<html>`. No existe toggle de tema.

### Paleta de Colores

| Variable CSS | Valor | Uso |
|-------------|-------|-----|
| `--co-bg` | `#000000` | Fondo general |
| `--co-surface-1` | `#1C1C1E` | Tarjetas primarias, paneles |
| `--co-surface-2` | `#2C2C2E` | Controles secundarios, inputs |
| `--co-surface-3` | `#3A3A3C` | Hover de listas |
| `--co-separator` | `rgba(255,255,255,0.1)` | Bordes y separadores |
| `--co-accent` | `#0A84FF` | Estado activo, enlaces, botones primarios |
| `--co-red` | `#FF453A` | Alertas críticas |
| `--co-orange` | `#FF9F0A` | Advertencias de compliance |
| `--co-green` | `#30D158` | Cumplimiento conforme |
| `--co-blue` | `#0A84FF` | Información general |
| `--co-indigo` | `#5E5CE6` | Estados de auditoría |

### Jerarquía de Encabezados (Obligatoria)

| Nivel | Color | Hex | Peso |
|-------|-------|-----|------|
| `h1` | Verde Matriz | `#00FF41` | 700 (Bold) |
| `h2` | Amarillo Oro | `#FECF06` | 700 (Bold) |
| `h3`, `h4` | Dorado Oscuro | `#524000` | 600 (SemiBold) |
| `h5`, `h6` | Blanco | `#FFFFFF` | 500 (Medium) |

> Los `h3` y `h4` incluyen fondo translúcido (`rgba(254,207,6,0.18)`) y filete lateral izquierdo de 3px sólido `#FECF06`.

### Sombras (Apple Elevation System)

| Token | Valor |
|-------|-------|
| `--co-shadow-1` | `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.18)` |
| `--co-shadow-2` | `0 4px 16px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12)` |
| `--co-shadow-3` | `0 8px 32px rgba(0,0,0,0.24), 0 2px 8px rgba(0,0,0,0.12)` |
| `--co-shadow-modal` | `0 20px 60px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.24)` |

### Bordes y Radios

| Elemento | Radio |
|----------|-------|
| Botón (`--apple-btn`) | 8px |
| Tarjeta (`--apple-card`) | 16px |
| Panel (`--apple-panel`) | 20px |
| Input | 8px |

### Animaciones

- `apple-fadeUp` — Entrada desde abajo con opacity
- `apple-fadeIn` — Entrada con opacity
- `apple-scaleIn` — Entrada con escala
- `apple-slideUp` — Deslizamiento hacia arriba
- Timing: Apple spring timing (suave y natural)

---

## Arquitectura de Datos

### Zustand Stores

#### cmsStore.ts (Estado Principal — 1200+ líneas)

Entidades gestionadas:
- `casos: CasoCMS[]` — Casos forenses con metadata completa
- `evidencias: Evidencia[]` — Elementos de evidencia con hash SHA-256
- `tareas: TareaForense[]` — Actividades forenses con fecha límite
- `fases: FaseForense[]` — Etapas del proceso forense
- `personal: Personal[]` — Peritos, fiscales, compliance officers
- `normativas: Normativa[]` — 9 instrumentos normativos pre-cargados
- `auditLogs: AuditLog[]` — Registro de auditoría
- `complianceChecklist: ComplianceCheckItem[]` — Checklist por normativa

Funcionalidades:
- CRUD completo para todas las entidades
- Gestión de pasos secuenciales con gating
- Migración de `completed_steps`/`step_metadata` al nuevo sistema `steps`
- Sincronización con Neon PostgreSQL con fallback offline
- Persistencia via Zustand persist middleware

#### auditStore.ts (Auditoría Inmutable — 135 líneas)

- Cadena de hashes SHA-256 encadenados
- Cada entrada contiene: `hashActual`, `hashAnterior`, `timestamp`, `accion`, `detalles`
- `verifyChain()` — Validación de integridad de la cadena
- `exportToJSON()` — Exportación de respaldo
- Persistencia en IndexedDB (solo-append)

#### authStore.ts (Autenticación — 89 líneas)

- Autenticación por correo electrónico contra Neon PostgreSQL
- Tabla `authorized_users` con lista de usuarios habilitados
- Sin contraseñas — validación por email autorizado únicamente
- Soporte para imagen de perfil
- Persistencia via Zustand persist middleware

### Capa de Persistencia

#### IndexedDB (`indexedDB.ts`)

- **Base de datos:** `sha256_forense` (versión 2)
- **6 object stores:** `casos`, `audit_logs`, `tareas`, `evidencias`, `personal`, `correos_forenses`
- CRUD completo + export/import JSON

#### Neon PostgreSQL (`neonClient.ts`)

- Cliente SQL directo usando `@neondatabase/serverless`
- Auto-creación de tablas: `casos`, `authorized_users`, `audit_logs`
- Auto-migración de esquema con `ALTER TABLE ADD COLUMN IF NOT EXISTS`
- Usuario autorizado por defecto: `julljoll@gmail.com`
- Fallback a localStorage cuando Neon no está disponible

#### Platform API (`platformAPI.ts`)

- Capa de abstracción para browser y Electron
- Wraps `window.electronAPI` para funcionalidades de escritorio

---

## Agentes OpenCode

### 3 Subagentes

| Agente | Especialización |
|--------|----------------|
| `compliance-officer` | Compliance Officer Legal-Jurídico-Forense-Digital |
| `perito-forense` | Perito Informático Forense Digital |
| `legal-analyst` | Analista Legal Venezolano |

### 8 Skills Especializados

| Skill | Descripción |
|-------|-------------|
| `cadena-custodia-digital` | Flujo de cadena de custodia MUCC-2017 |
| `compliance-officer-digital` | Gestión de cumplimiento normativo |
| `derecho-venezolano-forense` | Marco legal venezolano |
| `fullstack-forensic-developer` | Desarrollo de CMS forense |
| `lms-test-forense` | Simulador de interrogatorio técnico |
| `normativas-iso-forense` | Estándares ISO/NIST/RFC |
| `perito-informatico-forense` | Procedimientos periciales |
| `ux-ui-compliance-cms` | Diseño de interfaces CMS |

---

## Seguridad y Trazabilidad

### Hash Chain SHA-256

Cada acción del sistema genera un registro de auditoría con hash encadenado:

```
 Registro 1: SHA-256(contenido_1 + "GENESIS") → hash_1
 Registro 2: SHA-256(contenido_2 + hash_1) → hash_2
 Registro 3: SHA-256(contenido_3 + hash_2) → hash_3
 ...
```

- **Append-only** — Los registros nunca se modifican ni eliminan
- **Verificable** — `verifyChain()` valida la integridad de toda la cadena
- **Exportable** — `exportToJSON()` genera respaldo completo

### Modo de Operación

Badge visible en el header indicando:
- `PRODUCCIÓN` — Modo activo con datos reales
- `SIMULACIÓN` — Modo de prueba/demostración

### Contraseñas

- Hasheadas con SHA-256 mediante Web Crypto API
- Almacenamiento seguro en Neon PostgreSQL

---

## Despliegue

### Vercel (Producción)

```bash
# Build optimizado
npm run build

# Output standalone para Vercel
# Configurado en next.config.ts: output: 'standalone'
```

### Configuración de Redirecciones

El archivo `next.config.ts` incluye 15 redirecciones de URLs legacy a rutas consolidadas:
- `/compliance` → `/control/seguimiento-compliance`
- `/correo-forense` → `/forense/tutoriales`
- Y 13 redirecciones adicionales

---

## Documentación Adicional

| Archivo | Contenido |
|---------|-----------|
| `docs/design_tokens.md` | Tokens de diseño completos (colores, fuentes, sombras, bordes) |
| `docs/map_arquitectura.md` | Mapa de arquitectura del sistema con diagramas |
| `AGENTS.md` | Instrucciones principales del agente AI |
| `agent_instructions.json` | Metadatos completos del proyecto |
| `.opencode/agents/*.md` | Definiciones de subagentes |
| `.opencode/skills/*/SKILL.md` | Skills especializados |

---

## Licencia

MIT

---

*Versión: 3.0.0 — CMS de Cumplimiento Forense*  
*Última actualización: Julio 2026*
