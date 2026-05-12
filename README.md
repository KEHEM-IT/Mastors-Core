# Mastors-Core

**Enterprise-grade SCSS foundational architecture for the Mastors CDN ecosystem.**

[![npm](https://img.shields.io/npm/v/@mastors/core)](https://www.npmjs.com/package/@mastors/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Dart Sass](https://img.shields.io/badge/Dart%20Sass-1.70%2B-CC6699)](https://sass-lang.com)

---

## What is Mastors-Core?

Mastors-Core is the **foundational layer** of the entire Mastors CDN ecosystem. It provides:

- **Design Token System** — Colors, shadows, radius, z-index, opacity, breakpoints, motion
- **CSS Variable Engine** — Auto-generated CSS custom properties from all tokens
- **Theme Engine** — Light/dark/custom themes with `[data-theme]` switching
- **Responsive Engine** — Modern mobile-first media query mixins
- **Utility Generators** — Scoped utility classes (colors, shadows, spacing, sizing, etc.)
- **Helper Mixins** — Glassmorphism, neumorphism, skeleton loading, focus rings, and more
- **Accessibility System** — Focus visible, visually hidden, skip links, reduced motion
- **Base Reset** — Modern CSS reset, normalize supplement, motion defaults

---

## Architecture

```
mastors-core/
├── scss/
│   ├── config/           # Feature flags, settings
│   ├── tokens/           # Design tokens (colors, shadows, radius…)
│   ├── functions/        # Token accessors, math helpers
│   ├── mixins/           # Responsive engine, helpers, CSS var engine
│   ├── themes/           # Light, dark, custom themes
│   ├── generators/       # Utility class generators
│   ├── utilities/        # Spacing, sizing, border utilities
│   ├── base/             # Reset, motion defaults
│   ├── helpers/          # Container, state helpers
│   ├── accessibility/    # A11y system
│   ├── abstracts/        # Placeholders / silent classes
│   ├── vendors/          # Normalize supplement
│   ├── _index.scss       # @use entry (functions/mixins/tokens API)
│   └── mastors-core.scss # CSS compile entry
├── dist/                 # Compiled output
├── docs/                 # Documentation
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation

```bash
npm install @mastors/core
```

Or with Yarn:

```bash
yarn add @mastors/core
```

---

## Quick Start

### Compile the full CSS bundle

```bash
npm run sass:all
```

### Use in your SCSS

```scss
// Import the full API (functions, mixins, tokens — no CSS output)
@use '@mastors/core' as mc;

.my-card {
  background-color: mc.color('surface');
  border-radius: mc.radius('lg');
  box-shadow: mc.shadow('md');
  color: mc.semantic('text-primary');

  @include mc.up('md') {
    padding: 2rem;
  }
}
```

### Use with configuration overrides

```scss
@use '@mastors/core' with (
  $enable-dark-theme:   true,
  $enable-utilities:    true,
  $enable-accessibility: true,
  $mastors-prefix:      'mc'
);
```

---

## Integration with Mastors Libraries

Mastors-Core is the dependency base for the full Mastors CDN:

| Library           | Role                                  | Depends on Core |
|-------------------|---------------------------------------|-----------------|
| Mastors-Flexer    | Flexbox utility system                | ✅ Yes           |
| Mastors-Gridder   | CSS Grid layout system                | ✅ Yes           |
| Mastors-Fluider   | Fluid typography & responsive fonts  | ✅ Yes           |

In each library:

```scss
// At the top of every Mastors library
@use '@mastors/core' as mc;

// Then use core tokens, functions, mixins freely
.mastors-flex-row {
  @include mc.up('md') { flex-direction: row; }
}
```

---

## Token Functions

```scss
@use '@mastors/core' as mc;

// Color token
color: mc.color('primary');             // #2563eb
color: mc.color('neutral-700');         // #374151

// Semantic color
color: mc.semantic('text-muted');       // #6b7280

// Shadow
box-shadow: mc.shadow('lg');            // full shadow value

// Border radius
border-radius: mc.radius('xl');         // 16px

// Z-index
z-index: mc.z('modal');                 // 500

// Layer
z-index: mc.layer('dialog');           // 4

// Opacity
opacity: mc.opacity('50');              // 0.5

// Breakpoint value
$bp: mc.breakpoint('md');              // 768px

// Container max-width
max-width: mc.container('xl');          // 1140px

// Duration
transition-duration: mc.duration('normal'); // 200ms

// Easing
transition-timing-function: mc.easing('smooth');

// Transition shorthand
transition: mc.transition('colors');

// Math helpers
font-size: mc.rem(18);                  // 1.125rem
font-size: mc.em(14);                  // 0.875em
```

---

## Responsive Mixins

```scss
@use '@mastors/core' as mc;

.element {
  // min-width (mobile first)
  @include mc.up('md')           { ... } // ≥ 768px
  @include mc.up('xl')           { ... } // ≥ 1200px

  // max-width
  @include mc.down('lg')         { ... } // < 992px

  // range
  @include mc.between('sm', 'xl') { ... } // 576px – 1199px

  // single breakpoint only
  @include mc.only('md')         { ... } // 768px – 991px

  // device/media queries
  @include mc.hover              { ... } // pointer device hover
  @include mc.prefers-dark       { ... } // OS dark mode
  @include mc.prefers-reduced-motion { ... }
  @include mc.print              { ... }
  @include mc.portrait           { ... }
  @include mc.landscape          { ... }
}
```

---

## Helper Mixins

```scss
@use '@mastors/core' as mc;

// Centering
.centered {
  @include mc.absolute-center;
}

// Text truncation
.title {
  @include mc.truncate;
}

// Multi-line clamp
.excerpt {
  @include mc.line-clamp(3);
}

// Glassmorphism card
.glass-card {
  @include mc.glassmorphism(
    $blur: 20px,
    $bg: rgba(255, 255, 255, 0.15),
    $border: rgba(255, 255, 255, 0.2)
  );
}

// Neumorphism button
.neu-btn {
  @include mc.neumorphism(#e0e5ec);
}

// Custom scrollbar
.sidebar {
  @include mc.custom-scrollbar($width: 6px);
}

// Focus ring (custom)
.input {
  @include mc.focus-ring(#2563eb, 2px, 3px);
}

// Skeleton loading
.placeholder {
  @include mc.skeleton-loading;
}

// Hover lift
.card {
  @include mc.hover-lift;
}

// Smooth transition
.button {
  @include mc.smooth-transition(all, 300ms);
}

// Visually hidden
.label {
  @include mc.visually-hidden;
}
```

---

## Theme System

### Data attribute (recommended)

```html
<html data-theme="dark">
<html data-theme="light">
<html data-theme="enterprise">
```

### CSS Variable overrides

```css
:root {
  --mastors-color-primary: #0f4c75;
  --mastors-bg-body: #1b262c;
}
```

### Custom Theme (SCSS)

```scss
@use '@mastors/core/themes/custom' with (
  $theme-name: 'enterprise',
  $custom-tokens: (
    '--mastors-color-primary':  #0f4c75,
    '--mastors-color-secondary': #1b4332,
    '--mastors-bg-body':        #1b262c,
    '--mastors-text-primary':   #e2e8f0,
  )
);
```

---

## CSS Variable Reference

All tokens are available as CSS custom properties:

```css
/* Colors */
--mastors-color-primary
--mastors-color-secondary
--mastors-color-success
--mastors-color-danger
--mastors-color-warning

/* Semantic */
--mastors-text-primary
--mastors-text-secondary
--mastors-text-muted
--mastors-bg-body
--mastors-bg-subtle
--mastors-border-default
--mastors-border-focus
--mastors-surface

/* Shadows */
--mastors-shadow-sm
--mastors-shadow-md
--mastors-shadow-lg
--mastors-shadow-xl

/* Radius */
--mastors-radius-sm
--mastors-radius-md
--mastors-radius-lg
--mastors-radius-xl
--mastors-radius-full

/* Z-index */
--mastors-z-dropdown
--mastors-z-modal
--mastors-z-tooltip
--mastors-z-toast

/* Motion */
--mastors-duration-fast
--mastors-duration-normal
--mastors-easing-ease-in-out
--mastors-easing-spring
```

---

## Utility Classes

### Colors & Backgrounds
```html
<p class="text-primary">Primary text</p>
<div class="bg-neutral-100">Neutral background</div>
<div class="border-color-danger">Danger border</div>
```

### Shadows
```html
<div class="shadow-md">Medium shadow</div>
<div class="shadow-primary">Brand shadow</div>
```

### Border Radius
```html
<div class="rounded-lg">Large radius</div>
<div class="rounded-full">Pill shape</div>
<div class="rounded-t-xl">Top rounded only</div>
```

### Opacity
```html
<div class="opacity-50">50% opacity</div>
<div class="opacity-0">Hidden</div>
```

### Transitions
```html
<div class="transition-all">All transitions</div>
<div class="transition-colors">Color transitions</div>
```

### Positioning & Display
```html
<div class="position-relative">Relative</div>
<div class="d-none">Hidden</div>
<div class="d-block">Block</div>
<div class="overflow-hidden">Overflow hidden</div>
```

### Spacing
```html
<div class="p-4">1rem padding</div>
<div class="mt-8">2rem top margin</div>
<div class="px-6 py-3">Horizontal/vertical padding</div>
```

### Sizing
```html
<div class="w-full h-screen">Full width, full height</div>
<div class="max-w-4xl">Max width 4xl</div>
```

### Cursor & Object
```html
<button class="cursor-pointer">Clickable</button>
<img class="object-cover aspect-video">
```

---

## Accessibility

```html
<!-- Skip to content link -->
<a href="#main" class="mastors-skip-link">Skip to content</a>

<!-- Screen reader only -->
<span class="mastors-sr-only">Loading...</span>

<!-- Skeleton loading -->
<div class="mastors-skeleton w-full h-4 rounded-md"></div>

<!-- Animations -->
<div class="mastors-pulse">...</div>
<div class="mastors-spin">...</div>
```

---

## Build Commands

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm run sass:build` | Expanded CSS with source maps      |
| `npm run sass:min`   | Minified CSS, no source maps       |
| `npm run sass:watch` | Watch mode for development         |
| `npm run sass:all`   | Both expanded + minified           |
| `npm run build`      | Full Vite build                    |
| `npm run build:all`  | Sass + Vite build                  |
| `npm run clean`      | Clear dist/ folder                 |

---

## Breakpoints

| Key   | Value   |
|-------|---------|
| `xs`  | 0px     |
| `sm`  | 576px   |
| `md`  | 768px   |
| `lg`  | 992px   |
| `xl`  | 1200px  |
| `2xl` | 1400px  |
| `3xl` | 1600px  |

---

## License

MIT © Mastors CDN
