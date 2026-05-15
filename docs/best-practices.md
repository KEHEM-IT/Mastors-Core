# Best Practices — Mastors-Core

## 1. Always @use, Never @import

```scss
// ✅ Correct
@use '@mastorscdn/core' as mc;

// ❌ Wrong (deprecated)
@import 'mastors-core';
```

---

## 2. Use Token Functions, Not Raw Values

```scss
// ✅ Correct — token-driven, themeable
.btn {
  background: mc.color('primary');
  border-radius: mc.radius('md');
  box-shadow: mc.shadow('sm');
}

// ❌ Wrong — magic numbers
.btn {
  background: #2563eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

---

## 3. Use CSS Variables for Runtime-Themeable Properties

```scss
// ✅ Correct — switches on theme change
.card {
  color: var(--mastors-text-primary);
  background: var(--mastors-surface);
}

// ⚠️ Not runtime-switchable — locked at compile time
.card {
  color: mc.color('neutral-900');
  background: mc.color('white');
}
```

Use **SCSS functions** for things like `border-radius`, `box-shadow` (non-themeable).
Use **CSS variables** for colors, backgrounds, borders (themeable).

---

## 4. Always Include Fallback Values in CSS Variables

```scss
// ✅ Safe — fallback for when CSS vars aren't loaded
.element {
  color: var(--mastors-text-primary, #111827);
  background: var(--mastors-bg-body, #ffffff);
}
```

---

## 5. Mobile First Always

```scss
// ✅ Correct — mobile first
.element {
  padding: 1rem;           // mobile base
  @include mc.up('md') { padding: 2rem; }  // tablet
  @include mc.up('xl') { padding: 3rem; }  // desktop
}

// ❌ Wrong — desktop first anti-pattern
.element {
  padding: 3rem;
  @include mc.down('md') { padding: 1rem; }
}
```

---

## 6. Don't Duplicate Token Values

```scss
// ✅ Correct
$my-spacing: mc.rem(16);

// ❌ Wrong — duplicates token
$my-spacing: 1rem; // same as mc.rem(16) but not linked
```

---

## 7. Namespace Your @use

Always alias to avoid conflicts in large projects:

```scss
@use '@mastorscdn/core' as mc;
@use '@mastorscdn/flexer' as flex;
@use '@mastorscdn/gridder' as grid;

// Clear, readable
.layout {
  @include mc.up('md') { ... }
  @include flex.row { ... }
  @include grid.columns(3) { ... }
}
```

---

## 8. Use Semantic Color Variables in Components

```scss
// ✅ Correct — semantic
.alert-error {
  color: var(--mastors-color-danger);
  border-color: var(--mastors-color-danger);
}

// ❌ Wrong — not semantic
.alert-error {
  color: var(--mastors-color-red-600);
}
```

---

## 9. Use Placeholders for Repeated Silent Patterns

```scss
@use '@mastorscdn/core/abstracts' as abs;

.card-header {
  @extend %mastors-flex-center;
}

.thumbnail {
  @extend %mastors-cover;
}
```

---

## 10. Test All Components in Dark Mode

Every new component should be tested with:
```html
<html data-theme="dark">
```

If it looks broken, you have hard-coded color values somewhere. Use CSS variables.
