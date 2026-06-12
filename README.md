# SHA256.US — CMS de Cumplimiento Forense

**Sistema de gestión de cumplimiento normativo para procesos de peritaje digital.**  
Diseñado para que el **Compliance Officer** lleve el seguimiento comprobable de cada caso, genere los reportes exigidos por la ley e imprima las planillas oficiales en cada etapa del proceso.

> Basado en: Manual Único de Cadena de Custodia (Venezuela, 2017), ISO/IEC 27037, NIST SP 800-101, COPP, Ley de Mensajes de Datos y Firmas Electrónicas.

---

## Propósito

Esta app **no realiza análisis forense**. Es un **gestor de contenido (CMS)** que ayuda al perito auditor a:

- **Crear y gestionar casos** con toda la metadata del dispositivo y las partes involucradas
- **Controlar el cumplimiento normativo** paso a paso según 9 instrumentos legales precargados
- **Imprimir planillas oficiales** en cada fase del proceso (Acta de Obtención, PRCC, Seguimiento Forense)
- **Auditar cada acción** con trazabilidad inmutable mediante encadenamiento de hashes SHA-256
- **Generar reportes de auditoría** con línea de tiempo imprimible para presentar en tribunales

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 + TypeScript 6 |
| **Bundler** | Vite 8 |
| **Estilos** | TailwindCSS 3 (Dark Theme) |
| **Estado** | Zustand 5 + IndexedDB |
| **PWA** | Workbox (Service Worker) |
| **Iconos** | Lucide React |
| **Persistencia** | IndexedDB + Neon PostgreSQL |

---

## Estructura del Proyecto

```
SHA256.US/
├── src/
│   ├── components/       # Componentes React (Atomic Design)
│   │   ├── atoms/        # Componentes base (Toast, ErrorBoundary)
│   │   ├── molecules/    # Componentes compuestos (KpiCard)
│   │   ├── organisms/    # Bloques funcionales (Casos, Compliance, etc.)
│   │   └── templates/    # Layouts estructurales (CMSLayout, Layout)
│   ├── pages/            # Páginas del CMS
│   │   ├── DashboardPage.tsx
│   │   ├── CasosPage.tsx / CasoDetailPage.tsx
│   │   ├── Control/SeguimientoCompliancePage.tsx
│   │   ├── NormativasPage.tsx / AuditoriaPage.tsx
│   │   ├── PersonalPage.tsx / TareasPage.tsx
│   │   ├── CorreoForensePage.tsx
│   │   ├── Forense/          # TutorialesForensesPage, ManualAvillaPage, ManualServerlessPage
│   │   └── Planillas/    # ActaObtencionPage, PlanillaPRCCPage, SeguimientoPage
│   ├── store/            # Zustand stores
│   │   ├── cmsStore.ts   # Estado principal del CMS
│   │   ├── auditStore.ts # Auditoría con hash chain
│   │   ├── authStore.ts  # Autenticación
│   │   └── forenseStore.ts
│   ├── data/             # Fuentes de datos compartidas
│   │   ├── etapasForenses.ts       # 9 pasos del proceso forense
│   │   └── normativasEtapas.ts     # Normativas con sus etapas
│   ├── db/               # Capa de persistencia
│   │   ├── indexedDB.ts  # Almacenamiento durable IndexedDB
│   │   └── neonClient.ts # Cliente Neon PostgreSQL
│   └── hooks/            # Custom hooks
├── RAG/                  # Base documental (normativas, leyes, manuales)
├── dist/                 # Build de producción
└── public/               # Assets estáticos
```

---

## Módulos del CMS

| Ruta | Página | Función |
|------|--------|---------|
| `/` | **Dashboard** | KPIs: casos activos, cumplimiento, tareas pendientes |
| `/casos` | **Gestión de Casos** | CRUD con filtros por estado y prioridad |
| `/casos/:id` | **Detalle del Caso** | Evidencias, tareas, timeline, compliance |
| `/control/seguimiento-compliance` | **Seguimiento & Compliance** | Checklist normativo paso a paso (imprimible) |
| `/normativas` | **Marco Normativo** | 9 instrumentos legales con sus etapas |
| `/auditoria` | **Auditoría** | Log inmutable con cadena de hashes |
| `/tareas` | **Tareas & Fases** | Gestión de actividades por caso |
| `/personal` | **Personal** | Registro de peritos y roles |
| `/correo-forense` | **Correo Corporativo** | Proc. técnico-jurídico para correos electrónicos |
| `/planillas/acta-obtencion` | **Acta de Obtención** | Planilla imprimible para consignación |
| `/planillas/prcc-derivacion` | **Planilla PRCC** | Cadena de custodia imprimible |
| `/forense/manual-avilla` | **Manual Avilla** | Referencia operativa forense |
| `/forense/manual-serverless` | **Manual Serverless** | Guía de configuración Neon y Vercel |

---

## Flujo de Trabajo

```
1. CREAR CASO → 2. ASIGNAR NORMATIVAS → 3. SEGUIMIENTO PASO A PASO
                                              ↓
                                    ╔══════════════════╗
                                    ║  IMPRIMIR ACTA   ║  ← Por cada fase
                                    ║  IMPRIMIR PRCC   ║     completada
                                    ║  IMPRIMIR INFORME ║
                                    ╚══════════════════╝
                                              ↓
                                   4. AUDITORÍA INMUTABLE
                                              ↓
                                   5. REPORTE DE CIERRE
```

Las planillas se llenan a mano. La app genera el formato oficial exacto para cada etapa.  
Cada acción queda registrada en el log de auditoría con hash encadenado (trazabilidad forense).

---

## Normativas Precargadas

| Código | Tipo | Nombre |
|--------|------|--------|
| ISO/IEC 27037:2012 | ISO | Identificación, recopilación, adquisición y preservación |
| ISO/IEC 27042:2015 | ISO | Análisis e interpretación de evidencia digital |
| NIST SP 800-101 r1 | NIST | Guidelines on Mobile Device Forensics |
| MUCC-2017 | MANUAL | Manual Único de Cadena de Custodia |
| ACPO-v5 | MANUAL | Good Practice Guide for Digital Evidence |
| LEDI-2001 | LEY | Ley Especial de Delitos Informáticos |
| LMDF-1999 | LEY | Ley sobre Mensajes de Datos y Firmas Electrónicas |
| COPP | LEY | Código Orgánico Procesal Penal |
| CENIF-2012 | REGLAMENTO | Centro Nacional de Informática Forense |

---

## Instalación y Uso

```bash
npm install
npm run dev      # Desarrollo en http://localhost:5173
npm run build    # Build producción → dist/
npm run preview  # Vista previa del build
```

Credenciales por defecto: `admin` / `admin`

---

## PWA

La app es completamente funcional como PWA:
- Instalable en el dispositivo (standalone)
- Cachea recursos para funcionar offline
- La persistencia en IndexedDB mantiene los datos localmente
- Los reportes se imprimen directamente desde el navegador

---

## Licencia

MIT

---

*Versión: 2.0.0 — CMS de Cumplimiento Forense*  
*Última actualización: Mayo 2026*
