# Sistema de Diseño: Documento de Tokens (Modo Oscuro Permanente)

Este documento define los tokens de diseño (Design Tokens) utilizados en la aplicación **SHA256.US CMS de Cumplimiento Forense**. Mapea las variables globales y estilos especificados en el archivo [index.css](file:///c:/VS%20CODE/SHA256/src/index.css) y [tailwind.config.js](file:///c:/VS%20CODE/SHA256/tailwind.config.js).

> [!NOTE]
> Este proyecto está optimizado y configurado exclusivamente para funcionar en **Modo Oscuro (Dark Mode)** de forma permanente. El selector de modo claro ha sido deshabilitado.

---

## 1. Tipografía (Courier New System)

El proyecto utiliza una fuente de ancho fijo (monospace) a nivel de sistema para dar un aspecto técnico y limpio de terminal/forense.

* **Familia Tipográfica:** `'Courier New', Courier, monospace`
* **Interlineado Base (UI):** `1.6`
* **Interlineado Planillas (Print):** `1.5`

### Jerarquía y Colores de Encabezados

| Nivel de Encabezado | Color (Hex) | Peso (Weight) | Descripción / Significado |
| :--- | :--- | :--- | :--- |
| `h1` | `#00FF41` | `700` (Bold) | Verde Matriz / Hacker. Títulos principales. |
| `h2` | `#FECF06` | `700` (Bold) | Amarillo / Oro. Títulos de secciones y apartados. |
| `h3`, `h4` | `#524000` | `600` (SemiBold) | Dorado Oscuro / Marrón. Subtítulos y subdivisiones. |
| `h5`, `h6` | `#FFFFFF` | `500` (Medium) | Blanco puro. Encabezados de menor jerarquía. |

---

## 2. Paleta de Colores (Modo Oscuro)

| Variable CSS | Valor | Uso Semántico |
| :--- | :--- | :--- |
| `--co-bg` | `#000000` | Fondo general de la aplicación |
| `--co-surface-1` | `#1C1C1E` | Fondo de tarjetas primarias, paneles |
| `--co-surface-2` | `#2C2C2E` | Fondos de controles secundarios, inputs |
| `--co-surface-3` | `#3A3A3C` | Hover de listas y separadores activos |
| `--co-separator` | `rgba(255,255,255,0.1)` | Bordes y líneas de división secundarias |
| `--co-accent` | `#0A84FF` | Estado activo, enlaces y botones primarios |
| `--co-red` | `#FF453A` | Alertas críticas y acciones de borrado |
| `--co-orange` | `#FF9F0A` | Advertencias de compliance pendientes |
| `--co-green` | `#30D158` | Cumplimiento conforme y estados completados |
| `--co-blue` | `#0A84FF` | Información general |
| `--co-indigo` | `#5E5CE6` | Estados de auditoría |

---

## 3. Sombras (Shadows)

| Token de Elevación | Valor |
| :--- | :--- |
| `--co-shadow-1` | `0 1px 3px rgba(0,0,0,0.12)` |
| `--co-shadow-2` | `0 4px 16px rgba(0,0,0,0.18)` |
| `--co-shadow-modal` | `0 20px 60px rgba(0,0,0,0.45)` |

---

## 4. Bordes y Radios (Borders & Border-Radius)

* **Radio de Botón (`--apple-btn`):** `8px`
* **Radio de Tarjeta (`--apple-card`):** `16px`
* **Radio de Panel (`--apple-panel`):** `20px`
* **Grosor del Borde:** `1px` por defecto (`1.5px` o `2px` en planillas físicas)

---

## 5. Iconografía (Google Material Design)

El proyecto utiliza exclusivamente la librería **Google Material Design Icons (Outlined)** cargada remotamente.

* **Hoja de Estilos:** `https://fonts.googleapis.com/icon?family=Material+Icons+Outlined`
* **Clase Base:** `material-icons-outlined`
* **Implementación:** Administrada centralmente en el componente de átomos [AppleIcon.tsx](file:///c:/VS%20CODE/SHA256/src/components/atoms/AppleIcon.tsx) para mapear todos los nombres de iconos semánticos.
