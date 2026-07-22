# SHA256.US — Compliance Officer CMS Forense Digital
# Workspace Customization Rules (Project-Scoped)

## Reglas de Diseño Visual (Obligatorias en este Proyecto)

### Paleta de Colores Definitiva (Design System v3)
| Token | Valor | Uso |
|-------|-------|-----|
| `background.default` | `#0D1117` | Fondo área de contenido (main) |
| `background.paper` | `#161B22` | Cards, Paper, Modals |
| `sidebar.bg` | `#0D1117` | Sidebar y drawers |
| `header.bg` | `rgba(13,17,23,0.95)` | Header del CMS |
| `border.default` | `rgba(48,54,61,0.8)` | Bordes neutros |
| `primary` | `#FECF06` | Acento amarillo técnico |
| `secondary` | `#00FF41` | Verde terminal Matrix |
| `accent.lime` | `#9DFF00` | Alertas críticas, links activos |
| `text.primary` | `#E6EDF3` | Texto principal |
| `text.secondary` | `#8B949E` | Texto secundario / labels |

> **PROHIBIDO**: Cualquier tonalidad de azul en la UI del CMS.
> **PROHIBIDO**: El fondo `#524000` en el área de contenido (main). Solo se usa como color de acento del sidebar brand / logo.

### Sidebar Width
- Desktop: `256px`
- Mobile Drawer: `270px`

### Componentes Validados y Aprobados (No re-inventar)
- **SidebarLink**: `CMSLayout.tsx` — Link con estado activo en `#FECF06` y `borderLeft: 3px solid #FECF06`
- **KPI Bar**: Mini grid 2 columnas en la parte inferior del sidebar
- **StatusDot**: `atoms/StatusDot.tsx` — indicador de estado SQLite
- **CommandPalette**: `organisms/CommandPalette.tsx` — buscador global (⌘K)

### Tipografía
- **UI General**: `Ubuntu` (sans-serif)
- **Hashes, IDs, Tags técnicas**: `Fira Code`, `Consolas`, `monospace`
- **Planillas PDF**: `Helvetica` (React-PDF) / `Times New Roman` (HTML print)

---

## Normativas RAG — Checklist de Merge antes de Build

Antes de hacer commit o `npm run build` de un feature relacionado con flujos forenses, verificar:
- [ ] El proceso hace referencia a al menos 1 normativa del directorio `normativas_rag/`
- [ ] Las planillas usan márgenes Folio/Oficio (216mm x 330mm), margen izquierdo 3cm (encuadernación)
- [ ] El footer oficial de 2 líneas en 8pt está presente en todas las hojas
- [ ] El encabezado institucional solo aparece en la Hoja 1
- [ ] Los recuadros dactilares (Firma, Pulgar Izq, Pulgar Der) están verticales con altura mínima 60pt

---

## Software Forense Oficial del Proyecto
| Herramienta | Uso | Referencia |
|-------------|-----|------------|
| IPED Forensics v4.1 | Extracción forense masiva | Policía Federal de Brasil / INTERPOL |
| PhotoHolmes Python Engine | Análisis ELA de imágenes | github.com/photoholmes/photoholmes |
| PyOgg Audio Engine | Decodificación Opus WhatsApp | github.com/TeamPyOgg/PyOgg |
| FTK Imager v4.7 | Adquisición forense de disco | AccessData |

---

## Reglas de Código (TypeScript Estricto)

1. **Nunca usar `any` explícito** en nuevos componentes; usar `unknown` o tipos definidos.
2. **Zustand stores**: `useCMSStore`, `useAuthStore`, `useAuditStore` — no crear stores adicionales sin documentar.
3. **Importaciones MUI**: siempre importar desde sub-paths (`@mui/material/Box`, no `@mui/material`).
4. **SVG en React-PDF**: Los `<Text>` dentro de `<Svg>` deben usar `style={{ fontSize, color }}`, no atributos SVG directos.
5. **No usar Tailwind CSS** en ningún componente.

---

## Comandos de Referencia
```bash
npm run dev          # Desarrollo local http://localhost:3000
npm run build        # Verificar 0 errores TypeScript antes de entregar
npm run update-agent # Sincronizar metadatos del agente después de cambios significativos
npm run lint         # Verificar 0 warnings ESLint
```
