---
name: web-design-expert
description: Experto en diseño UI/UX para aplicaciones web modernas. Usar cuando se necesite diseñar interfaces, crear sistemas de diseño, definir paletas de colores, tipografías, layouts responsive, componentes visuales, o mejorar la experiencia de usuario. Especializado en diseño dark theme, aplicaciones de fitness, y principios de usabilidad.
---

# Web Design Expert

Guía para crear interfaces modernas, accesibles y visualmente atractivas.

## Principios de Diseño UI/UX

### Jerarquía Visual

1. **Contraste de color** - Diferenciar elementos por importancia
2. **Tamaño y escala** - Elementos importantes deben destacar
3. **Espaciado** - Respiración entre elementos (white space)
4. **Alineación** - Consistencia en la estructura
5. **Proximidad** - Elementos relacionados juntos

### Dark Theme - Mejores Prácticas

```css
/* Jerarquía de superficies */
--surface-primary: #181c1f;    /* Fondo principal */
--surface-secondary: #212529;   /* Cards, sidebars */
--surface-tertiary: #2d333b;    /* Elevaciones, hovers */
--surface-input: #1c2127;       /* Inputs, formularios */

/* Texto */
--text-primary: #ffffff;        /* 100% opacidad */
--text-secondary: #b4b4b4;      /* ~70% opacidad */
--text-muted: #6e7681;          /* ~50% opacidad */

/* Accesibilidad */
--border-subtle: rgba(255,255,255,0.1);
--focus-ring: 0 0 0 3px rgba(255,143,56,0.4);
```

### Paleta de Colores - Proyecto OverWorkout

| Color | Hex | Uso |
|-------|-----|-----|
| Primary | `#ff8f38` | Botones primarios, acentos, acciones |
| Secondary | `#212529` | Surfaces, backgrounds |
| Accent | `#38b2ac` | Estados success, indicadores |
| Error | `#ef4444` | Errores, validaciones |
| Warning | `#f59e0b` | Advertencias |
| Info | `#3b82f6` | Información |

## Tipografía

### Sistema Tipográfico

```css
/* Familia */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Escala */
--text-xs: 0.75rem;     /* 12px - Captions */
--text-sm: 0.875rem;    /* 14px - Body small */
--text-base: 1rem;      /* 16px - Body */
--text-lg: 1.125rem;    /* 18px - Lead */
--text-xl: 1.25rem;     /* 20px - H4 */
--text-2xl: 1.5rem;     /* 24px - H3 */
--text-3xl: 1.875rem;   /* 30px - H2 */
--text-4xl: 2.25rem;    /* 36px - H1 */

/* Peso */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line height */
--leading-tight: 1.25;  /* Headings */
--leading-normal: 1.5;  /* Body */
--leading-relaxed: 1.75;/* Large text */
```

### Reglas de Tipografía

- **Headings**: Semibold (600), tight leading
- **Body**: Normal (400), normal leading
- **Labels/Buttons**: Medium (500)
- **Max width**: 65-75 caracteres por línea para legibilidad

## Espaciado y Layout

### Sistema de Espaciado (8px base)

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Grids y Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Tablets */
--breakpoint-md: 768px;   /* Small laptops */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large screens */

/* Container */
max-width: 1280px;
padding: 0 1rem; /* Mobile */
padding: 0 2rem; /* Desktop */
```

## Componentes UI - Guía Visual

### Botones

```css
/* Primary */
background: var(--color-primary);
color: #000;
border-radius: 6px;
padding: 10px 20px;
font-weight: 500;
transition: all 0.2s;

/* Hover */
filter: brightness(1.1);
transform: translateY(-1px);

/* Secondary/Outline */
border: 1px solid var(--border-subtle);
background: transparent;
```

### Cards

```css
background: var(--surface-secondary);
border-radius: 12px;
border: 1px solid var(--border-subtle);
padding: 1.5rem;
box-shadow: 0 4px 6px rgba(0,0,0,0.1);

/* Hover state */
box-shadow: 0 8px 16px rgba(0,0,0,0.15);
transform: translateY(-2px);
```

### Inputs

```css
background: var(--surface-input);
border: 1px solid var(--border-subtle);
border-radius: 8px;
padding: 12px 16px;
color: var(--text-primary);

/* Focus */
border-color: var(--color-primary);
box-shadow: var(--focus-ring);

/* Error */
border-color: var(--color-error);
```

## Diseño Responsive

### Enfoque Mobile-First

```css
/* Base: Mobile */
.grid { display: grid; gap: 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}
```

### Touch Targets

- **Mínimo**: 44x44px para elementos interactivos
- **Ideal**: 48x48px
- **Espaciado**: 8px mínimo entre elementos táctiles

## Accesibilidad (a11y)

### Contraste

- **Normal text**: 4.5:1 ratio mínimo
- **Large text**: 3:1 ratio mínimo
- **UI Components**: 3:1 ratio mínimo

### Focus Indicators

```css
/* Visible focus para navegación por teclado */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -100%;
}
.skip-link:focus {
  top: 1rem;
  left: 1rem;
  z-index: 9999;
}
```

### Reducir Movimiento

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Animaciones y Transiciones

### Principios

- **Duración**: 150-300ms para micro-interacciones
- **Easing**: 
  - `ease-out` para elementos que entran
  - `ease-in` para elementos que salen
  - `ease-in-out` para estados de cambio

```css
/* Easing recomendados */
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Patrones Comunes

```css
/* Fade + Slide Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale on hover */
.card:hover {
  transform: scale(1.02);
  transition: transform 0.2s var(--ease-out);
}

/* Skeleton loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-secondary) 25%,
    var(--surface-tertiary) 50%,
    var(--surface-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

## Checklist de Diseño

- [ ] ¿La paleta sigue el sistema de colores definido?
- [ ] ¿Hay suficiente contraste para accesibilidad?
- [ ] ¿El espaciado es consistente?
- [ ] ¿Los elementos interactivos tienen estados (hover, focus, active)?
- [ ] ¿La tipografía tiene jerarquía clara?
- [ ] ¿El diseño funciona en mobile?
- [ ] ¿Las animaciones son sutiles y no distraen?
- [ ] ¿Los errores son visibles y comprensibles?
