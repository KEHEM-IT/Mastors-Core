// =============================================================================
// @mastorscdn/core | index.d.ts
// TypeScript type declarations
// =============================================================================

import type { FileImporter } from 'sass';

/** Sass FileImporter — pass to sass.compile({ importers: [importer] }) */
export declare const importer: FileImporter<'sync'>;

/** Returns the package root path (use as --load-path) */
export declare function getLoadPath(): string;

/** Returns the node_modules directory containing this package */
export declare function getNodeModulesPath(): string;

/** Ready-to-use array for Vite / Next.js sassOptions.loadPaths */
export declare const sassLoadPaths: string[];

/** Absolute path to scss/_index.scss (SCSS @use API entry) */
export declare const scssEntry: string;

/** Absolute path to scss/mastors-core.scss (CSS compile entry) */
export declare const scssCompileEntry: string;

/** Shape of mc.config.{js|ts} — mirrors Tailwind's theme config pattern */
export interface McThemeColors {
  /** Main brand colour, e.g. '#6366f1' */
  primary?:          string;
  'primary-light'?:  string;
  'primary-dark'?:   string;

  /** Secondary brand colour */
  secondary?:          string;
  'secondary-light'?:  string;
  'secondary-dark'?:   string;

  /** Accent / highlight colour */
  accent?:          string;
  'accent-light'?:  string;
  'accent-dark'?:   string;

  /** Any other custom colour tokens */
  [key: string]: string | undefined;
}

export interface McTheme {
  colors?: McThemeColors;
}

export interface McConfig {
  /** Sass load paths — pass to bundler's scss preprocessorOptions.loadPaths */
  loadPaths?: string[];

  /**
   * Brand theme overrides.
   * These map to SCSS $mastors-colors token overrides via @use … with (…).
   *
   * @example
   * theme: {
   *   colors: {
   *     primary: '#6366f1',
   *     secondary: '#8b5cf6',
   *   },
   * }
   */
  theme?: McTheme;
}
