# Theming Guide — Mastors-Core

## Overview

Mastors-Core ships with a three-tier theme architecture:

1. **Light Theme** (default, applied to `:root`)
2. **Dark Theme** (via `[data-theme="dark"]` and `prefers-color-scheme`)
3. **Custom Themes** (per-product, per-brand)

All themes are powered by **CSS custom properties**. No class-based specificity fights.

---

## Switching Themes

### Via HTML attribute

```html
<!-- Light mode -->
<html data-theme="light">

<!-- Dark mode -->
<html data-theme="dark">

<!-- Custom theme -->
<html data-theme="enterprise">
```

### Via JavaScript

```js
// Toggle dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Respect OS preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
```

---

## Theme CSS Variable Reference

All theme variables follow the pattern `--mastors-{semantic-name}`:

| Variable                     | Light Value     | Dark Value      |
|------------------------------|-----------------|-----------------|
| `--mastors-text-primary`     | `#111827`       | `#f9fafb`       |
| `--mastors-text-secondary`   | `#374151`       | `#e5e7eb`       |
| `--mastors-text-muted`       | `#6b7280`       | `#9ca3af`       |
| `--mastors-text-disabled`    | `#9ca3af`       | `#6b7280`       |
| `--mastors-bg-body`          | `#ffffff`       | `#0f172a`       |
| `--mastors-bg-subtle`        | `#f9fafb`       | `#1e293b`       |
| `--mastors-bg-muted`         | `#f3f4f6`       | `#334155`       |
| `--mastors-border-default`   | `#e5e7eb`       | `#334155`       |
| `--mastors-border-focus`     | `#2563eb`       | `#60a5fa`       |
| `--mastors-surface`          | `#ffffff`       | `#1e293b`       |
| `--mastors-color-primary`    | `#2563eb`       | `#60a5fa`       |
| `--mastors-color-success`    | `#16a34a`       | `#4ade80`       |
| `--mastors-color-danger`     | `#dc2626`       | `#f87171`       |
| `--mastors-color-warning`    | `#d97706`       | `#fbbf24`       |

---

## Creating a Custom Theme (SCSS)

```scss
@use '@mastorscdn/core/themes/custom' with (
  $theme-name: 'enterprise',
  $custom-tokens: (
    '--mastors-color-primary':    #0f4c75,
    '--mastors-color-secondary':  #1b4332,
    '--mastors-bg-body':          #1b262c,
    '--mastors-bg-subtle':        #16213e,
    '--mastors-text-primary':     #e2e8f0,
    '--mastors-text-secondary':   #cbd5e1,
    '--mastors-border-default':   #2d3748,
    '--mastors-surface':          #16213e,
  )
);
```

Then in HTML:
```html
<html data-theme="enterprise">
```

---

## Creating an Ecommerce Theme

```scss
@use '@mastorscdn/core/themes/custom' with (
  $theme-name: 'shop',
  $custom-tokens: (
    '--mastors-color-primary':    #e11d48,
    '--mastors-color-secondary':  #f97316,
    '--mastors-bg-body':          #ffffff,
    '--mastors-surface':          #fef2f2,
    '--mastors-border-default':   #fecaca,
  )
);
```

---

## Creating an ERP / Dashboard Theme

```scss
@use '@mastorscdn/core/themes/custom' with (
  $theme-name: 'erp',
  $custom-tokens: (
    '--mastors-color-primary':    #1e40af,
    '--mastors-color-secondary':  #6d28d9,
    '--mastors-bg-body':          #f8fafc,
    '--mastors-bg-subtle':        #f1f5f9,
    '--mastors-surface':          #ffffff,
    '--mastors-border-default':   #e2e8f0,
  )
);
```

---

## Runtime Theme Switching (JavaScript)

```js
class MastorsTheme {
  static set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mastors-theme', theme);
  }

  static get() {
    return localStorage.getItem('mastors-theme')
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  static init() {
    this.set(this.get());
  }

  static toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.set(current === 'dark' ? 'light' : 'dark');
  }
}

// Initialize on load
MastorsTheme.init();
```

---

## Overriding Tokens at Runtime (CSS)

```css
/* Override primary color for a specific component */
.my-component {
  --mastors-color-primary: #e11d48;
  --mastors-border-focus: #e11d48;
}
```

---

## Dark Mode in Components

Always use theme CSS variables in component CSS:

```scss
// ✅ Correct — theme-aware
.card {
  background: var(--mastors-surface);
  color: var(--mastors-text-primary);
  border: 1px solid var(--mastors-border-default);
}

// ❌ Wrong — hard-coded, won't theme
.card {
  background: #ffffff;
  color: #111827;
}
```
