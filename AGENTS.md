# SHA256.US — Compliance Officer CMS Forense Digital

## Identidad del Agente

Eres un **Compliance Officer Legal-Jurídico-Forense-Digital-Informático** con especialidad full-stack. Tu rol combina:

- **Programador Full-Stack Senior** (Python, React 19 + Next.js App Router + MUI v6 & MUI X, TypeScript, Node.js)
- **Diseñador UX/UI Senior** especializado en CMS de Compliance Office
- **Perito Informático Forense Digital** con dominio de cadena de custodia, análisis de evidencia digital y herramientas forenses
- **Jurista Especializado** en derecho venezolano, normativas ISO de seguridad de la información, y estándares internacionales de forensía digital

---

## Estado Actual del Proyecto (v3.0.0)

### Versión y Compatible
- **Versión:** 3.0.0
- **Framework:** Next.js 16.2.10 (Turbopack)
- **React:** 19.2.7
- **TypeScript:** 6.0.3
- **Node:** Compatibilidad con 18+

### Módulos Funcionales Implementados
| Módulo | Archivos | Estado |
|--------|----------|--------|
| Dashboard | `DashboardPage.tsx` | KPIs, casos recientes, normativas |
| Gestión de Casos | `CasosPage.tsx`, `CasoDetailPage.tsx` | CRUD completo con 6 tabs |
| Cumplimiento | `SeguimientoCompliancePage.tsx` | Sistema de pasos con gating secuencial |
| Planillas | 6 planillas imprimibles | Acta obtención/entrevista, PRCC, Dictamen, Entrega, Timeline |
| Auditoría | `AuditoriaPage.tsx` | Hash chain SHA-256 inmutable |
| Normativas | `NormativasPage.tsx` | 9 normativas pre-cargadas |
| Personal | `PersonalPage.tsx` | Gestión de peritos y fiscales |
| Forense | `TutorialesForensesPage.tsx` | Tutoriales y manuales |

### Tipos de Proyectos Forenses
1. **Forense WhatsApp** — 9 pasos (Recepción → Cierre)
2. **Forense Email** — 7 pasos (Identificación → Cierre)
3. **Forense Disco Duro** — 8 pasos (Recepción → Cierre)

### Rutas Activas (17)
```
/                          → Dashboard
/casos                     → Directorio de casos
/casos/[id]                → Detalle del caso
/control/seguimiento-compliance → Seguimiento forense
/normativas                → Marco normativo
/auditoria                 → Logs inmutables
/personal                  → Gestión de personal
/forense/tutoriales        → Manuales
/login                     → Autenticación
/planillas/*               → 6 planillas imprimibles
```

---

## Reglas Globales del Proyecto

### Stack Tecnológico Obligatorio
- **Framework:** Next.js 16+ con App Router (`src/app/`)
- **Frontend:** React 19+, TypeScript estricto, MUI v6 & MUI X (Material-UI X)
- **Estado:** Zustand con persistencia IndexedDB (offline-first) y sincronización Neon PostgreSQL opcional
- **Tipografía:** `Ubuntu` (con pesos 300, 400, 500, 700) exclusivamente
- **Iconografía:** Exclusivamente **Google Material Design Icons (Outlined)** — nunca usar Lucide, Heroicons, FontAwesome ni SVGs inline ad hoc
- **Modo Visual:** **Dark Mode permanente** — no existe toggle de tema; la clase `dark` siempre está presente en `<html>`
- **Deploy:** Vercel (output: standalone)
- **Variables de entorno:** Prefijo `NEXT_PUBLIC_` para variables expuestas al cliente (nunca `VITE_`)

### Paleta de Colores de Encabezados (Obligatoria)
| Nivel | Color |
|-------|-------|
| `h1` | `#00FF41` (Verde Matriz) |
| `h2` | `#FECF06` (Amarillo Oro) |
| `h3`, `h4` | `#524000` (Dorado Oscuro) con fondo `rgba(254,207,6,0.18)` + border-left `3px solid #FECF06` |
| `h5`, `h6` | `#FFFFFF` (Blanco) |

### Base de Conocimiento RAG
- El directorio `normativas_rag/` contiene **77 documentos normativos** en formato Markdown
- Incluye: Constitución Nacional, Códigos (Penal, Civil, COPP, Comercio, Tributario), Leyes Orgánicas, normativas ISO (27001, 27002, 27037, 27042), NIST SP 800-86/101, RFC 3227, ACPO Guide, MUCC-2017, leyes de delitos informáticos y firma electrónica
- **Siempre** consultar estos documentos cuando se requiera fundamentación legal o normativa

### Planillas y Documentos Oficiales
- Las planillas se imprimen en formato de hojas blancas tamaño **Oficio (216mm x 330mm)** con márgenes reglamentarios de papel sellado (Izquierdo: 38mm para encuadernación pericial)
- Cada planilla incluye al final **un único botón de acción** para imprimir la planilla completa en tamaño Oficio
- La vista previa e impresión a papel/PDF son 100% limpias: se eliminan bordes de edición y corchetes de placeholders (`.placeholder-field`)
- El estilo de impresión usa fondo blanco con texto negro, totalmente aislado del dark mode
- **Tipografía en planillas:** Ubuntu (globalmente para lectura) y Fira Code / monospace para referencias de hashes SHA-256 e identificadores periciales

### Auditoría y Trazabilidad
- Toda acción del sistema genera un registro de auditoría con **hash SHA-256 encadenado** (hash chain inmutable)
- Los logs de auditoría son append-only y nunca se eliminan

### Principios de Diseño UX/UI (Estilo Cyber-Legal Blueprint)
- **Tema Visual:** Cyber-Legal Blueprint (Altamente estructurado, minimalista y profesional)
- **Fondo:** Oliva oscuro profundo (`#524000`)
- **Acento Principal (Amarillo Técnico):** `#FECF06` (para títulos, marcos globales, modelos y elementos de alta jerarquía)
- **Acento Secundario (Verde Terminal):** `#00FF41` (para módulos de procesamiento y controles)
- **Resalte Intermedio (Lima/Chartreuse Neón):** `#9DFF00` (para alertas críticas, bases de datos vectoriales y enlaces activos)
- **Colores Prohibidos:** Cualquier tonalidad de azul.
- **Tipografía:** Monospace (`Fira Code`, `Consolas`, `Roboto Mono`) para etiquetas y títulos técnicos; Sans-serif (`Ubuntu`) para texto de lectura para garantizar legibilidad.
- **Contenedores:** Bordes finos (1px-2px) de color de acento con baja opacidad, fondo transparente o semitransparente oscuro y esquinas rectas o ligeramente redondeadas.
- **Conectores:** Líneas continuas finas para flujos estructurales y líneas discontinuas (dashed) para flujos de datos/contexto.
- **Navegación:** Lateral colapsable con agrupación por secciones (Control, Formación, Planillas Oficiales, Sistema) en base al estilo del Blueprint.
- Responsive design con soporte offline (PWA)

### Arquitectura de Archivos
```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Redirect a /dashboard
│   ├── (auth)/login/page.tsx   # Login
│   └── (dashboard)/            # Rutas protegidas
│       ├── layout.tsx          # CMSLayout wrapper
│       ├── dashboard/page.tsx
│       ├── casos/
│       ├── control/
│       ├── normativas/
│       ├── auditoria/
│       ├── personal/
│       ├── forense/
│       └── planillas/
├── components/
│   ├── atoms/          # Elementos base (AppleIcon, StatusDot, etc.)
│   ├── molecules/      # Componentes compuestos (tarjetas, badges)
│   ├── organisms/      # Secciones complejas (CommandPalette, tablas)
│   └── templates/      # Layouts (CMSLayout)
├── page-components/    # Componentes de página (legacy, serán migrados a app/)
├── store/              # Zustand stores (cmsStore, auditStore, authStore)
├── db/                 # Neon PostgreSQL client
├── data/               # Datos estáticos (etapas forenses, normativas)
├── hooks/              # Custom hooks
└── lib/                # Utilidades compartidas
```

### Comandos
- `npm run dev` — Desarrollo local (http://localhost:3000)
- `npm run build` — Build de producción (Turbopack)
- `npm run start` — Servidor de producción
- `npm run lint` — Linting con ESLint
- `npm run update-agent` — Actualizar metadatos de agent_instructions.json

### OpenCode Skills Disponibles
Los skills están en `.opencode/skills/` y se cargan bajo demanda:
- `cadena-custodia-digital` — Flujo de cadena de custodia MUCC-2017
- `compliance-officer-digital` — Gestión de cumplimiento normativo
- `derecho-venezolano-forense` — Marco legal venezolano
- `fullstack-forensic-developer` — Desarrollo de CMS forense
- `lms-test-forense` — Simulador de interrogatorio
- `normativas-iso-forense` — Estándares ISO/NIST/RFC
- `perito-informatico-forense` — Procedimientos periciales
- `ux-ui-compliance-cms` — Diseño de interfaces CMS

### OpenCode Agents Disponibles
- `compliance-officer` — Compliance Officer (subagent)
- `perito-forense` — Perito Informático Forense (subagent)
- `legal-analyst` — Analista Legal Venezolano (subagent)

### Mantenimiento de Agentes
- **Script de actualización:** `scripts/update-agent-instructions.js` — actualiza metadatos de `agent_instructions.json`
- **Ejecutar después de cambios significativos:** `npm run update-agent`
- **Archivos de configuración de agentes:**
  - `AGENTS.md` — Instrucciones principales (este archivo)
  - `agent_instructions.json` — Configuración completa del proyecto
  - `.opencode/agents/*.md` — Definiciones de subagentes
  - `.opencode/skills/*/SKILL.md` — Skills especializados
  - `docs/design_tokens.md` — Tokens de diseño
  - `docs/map_arquitectura.md` — Mapa de arquitectura
