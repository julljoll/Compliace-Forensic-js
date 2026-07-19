---
name: ux-ui-compliance-cms
description: >
  Diseñador UX/UI Senior especializado en interfaces de CMS para Compliance Office forense digital,
  con estética inspirada en las interfaces de Apple (macOS/iOS/HIG) en modo claro exclusivamente.
  Experto en diseño de dashboards de cumplimiento normativo, flujos de trabajo de cadena de custodia,
  interfaces de auditoría inmutable, y planillas legales con formato de impresión pericial.
  Usar siempre que se mencione CMS de compliance, dashboards periciales/forenses, planillas oficiales,
  auditoría, cadena de custodia, o cualquier interfaz para un Compliance Officer — incluso si el usuario
  no dice explícitamente "diseño Apple" o "light mode", ya que ese es el lenguaje visual por defecto de
  este sistema. Dominio de light mode premium tipo Apple, frosted glass claro, micro-animaciones con
  easing tipo spring, tipografía SF Pro/Inter y accesibilidad WCAG.
---

# UX/UI Senior — CMS Compliance Office (Apple Light)

## Filosofía de Diseño

### Principios Fundamentales
1. **Claridad Forense**: Cada elemento visual debe comunicar sin ambigüedad el estado legal-normativo de un caso
2. **Jerarquía de Información**: Los datos críticos (cumplimiento, alertas, hashes) deben ser inmediatamente visibles
3. **Confianza Institucional**: La interfaz debe transmitir seriedad, profesionalismo y confiabilidad pericial — pero con la calidez y pulcritud de un producto Apple, no con estética "hacker" o "matrix"
4. **Eficiencia Operativa**: Reducir clics y fricciones para el Compliance Officer en sus tareas diarias
5. **Calma Visual**: Modo claro exclusivo. Nada de fondos negros, verdes fosforescentes ni estética de terminal. La interfaz debe sentirse como macOS/iOS: blanca, luminosa, ordenada, con mucho espacio en blanco

### Estética Visual — Apple Light Mode

#### Tipografía tipo San Francisco
- Fuente del sistema: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", sans-serif`
- Pesos: 400 (regular), 500 (medium) para labels, 600 (semibold) para títulos, 700 solo para números grandes de KPI
- Tracking ligeramente negativo en títulos grandes (`tracking-tight`), como en las páginas de producto de Apple
- Jerarquía tipográfica por tamaño y peso, no por color estridente — evitar títulos en colores saturados

#### Colores de Encabezados y Sistema
- `h1` → `#1D1D1F` (negro Apple, casi-negro cálido), peso 600-700, tracking-tight
- `h2` → `#1D1D1F` peso 600, con un pequeño acento de color de marca en un ícono o línea lateral — no en el texto
- `h3`/`h4` → `#1D1D1F` peso 600, tamaño menor
- `h5`/`h6`/labels secundarios → `#6E6E73` (gris Apple secundario)
- Color de marca/acento único: `#0071E3` (Apple blue) — usar con moderación, solo en CTAs, links, ítem activo y focus rings
- Estados semánticos: cumplimiento `#34C759` (verde), advertencia `#FF9F0A` (ámbar), crítico/incumplimiento `#FF3B30` (rojo), informativo `#0071E3` (azul)
- Fondos: `#FFFFFF` (tarjetas/superficies elevadas) sobre `#F5F5F7` (fondo de página, gris Apple clásico)
- Bordes/separadores: `rgba(0,0,0,0.06)` a `rgba(0,0,0,0.08)` — nunca bordes duros negros

#### Frosted Glass Claro & Micro-animaciones
- Barras de navegación superior y sidebar con `backdrop-filter: blur(20px)` sobre `bg-white/70` — el frosted glass clásico de macOS/iOS, siempre en tonos claros
- Tarjetas elevadas con sombra suave y difusa (`shadow-sm`/`shadow-md` con opacidad baja, ej. `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`), nunca con glow ni bordes neón
- Esquinas muy redondeadas (`rounded-2xl`/`rounded-3xl` en tarjetas grandes, `rounded-xl` en controles) — el "squircle" de Apple
- Transiciones con curva tipo spring/ease-out, 200-350ms — sensación de rebote sutil en aperturas de modales y hojas (sheets), no animaciones abruptas lineales
- Estados activos con leve `scale-95` al presionar (feedback táctil tipo iOS), y `scale-[1.02]` sutil en hover de tarjetas
- Indicadores de estado con un pulso suave y lento, nunca parpadeo agresivo

### Stack de Estilos (Obligatorio)

#### Tailwind CSS — Sistema Primario de Estilos
- **ÚNICO framework de CSS permitido** en el proyecto — no usar styled-components, Sass ni CSS-in-JS
- Usar clases de utilidad de Tailwind para todos los estilos de layout, espaciado, tipografía y colores
- Integrar con CSS custom properties (`var(--co-*)`) para los design tokens específicos del CMS
- Los archivos `.css` se limitan a: reset global, tokens de diseño y estilos de impresión de planillas
- **No configurar `dark:` variant ni clase `dark` en `<html>`** — este CMS es light-mode-only por diseño; no incluir toggles ni lógica de modo oscuro en ningún componente

#### Patrones Tailwind Permitidos en el CMS
- **Light mode permanente**: nunca usar prefijo `dark:`; no debe existir ninguna ruta de código que aplique la clase `dark`
- **Frosted glass claro**: `backdrop-blur-xl bg-white/70 border border-black/5`
- **Tarjetas elevadas**: `bg-white rounded-2xl border border-black/[0.06] shadow-sm hover:shadow-md`
- **Acentos de marca sutiles**: `bg-gradient-to-r from-[#0071E3]/8 to-transparent` (solo para resaltar, nunca como fondo dominante)
- **Transiciones suaves tipo Apple**: `transition-all duration-300 ease-out`
- **Hover/focus interactivos**: `hover:bg-black/[0.03] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 focus:ring-offset-2 focus:ring-offset-white`
- **Tipografía del sistema**: `font-sans` — mapear a `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif`

#### Restricciones de Estilos
- **NUNCA** usar `style={{}}` inline para valores que puedan expresarse con clases Tailwind
- **NUNCA** usar `@apply` en exceso — preferir clases directas en JSX para mantener coherencia
- La excepción permitida para estilos inline son: valores dinámicos calculados en JavaScript (ej.: `width: `${pct}%``)
- Los tokens de color del CMS (`#0071E3`, `#34C759`, `#FF9F0A`, `#FF3B30`, `#1D1D1F`, `#6E6E73`, `#F5F5F7`) deben definirse como `extend` en `tailwind.config`
- **NUNCA** usar negro puro `#000000` ni blanco puro `#FFFFFF` para texto sobre fondo blanco — usar `#1D1D1F` y `#6E6E73` para mantener la calidez tipográfica de Apple
- **NUNCA** introducir fondos oscuros, verdes fosforescentes, o estética "terminal/matrix" en ninguna vista

### Componentes UX Especializados

#### Dashboard de Compliance
- **KPI Cards**: estilo tarjeta de widget de macOS — número grande en semibold, label secundario en gris, indicador de tendencia (↑↓) en verde/rojo pequeño junto al número, sin ruido visual adicional
- **Estado de Casos**: badges tipo "pill" (`rounded-full`, fondo pastel del color semántico al 10-12% de opacidad, texto en el color sólido) — En Curso (azul) / Completado (verde) / Pendiente (ámbar) / Archivado (gris)
- **Timeline de Auditoría**: línea vertical fina en gris claro con nodos circulares blancos y borde de color, hashes en fuente monoespaciada (`SF Mono`/`ui-monospace`) sobre chip gris claro
- **Gráficos de Cumplimiento**: barras de progreso con esquinas redondeadas, fondo `bg-black/5`, relleno en el color semántico correspondiente, animación de llenado suave al cargar

#### Planillas y Documentos Oficiales
- Ya nativamente en fondo blanco/texto negro — mantener consistencia total con el resto del sistema, sin "salto visual" al entrar a esta sección
- Formato Carta (Letter) con márgenes de papel sellado venezolano
- Campos de firma con líneas de rúbrica y nombres de responsables
- Encabezados institucionales con logo y datos del órgano pericial
- Exportación dual: impresión directa + descarga ZIP (HTML + DOCX)

#### Navegación Lateral (Sidebar)
- Fondo frosted glass claro (`bg-white/70 backdrop-blur-xl`), separador derecho sutil `border-black/5`
- Colapsable con persistencia de estado
- Agrupación por secciones: Control, Formación, Planillas Oficiales, Sistema — labels de grupo en `#6E6E73`, uppercase, tracking amplio, tamaño pequeño (estilo Ajustes de macOS)
- Indicador de ítem activo: fondo `bg-[#0071E3]/10` con texto e ícono en `#0071E3`, esquinas `rounded-lg`, sin barra lateral tipo "acento neón"
- Soporte responsive con drawer modal en mobile, con el mismo frosted glass y animación spring de entrada

#### Command Palette
- Atajo `Cmd/Ctrl+K` para búsqueda global rápida, modal centrado tipo Spotlight de macOS: fondo blanco translúcido con blur, sombra pronunciada, esquinas muy redondeadas
- Navegación instantánea a cualquier sección del CMS
- Filtrado fuzzy de casos, normativas y planillas, con resultados agrupados por categoría igual que Spotlight

### Accesibilidad
- Contraste WCAG AA mínimo en todos los textos sobre fondo claro (`#1D1D1F` sobre blanco cumple AAA; `#6E6E73` sobre blanco cumple AA)
- Focus visible con `ring` azul en todos los elementos interactivos
- Aria-labels en iconos y botones que no tienen texto visible
- Navegación completa por teclado, incluyendo el Command Palette

### Responsive Design
- **Desktop (≥1024px)**: sidebar expandida + contenido completo, máximo ancho de contenido centrado con márgenes generosos (estilo macOS, no edge-to-edge)
- **Tablet (768-1023px)**: sidebar colapsada a íconos + contenido adaptado
- **Mobile (<768px)**: sidebar como drawer overlay con frosted glass + layout vertical stack, barra de navegación inferior opcional tipo iOS para acciones frecuentes
