# Sistema de Diseño: Documento de Tokens (Modo Oscuro Permanente con MUI v6 & MUI X)

Este documento define los tokens de diseño (Design Tokens) utilizados en la aplicación **SHA256.US CMS de Cumplimiento Forense**. Mapea las variables globales y estilos especificados en el tema centralizado [theme.ts](file:///c:/VS%20CODE/Compliace-Forensic-js/src/lib/theme.ts) y [index.css](file:///c:/VS%20CODE/Compliace-Forensic-js/src/index.css).

> [!NOTE]
> Este proyecto está optimizado y configurado exclusivamente para funcionar en **Modo Oscuro (Dark Mode)** de forma permanente mediante `palette.mode = 'dark'` en MUI v6. El selector de modo claro ha sido deshabilitado.

---

## 1. Tipografía (Ubuntu & Fira Code)

El proyecto utiliza la tipografía Ubuntu a nivel de sistema UI y Fira Code para elementos técnicos y hashes SHA-256.

* **Familia Tipográfica Principal:** `'Ubuntu', sans-serif`
* **Familia Tipográfica Monospace:** `'Fira Code', 'Roboto Mono', monospace`
* **Interlineado Base (UI):** `1.5`
* **Interlineado Planillas (Print):** `1.5`

### Jerarquía y Colores de Encabezados

| Nivel de Encabezado | Color (Hex) | Peso (Weight) | Descripción / Significado |
| :--- | :--- | :--- | :--- |
| `h1` | `#00FF41` | `700` (Bold) | Verde Matriz Terminal. Títulos principales de módulo. |
| `h2` | `#FECF06` | `600` (SemiBold) | Amarillo Técnico / Oro. Títulos de secciones. |
| `h3`, `h4` | `#FECF06` | `600` (SemiBold) | Dorado/Amarillo con fondo `rgba(254,207,6,0.18)` y borde `3px solid #FECF06`. |
| `h5`, `h6` | `#FFFFFF` | `500` (Medium) | Blanco puro. Encabezados de tarjetas y controles. |

---

## 2. Paleta de Colores Cyber-Legal (Modo Oscuro)

| Propiedad MUI | Valor Hex / RGBA | Uso Semántico |
| :--- | :--- | :--- |
| `background.default` | `#524000` | Fondo general de la aplicación (Oliva Oscuro Profundo) |
| `background.paper` | `#121412` | Fondo de tarjetas primarias, paneles técnicos (`rgba(0,0,0,0.35)`) |
| `primary.main` | `#FECF06` | Estado activo, acento técnico, botones primarios y bordes |
| `secondary.main` | `#00FF41` | Verde Matriz Terminal para verificaciones conforme y hashes SHA-256 |
| `info.main` | `#9DFF00` | Lima Neón para alertas críticas y bases de datos vectoriales RAG |
| `warning.main` | `#FF9500` | Advertencias de compliance y estados en proceso |
| `error.main` | `#FF3B30` | Alertas críticas y acciones de borrado |
| `text.primary` | `#FFFFFF` | Texto principal de lectura |
| `text.secondary` | `#AEAEB2` | Etiquetas secundarias y metadatos |
| `divider` | `rgba(254, 207, 6, 0.2)` | Bordes y líneas de división secundarias |

---

## 3. Sombras (Shadows)

| Token de Elevación | Valor |
| :--- | :--- |
| `--co-shadow-1` | `0 1px 2px rgba(0,0,0,0.2)` |
| `--co-shadow-2` | `0 2px 6px rgba(0,0,0,0.3)` |
| `--co-shadow-3` | `0 4px 12px rgba(0,0,0,0.4)` |
| `--co-shadow-modal` | `0 12px 32px rgba(0,0,0,0.8)` |

---

## 4. Bordes y Radios (Borders & Border-Radius)

* **Radio de Botón (`MuiButton`):** `8px`
* **Radio de Tarjeta (`MuiCard`):** `8px` / `12px`
* **Radio de Panel (`MuiPaper`):** `16px`
* **Radio de Input (`MuiTextField`):** `10px`
* **Grosor del Borde:** `1px` con opacidad `0.2` (`rgba(254, 207, 6, 0.2)`)

---

## 5. Iconografía (Google Material Design & MUI Icons)

El proyecto utiliza la librería **Google Material Design Icons (Outlined)** y paquetes nativos de `@mui/icons-material`.
