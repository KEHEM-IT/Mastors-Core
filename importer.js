// =============================================================================
// @mastorscdn/core | importer.js
// Custom Sass FileImporter — resolves `@mastorscdn/core` imports to the
// correct SCSS path without requiring --load-path in every sass command.
//
// Usage in Node.js sass API:
//   const sass = require('sass');
//   const { importer } = require('@mastorscdn/core/importer');
//
//   sass.compile('src/main.scss', { importers: [importer] });
//
// (Bundlers like Vite/Next/Nuxt use loadPaths config instead — no importer needed.)
// =============================================================================

'use strict';

const path = require('path');
const fs   = require('fs');
const url  = require('url');

// Absolute path to this package's scss/ folder
const SCSS_ROOT = path.resolve(__dirname, 'scss');

/**
 * Dart Sass FileImporter that resolves `@mastorscdn/core` and
 * `@mastorscdn/core/<sub-path>` to real .scss files on disk.
 */
const importer = {
  /**
   * @param {string} importUrl - The string after @use / @import
   * @returns {{ url: URL } | null}
   */
  findFileUrl(importUrl) {
    if (!importUrl.startsWith('@mastorscdn/core')) return null;

    // Strip package name prefix, keep optional sub-path
    const sub = importUrl.replace(/^@mastorscdn\/core\/?/, '');

    const target = sub
      ? path.join(SCSS_ROOT, sub)
      : path.join(SCSS_ROOT, '_index.scss');

    // Resolution order (mirrors Sass partial resolution)
    const candidates = sub
      ? [
          target + '.scss',
          path.join(path.dirname(target), '_' + path.basename(target) + '.scss'),
          path.join(target, '_index.scss'),
          target,
        ]
      : [target];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return { url: url.pathToFileURL(candidate) };
      }
    }

    return null; // fall through to Sass default resolution
  },
};

/**
 * Returns the node_modules directory that contains @mastorscdn/core.
 * Pass this as a loadPaths entry in your bundler.
 */
function getNodeModulesPath() {
  // __dirname is .../node_modules/@mastorscdn/core
  // So node_modules is two levels up
  return path.resolve(__dirname, '..', '..');
}

/**
 * Returns the package root (parent of scss/).
 * Use as --load-path value when running sass CLI.
 */
function getLoadPath() {
  return __dirname;
}

module.exports = { importer, getLoadPath, getNodeModulesPath };
