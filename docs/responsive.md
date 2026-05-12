# Responsive Guide — Mastors-Core

## Breakpoint Scale

| Key   | Value   | Typical Target       |
|-------|---------|----------------------|
| `xs`  | 0px     | Extra small / mobile |
| `sm`  | 576px   | Small / large mobile |
| `md`  | 768px   | Tablet portrait      |
| `lg`  | 992px   | Tablet landscape     |
| `xl`  | 1200px  | Desktop              |
| `2xl` | 1400px  | Wide desktop         |
| `3xl` | 1600px  | Ultra-wide           |

---

## Responsive Mixin API

### `up($bp)` — Mobile first (min-width)

```scss
@use '@mastors/core' as mc;

.element {
  font-size: 1rem;

  @include mc.up('md') { font-size: 1.25rem; }
  @include mc.up('xl') { font-size: 1.5rem; }
}
```

Compiles to:
```css
.element { font-size: 1rem; }
@media (min-width: 768px) { .element { font-size: 1.25rem; } }
@media (min-width: 1200px) { .element { font-size: 1.5rem; } }
```

---

### `down($bp)` — Desktop first (max-width)

```scss
.element {
  @include mc.down('lg') {
    display: none;
  }
}
```

Compiles to:
```css
@media (max-width: 991.98px) { .element { display: none; } }
```

> Note: `down()` uses `$value - 0.02px` to prevent overlap with `up()`.

---

### `between($lower, $upper)` — Range

```scss
.element {
  @include mc.between('sm', 'lg') {
    background: red;
  }
}
```

Compiles to:
```css
@media (min-width: 576px) and (max-width: 991.98px) { ... }
```

---

### `only($bp)` — Single breakpoint

```scss
.element {
  @include mc.only('md') {
    padding: 2rem;
  }
}
```

Compiles to:
```css
@media (min-width: 768px) and (max-width: 991.98px) { ... }
```

---

### Custom Breakpoint Values

You can pass raw px values directly:

```scss
@include mc.up(900px) { ... }
@include mc.down(1100px) { ... }
```

---

### Custom Breakpoint Map Override

```scss
// Override before @use
@use '@mastors/core' as mc;

// Or extend via token override (in your own tokens file):
$mastors-breakpoints: map.merge(mc.$mastors-breakpoints, (
  'tablet': 820px,
  'desktop': 1024px,
));
```

---

## Media Helpers

```scss
// Touch/pointer devices only
@include mc.hover { ... }

// OS dark mode
@include mc.prefers-dark { ... }

// Reduced motion
@include mc.prefers-reduced-motion { ... }

// Print
@include mc.print { ... }

// Orientation
@include mc.portrait  { ... }
@include mc.landscape { ... }
```

---

## Integration with Mastors-Fluider

Mastors-Core provides the breakpoint tokens that Mastors-Fluider reads for fluid typography:

```scss
// In Mastors-Fluider:
@use '@mastors/core/tokens/breakpoints' as mc-bp;

$fluid-min-vw: map.get(mc-bp.$mastors-breakpoints, 'sm'); // 576px
$fluid-max-vw: map.get(mc-bp.$mastors-breakpoints, 'xl'); // 1200px
```
