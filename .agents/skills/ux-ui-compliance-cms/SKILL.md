---
name: ux-ui-compliance-cms
description: >
  Diseñador UX/UI Senior especializado en interfaces de CMS para Compliance Office forense digital.
  Experto en diseño de dashboards de cumplimiento normativo, flujos de trabajo de cadena de custodia,
  interfaces de auditoría inmutable, y planillas legales con formato de impresión pericial.
  Dominio de dark mode premium, glassmorphism, micro-animaciones y accesibilidad WCAG.
---

# UX/UI Senior — CMS Compliance Office

## Filosofía de Diseño

### Principios Fundamentales
1. **Claridad Forense**: Cada elemento visual debe comunicar sin ambigüedad el estado legal-normativo de un caso
2. **Jerarquía de Información**: Los datos críticos (cumplimiento, alertas, hashes) deben ser inmediatamente visibles
3. **Confianza Institucional**: La interfaz debe transmitir seriedad, profesionalismo y confiabilidad pericial
4. **Eficiencia Operativa**: Reducir clics y fricciones para el Compliance Officer en sus tareas diarias

### Estética Visual

#### Dark Mode Permanente
- Fondo base: `#000000` (negro absoluto)
- Superficies: escala progresiva `#1C1C1E` → `#2C2C2E` → `#3A3A3C`
- Separadores: `rgba(255,255,255,0.1)` — sutiles, no invasivos
- Acentos cromáticos con función semántica (verde = conforme, rojo = crítico, naranja = pendiente)

#### Tipografía Pericial
- Fuente monoespaciada `Courier New` en toda la interfaz
- Evoca documentos periciales, terminales forenses y reportes técnicos
- Tamaños jerárquicos definidos en design_tokens.md

#### Colores de Encabezados
- `h1` → `#00FF41` (Verde Matriz): impacto visual inmediato, marca identitaria
- `h2` → `#FECF06` (Oro): secciones principales, guía visual del usuario
- `h3`/`h4` → `#524000` con fondo semitransparente amarillo: subdivisiones con alto contraste
- `h5`/`h6` → `#FFFFFF`: texto neutral para detalles menores

#### Glassmorphism & Micro-animaciones
- Tarjetas con `backdrop-filter: blur` y bordes sutiles `rgba(255,255,255,0.08)`
- Transiciones suaves de 200-300ms en hover, focus y cambios de estado
- Animaciones de entrada `fade-in` y `slide-up` para carga progresiva de contenido
- Efecto de pulsación sutil en indicadores de estado activo

### Stack de Estilos (Obligatorio)

#### Tailwind CSS — Sistema Primario de Estilos
- **ÚNICO framework de CSS permitido** en el proyecto — no usar styled-components, Sass ni CSS-in-JS
- Usar clases de utilidad de Tailwind para todos los estilos de layout, espaciado, tipografía y colores
- Integrar con CSS custom properties (`var(--co-*)`) para los design tokens específicos del CMS
- Los archivos `.css` se limitan a: reset global, tokens de diseño y estilos de impresión de planillas

#### Patrones Tailwind Permitidos en el CMS
- **Dark mode permanente**: usar `dark:` prefix; la clase `dark` siempre está activa en `<html>`
- **Glassmorphism**: `backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl`
- **Gradientes corporativos**: `bg-gradient-to-r from-[#00FF41]/10 to-transparent`
- **Transiciones suaves**: `transition-all duration-200 ease-in-out`
- **Hover/focus interactivos**: `hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#00FF41]/50`
- **Tipografía monoespaciada**: `font-mono` — siempre mapear a `'Courier New', Courier, monospace`

#### Restricciones de Estilos
- **NUNCA** usar `style={{}}` inline para valores que puedan expresarse con clases Tailwind
- **NUNCA** usar `@apply` en exceso — preferir clases directas en JSX para mantener coherencia
- La excepción permitida para estilos inline son: valores dinámicos calculados en JavaScript (ej.: `width: `${pct}%``)
- Los tokens de color del CMS (`#00FF41`, `#FECF06`, `#524000`) deben definirse como `extend` en `tailwind.config`

### Componentes UX Especializados

#### Dashboard de Compliance
- **KPI Cards**: métricas grandes con indicador de tendencia (↑↓)
- **Estado de Casos**: badges cromáticos (En Curso / Completado / Pendiente / Archivado)
- **Timeline de Auditoría**: flujo cronológico con hashes visibles y verificables
- **Gráficos de Cumplimiento**: barras de progreso normativo por etapa forense

#### Planillas y Documentos Oficiales
- Diseño aislado del dark mode para impresión: fondo blanco, texto negro, bordes nítidos
- Formato Carta (Letter) con márgenes de papel sellado venezolano
- Campos de firma con líneas de rúbrica y nombres de responsables
- Encabezados institucionales con logo y datos del órgano pericial
- Exportación dual: impresión directa + descarga ZIP (HTML + DOCX)

#### Navegación Lateral (Sidebar)
- Colapsable con persistencia de estado
- Agrupación por secciones: Control, Formación, Planillas Oficiales, Sistema
- Indicador de ítem activo con barra lateral accent
- Soporte responsive con drawer modal en mobile

#### Command Palette
- Atajo `Ctrl+K` para búsqueda global rápida
- Navegación instantánea a cualquier sección del CMS
- Filtrado fuzzy de casos, normativas y planillas

### Accesibilidad
- Contraste WCAG AA mínimo en todos los textos sobre fondos oscuros
- Focus visible con outline en todos los elementos interactivos
- Aria-labels en iconos y botones que no tienen texto visible
- Navegación completa por teclado

### Responsive Design
- **Desktop (≥1024px)**: sidebar expandida + contenido completo
- **Tablet (768-1023px)**: sidebar colapsada + contenido adaptado
- **Mobile (<768px)**: sidebar como drawer overlay + layout vertical stack
