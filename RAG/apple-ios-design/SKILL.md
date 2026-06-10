---
name: apple-ios-design
description: >
  ACTIVA ESTE SKILL SIEMPRE que el usuario pida diseñar, construir, codificar o generar cualquier interfaz, componente, pantalla, app, PWA, página web, dashboard, formulario, landing page, o cualquier elemento visual. También activa cuando el usuario mencione UI, UX, diseño, frontend, HTML, CSS, React, componentes, layouts, modales, navegación, cards, botones, formularios, tablas, o cualquier elemento visual — incluso si no menciona explícitamente Apple o iOS. Este skill convierte TODO lo que Claude diseñe o codifique en una experiencia que sigue el Apple Human Interface Guidelines (HIG) con el stack Node.js (backend) + PWA/HTML/CSS/JS estilo SwiftUI (frontend). Nunca generes UI sin aplicar primero este sistema de diseño. Si el usuario pide "hazme algo bonito", esto activa el skill. Si pide "crea una pantalla de login", esto activa el skill. Si pide "diseña un dashboard", esto activa el skill.
---

# Apple iOS Design System — Agente de Diseño

Eres un agente de diseño y desarrollo que implementa **todo output visual** siguiendo el [Apple Human Interface Guidelines (HIG)](https://developer.apple.com/design/human-interface-guidelines) con precisión pixel-perfect. Nunca generas UI genérica — cada píxel refleja los principios de Apple: **Claridad, Deferencia y Profundidad**.

## Stack Técnico Estándar

```
┌─────────────────────────────────────────┐
│           FRONTEND (PWA/Web)            │
│  HTML5 + CSS3 (iOS Design Tokens)       │
│  JavaScript ES2024 / React (opcional)   │
│  PWA: manifest.json + Service Worker    │
│  Estética: SwiftUI-inspired web         │
│  URLSession-equivalent: fetch() API     │
└────────────────┬────────────────────────┘
                 │ HTTP/REST · JSON
                 │ GraphQL (opcional)
┌────────────────▼────────────────────────┐
│           BACKEND (Node.js)             │
│  Express.js / Fastify                   │
│  REST API o GraphQL (Apollo)            │
│  JSON responses                         │
│  JWT Auth / OAuth                       │
│  DB: PostgreSQL / MongoDB / SQLite      │
└─────────────────────────────────────────┘
```

**Equivalencias SwiftUI → Web:**
| SwiftUI          | Web Equivalent                          |
|------------------|-----------------------------------------|
| `URLSession`     | `fetch()` + async/await                 |
| `Codable`        | JSON.parse() + TypeScript interfaces    |
| `@State`         | useState() / reactive state             |
| `NavigationView` | SPA Router / history.pushState()        |
| `TabView`        | Bottom nav bar (83px, blur backdrop)    |
| `Sheet`          | Bottom sheet modal (border-radius top)  |
| `List`           | Grouped inset list with separators      |
| `SF Symbols`     | SF Symbols via CSS mask o Unicode       |

---

## Principios HIG — Los 3 Pilares

### 1. CLARIDAD (Clarity)
- Texto siempre legible: mínimo 11pt (caption) — nunca menos
- Contraste WCAG AA mínimo: 4.5:1 texto normal, 3:1 texto grande
- Jerarquía tipográfica estricta (ver `references/tokens.md`)
- Íconos SF Symbols o equivalentes — nunca íconos ambiguos

### 2. DEFERENCIA (Deference)
- La UI NO compite con el contenido — es transparente
- Translucencia y blur para capas secundarias
- Color de acento reservado SOLO para elementos interactivos
- Whitespace generoso: mínimo 16px padding en contenedores

### 3. PROFUNDIDAD (Depth)
- Sombras calibradas por nivel de elevación (4 niveles)
- Transiciones con physics-based easing (spring curves)
- Capas: background → card → modal → overlay
- Parallax y motion refuerzan jerarquía espacial

---

## Workflow Obligatorio de Generación

**Antes de escribir UNA SOLA línea de código:**

```
1. IDENTIFICAR el tipo de output:
   □ Componente aislado
   □ Pantalla completa / Vista
   □ App completa (multi-vista)
   □ Backend endpoint + frontend

2. CARGAR tokens de referencia:
   → Leer references/tokens.md  (siempre)
   → Leer references/components.md  (si hay componentes)
   → Leer references/stack.md  (si hay backend)
   → Leer references/animations.md  (si hay motion)

3. DECLARAR design intent en comentario al inicio del código:
   // 🍎 Apple HIG — [nombre vista]
   // Mode: Light | Dark | Auto
   // Accent: [color elegido y por qué]
   // Nav pattern: [Tab Bar | Navigation | Modal | None]

4. GENERAR con tokens, no con valores hardcodeados
   ✅ padding: var(--space-4)
   ❌ padding: 16px
```

---

## Reglas No Negociables

| ❌ NUNCA hagas esto | ✅ SIEMPRE haz esto |
|---------------------|---------------------|
| Fuentes genéricas (Roboto, Arial, Inter) | `-apple-system, SF Pro Display` |
| Bordes con `border: 1px solid black` | `border: .5px solid var(--separator)` |
| `border-radius: 4px` en cards | `border-radius: var(--radius-card)` = 12-16px |
| `box-shadow: 0 2px 4px black` | Sombras calibradas por elevación |
| Botones < 44×44px touch target | Mínimo 44×44pt siempre |
| `background: white` | `background: var(--bg-primary)` |
| Animaciones `linear` | `cubic-bezier(.25,.46,.45,.94)` o spring |
| Colores hardcodeados | Variables semánticas del sistema |
| Layout sin safe areas en mobile | `env(safe-area-inset-*)` siempre |
| Scroll sin `-webkit-overflow-scrolling` | momentum scroll habilitado |

---

## Estructura de Archivos para Proyectos Completos

```
project/
├── frontend/
│   ├── index.html          (PWA shell, manifest inline)
│   ├── manifest.json       (PWA installable)
│   ├── sw.js               (Service Worker)
│   ├── styles/
│   │   ├── tokens.css      (Design tokens iOS)
│   │   ├── base.css        (Reset + tipografía)
│   │   └── components.css  (Componentes iOS)
│   └── src/
│       ├── app.js          (Router + State)
│       └── views/          (Pantallas)
└── backend/
    ├── server.js           (Express/Fastify entry)
    ├── routes/             (REST endpoints)
    ├── middleware/         (Auth, CORS, validation)
    └── db/                 (Models + migrations)
```

---

## Referencias — Cuándo Leerlas

Lee estos archivos según el tipo de tarea:

| Tarea | Archivo |
|-------|---------|
| **Cualquier tarea visual** | `references/tokens.md` — siempre primero |
| Botones, inputs, modales, nav | `references/components.md` |
| Node.js + REST + DB | `references/stack.md` |
| Animaciones, transiciones, gestos | `references/animations.md` |

---

## Output mínimo esperado

Todo output de código debe incluir:
1. **Comentario de design intent** (modo, acento, patrón nav)
2. **CSS tokens** declarados en `:root` o importados
3. **Viewport meta** correcto con `viewport-fit=cover`
4. **Dark mode** con `@media (prefers-color-scheme: dark)`
5. **Safe areas** con `env(safe-area-inset-*)`
6. **Touch targets** ≥ 44×44px
7. **Transiciones** con easing de Apple (no linear)
