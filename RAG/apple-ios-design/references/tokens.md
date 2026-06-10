# iOS Design Tokens — Referencia Completa

Copia este bloque CSS en todo proyecto. Es la fuente de verdad del sistema.

## CSS Variables — Sistema Completo

```css
/* ============================================================
   🍎 APPLE iOS DESIGN TOKENS — v2025
   Basado en Apple Human Interface Guidelines
   https://developer.apple.com/design/human-interface-guidelines
   ============================================================ */

:root {
  /* ─── TIPOGRAFÍA ─────────────────────────────────────────── */
  /* SF Pro es el sistema de fuentes de iOS — en web usamos el
     stack system-ui que en Apple devices renderiza SF Pro */
  --font-display: -apple-system, "SF Pro Display", BlinkMacSystemFont,
                  "Helvetica Neue", sans-serif;
  --font-text:    -apple-system, "SF Pro Text", BlinkMacSystemFont,
                  "Helvetica Neue", sans-serif;
  --font-rounded: -apple-system, "SF Pro Rounded", BlinkMacSystemFont,
                  "Helvetica Neue", sans-serif;
  --font-mono:    "SF Mono", "Fira Code", "Cascadia Code", monospace;

  /* Escala tipográfica iOS (pt → px ≈ 1:1 en 1x) */
  --text-large-title:  34px; --weight-large-title:  700; --line-large-title:  41px;
  --text-title-1:      28px; --weight-title-1:      700; --line-title-1:      34px;
  --text-title-2:      22px; --weight-title-2:      700; --line-title-2:      28px;
  --text-title-3:      20px; --weight-title-3:      600; --line-title-3:      25px;
  --text-headline:     17px; --weight-headline:     600; --line-headline:     22px;
  --text-body:         17px; --weight-body:         400; --line-body:         22px;
  --text-callout:      16px; --weight-callout:      400; --line-callout:      21px;
  --text-subheadline:  15px; --weight-subheadline:  400; --line-subheadline:  20px;
  --text-footnote:     13px; --weight-footnote:     400; --line-footnote:     18px;
  --text-caption-1:    12px; --weight-caption-1:    400; --line-caption-1:    16px;
  --text-caption-2:    11px; --weight-caption-2:    400; --line-caption-2:    13px;

  /* ─── COLORES — MODO CLARO ──────────────────────────────── */
  /* Labels (texto) */
  --label-primary:            rgba(0, 0, 0, 1.00);
  --label-secondary:          rgba(60, 60, 67, 0.60);
  --label-tertiary:           rgba(60, 60, 67, 0.30);
  --label-quaternary:         rgba(60, 60, 67, 0.18);

  /* Backgrounds */
  --bg-primary:               #FFFFFF;
  --bg-secondary:             #F2F2F7;   /* iOS system gray 6 */
  --bg-tertiary:              #FFFFFF;
  --bg-grouped-primary:       #F2F2F7;
  --bg-grouped-secondary:     #FFFFFF;
  --bg-grouped-tertiary:      #F2F2F7;

  /* Fill (para controles sobre fondos) */
  --fill-primary:             rgba(120, 120, 128, 0.20);
  --fill-secondary:           rgba(120, 120, 128, 0.16);
  --fill-tertiary:            rgba(118, 118, 128, 0.12);
  --fill-quaternary:          rgba(116, 116, 128, 0.08);

  /* Separadores */
  --separator:                rgba(60, 60, 67, 0.29);
  --separator-opaque:         #C6C6C8;
  --separator-thin:           rgba(60, 60, 67, 0.12);

  /* Sistema de colores de acento */
  --accent:                   #007AFF;
  --accent-rgb:               0, 122, 255;
  --blue:                     #007AFF;
  --green:                    #34C759;
  --indigo:                   #5856D6;
  --orange:                   #FF9500;
  --pink:                     #FF2D55;
  --purple:                   #AF52DE;
  --red:                      #FF3B30;
  --teal:                     #5AC8FA;
  --yellow:                   #FFCC00;
  --mint:                     #00C7BE;
  --cyan:                     #32ADE6;
  --brown:                    #A2845E;

  /* Grays del sistema */
  --gray:                     #8E8E93;
  --gray-2:                   #AEAEB2;
  --gray-3:                   #C7C7CC;
  --gray-4:                   #D1D1D6;
  --gray-5:                   #E5E5EA;
  --gray-6:                   #F2F2F7;

  /* Semánticos */
  --color-success:            #34C759;
  --color-warning:            #FF9500;
  --color-error:              #FF3B30;
  --color-info:               #007AFF;

  /* ─── ESPACIADO ─────────────────────────────────────────── */
  /* Escala de 4pt — iOS usa grid de 8pt con subdivisiones de 4pt */
  --space-1:    4px;
  --space-2:    8px;
  --space-3:   12px;
  --space-4:   16px;   /* ← padding estándar de vista */
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;
  --space-20:  80px;

  /* ─── BORDER RADIUS ─────────────────────────────────────── */
  --radius-xs:     6px;    /* inputs pequeños, badges */
  --radius-sm:     8px;    /* inputs, chips */
  --radius-md:    10px;    /* inputs estándar, botones secundarios */
  --radius-card:  12px;    /* cards normales */
  --radius-lg:    16px;    /* cards grandes, sheets */
  --radius-xl:    20px;    /* modales, bottom sheets */
  --radius-2xl:   28px;    /* sheets grandes */
  --radius-full: 9999px;   /* pills, avatars, FAB */
  --radius-app:   17px;    /* ícono de app (iOS) */

  /* ─── SOMBRAS — 4 niveles de elevación ─────────────────── */
  /* Nivel 0: sin elevación */
  --shadow-0: none;
  /* Nivel 1: cards en reposo */
  --shadow-1: 0 1px 3px rgba(0,0,0,0.06),
              0 4px 12px rgba(0,0,0,0.04);
  /* Nivel 2: cards hover, dropdowns */
  --shadow-2: 0 2px 8px rgba(0,0,0,0.08),
              0 12px 32px rgba(0,0,0,0.06);
  /* Nivel 3: modales, sheets */
  --shadow-3: 0 8px 24px rgba(0,0,0,0.10),
              0 24px 64px rgba(0,0,0,0.08);
  /* Nivel 4: overlays, toasts */
  --shadow-4: 0 16px 48px rgba(0,0,0,0.14),
              0 48px 96px rgba(0,0,0,0.10);

  /* ─── BLUR (Materials) ──────────────────────────────────── */
  /* iOS usa "materials" que son blur + color tintado */
  --blur-thin:       blur(8px);
  --blur-regular:    blur(16px);
  --blur-thick:      blur(24px);
  --blur-chrome:     blur(20px) saturate(180%);   /* nav bars */
  --blur-ultrathick: blur(40px) saturate(200%);   /* modales */

  /* Backgrounds con material */
  --material-thin:      rgba(255,255,255,0.72);
  --material-regular:   rgba(255,255,255,0.80);
  --material-thick:     rgba(255,255,255,0.88);
  --material-chrome:    rgba(255,255,255,0.85);   /* nav bar */
  --material-ultrathick:rgba(255,255,255,0.92);

  /* ─── DURACIONES DE ANIMACIÓN ───────────────────────────── */
  --duration-instant:  100ms;
  --duration-fast:     200ms;
  --duration-normal:   300ms;
  --duration-slow:     400ms;
  --duration-spring:   420ms;
  --duration-gentle:   600ms;

  /* ─── EASINGS (Apple Physics) ───────────────────────────── */
  --ease-standard:  cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-decelerate:cubic-bezier(0.00, 0.00, 0.20, 1.00);
  --ease-accelerate:cubic-bezier(0.40, 0.00, 1.00, 1.00);
  --ease-sharp:     cubic-bezier(0.40, 0.00, 0.60, 1.00);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1.00);  /* overshoot */
  --ease-bounce:    cubic-bezier(0.68,-0.55, 0.27, 1.55);

  /* ─── LAYOUT ────────────────────────────────────────────── */
  --nav-bar-height:      44px;   /* top navigation bar */
  --tab-bar-height:      49px;   /* bottom tab bar sin safe area */
  --tab-bar-full:        83px;   /* bottom tab bar con safe area */
  --toolbar-height:      44px;
  --status-bar-height:   47px;   /* iPhone con Dynamic Island */
  --touch-target:        44px;   /* mínimo para touch targets */

  /* Safe areas (sobrescritas por env() en dispositivos reales) */
  --safe-top:    env(safe-area-inset-top,    47px);
  --safe-right:  env(safe-area-inset-right,  0px);
  --safe-bottom: env(safe-area-inset-bottom, 34px);
  --safe-left:   env(safe-area-inset-left,   0px);

  /* ─── BORDES ────────────────────────────────────────────── */
  --border-thin:   0.5px solid var(--separator);
  --border-normal: 1px   solid var(--separator-opaque);

  /* ─── Z-INDEX ───────────────────────────────────────────── */
  --z-base:       0;
  --z-raised:    10;
  --z-dropdown:  100;
  --z-sticky:    200;
  --z-overlay:   300;
  --z-modal:     400;
  --z-toast:     500;
  --z-tooltip:   600;
}

/* ============================================================
   MODO OSCURO — Dark Mode
   iOS usa colores adaptivos que invierten semánticamente
   ============================================================ */
@media (prefers-color-scheme: dark) {
  :root {
    /* Labels */
    --label-primary:            rgba(255, 255, 255, 1.00);
    --label-secondary:          rgba(235, 235, 245, 0.60);
    --label-tertiary:           rgba(235, 235, 245, 0.30);
    --label-quaternary:         rgba(235, 235, 245, 0.18);

    /* Backgrounds */
    --bg-primary:               #000000;
    --bg-secondary:             #1C1C1E;
    --bg-tertiary:              #2C2C2E;
    --bg-grouped-primary:       #000000;
    --bg-grouped-secondary:     #1C1C1E;
    --bg-grouped-tertiary:      #2C2C2E;

    /* Fill */
    --fill-primary:             rgba(120, 120, 128, 0.36);
    --fill-secondary:           rgba(120, 120, 128, 0.32);
    --fill-tertiary:            rgba(118, 118, 128, 0.24);
    --fill-quaternary:          rgba(116, 116, 128, 0.18);

    /* Separadores */
    --separator:                rgba(84, 84, 88, 0.65);
    --separator-opaque:         #38383A;
    --separator-thin:           rgba(84, 84, 88, 0.34);

    /* Grays dark */
    --gray:   #8E8E93; --gray-2: #636366; --gray-3: #48484A;
    --gray-4: #3A3A3C; --gray-5: #2C2C2E; --gray-6: #1C1C1E;

    /* Materials dark */
    --material-thin:       rgba(30,30,30,0.72);
    --material-regular:    rgba(30,30,30,0.80);
    --material-thick:      rgba(30,30,30,0.88);
    --material-chrome:     rgba(28,28,30,0.85);
    --material-ultrathick: rgba(28,28,30,0.92);

    /* Sombras en dark (más sutiles — el negro no da contraste) */
    --shadow-1: 0 1px 3px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.15);
    --shadow-2: 0 2px 8px rgba(0,0,0,0.28), 0 12px 32px rgba(0,0,0,0.20);
    --shadow-3: 0 8px 24px rgba(0,0,0,0.35), 0 24px 64px rgba(0,0,0,0.28);
    --shadow-4: 0 16px 48px rgba(0,0,0,0.44), 0 48px 96px rgba(0,0,0,0.36);
  }
}

/* ============================================================
   RESET BASE iOS-STYLE
   ============================================================ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0; padding: 0;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  font-family: var(--font-text);
  font-size: var(--text-body);
  line-height: var(--line-body);
  color: var(--label-primary);
  background: var(--bg-secondary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Momentum scroll en iOS */
.scroll-view {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}

/* Ocultar scrollbar al estilo iOS */
.scroll-view::-webkit-scrollbar { display: none; }
.scroll-view { scrollbar-width: none; }
```

## Clases Utilitarias de Tipografía

```css
/* Usa estas clases directamente en HTML */
.text-large-title  { font-family: var(--font-display); font-size: var(--text-large-title);  font-weight: var(--weight-large-title);  line-height: var(--line-large-title); letter-spacing: -0.4px; }
.text-title-1      { font-family: var(--font-display); font-size: var(--text-title-1);      font-weight: var(--weight-title-1);      line-height: var(--line-title-1); letter-spacing: -0.4px; }
.text-title-2      { font-family: var(--font-display); font-size: var(--text-title-2);      font-weight: var(--weight-title-2);      line-height: var(--line-title-2); letter-spacing: -0.3px; }
.text-title-3      { font-size: var(--text-title-3);      font-weight: var(--weight-title-3);      line-height: var(--line-title-3); letter-spacing: -0.2px; }
.text-headline     { font-size: var(--text-headline);     font-weight: var(--weight-headline);     line-height: var(--line-headline); }
.text-body         { font-size: var(--text-body);         font-weight: var(--weight-body);         line-height: var(--line-body); }
.text-callout      { font-size: var(--text-callout);      font-weight: var(--weight-callout);      line-height: var(--line-callout); }
.text-subheadline  { font-size: var(--text-subheadline);  font-weight: var(--weight-subheadline);  line-height: var(--line-subheadline); }
.text-footnote     { font-size: var(--text-footnote);     font-weight: var(--weight-footnote);     line-height: var(--line-footnote); }
.text-caption-1    { font-size: var(--text-caption-1);    font-weight: var(--weight-caption-1);    line-height: var(--line-caption-1); }
.text-caption-2    { font-size: var(--text-caption-2);    font-weight: var(--weight-caption-2);    line-height: var(--line-caption-2); }

/* Color de texto */
.text-primary    { color: var(--label-primary); }
.text-secondary  { color: var(--label-secondary); }
.text-tertiary   { color: var(--label-tertiary); }
.text-accent     { color: var(--accent); }
.text-success    { color: var(--color-success); }
.text-warning    { color: var(--color-warning); }
.text-error      { color: var(--color-error); }
```

## Viewport Obligatorio para PWA iOS

```html
<!-- SIEMPRE incluir en <head> para PWA iOS -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<!-- Para dark status bar: content="black" -->
<!-- Para status bar transparente: content="black-translucent" -->
<meta name="theme-color" content="#007AFF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
```

## Cómo Elegir Color de Acento

```css
/* El acento varía por temática — sobreescribe --accent y --accent-rgb */

/* Educación / General */   --accent: #007AFF; --accent-rgb: 0,122,255;
/* Salud / Medical */       --accent: #34C759; --accent-rgb: 52,199,89;
/* Finanzas / Dinero */     --accent: #30D158; --accent-rgb: 48,209,88;
/* Derecho / Legal */       --accent: #1C4E80; --accent-rgb: 28,78,128;
/* Creatividad / Arte */    --accent: #FF2D55; --accent-rgb: 255,45,85;
/* Tecnología */            --accent: #5856D6; --accent-rgb: 88,86,214;
/* Bienestar / Fitness */   --accent: #FF9500; --accent-rgb: 255,149,0;
/* Productividad */         --accent: #007AFF; --accent-rgb: 0,122,255;
/* Viajes / Turismo */      --accent: #5AC8FA; --accent-rgb: 90,200,250;
/* Alimentos */             --accent: #FF6B35; --accent-rgb: 255,107,53;
```
