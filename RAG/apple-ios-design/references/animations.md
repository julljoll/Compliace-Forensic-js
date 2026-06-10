# Animaciones iOS — Motion System

Apple usa animaciones basadas en física (spring physics) que se sienten naturales, nunca mecánicas. Nunca uses `linear`.

## Curvas de Easing — Los 5 Tipos

```css
/* 1. STANDARD — La más usada. Para la mayoría de transiciones */
--ease-standard:  cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* 2. DECELERATE — Elementos que entran en pantalla (vienen rápido, frenan) */
--ease-decelerate: cubic-bezier(0.00, 0.00, 0.20, 1.00);

/* 3. ACCELERATE — Elementos que salen de pantalla (arrancan despacio, se van) */
--ease-accelerate: cubic-bezier(0.40, 0.00, 1.00, 1.00);

/* 4. SPRING — Para botones, modales, elementos que "rebotan" (overshoot) */
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1.00);

/* 5. BOUNCE — Para elementos lúdicos con rebote pronunciado */
--ease-bounce:    cubic-bezier(0.68, -0.55, 0.27, 1.55);
```

## Duraciones

```css
--duration-instant:  100ms;  /* Feedback inmediato: ripple, highlight */
--duration-fast:     200ms;  /* Microinteracciones: hover, toggle */
--duration-normal:   300ms;  /* Transiciones de vista estándar */
--duration-slow:     400ms;  /* Modales que entran, elementos grandes */
--duration-spring:   420ms;  /* Animaciones con spring */
--duration-gentle:   600ms;  /* Hero animations, onboarding */
```

## Patrón de Tap (Touch Feedback)

```css
/* SIEMPRE aplicar en elementos interactivos — es el "feel" iOS */
.tappable {
  transition: transform var(--duration-instant) var(--ease-standard),
              opacity  var(--duration-instant) var(--ease-standard);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.tappable:active {
  transform: scale(0.97);
  opacity: 0.85;
}

/* Para botones grandes (filled, CTA) */
.btn:active { transform: scale(0.97); opacity: 0.88; }

/* Para cards */
.card-tappable:active { transform: scale(0.98); box-shadow: var(--shadow-0); }

/* Para nav items (spring overshoot en el ícono) */
.nav-icon { transition: transform var(--duration-fast) var(--ease-spring); }
.nav-item.active .nav-icon { transform: scale(1.1); }
```

## Transición entre Vistas (NavigationView push/pop)

```css
/* Sistema de vistas SPA con slide iOS */
.view-container {
  position: relative; overflow: hidden;
  width: 100%; height: 100%;
}

.view {
  position: absolute; inset: 0;
  background: var(--bg-secondary);
  will-change: transform, opacity;
}

/* Entrar (push) — desde la derecha */
.view-entering {
  animation: view-push-in var(--duration-normal) var(--ease-decelerate) forwards;
}
@keyframes view-push-in {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

/* Salir cuando se hace push — va a la izquierda */
.view-leaving-push {
  animation: view-push-out var(--duration-normal) var(--ease-accelerate) forwards;
}
@keyframes view-push-out {
  from { transform: translateX(0); }
  to   { transform: translateX(-30%); opacity: 0.5; } /* efecto parallax iOS */
}

/* Pop (atrás) — sale a la derecha */
.view-leaving-pop {
  animation: view-pop-out var(--duration-normal) var(--ease-accelerate) forwards;
}
@keyframes view-pop-out {
  from { transform: translateX(0); }
  to   { transform: translateX(100%); }
}

/* La vista que vuelve, viene de la izquierda */
.view-entering-pop {
  animation: view-pop-in var(--duration-normal) var(--ease-decelerate) forwards;
}
@keyframes view-pop-in {
  from { transform: translateX(-30%); opacity: 0.5; }
  to   { transform: translateX(0); opacity: 1; }
}
```

## Bottom Sheet — Spring Animation

```css
.sheet {
  transform: translateY(100%);
  transition: transform var(--duration-spring) var(--ease-spring);
}
.sheet.visible {
  transform: translateY(0);
}

/* Backdrop fade */
.sheet-backdrop {
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-standard);
}
.sheet-backdrop.visible {
  opacity: 1;
}
```

## List Items — Stagger de entrada

```javascript
// JS para animar lista con stagger al estilo iOS
function animateListIn(container, delay = 40) {
  const items = container.querySelectorAll('[data-animate]');
  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(16px)';
    setTimeout(() => {
      item.style.transition = `opacity ${300}ms ease, transform ${300}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, i * delay);
  });
}
```

```css
/* CSS alternativo con animation-delay */
.list-item { opacity: 0; animation: fade-up var(--duration-normal) var(--ease-decelerate) forwards; }
.list-item:nth-child(1)  { animation-delay:  0ms; }
.list-item:nth-child(2)  { animation-delay: 40ms; }
.list-item:nth-child(3)  { animation-delay: 80ms; }
.list-item:nth-child(4)  { animation-delay: 120ms; }
.list-item:nth-child(5)  { animation-delay: 160ms; }
/* continuar según necesidad */

@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

## Microinteracciones Específicas

### Toggle/Switch
```css
.toggle-thumb {
  transition: transform var(--duration-fast) var(--ease-spring);
}
.toggle input:checked ~ .toggle-thumb {
  transform: translateX(20px);
  /* La spring hace que el pulgar "arrive" con un pequeño rebote */
}
```

### Checkbox
```css
.checkbox-icon {
  transform: scale(0);
  transition: transform var(--duration-fast) var(--ease-spring);
}
.checkbox input:checked ~ .checkbox-icon {
  transform: scale(1);
}
```

### Expandir/Colapsar (Accordion)
```css
.accordion-content {
  overflow: hidden;
  max-height: 0;
  transition: max-height var(--duration-slow) var(--ease-decelerate),
              opacity var(--duration-normal) var(--ease-standard);
  opacity: 0;
}
.accordion-content.expanded {
  max-height: 1000px; /* suficientemente grande */
  opacity: 1;
}

.accordion-arrow {
  transition: transform var(--duration-fast) var(--ease-spring);
}
.accordion.open .accordion-arrow {
  transform: rotate(90deg);  /* o 180deg para flecha abajo */
}
```

### Notificación / Toast aparecer
```css
.toast {
  transform: translateY(-calc(100% + var(--space-4)));
  opacity: 0;
  transition: transform var(--duration-spring) var(--ease-spring),
              opacity var(--duration-fast) var(--ease-standard);
}
.toast.visible {
  transform: translateY(0);
  opacity: 1;
}
```

## Parallax Scroll (efecto profundidad iOS)

```javascript
// Parallax suave al hacer scroll — efecto depth
const hero = document.querySelector('.hero-image');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  hero.style.transform = `translateY(${scrolled * 0.4}px)`;
}, { passive: true });
```

## Reducir Movimiento (Accesibilidad)

```css
/* SIEMPRE incluir esto — usuarios con vestibular disorders */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Cuándo usar cada animación

| Situación | Easing | Duración |
|-----------|--------|----------|
| Tap feedback | ease-standard | 100ms |
| Toggle/checkbox | ease-spring | 200ms |
| Nav icon active | ease-spring | 200ms |
| Card hover | ease-standard | 200ms |
| Push view in | ease-decelerate | 300ms |
| Push view out | ease-accelerate | 300ms |
| Modal/sheet in | ease-spring | 420ms |
| Modal/sheet out | ease-accelerate | 300ms |
| Alert in | ease-spring | 420ms |
| Toast in | ease-spring | 420ms |
| List stagger | ease-decelerate | 300ms + 40ms delay |
| Progress bar | ease-decelerate | 400ms |
| Hero on scroll | linear (passive) | continuo |
