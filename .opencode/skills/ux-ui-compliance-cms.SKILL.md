---
name: ux-ui-compliance-cms
description: >
  Diseñador UX/UI Senior e Ingeniero Frontend Experto especializado en la creación de interfaces web
  con componentes nativos de MUI v6 & MUI X (Material-UI X) para plataformas de Compliance Office forense digital.
  Dominio absoluto de la estética técnica Cyber-Legal Blueprint en modo oscuro permanente (#524000), sistema de temas centralizado
  (src/lib/theme.ts), la prop `sx={{...}}`, layout con Box/Stack/Grid, componentes de datos complejos (MUI X DataGrid),
  controles e indicadores de estado, y planillas legales en formato Folio/Oficio (216mm x 330mm) con impresion limpia.
  Usar siempre que se diseñen o implementen componentes visuales, dashboards, planillas u organigramas de cumplimiento normativo.
---

# UX/UI Senior & MUI v6 Expert — CMS Compliance Office (Cyber-Legal Blueprint)

## Filosofía de Diseño y Maestría en MUI v6 / MUI X

### Principios Fundamentales
1. **Claridad Forense**: Cada elemento visual debe comunicar sin ambigüedad el estado legal-normativo de un caso.
2. **Jerarquía de Información**: Los datos críticos (cumplimiento, alertas, hashes) son inmediatamente visibles usando acentos de alto contraste sobre MUI Cards y Papers.
3. **Estética Arquitectónica y Técnica**: La interfaz evoca un entorno seguro, profesional e inmutable. Inspirada en diagramas de software y tableros de control de compliance, usando bounding boxes finos, líneas conectoras continuas o discontinuas y ambientes virtuales aislados.
4. **Calma Visual en Modo Oscuro**: Fondo oliva oscuro profundo (`#524000`) permanente. Cero tonos de azul. Estructuras minimalistas con MUI v6 que evitan el desorden visual.

---

## Estética Visual — Cyber-Legal Blueprint

### Tipografía Dual (Sistema MUI Typography)
- **Etiquetas y Títulos Técnicos (Monospace)**: Nombres de archivos, hashes SHA-256, rutas de código y esquemas de terminal usan fuentes monoespaciadas (`Fira Code`, `Consolas`, `Roboto Mono`).
- **Texto de Lectura (Sans-Serif)**: Bloques de texto descriptivo y párrafos usan tipografía limpia y legible (`Ubuntu`, `sans-serif`).
- Pesos: `300` (light) para conectores, `400`/`500` para cuerpo y labels, `700` (bold) para números grandes de KPI y títulos principales.

### Paleta de Colores de Encabezados y Sistema (Obligatoria)
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

---

## Guía de Implementación Experta con MUI v6 & MUI X

### 1. Sistema de Temas (`src/lib/theme.ts`)
- Todas las vistas de la aplicación se construyen sobre el `ThemeProvider` de MUI v6 en `src/lib/theme.ts`.
- Las personalizaciones de componentes deben aprovechar el tema global o aplicarse mediante la prop `sx={{...}}`.

```tsx
// Ejemplo de tarjeta técnica en MUI v6
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export function ComponenteTecnico({ titulo, estado }: { titulo: string; estado: string }) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 2.5,
        backgroundColor: 'rgba(18, 20, 18, 0.85)',
        border: '1px solid rgba(254, 207, 6, 0.25)',
        borderRadius: '10px',
        backdropFilter: 'blur(8px)',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
        '&:hover': {
          borderColor: '#FECF06',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: '#FECF06', fontFamily: 'Ubuntu, sans-serif' }}>
          {titulo}
        </Typography>
        <Chip
          label={estado}
          size="small"
          sx={{
            backgroundColor: 'rgba(0, 255, 65, 0.15)',
            color: '#00FF41',
            border: '1px solid rgba(0, 255, 65, 0.3)',
            fontWeight: 700,
            fontSize: '11px',
          }}
        />
      </Box>
    </Paper>
  );
}
```

---

### 2. Uso de MUI X DataGrid (`@mui/x-data-grid`)
- Las tablas de auditoría, expedientes y trazabilidad inmutable SHA-256 utilizan **MUI X DataGrid**.
- Configuración estricta con renderizadores de celdas monoespaciados para hashes criptográficos:

```tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const columns: GridColDef[] = [
  { field: 'timestamp', headerName: 'FECHA / HORA', width: 180 },
  { field: 'usuario', headerName: 'PERITO RESPONSABLE', width: 200 },
  { field: 'accion', headerName: 'ACCIÓN REGISTRADA', width: 180 },
  {
    field: 'hashActual',
    headerName: 'HASH SHA-256 (INMUTABLE)',
    flex: 1,
    renderCell: (params) => (
      <Box sx={{ fontFamily: 'Fira Code, monospace', fontSize: '11px', color: '#00FF41' }}>
        {params.value}
      </Box>
    ),
  },
];
```

---

### 3. Planillas e Impresión en Tamaña Folio / Oficio (`216mm x 330mm`)
- Las planillas imprimibles oficiales utilizan el selector `.planilla-container` con isolación visual:
- En pantalla, se presenta sobre el fondo oscuro `#524000` en formato tarjetero.
- Al imprimir (`@media print`), se resetean todos los contenedores a blanco puro `#ffffff` con márgenes exactos:
  - `@page { size: 216mm 330mm; margin: 0; }`
  - `.planilla-container .page`: `width: 216mm !important; min-height: 330mm !important; padding: 20mm 15mm 20mm 38mm !important;`
  - `page-break-after: always !important;` en cada hoja.
  - Ocultamiento total de corchetes de placeholder (`.placeholder-field`) y elementos con la clase `.no-print`.
  - Botón de acción único MUI v6 al final de la página con la clase `.no-print`.

---

## Prohibiciones Estrictas
- **NUNCA usar Tailwind CSS**: Todas las clases utilitarias de Tailwind fueron eliminadas.
- **NUNCA usar tonos de azul**: Todo azul está vetado de la interfaz visual del CMS.
- **NUNCA romper la estructura de dark mode**: El tema de la app es permanente dark mode `#524000`.
- **NUNCA modificar las planillas imprimibles fuera de las reglas `@media print`** prescritas.
