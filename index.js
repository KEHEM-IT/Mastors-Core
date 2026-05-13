// =============================================================================
// @mastorscdn/core | index.js
// JavaScript entry point — exposes helpers for tooling integrations.
//
// What this gives you:
//   const mc = require('@mastorscdn/core');
//   mc.sassLoadPaths   → pass to Vite / Next sassOptions.loadPaths
//   mc.importer        → pass to sass.compile({ importers: [mc.importer] })
//   mc.scssEntry       → absolute path to scss/_index.scss
// =============================================================================

'use strict';

const path = require('path');
const { importer, getLoadPath, getNodeModulesPath } = require('./importer');

const PKG_ROOT     = path.resolve(__dirname);
const SCSS_ENTRY   = path.join(PKG_ROOT, 'scss', '_index.scss');
const SCSS_COMPILE = path.join(PKG_ROOT, 'scss', 'mastors-core.scss');

module.exports = {
  /** Sass FileImporter for programmatic sass.compile() */
  importer,

  /** Absolute path to this package's root (for --load-path) */
  getLoadPath,

  /** Absolute path to node_modules containing this package */
  getNodeModulesPath,

  /** Ready-to-use array for Vite / Next.js sassOptions.loadPaths */
  get sassLoadPaths() { return [getNodeModulesPath()]; },

  /** scss/_index.scss — use for @use API (no CSS output) */
  scssEntry: SCSS_ENTRY,

  /** scss/mastors-core.scss — compile this for the full CSS bundle */
  scssCompileEntry: SCSS_COMPILE,
};
