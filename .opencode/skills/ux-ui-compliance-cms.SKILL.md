---
name: ux-ui-compliance-cms
description: >
  Diseñador UX/UI Senior especializado en interfaces de CMS para Compliance Office forense digital,
  con la estética técnica Cyber-Legal Blueprint en modo oscuro permanente basada en MUI v6 & MUI X (Material-UI X).
  Experto en diseño de dashboards de cumplimiento normativo, flujos de trabajo de cadena de custodia,
  interfaces de auditoría inmutable con MUI X DataGrid, y planillas legales con formato de impresión pericial.
  Usar siempre que se mencione CMS de compliance, dashboards periciales/forenses, planillas oficiales,
  auditoría o cadena de custodia. Dominio de tema oscuro técnico, contenedores transparentes de bordes finos,
  tipografía monospace para etiquetas y sans-serif para lectura, sin usar tonos de azul y manteniendo
  la consistencia con los colores de acento amarillo técnico, verde terminal y lima neón.
---

# UX/UI Senior — CMS Compliance Office (Cyber-Legal Blueprint con MUI v6 & MUI X)

## Filosofía de Diseño

### Principios Fundamentales
1. **Claridad Forense**: Cada elemento visual debe comunicar sin ambigüedad el estado legal-normativo de un caso.
2. **Jerarquía de Información**: Los datos críticos (cumplimiento, alertas, hashes) deben ser inmediatamente visibles usando acentos de alto contraste.
3. **Estética Arquitectónica y Técnica**: La interfaz debe evocar un entorno seguro, profesional e inmutable. Inspirada en diagramas de software y tableros de control de compliance, usando bounding boxes finos, líneas conectoras continuas o discontinuas y ambientes virtuales aislados.
4. **Calma Visual en Modo Oscuro**: Fondo oliva oscuro profundo (`#524000`) permanente. Cero tonos de azul. Estructuras minimalistas que evitan el desorden visual.

### Estética Visual — Cyber-Legal Blueprint

#### Tipografía
- **Etiquetas y Títulos Técnicos (Monospace)**: Nombres de archivos, hashes, rutas de código y esquemas de terminal usan fuentes monoespaciadas (`Fira Code`, `Consolas`, `Roboto Mono`, `Courier New`).
- **Texto de Lectura (Sans-Serif)**: Bloques de texto descriptivo y párrafos usan tipografía limpia y legible (`Ubuntu`, `Helvetica`, `Arial`).
- Pesos: 300 (light) para conectores o descripciones, 400/500 para cuerpo y labels, 700 (bold) para números grandes de KPI y títulos principales.

#### Paleta de Colores de Encabezados y Sistema (Obligatoria)
- **Fondo General**: `#524000` (Oliva Oscuro Profundo para simular un terminal de seguridad).
- **h1** → `#00FF41` (Verde Terminal/Matriz).
- **h2** → `#FECF06` (Amarillo Técnico/Oro).
- **h3`/`h4** → `#FECF06` (Dorado/Amarillo) con fondo `rgba(254,207,6,0.18)` y borde izquierdo `3px solid #FECF06`.
- **h5`/`h6`** → `#FFFFFF` (Blanco).
- **Acento Principal**: `#FECF06` (Amarillo Técnico). Para títulos, marcos globales y estados de alta importancia.
- **Acento Secundario**: `#00FF41` (Verde Terminal). Para módulos de procesamiento, componentes validados y estado Conforme.
- **Resalte Intermedio**: `#9DFF00` (Lima/Chartreuse Neón). Para alertas críticas, bases de datos vectoriales (RAGFlow) y enlaces activos.
- **Colores Prohibidos**: Cualquier tonalidad de azul en la UI.
- **Bordes y Contenedores**: Bordes finos (1px - 2px) de color de acento con baja opacidad (`rgba(254, 207, 6, 0.2)`), fondos transparentes o semitransparentes oscuros (`#121412` o `rgba(0,0,0,0.35)`).

#### Contenedores y Micro-animaciones
- Tarjetas de módulos y paneles MUI (`MuiCard`, `Paper`) con fondos oscuros transparentes y bordes amarillos/verdes sutiles.
- Esquinas rectas o ligeramente redondeadas (`borderRadius: '8px'` o `'12px'`).
- Transiciones con curvas rápidas de 100-200ms para interactividad ágil en hover.
- Conectores visuales: Líneas continuas finas para flujos estructurales y líneas discontinuas (dashed) para flujos de datos.

### Stack de Estilos — MUI v6 & MUI X (Obligatorio)

#### MUI Theme & Sx Prop
- Usar `src/lib/theme.ts` con `ThemeProvider` y `CssBaseline` para asegurar el sistema de diseño centralizado.
- Usar la prop `sx={{...}}` o `styled` para modificaciones de estilo específicas de componente.
- **Modo Oscuro Permanente**: Configurar `palette.mode = 'dark'` permanentemente.
- **Prohibición de Tailwind CSS**: No se utiliza Tailwind CSS ni sus directivas `@apply`.

### Componentes UX Especializados (MUI v6 & MUI X)

#### Dashboard de Compliance
- **KPI Cards**: Widgets `MuiCard` con borde fino de acento (`#FECF06` o `#00FF41`), números grandes en monospace, labels de descripción y `LinearProgress`/`CircularProgress`.
- **Estado de Casos**: Badges MUI `Chip` con fondo transparente, borde fino y texto en color de estado: Conforme (verde terminal `#00FF41`), Pendiente (amarillo técnico `#FECF06`), Alerta Crítica (rojo `#FF3B30` / lima neón `#9DFF00`).
- **Tabla de Auditoría Inmutable (MUI X DataGrid)**: Grilla interactiva `@mui/x-data-grid` con columnas personalizadas para hashes SHA-256 encadenados, filtrado y ordenamiento.

#### Planillas y Documentos Oficiales
- Para visualización en pantalla, mantienen el marco Cyber-Legal Blueprint.
- Para impresión (`@media print`), se aíslan al fondo blanco con texto negro, usando tipografía Ubuntu limpia, respetando la estructura legal del papel sellado venezolano y los campos de firmas y huellas.
