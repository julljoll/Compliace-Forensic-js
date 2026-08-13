```
====================================================================================================
               🏛️ SHA256.US — CMS DE COMPLIANCE FORENSE DIGITAL 🏛️
     MANUAL CANÓNICO PROFESIONAL DE INGENIERÍA & ESTÁNDARES DE DESARROLLO
====================================================================================================
```

# ⚖️ SHA256.US — MANUAL CANÓNICO PROFESIONAL DE INGENIERÍA & ESTÁNDARES DE DESARROLLO

> [!IMPORTANT]
> **ESTÁNDAR CANÓNICO DE GOBERNAZA Y DESARROLLO PERICIAL:**
> Este documento constituye el **Manual Canónico Oficial de Ingeniería y Estándares de Desarrollo** que rige obligatoriamente todo el código, arquitectura de datos, interfaz gráfica (USWDS/Bootstrap), motor PDF e inmutabilidad criptográfica en el proyecto **SHA256.US**.

| 📌 Parámetro de Gobernanza | ⚙️ Especificación Técnica Institucional |
|:---------------------------|:----------------------------------------|
| **Documento Oficial**      | **Manual Canónico Profesional de Ingeniería & Estándares de Desarrollo** |
| **Sistema Mandante**       | SHA256.US — Compliance Forense Digital CMS |
| **Versión Canónica**       | `v3.5.0-CANONICAL` |
| **Estado de Vigencia**     | 🟢 **OBLIGATORIO & ACTIVO (ENFORCED)** |
| **Clasificación Legal**    | Estándar Forense ISO/IEC 27037 · ISO/IEC 27042 · NIST SP 800-86 · MUCC-2017 · COPP Art. 187 |

---


## 1. Stack Tecnológico Exclusivo y Reglas de Arquitectura

- **Framework Principal:** Next.js 16+ con App Router (`src/app/`).
- **Sistema de UI y Estilos (ÚNICO Y EXCLUSIVO):** **Bootstrap 5.3+** + **USWDS (US Web Design System 3.0+)**.
- **PROHIBICIÓN TOTAL DE MUI / MATERIAL-UI:** Queda estrictamente prohibido el uso de MUI (`@mui/material`, `@mui/x-data-grid`, `@mui/icons-material`, `src/lib/theme.ts`). Toda la interfaz debe construirse con componentes HTML semánticos estilizados exclusivamente con Bootstrap 5.3+ y clases USWDS `.usa-*`.
- **PROHIBICIÓN TOTAL DE TAILWIND CSS:** Prohibido cualquier uso de utilidades o directivas de Tailwind CSS.
- **Iconografía Oficial:** Lucide React y SVG estandarizados (`src/components/atoms/AppleIcon.tsx`).
- **Motor de Renderizado PDF:** `@react-pdf/renderer` para la generación inmutable de documentos imprimibles.
- **Estado Global:** Zustand (`src/store/cmsStore.ts`, `src/store/auditStore.ts`) con persistencia local IndexedDB / LocalStorage (offline-first) y sincronización backend opcional.
- **Tipografía Institucional:**
  - `Public Sans` (Google Font oficial USWDS para UI y lectura).
  - `Fira Code` / `Courier` / `monospace` (para hashes SHA-256, hashes MD5, identificadores de expedientes, direcciones MAC/IP y datos técnicos).

---

## 2. Sistema de Diseño Visual (USWDS DC3 Cyber Forensics Light Theme)

La interfaz gráfica sigue el modelo de diseño oficial del **Defense Cyber Crime Center — Cyber Forensics Laboratory (DC3)** en modo claro gubernamental:

### 2.1 Tokens de Color Oficiales

| Elemento / Rol | Token USWDS | Valor Hex | Aplicación |
|----------------|-------------|-----------|------------|
| **Fondo Principal (Canvas)** | `Cool Gray 5` | `#F0F4F8` | Canvas general de la aplicación |
| **Tarjetas y Superficies** | `Crisp White` | `#FFFFFF` | Tarjetas, modales, tablas y contenedores (`border: #CBD5E1`) |
| **Sidebar & Nav Superior** | `Dark Navy Ink 90v` | `#112E51` | Azul marino federal de laboratorio forense |
| **Banner Oficial del Gobierno** | `Banner Navy` | `#1A2536` | Componente `USWDSGovBanner` |
| **Acento Primario / Interactivo** | `Vivid Blue 60v` | `#005EA2` | Botones principales, enlaces, progreso, tabs activos |
| **Sellos y Destacados** | `Accent Gold 40v` | `#D9A700` | Insignias de la República, sellos oficiales y badges |
| **Texto de Lectura Principal** | `Dark Ink` | `#1B2A4A` | Encabezados, títulos y texto primario |
| **Texto Secundario / Muted** | `Slate` | `#475569` | Descripciones, labels y meta-información |
| **Estado Éxito / Conforme** | `Green 50v` | `#008837` | Hashes verificados, estados completados |
| **Estado Alerta / Gating** | `Gold 60v` | `#C05621` | Pasos pendientes, alertas de cumplimiento |
| **Estado Error / Violación** | `Red 50v` | `#D9381E` | Inconsistencias de hash, errores de custodia |

### 2.2 Componentes de Diseño USWDS (`.usa-*`)
- `.usa-banner`: Banner institucional superior gubernamental.
- `.usa-card`: Tarjetas blancas elevadas con bordes `#CBD5E1` y hover azul `#005EA2`.
- `.usa-table`: Tablas federales limpias con encabezados en `#F1F5F9` o `#112E51`.
- `.usa-alert`, `.usa-alert--success`, `.usa-alert--info`, `.usa-alert--error`: Bloques de alerta estructurados.
- `.usa-tag`: Insignias tipo chip monospaciadas para normativas y tipos de caso.
- `.usa-step-indicator`: Barra de progreso por pasos del expediente.
- `.usa-summary-box`: Recuadros resumen con borde lateral institucional.

### 2.3 Estándar de Activos Vectoriales SVG (Planillas, Pipelines y Diagramas de Flujo)

Todo gráfico o recurso en formato `.svg` (planillas, actas, diagramas de flujo, pipelines forenses o arquitecturas de sistema) generado o requerido por el proyecto debe cumplir obligatoriamente con los siguientes principios:

1. **Orientación y Proporción Canónica (Hoja Folio Vertical):**
   - Todos los activos SVG deben diseñarse en **orientación vertical**, adoptando las proporciones físicas y la relación de aspecto estandarizada de **Hoja Folio / Oficio (216mm × 330mm)** (relación de aspecto `1 : 1.528`, ej. `viewBox="0 0 612 935"` o `viewBox="0 0 800 1222"`).

2. **Paridad y Fidelidad Absoluta (Copia Fiel 1:1 para Planillas Existentes):**
   - Cuando el recurso SVG sea una representación o visualización de una planilla o acta ya existente en el sistema, debe constituir una **copia fiel 1:1**.
   - Debe replicar con exactitud milimétrica la tipografía (`Public Sans` / `Fira Code`), membretes institucionales, grillas de campos, tablas, pautas de cuaderno, recuadros dactiloscópicos y bloques de firmas bilaterales del componente original.

3. **Ingeniería de UI/UX, SEO Gráfico y Estilos Institucionales (Nuevos Diagramas / Pipelines):**
   - **Estilos Institucionales & UI/UX:** Aplicar de forma estricta los tokens de color oficiales del laboratorio forense (Canvas `#F0F4F8`, Tarjetas `#FFFFFF`, Azul Marino `#112E51`, Azul Interactivo `#005EA2`, Dorado `#D9A700`, Texto `#1B2A4A`), manteniendo jerarquía visual limpia y alto contraste (WCAG 2.1 AA).
   - **SEO Gráfico & Semántica SVG:** Incluir etiquetas semánticas dentro del código del SVG (`<title>`, `<desc>`, atributos `role="img"` y `aria-labelledby`), optimización vectorial sin nodos o estilos redundantes inline, garantizando rendimiento, accesibilidad e indexación web.

---

## 3. Marco Regulatorio y Estándares Forenses Obligatorios

Todas las planillas, actas e informes emitidos por el sistema deben cumplir con el marco regulatorio vigente:

1. **ISO/IEC 27037:2012:** Guía para la identificación, recolección, adquisición y preservación de evidencia digital.
2. **ISO/IEC 27042:2015:** Directrices para el análisis e interpretación de evidencia digital.
3. **NIST SP 800-86:** Guide to Integrating Forensic Techniques into Incident Response.
4. **NIST SP 800-88 Rev. 1:** Guidelines for Media Sanitization (Zeroization & Crypto-Erase).
5. **MUCC-2017:** Manual Único de Cadena de Custodia de Evidencias Físicas (Ministerio Público / CICPC - Venezuela).
6. **COPP Art. 187:** Garantía procesal penal de cadena de custodia.
7. **CRBV Arts. 28 y 60:** Protección de datos personales, privacidad y Hábeas Data.
8. **RFC 3227:** Guidelines for Evidence Collection and Archiving.

---

## 4. Regla de Doble Arquitectura Sincronizada para Planillas Forenses

Toda planilla o acta del sistema se mantiene **sincronizada en dos capas de presentación paritarias**:

1. **Planilla Web Interactiva (`src/components/organisms/Planillas/*.tsx`):**
   - Formulario interactivo que permite la edición y visualización en pantalla.
   - Pre-llenado automático desde el expediente activo (`CasoCMS`).
   - Controles de validación de campos requeridos y gating normativo.
   - Estructura visual tipo "Hoja de Folio" (216mm × 330mm) con soporte de zoom en visor `PlanillaDocumentViewer.tsx`.

2. **Documento PDF Imprimible (`src/lib/pdf/documents/*Pdf.tsx`):**
   - Renderizado limpio mediante `@react-pdf/renderer` para exportación directa y previsualización.
   - Pauta de cuaderno a rayas para observaciones manuscritas.
   - Formato legal estándar (Folio / Oficio) con márgenes reglamentarios (Izquierda 3cm, Derecha 1.5cm, Superior 4cm/1.5cm, Inferior 1.5cm).

> **REGLA DE ORO:** Cualquier nuevo campo, sección o modificación en una planilla DEBE aplicarse simultáneamente en la versión Web Interactiva y en el componente PDF de impresión.

---

## 5. Estándar de Cierre Legal: Firmas, Dactiloscopía y Consignatario

En la parte inferior de toda planilla o acta forense debe figurar obligatoriamente la sección de cierre legal:

### 5.1 Estructura de Firma Bilateral y Dactiloscopía:
1. **Sección de Firmas:**
   - Línea de firma con espacio adecuado para rúbrica manuscrita (`.sig-line`).
   - Campos legibles sobre/bajo la firma:
     - `Nombre y Apellido:`
     - `C.I. N°:`
     - `CIV N°:` (Colegio de Ingenieros, si aplica)
     - `INPREABOGADO N°:` (si aplica)
     - `Cargo / Rol:` (Consignante, Entrevistado, Perito Líder, Perito Coadyuvante)
2. **Recuadros Dactiloscópicos (Huellas):**
   - Dos recuadros de huella dactilar (`Pulgar Izquierdo` y `Pulgar Derecho`).
3. **Datos de Contacto Post-Firma (Obligatorios):**
   - `Número Telefónico:`
   - `Dirección de Habitación / Residencia:`

### 5.2 Cláusula Normativa para Adquisición de Imagen Forense (DEFR / DES):
Para procedimientos de extracción de imagen forense (ISO 27037), se debe incluir la cláusula de responsabilidad:
> *"Realizar el procedimiento técnico correspondiente hasta lograr la extracción exitosa de la imagen forense del dispositivo objeto de peritaje, garantizando la preservación del hash génesis SHA-256."*

---

## 6. Automatización de Expedientes ("Crear Caso" / "Nuevo Expediente")

El proceso de apertura de un caso se realiza mediante el asistente `NuevoCasoWizard.tsx` (modal Bootstrap/USWDS de 4 pasos):
- **Paso 1:** Expediente y Tipología (`forense_whatsapp`, `forense_email`, `forense_discoduro`, `forense_imagen`).
- **Paso 2:** Consignante / Entrevistado (Nombre, C.I., Teléfono, Email, Dirección).
- **Paso 3:** Evidencia Digital (Marca, Modelo, Serial/IMEI, Color, Estado, Aislamiento RF).
- **Paso 4:** Equipo Pericial y Fiscalía Ordenante.

Al crear el caso, los datos se almacenan centralizadamente en `cmsStore.ts` y se pre-llenan automáticamente en todas las planillas de las 4 etapas del proceso forense.

---

## 7. Tipologías Periciales Soportadas

- `forense_whatsapp`: Extracción móvil Android / iOS, parseo `msgstore.db`, 9 pasos MUCC-2017.
- `forense_email`: Cabeceras SMTP, validación SPF/DKIM/DMARC, 7 pasos RFC 3227.
- `forense_discoduro`: Clonado bit-a-bit E01/DD, 8 pasos NIST SP 800-86.
- `forense_imagen`: Adquisición de imagen forense digital, verificación de hash SHA-256 bit-a-bit, 8 pasos ISO/IEC 27037.

---

## 8. Guía Técnica Paso a Paso para Desarrolladores (Developer Skills)

### 🚀 SKILL 1: Cómo Agregar o Modificar una Planilla Forense

Para crear una nueva planilla en el sistema, siga estrictamente estos 5 pasos:

1. **Paso 1 — Registrar el ID de la Planilla:**
   - Editar `src/hooks/usePlanillaFormData.ts` y agregar el ID al tipo `PlanillaId`.
   - Editar `src/components/organisms/Planillas/PlanillaDigitalFormModal.tsx` y agregar la meta-información a `PLANILLA_LABELS`.

2. **Paso 2 — Crear el Componente Web Interactiva:**
   - Crear `src/components/organisms/Planillas/[NombrePlanilla].tsx`.
   - Utilizar el wrapper `PlanillaFolioTemplate`.
   - Incorporar secciones numeradas (`PlanillaSectionTitle`), inputs editables (`PlanillaEditableValue`), casillas (`PlanillaCheckboxGroup`), y la sección de firma bilateral con `PlanillaThumbBox`.

3. **Paso 3 — Crear el Componente PDF Correspondiente (`@react-pdf/renderer`):**
   - Crear `src/lib/pdf/documents/[NombrePlanilla]Pdf.tsx`.
   - Utilizar `PlanillaCoverPagePdf`, `PlanillaHeader`, `PlanillaFooter` y los estilos de `reactPdfStyles.ts`.
   - Garantizar paridad 1:1 en campos y textos legales con el componente Web.

4. **Paso 4 — Crear/Actualizar la Página en App Router:**
   - Crear o actualizar `src/page-components/Planillas/[NombrePlanilla]Page.tsx`.
   - Utilizar `PlanillaPdfViewer` pasando el documento PDF en la prop `document` y la metadata del caso.

5. **Paso 5 — Verificar Compilación:**
   - Ejecutar `npx tsc --noEmit` para confirmar que no existen errores de tipado.

---

### 🛡️ SKILL 2: Gestión de Auditoría Criptográfica e Inmutabilidad (Hash Chain)

1. Toda acción crítica (creación de expediente, recepción de evidencia, clonado, sanitización, dictamen) debe registrarse en `auditStore.ts` invocando `addEntry()`.
2. Cada entrada genera automáticamente:
   - `hashActual`: SHA-256 del contenido del evento.
   - `hashAnterior`: Enlace criptográfico al hash del evento previo (cadena inmutable).
3. Para mostrar el historial auditado en una planilla o acta, utilizar el componente `ActaAuditoriaTimeline.tsx` y `ActaAuditoriaTimelinePdf.tsx`.

---

### 📦 SKILL 3: Exportación y Empaquetado de Expedientes (`downloadPlanillaZip.ts`)

1. El sistema permite descargar el expediente forense en un archivo comprimido ZIP que contiene:
   - El documento en formato HTML independiente con CSS embebido.
   - El informe/dictamen oficial en formato PDF.
   - El documento editable en Microsoft Word (.DOCX) generado mediante `exportPlanillaToWordDocx`.
2. Para modificar la exportación a Word o ZIP, actualizar los módulos en `src/lib/export/` y `src/page-components/Planillas/downloadPlanillaZip.ts`.

---

## 9. Gobernanza de Código y Estructura de Directorios

```
src/
├── app/                        # Next.js 16 App Router (Rutas de la aplicación)
├── components/
│   ├── atoms/                  # Componentes atómicos (AppleIcon, Badge, Button, Input, Modal, Skeleton)
│   ├── molecules/              # Moléculas de UI (KpiCard, NormativaAccordion, PlanillaHeader, PlanillaFooter)
│   ├── organisms/              # Organismos complejos y Formularios Web de Planillas
│   │   ├── Casos/              # Wizard y filtros de expedientes
│   │   ├── Compliance/         # Indicadores KPI de cumplimiento
│   │   └── Planillas/          # Componentes web interactivos (*.tsx) y Visores
│   └── templates/              # Templates de layout (CMSLayout, PlanillaFolioTemplate)
├── data/                       # Tipologías y constantes forenses
├── db/                         # Persistencia IndexedDB / LocalStorage
├── hooks/                      # Custom hooks (usePlanillaFormData, etc.)
├── lib/
│   ├── export/                 # Exportadores (.DOCX Word)
│   └── pdf/                    # Motor de PDF (@react-pdf/renderer)
│       ├── documents/          # Componentes de renderizado PDF (*Pdf.tsx)
│       ├── PlanillaHeaderFooter.tsx
│       ├── PlanillaCoverPagePdf.tsx
│       └── reactPdfStyles.ts
├── page-components/            # Componentes de página Next.js
│   └── Planillas/              # Páginas de planillas (*Page.tsx) y Planillas.css
├── store/                      # Zustand Stores (cmsStore.ts, auditStore.ts)
└── testing/                    # Utilidades para pruebas unitarias
```

---

## 10. Reglas de Calidad y Verificación de Desarrollo

1. **Nunca romper la paridad Web/PDF:** Al agregar un campo en la UI web, agregarlo de inmediato en el componente PDF correspondiente.
2. **Sin librerías UI no autorizadas:** No instalar ni utilizar MUI, Tailwind, Ant Design o similares. Bootstrap 5.3 + USWDS 3.0 son los únicos marcos visuales permitidos.
3. **Verificación TypeScript Obligatoria:** Ningún cambio se da por concluido sin haber verificado la compilación estática ejecutando `npx tsc --noEmit`.
4. **Preservación de Márgenes de Folio:** La previsualización web y la impresión física deben conservar los márgenes normativos de hoja Folio (216mm × 330mm).
5. **Cumplimiento Estricto de SVG Folio Vertical:** Todo activo SVG de planillas, diagramas de flujo o pipelines debe crearse en orientación Folio vertical (`1:1.528`), ser copia fiel 1:1 si corresponde a una planilla existente, e integrar optimización UX/SEO con los estilos institucionales (DC3 Cyber Forensics).
