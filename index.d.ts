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

/** Shape of mc.config.js */
export interface McConfig {
  loadPaths?: string[];
}
