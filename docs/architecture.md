# Architecture Guide — Mastors-Core

## Design Principles

Mastors-Core follows these foundational principles:

1. **Dart Sass Modern Only** — `@use`/`@forward` exclusively. No `@import`. No deprecated globals.
2. **Token-First** — All values derive from SCSS maps. No magic numbers in component code.
3. **CSS Variable Synced** — Every token also exists as a CSS custom property for runtime theming.
4. **Tree-Shakeable** — Import only what you need via `@use` namespacing.
5. **No Side Effects by Default** — `_index.scss` emits zero CSS. Only `mastors-core.scss` compiles output.
6. **Separation of Concerns** — Functions/mixins live in separate partials, never mixed with output CSS.

---

## Module Dependency Graph

```
mastors-core.scss (compile entry)
│
├── config/          ← Feature flags (no deps)
├── tokens/          ← Token maps (no deps)
│   ├── _colors.scss
│   ├── _shadows.scss
│   ├── _radius.scss
│   ├── _zindex.scss
│   ├── _opacity.scss
│   ├── _breakpoints.scss
│   ├── _motion.scss
│   └── _borders.scss
│
├── functions/       ← Uses tokens + sass:map/math
│   ├── _map-helpers.scss
│   ├── _token-accessors.scss
│   └── _math.scss
│
├── mixins/          ← Uses tokens + functions
│   ├── _responsive.scss
│   ├── _helpers.scss
│   └── _css-vars.scss
│
├── abstracts/       ← Silent placeholders (no CSS output)
├── vendors/         ← Normalize supplement
├── base/            ← Reset + motion defaults
├── themes/          ← Light + dark + custom
├── accessibility/   ← A11y classes
├── helpers/         ← Container + states
├── generators/      ← Utility class output
└── utilities/       ← Spacing, sizing, borders
```

---

## @use vs @forward Rules

| File Type     | Rule                                                    |
|---------------|---------------------------------------------------------|
| `_index.scss` | `@forward` only — re-exports for consumers              |
| Partials      | `@use` only — imports what it needs internally          |
| Entry file    | `@use` only — orchestrates compilation order            |

---

## Naming Conventions

| Type              | Convention                         | Example                          |
|-------------------|------------------------------------|----------------------------------|
| SCSS variables    | `$mastors-{group}-{key}`           | `$mastors-colors`, `$mastors-radius` |
| Functions         | `{name}($key, $fallback)`          | `color('primary')`, `z('modal')` |
| Mixins            | `{name}()`                         | `@include up('md')`              |
| CSS custom props  | `--mastors-{group}-{key}`          | `--mastors-color-primary`        |
| Utility classes   | `.{group}-{key}`                   | `.shadow-lg`, `.rounded-xl`      |
| Helper classes    | `.mastors-{name}`                  | `.mastors-skeleton`, `.mastors-sr-only` |

---

## Adding a New Token Group

1. Create `scss/tokens/_my-tokens.scss`:
```scss
$mastors-my-tokens: (
  'foo': 42px,
  'bar': 100ms,
) !default;
```

2. Forward from `scss/tokens/_index.scss`:
```scss
@forward 'my-tokens';
```

3. Add accessor to `scss/functions/_token-accessors.scss`:
```scss
@use '../tokens/my-tokens' as t-my;

@function my-token($key, $fallback: null) {
  @return helpers.mastors-map-get(t-my.$mastors-my-tokens, $key, $fallback, 'my-token()');
}
```

4. Export from `scss/functions/_index.scss`:
```scss
@forward 'token-accessors' show my-token;
```

5. Add CSS variable generation in `scss/mixins/_css-vars.scss`:
```scss
@each $key, $value in t-my.$mastors-my-tokens {
  --#{cfg.$mastors-prefix}-my-#{$key}: #{$value};
}
```

---

## Adding a New Utility Generator

1. Create `scss/generators/_my-utilities.scss`:
```scss
@use 'sass:map';
@use '../tokens/my-tokens' as t;
@use '../config/settings' as cfg;

@if cfg.$enable-utilities {
  @each $key, $value in t.$mastors-my-tokens {
    .my-#{$key} { some-property: $value !important; }
  }
}
```

2. Forward from `scss/generators/_index.scss`:
```scss
@forward 'my-utilities';
```

---

## Integration Pattern for Other Mastors Libraries

```scss
// In mastors-flexer/_index.scss
@use '@mastorscdn/core' as mc;
@use '@mastorscdn/core/tokens/breakpoints' as t-bp;

// Use responsive mixin
.mastors-flex-container {
  @include mc.up('md') {
    display: flex;
  }
}

// Use token function
.mastors-flex-gap {
  gap: mc.rem(16);
}
```
