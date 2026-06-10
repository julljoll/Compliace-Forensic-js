# Componentes iOS — Especificaciones CSS Exactas

Implementaciones pixel-perfect de cada componente del HIG de Apple para web/PWA.

## Navigation Bar (Top)

```css
.nav-bar {
  position: sticky; top: 0; z-index: var(--z-sticky);
  height: var(--nav-bar-height);          /* 44px */
  padding-top: var(--safe-top);           /* + safe area */
  padding-left: var(--space-4);
  padding-right: var(--space-4);
  display: flex; align-items: center; justify-content: space-between;
  background: var(--material-chrome);
  backdrop-filter: var(--blur-chrome);
  -webkit-backdrop-filter: var(--blur-chrome);
  border-bottom: var(--border-thin);
}

/* Título de la nav bar */
.nav-bar-title {
  font-size: var(--text-headline);
  font-weight: var(--weight-headline);
  color: var(--label-primary);
  text-align: center; flex: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* Título grande (Large Title) — se muestra al inicio de lista */
.nav-bar-large-title {
  font-family: var(--font-display);
  font-size: var(--text-large-title);
  font-weight: var(--weight-large-title);
  letter-spacing: -0.5px;
  padding: var(--space-2) var(--space-4) var(--space-3);
}

/* Botón de la nav bar */
.nav-bar-btn {
  min-width: var(--touch-target);
  height: var(--touch-target);
  display: flex; align-items: center; justify-content: center;
  border: none; background: none; cursor: pointer;
  color: var(--accent); font-size: var(--text-body);
  font-family: var(--font-text);
  border-radius: var(--radius-full);
  transition: opacity var(--duration-instant) var(--ease-standard);
}
.nav-bar-btn:active { opacity: 0.4; }

/* Botón de retroceso */
.nav-bar-back {
  display: flex; align-items: center; gap: 4px;
  color: var(--accent); font-size: var(--text-body);
  padding: 0; min-width: var(--touch-target);
}
.nav-bar-back::before { content: "‹"; font-size: 24px; line-height: 1; margin-right: -2px; }
```

## Tab Bar (Bottom Navigation)

```css
.tab-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  z-index: var(--z-sticky);
  height: var(--tab-bar-full);            /* 83px */
  padding-bottom: var(--safe-bottom);     /* + 34px safe area */
  padding-top: 0;
  display: flex; align-items: flex-start; justify-content: space-around;
  padding-inline: var(--space-2);
  background: var(--material-chrome);
  backdrop-filter: var(--blur-chrome);
  -webkit-backdrop-filter: var(--blur-chrome);
  border-top: var(--border-thin);
}

.tab-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: flex-start;
  padding-top: 8px; gap: 3px;
  min-width: var(--touch-target); min-height: var(--touch-target);
  border: none; background: none; cursor: pointer;
  transition: opacity var(--duration-instant) var(--ease-standard);
}
.tab-item:active { opacity: 0.6; }

.tab-icon {
  font-size: 22px; line-height: 1;
  transition: transform var(--duration-fast) var(--ease-spring);
}
.tab-item.active .tab-icon { transform: scale(1.08); }

.tab-label {
  font-size: var(--text-caption-2); font-weight: 500;
  color: var(--label-tertiary);
  transition: color var(--duration-fast) var(--ease-standard);
}
.tab-item.active .tab-label { color: var(--accent); }
```

## Cards — Inset Grouped List Style

```css
/* Card estándar (equivalente a List en SwiftUI) */
.card {
  background: var(--bg-grouped-secondary);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-1);
  overflow: hidden;
}

/* Section de cards (inset grouped) */
.card-section {
  margin: 0 var(--space-4) var(--space-4);
}

.card-section-label {
  font-size: var(--text-footnote);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--label-secondary);
  padding: 0 var(--space-4) var(--space-2);
  margin-top: var(--space-6);
}

/* Row dentro de card */
.card-row {
  display: flex; align-items: center;
  padding: 11px var(--space-4);
  min-height: var(--touch-target);
  border-bottom: var(--border-thin);
  border-bottom-color: var(--separator-thin);
  gap: var(--space-3);
  cursor: pointer;
  transition: background var(--duration-instant) var(--ease-standard);
}
.card-row:last-child { border-bottom: none; }
.card-row:active { background: var(--fill-quaternary); }

.card-row-icon {
  width: 29px; height: 29px;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}

.card-row-content { flex: 1; min-width: 0; }
.card-row-title { font-size: var(--text-body); color: var(--label-primary); }
.card-row-subtitle { font-size: var(--text-subheadline); color: var(--label-secondary); margin-top: 1px; }

.card-row-accessory {
  color: var(--label-tertiary); font-size: var(--text-body);
  display: flex; align-items: center; gap: var(--space-2);
}
.card-row-chevron::after { content: "›"; font-size: 20px; line-height: 1; color: var(--label-quaternary); }
```

## Botones (Buttons)

```css
/* Botón primario — lleno */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  min-height: var(--touch-target);         /* 44px mínimo */
  border-radius: var(--radius-md);
  border: none; cursor: pointer;
  font-family: var(--font-text);
  font-size: var(--text-body); font-weight: 600;
  letter-spacing: -0.1px;
  transition: transform var(--duration-instant) var(--ease-standard),
              opacity var(--duration-instant) var(--ease-standard);
  user-select: none; -webkit-user-select: none;
}
.btn:active { transform: scale(0.97); opacity: 0.88; }
.btn:disabled { opacity: 0.32; pointer-events: none; }

/* Variantes */
.btn-filled  { background: var(--accent); color: #fff; padding: 0 var(--space-6); }
.btn-tinted  { background: rgba(var(--accent-rgb), 0.12); color: var(--accent); padding: 0 var(--space-6); }
.btn-gray    { background: var(--fill-tertiary); color: var(--label-primary); padding: 0 var(--space-6); }
.btn-outlined { background: transparent; color: var(--accent); border: 1.5px solid var(--accent); padding: 0 var(--space-6); }
.btn-plain   { background: transparent; color: var(--accent); padding: 0 var(--space-3); }
.btn-destructive { background: var(--red); color: #fff; padding: 0 var(--space-6); }

/* Tamaños */
.btn-large  { height: 50px; font-size: 17px; border-radius: var(--radius-card); }
.btn-small  { height: 32px; font-size: var(--text-subheadline); border-radius: var(--radius-sm); padding: 0 var(--space-3); }
.btn-full   { width: 100%; }

/* Continous corners (iOS 16+) para botones grandes */
.btn-large.btn-filled { border-radius: var(--radius-card); }
```

## Inputs / Forms

```css
.input-group { margin-bottom: var(--space-4); }

.input-label {
  display: block;
  font-size: var(--text-footnote); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--label-secondary);
  margin-bottom: var(--space-2);
  padding-left: var(--space-1);
}

.input {
  display: block; width: 100%;
  height: var(--touch-target);              /* 44px */
  padding: 0 var(--space-4);
  border-radius: var(--radius-md);
  border: var(--border-thin);
  background: var(--bg-grouped-secondary);
  color: var(--label-primary);
  font-family: var(--font-text);
  font-size: var(--text-body);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard);
  -webkit-appearance: none; appearance: none;
}

/* Focus state — el anillo de enfoque de iOS */
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.20);
}

/* Input con fill (sin borde) — estilo Configuración de iOS */
.input-filled {
  border: none;
  background: var(--fill-tertiary);
}
.input-filled:focus {
  background: var(--fill-secondary);
  box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.15);
}

textarea.input {
  height: auto; min-height: 88px;
  padding: var(--space-3) var(--space-4);
  resize: vertical; line-height: var(--line-body);
}

/* Search Field */
.search-field-wrap {
  position: relative;
  display: flex; align-items: center;
}
.search-field {
  padding-left: 36px;
  background: var(--fill-tertiary);
  border: none; border-radius: var(--radius-full);
}
.search-field-icon {
  position: absolute; left: var(--space-3);
  color: var(--label-tertiary); pointer-events: none;
  font-size: 15px;
}
```

## Bottom Sheet / Modal

```css
/* Backdrop */
.sheet-backdrop {
  position: fixed; inset: 0; z-index: var(--z-modal);
  background: rgba(0, 0, 0, 0.40);
  backdrop-filter: var(--blur-thin);
  -webkit-backdrop-filter: var(--blur-thin);
  display: flex; align-items: flex-end;
  transition: opacity var(--duration-normal) var(--ease-standard);
}
.sheet-backdrop.hidden { opacity: 0; pointer-events: none; }
.sheet-backdrop.hidden .sheet { transform: translateY(100%); }

/* Sheet */
.sheet {
  width: 100%;
  background: var(--bg-grouped-secondary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  max-height: 92dvh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: var(--safe-bottom);
  transition: transform var(--duration-spring) var(--ease-spring);
}

.sheet-handle {
  width: 36px; height: 5px;
  background: var(--gray-4);
  border-radius: var(--radius-full);
  margin: 8px auto 0;
}

.sheet-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-4) var(--space-4) var(--space-3);
}
.sheet-title {
  font-size: var(--text-title-2); font-weight: var(--weight-title-2);
  letter-spacing: -0.3px;
}

/* Alert Sheet (pequeño, centrado) */
.alert-backdrop {
  align-items: center;
  padding: var(--space-4);
}
.alert-sheet {
  width: 100%; max-width: 270px;
  border-radius: var(--radius-xl);
  background: var(--material-ultrathick);
  backdrop-filter: var(--blur-ultrathick);
  -webkit-backdrop-filter: var(--blur-ultrathick);
  overflow: hidden;
  box-shadow: var(--shadow-4);
}
.alert-content { padding: var(--space-5) var(--space-4) var(--space-3); text-align: center; }
.alert-title { font-size: var(--text-headline); font-weight: 700; margin-bottom: 4px; }
.alert-message { font-size: var(--text-subheadline); color: var(--label-secondary); }
.alert-actions { border-top: var(--border-thin); }
.alert-action {
  width: 100%; height: 44px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: none;
  font-family: var(--font-text); font-size: var(--text-body); font-weight: 400;
  color: var(--accent); cursor: pointer;
  border-bottom: var(--border-thin);
  transition: background var(--duration-instant) var(--ease-standard);
}
.alert-action:last-child { border-bottom: none; }
.alert-action:active { background: var(--fill-quaternary); }
.alert-action.destructive { color: var(--red); }
.alert-action.default { font-weight: 700; }
```

## Toggle / Switch

```css
.toggle-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px var(--space-4); min-height: var(--touch-target);
}

.toggle {
  position: relative;
  width: 51px; height: 31px;
  flex-shrink: 0;
}
.toggle input { opacity: 0; width: 0; height: 0; position: absolute; }

.toggle-track {
  position: absolute; inset: 0;
  border-radius: var(--radius-full);
  background: var(--gray-5);
  transition: background var(--duration-fast) var(--ease-standard);
  cursor: pointer;
}
.toggle input:checked + .toggle-track { background: var(--accent); }

.toggle-thumb {
  position: absolute;
  top: 2px; left: 2px;
  width: 27px; height: 27px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.08);
  transition: transform var(--duration-fast) var(--ease-spring);
  pointer-events: none;
}
.toggle input:checked ~ .toggle-thumb { transform: translateX(20px); }
```

## Badges y Pills

```css
.badge {
  display: inline-flex; align-items: center; justify-content: center;
  height: 20px; min-width: 20px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  font-size: var(--text-caption-2); font-weight: 700;
  background: var(--red); color: #fff;
}

.pill {
  display: inline-flex; align-items: center; gap: 4px;
  height: 28px; padding: 0 var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-subheadline); font-weight: 500;
}
.pill-accent  { background: rgba(var(--accent-rgb), 0.12); color: var(--accent); }
.pill-green   { background: rgba(52,199,89,0.12); color: var(--green); }
.pill-red     { background: rgba(255,59,48,0.12); color: var(--red); }
.pill-orange  { background: rgba(255,149,0,0.12); color: var(--orange); }
.pill-gray    { background: var(--fill-tertiary); color: var(--label-secondary); }
```

## Progress Bar y Activity Indicator

```css
/* Progress Bar */
.progress-bar {
  height: 4px;
  background: var(--fill-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-fill {
  height: 100%; border-radius: var(--radius-full);
  background: var(--accent);
  transition: width var(--duration-slow) var(--ease-decelerate);
}

/* Circular Progress (Activity Indicator) */
.spinner {
  width: 20px; height: 20px;
  border: 2px solid var(--fill-tertiary);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--fill-tertiary) 25%,
    var(--fill-secondary) 50%,
    var(--fill-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
```

## Toasts / Snackbars (estilo iOS)

```css
.toast {
  position: fixed;
  top: calc(var(--safe-top) + var(--nav-bar-height) + var(--space-3));
  left: 50%; transform: translateX(-50%) translateY(-120%);
  z-index: var(--z-toast);
  max-width: min(320px, calc(100vw - var(--space-8)));
  padding: var(--space-3) var(--space-4);
  background: var(--label-primary);      /* negro en light, blanco en dark */
  color: var(--bg-primary);
  border-radius: var(--radius-full);
  font-size: var(--text-subheadline); font-weight: 500;
  box-shadow: var(--shadow-3);
  white-space: nowrap;
  transition: transform var(--duration-spring) var(--ease-spring);
}
.toast.visible { transform: translateX(-50%) translateY(0); }
```

## Segmented Control

```css
.segmented {
  display: flex;
  background: var(--fill-tertiary);
  border-radius: var(--radius-sm);
  padding: 2px;
  gap: 2px;
}
.seg-option {
  flex: 1; min-height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: calc(var(--radius-sm) - 2px);
  font-size: var(--text-subheadline); font-weight: 500;
  cursor: pointer; border: none; background: none;
  color: var(--label-primary);
  transition: all var(--duration-fast) var(--ease-standard);
}
.seg-option.active {
  background: var(--bg-grouped-secondary);
  box-shadow: var(--shadow-1);
  font-weight: 600;
}
```
