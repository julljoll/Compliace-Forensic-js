# Sistema de Diseño: Documento de Tokens (Modo Oscuro Permanente con MUI v6 & MUI X)

Este documento define los tokens de diseño (Design Tokens) oficiales del proyecto **SHA256.US CMS de Cumplimiento Forense**, en estricta consonancia con el Skill `ux-ui-compliance-cms` y la estética **Cyber-Legal Blueprint**. Mapea las variables globales y estilos especificados en [theme.ts](file:///c:/VS%20CODE/CODIGO/Compliace-Forensic-js/src/lib/theme.ts) y [index.css](file:///c:/VS%20CODE/CODIGO/Compliace-Forensic-js/src/index.css).

> [!NOTE]
> Este proyecto está configurado exclusivamente para funcionar en **Modo Oscuro (Dark Mode)** de forma permanente mediante `palette.mode = 'dark'` en MUI v6. No existe selector de tema claro.

---

## 1. Principios de la Estética Cyber-Legal Blueprint

1. **Fondo Oliva Oscuro Profundo (`#524000`)**: Simula un entorno de seguridad pericial inmutable y altamente estructurado.
2. **Prohibición de Tonos Azules**: Ningún componente UI utiliza tonos de azul. Los acentos son exclusivamente Amarillo Técnico (`#FECF06`), Verde Terminal (`#00FF41`) y Lima Neón (`#9DFF00`).
3. **Contenedores Transparentes de Bordes Finos**: Tarjetas `MuiCard` y paneles `Paper` utilizan fondo `#121412` o `rgba(0,0,0,0.35)` con bordes de `1px` a `2px` en `rgba(254, 207, 6, 0.2)` o `rgba(0, 255, 65, 0.2)`.
4. **Doble Familia Tipográfica**:
   - **Monospace (`Fira Code`, `Consolas`, `Roboto Mono`)**: Para etiquetas técnicas, números de expedientes, hashes SHA-256 y esquemas terminales.
   - **Sans-Serif (`Ubuntu`, `Helvetica`, `Arial`)**: Para bloques de texto descriptivo y párrafos de lectura.

---

## 2. Tipografía & Jerarquía de Encabezados

* **Familia Tipográfica Principal (Lectura):** `'Ubuntu', sans-serif`
* **Familia Tipográfica Monospace (Técnica & Hashes):** `'Fira Code', 'Roboto Mono', monospace`
* **Interlineado Base (UI):** `1.5`
* **Interlineado Planillas (Print):** `1.4` / `1.5`

### Jerarquía y Colores de Encabezados (Obligatoria)

| Nivel de Encabezado | Color (Hex) | Peso (Weight) | Estilo Visual & Significado |
| :--- | :--- | :--- | :--- |
| `h1` | `#00FF41` | `700` (Bold) | Verde Matriz Terminal. Títulos principales de módulo y consolas. |
| `h2` | `#FECF06` | `600` (SemiBold) | Amarillo Técnico / Oro. Títulos de secciones principales. |
| `h3`, `h4` | `#FECF06` | `600` (SemiBold) | Dorado/Amarillo con fondo `rgba(254,207,6,0.18)` y borde izquierdo `3px solid #FECF06`. |
| `h5`, `h6` | `#FFFFFF` | `500` (Medium) | Blanco puro. Encabezados de tarjetas, controles y modales. |

---

## 3. Paleta de Colores Cyber-Legal (Modo Oscuro)

| Propiedad MUI | Valor Hex / RGBA | Uso Semántico |
| :--- | :--- | :--- |
| `background.default` | `#524000` | Fondo general de la aplicación (Oliva Oscuro Profundo) |
| `background.paper` | `#121412` | Fondo de tarjetas primarias, paneles técnicos (`rgba(0,0,0,0.35)`) |
| `primary.main` | `#FECF06` | Estado activo, acento técnico, botones primarios y marcos globales |
| `secondary.main` | `#00FF41` | Verde Matriz Terminal para verificaciones conforme, hashes SHA-256 y módulos validados |
| `info.main` | `#9DFF00` | Lima/Chartreuse Neón para alertas críticas, RAGVectorDB y enlaces activos |
| `warning.main` | `#FF9500` | Advertencias de compliance y estados en progreso |
| `error.main` | `#FF3B30` | Alertas críticas, fallos de auditoría y acciones destructivas |
| `text.primary` | `#FFFFFF` | Texto principal de lectura |
| `text.secondary` | `#AEAEB2` | Etiquetas secundarias, subtextos y metadatos |
| `divider` | `rgba(254, 207, 6, 0.2)` | Bordes y líneas de división estructurales |

---

## 4. Sombras (Shadows) y Elevaciones

| Token de Elevación | Valor |
| :--- | :--- |
| `--co-shadow-1` | `0 1px 2px rgba(0,0,0,0.2)` |
| `--co-shadow-2` | `0 2px 6px rgba(0,0,0,0.3)` |
| `--co-shadow-3` | `0 4px 12px rgba(0,0,0,0.4)` |
| `--co-shadow-modal` | `0 12px 32px rgba(0,0,0,0.8)` |

---

## 5. Bordes, Radios & Conectores

* **Radio de Botón (`MuiButton`):** `8px`
* **Radio de Tarjeta (`MuiCard`):** `8px` / `12px`
* **Radio de Panel (`Paper`):** `8px` / `16px`
* **Radio de Input (`MuiTextField`):** `8px` / `10px`
* **Bordes Contenedores:** `1px` - `2px` solid con opacidad `0.2` (`rgba(254, 207, 6, 0.2)` o `rgba(0, 255, 65, 0.2)`)
* **Conectores Visuales:**
  - **Líneas continuas finas (`1px solid`):** Flujos estructurales de jerarquía.
  - **Líneas discontinuas (`1px dashed`):** Flujos de datos, contextos y campos editables.

---

## 6. Iconografía (Google Material Design Icons & MUI Icons)

* **Librería Primaria:** Google Material Design Icons (Outlined)
* **Librería Secundaria:** `@mui/icons-material`
* **Iconos Prohibidos:** SVGs inline ad hoc, Heroicons, FontAwesome, Lucide.

---

## 7. Formato Imprimible de Planillas Oficiales (Hojas Blancas Tamaño Oficio)

* **Formato de Papel:** Hojas Blancas Tamaño **Oficio Venezolano** (`216mm x 330mm`).
* **Márgenes de Papel Sellado:** `Top: 20mm`, `Right: 15mm`, `Bottom: 20mm`, `Left: 38mm` (espacio reglamentario de encuadernación/cosido pericial).
* **Comportamiento en Impresión (`@media print`):**
  - Fondo blanco puro (`#FFFFFF`) y texto negro pericial (`#1D1D1F` / `#000000`).
  - Ocultación total de elementos `.no-print` (incluyendo barras flotantes y navegadores).
  - Ocultación de corchetes e indicativos referenciales (`.placeholder-field` → `display: none !important`).
  - Remoción de líneas punteadas de edición (`contenteditable="true"` → `border-bottom: none !important`).
  - Preservación de membrete institucional, firmas periciales y cuadros de huellas dactilares.
