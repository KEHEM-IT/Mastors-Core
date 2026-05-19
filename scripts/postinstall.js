#!/usr/bin/env node
// =============================================================================
// Mastors-Core | postinstall.js
// Runs after `npm install @mastorscdn/core`
// • Auto-detects framework (Next, Nuxt, Vite, Angular, …)
// • Auto-detects TypeScript → creates mc.config.ts instead of mc.config.js
// • Writes mc.config.{js|ts} with primary/secondary color overrides
// • Writes .mastors-cache.json with version + list of generated files
// =============================================================================

'use strict';

const fs   = require('fs');
const path = require('path');

// ── ANSI colours ─────────────────────────────────────────────────────────────
const C = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  cyan:    '\x1b[36m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  magenta: '\x1b[35m',
  gray:    '\x1b[90m',
};

const b  = (s) => `${C.bold}${s}${C.reset}`;
const c  = (s) => `${C.cyan}${s}${C.reset}`;
const g  = (s) => `${C.green}${s}${C.reset}`;
const y  = (s) => `${C.yellow}${s}${C.reset}`;
const m  = (s) => `${C.magenta}${s}${C.reset}`;
const gr = (s) => `${C.gray}${s}${C.reset}`;

// ── Resolve user's project root ───────────────────────────────────────────────
function findProjectRoot() {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    const pkg = path.join(dir, 'package.json');
    if (fs.existsSync(pkg)) {
      try {
        const p = JSON.parse(fs.readFileSync(pkg, 'utf8'));
        if (p.name !== '@mastorscdn/core') return dir;
      } catch (_) {}
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

const ROOT = findProjectRoot();

// ── Read user's package.json ──────────────────────────────────────────────────
function getUserPkg() {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  } catch (_) {
    return {};
  }
}

// ── TypeScript detection ──────────────────────────────────────────────────────
function detectTypeScript(pkg) {
  const all = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };

  // 1. typescript package present
  if (all['typescript']) return true;

  // 2. tsconfig.json exists at project root
  if (fs.existsSync(path.join(ROOT, 'tsconfig.json'))) return true;

  // 3. tsconfig.*.json variant
  try {
    const entries = fs.readdirSync(ROOT);
    if (entries.some((f) => /^tsconfig.*\.json$/.test(f))) return true;
  } catch (_) {}

  // 4. Any .ts / .tsx source files at root level
  try {
    const entries = fs.readdirSync(ROOT);
    if (entries.some((f) => /\.(ts|tsx)$/.test(f))) return true;
  } catch (_) {}

  return false;
}

// ── Framework detection ───────────────────────────────────────────────────────
function detectFramework(pkg) {
  const all = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };
  const has = (name) => Boolean(all[name]);

  if (has('next'))                                        return 'next';
  if (has('nuxt') || has('@nuxt/ui'))                     return 'nuxt';
  if (has('astro') || has('@astrojs/react'))              return 'astro';
  if (has('@sveltejs/kit'))                               return 'sveltekit';
  if (has('svelte'))                                      return 'svelte';
  if (has('@remix-run/react') || has('@remix-run/node'))  return 'remix';
  if (has('vite') && has('vue'))                          return 'vite-vue';
  if (has('vite') && has('react'))                        return 'vite-react';
  if (has('vite'))                                        return 'vite';
  if (has('vue'))                                         return 'vue-cli';
  if (has('@angular/core'))                               return 'angular';
  if (has('react'))                                       return 'react';
  return 'node';
}

// ── Banner ────────────────────────────────────────────────────────────────────
function banner() {
  console.log('');
  console.log(b(c('  ╔══════════════════════════════════════════╗')));
  console.log(b(c('  ║        @mastorscdn/core installed!       ║')));
  console.log(b(c('  ╚══════════════════════════════════════════╝')));
  console.log('');
}

// ── Framework guides ──────────────────────────────────────────────────────────
function guideNode() {
  console.log(b(g('  ✔  Plain Node + Sass')));
  console.log('');
  console.log('  Run sass with --load-path:');
  console.log('');
  console.log(c('    sass --watch src/main.scss:dist/main.css --load-path=node_modules'));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideNext() {
  console.log(b(g('  ✔  Next.js detected')));
  console.log('');
  console.log('  Add to ' + c('next.config.mjs') + ':');
  console.log('');
  console.log(gr("    const nextConfig = {"));
  console.log(gr("      sassOptions: { loadPaths: ['./node_modules'] },"));
  console.log(gr("    };"));
  console.log(gr("    export default nextConfig;"));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideVite(flavour) {
  const label = { 'vite-vue': 'Vite + Vue', 'vite-react': 'Vite + React', vite: 'Vite' }[flavour] || 'Vite';
  console.log(b(g(`  ✔  ${label} detected`)));
  console.log('');
  console.log('  Add to ' + c('vite.config.js / vite.config.ts') + ':');
  console.log('');
  console.log(gr("    css: { preprocessorOptions: { scss: {"));
  console.log(gr("      api: 'modern-compiler',"));
  console.log(gr("      loadPaths: ['./node_modules'],"));
  console.log(gr("    } } },"));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideNuxt() {
  console.log(b(g('  ✔  Nuxt detected')));
  console.log('');
  console.log('  Add to ' + c('nuxt.config.ts') + ':');
  console.log('');
  console.log(gr("    vite: { css: { preprocessorOptions: { scss: {"));
  console.log(gr("      api: 'modern-compiler',"));
  console.log(gr("      loadPaths: ['./node_modules'],"));
  console.log(gr("    } } } },"));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideAstro() {
  console.log(b(g('  ✔  Astro detected')));
  console.log('');
  console.log('  Add to ' + c('astro.config.mjs') + ':');
  console.log('');
  console.log(gr("    vite: { css: { preprocessorOptions: { scss: {"));
  console.log(gr("      api: 'modern-compiler',"));
  console.log(gr("      loadPaths: [path.resolve('./node_modules')],"));
  console.log(gr("    } } } },"));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideSvelteKit() {
  console.log(b(g('  ✔  SvelteKit detected')));
  console.log('');
  console.log('  Add to ' + c('vite.config.js') + ':');
  console.log('');
  console.log(gr("    css: { preprocessorOptions: { scss: {"));
  console.log(gr("      api: 'modern-compiler',"));
  console.log(gr("      loadPaths: [path.resolve('./node_modules')],"));
  console.log(gr("    } } },"));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideRemix() {
  console.log(b(g('  ✔  Remix detected')));
  console.log('');
  console.log('  Add to ' + c('vite.config.ts') + ':');
  console.log('');
  console.log(gr("    css: { preprocessorOptions: { scss: {"));
  console.log(gr("      api: 'modern-compiler',"));
  console.log(gr("      loadPaths: ['./node_modules'],"));
  console.log(gr("    } } },"));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideAngular() {
  console.log(b(g('  ✔  Angular detected')));
  console.log('');
  console.log('  In ' + c('angular.json') + ' under build > options:');
  console.log('');
  console.log(gr('    "stylePreprocessorOptions": {'));
  console.log(gr('      "includePaths": ["node_modules"]'));
  console.log(gr('    }'));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

// ── mc.config.{js|ts} writer ──────────────────────────────────────────────────
function writeMcConfig(framework, isTypeScript) {
  const ext        = isTypeScript ? 'ts' : 'js';
  const configName = `mc.config.${ext}`;
  const configPath = path.join(ROOT, configName);

  // Never overwrite an existing config
  if (fs.existsSync(configPath)) return configName;

  // ── TypeScript version ────────────────────────────────────────────────────
  const tsContent = `// =============================================================================
// mc.config.ts — Mastors Core Configuration
// Auto-generated by @mastorscdn/core on install  (framework: ${framework})
//
// Customise design tokens here — they will be passed to your SCSS as
// @use overrides, just like Tailwind's theme config.
//
// Full docs: https://mastorscdn.kehem.com/docs/configuration
// =============================================================================

import type { McConfig } from '@mastorscdn/core';

const mcConfig: McConfig = {
  // ── Sass load path (required for bundler integration) ──────────────────────
  loadPaths: ['./node_modules'],

  // ── Brand colours ──────────────────────────────────────────────────────────
  // These map directly to the SCSS token overrides below.
  // Accepts any valid CSS colour value: hex, rgb(), hsl(), oklch(), etc.
  theme: {
    colors: {
      primary:          '#6366f1',   // indigo-500  — your main brand colour
      'primary-light':  '#a5b4fc',   // indigo-300
      'primary-dark':   '#4338ca',   // indigo-700

      secondary:        '#8b5cf6',   // violet-500
      'secondary-light':'#c4b5fd',   // violet-300
      'secondary-dark': '#6d28d9',   // violet-700

      accent:           '#06b6d4',   // cyan-500
      'accent-light':   '#67e8f9',   // cyan-300
      'accent-dark':    '#0e7490',   // cyan-700
    },
  },

  // ── SCSS @use override block (copy into your main .scss entry file) ─────────
  //
  //   @use '@mastorscdn/core' with (
  //     $enable-dark-theme:   true,
  //     $enable-utilities:    true,
  //     $mastors-prefix:      'mc',
  //     $mastors-colors: map.merge($mastors-colors, (
  //       'primary':         #6366f1,
  //       'primary-light':   #a5b4fc,
  //       'primary-dark':    #4338ca,
  //       'secondary':       #8b5cf6,
  //       'secondary-light': #c4b5fd,
  //       'secondary-dark':  #6d28d9,
  //       'accent':          #06b6d4,
  //       'accent-light':    #67e8f9,
  //       'accent-dark':     #0e7490,
  //     )),
  //   );
};

export default mcConfig;
`;

  // ── JavaScript version ────────────────────────────────────────────────────
  const jsContent = `// =============================================================================
// mc.config.js — Mastors Core Configuration
// Auto-generated by @mastorscdn/core on install  (framework: ${framework})
//
// Customise design tokens here — they will be passed to your SCSS as
// @use overrides, just like Tailwind's theme config.
//
// Full docs: https://mastorscdn.kehem.com/docs/configuration
// =============================================================================

/** @type {import('@mastorscdn/core').McConfig} */
const mcConfig = {
  // ── Sass load path (required for bundler integration) ──────────────────────
  loadPaths: ['./node_modules'],

  // ── Brand colours ──────────────────────────────────────────────────────────
  // These map directly to the SCSS token overrides below.
  // Accepts any valid CSS colour value: hex, rgb(), hsl(), oklch(), etc.
  theme: {
    colors: {
      primary:            '#6366f1',   // indigo-500  — your main brand colour
      'primary-light':    '#a5b4fc',   // indigo-300
      'primary-dark':     '#4338ca',   // indigo-700

      secondary:          '#8b5cf6',   // violet-500
      'secondary-light':  '#c4b5fd',   // violet-300
      'secondary-dark':   '#6d28d9',   // violet-700

      accent:             '#06b6d4',   // cyan-500
      'accent-light':     '#67e8f9',   // cyan-300
      'accent-dark':      '#0e7490',   // cyan-700
    },
  },

  // ── SCSS @use override block (copy into your main .scss entry file) ─────────
  //
  //   @use '@mastorscdn/core' with (
  //     $enable-dark-theme:   true,
  //     $enable-utilities:    true,
  //     $mastors-prefix:      'mc',
  //     $mastors-colors: map.merge($mastors-colors, (
  //       'primary':         #6366f1,
  //       'primary-light':   #a5b4fc,
  //       'primary-dark':    #4338ca,
  //       'secondary':       #8b5cf6,
  //       'secondary-light': #c4b5fd,
  //       'secondary-dark':  #6d28d9,
  //       'accent':          #06b6d4,
  //       'accent-light':    #67e8f9,
  //       'accent-dark':     #0e7490,
  //     )),
  //   );
};

module.exports = mcConfig;
`;

  const content = isTypeScript ? tsContent : jsContent;

  try {
    fs.writeFileSync(configPath, content, 'utf8');
    return configName;
  } catch (_) {
    return null;
  }
}

// ── .mastors-cache.json writer ────────────────────────────────────────────────
// Records which files were generated so preuninstall knows exactly what to remove.
function writeCacheJson(framework, isTypeScript, generatedFiles) {
  const cachePath = path.join(ROOT, '.mastors-cache.json');

  // Read own version from package.json
  let version = '1.0.3';
  try {
    const selfPkg = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'),
    );
    version = selfPkg.version || version;
  } catch (_) {}

  const cache = {
    version,
    generatedAt:    new Date().toISOString(),
    framework,
    typescript:     isTypeScript,
    generatedFiles, // ← preuninstall reads this
  };

  try {
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch (_) {}
}

// ── Footer ────────────────────────────────────────────────────────────────────
function footer(configName, isTypeScript) {
  console.log(b('  ─────────────────────────────────────────────'));
  console.log('');
  console.log('  ' + b('In any .scss file:'));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
  console.log(gr('    .card {'));
  console.log(gr("      color:         mc.color('primary');"));
  console.log(gr("      border-radius: mc.radius('lg');"));
  console.log(gr("      box-shadow:    mc.shadow('md');"));
  console.log(gr("      @include mc.up('md') { padding: 2rem; }"));
  console.log(gr("      @include mc.container('lg');"));
  console.log(gr('    }'));
  console.log('');
  if (configName) {
    console.log('  ' + y(`📄 ${configName} written to your project root.`));
    console.log('  ' + gr('   Edit theme.colors to set your brand palette.'));
    console.log('');
  }
  if (isTypeScript) {
    console.log('  ' + y('🔷 TypeScript detected — config created as .ts'));
    console.log('');
  }
  console.log('  ' + b('Docs:') + ' ' + c('https://mastorscdn.kehem.com/'));
  console.log('  ' + b('npm:')  + ' ' + c('https://www.npmjs.com/package/@mastorscdn/core'));
  console.log('');
  console.log(b(c('  Happy styling with Mastors Core! 🚀')));
  console.log('');
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  if (process.env.CI && process.env.MASTORS_SILENT) return;

  const pkg         = getUserPkg();
  const framework   = detectFramework(pkg);
  const isTypeScript = detectTypeScript(pkg);

  banner();
  console.log(`  ${b('Detected environment:')} ${g(framework)}`);
  console.log(`  ${b('TypeScript:')}           ${isTypeScript ? g('yes') : gr('no')}`);
  console.log('');

  switch (framework) {
    case 'next':        guideNext();             break;
    case 'nuxt':        guideNuxt();             break;
    case 'astro':       guideAstro();            break;
    case 'sveltekit':
    case 'svelte':      guideSvelteKit();        break;
    case 'remix':       guideRemix();            break;
    case 'vite-vue':    guideVite('vite-vue');   break;
    case 'vite-react':  guideVite('vite-react'); break;
    case 'vite':        guideVite('vite');       break;
    case 'angular':     guideAngular();          break;
    default:            guideNode();             break;
  }

  // Generate config file (skip for plain Node — no bundler to configure)
  let configName = null;
  const generatedFiles = ['.mastors-cache.json'];

  if (framework !== 'node') {
    configName = writeMcConfig(framework, isTypeScript);
    if (configName) generatedFiles.push(configName);
  }

  // Always write cache (tracks generated files for clean uninstall)
  writeCacheJson(framework, isTypeScript, generatedFiles);

  footer(configName, isTypeScript);
}

main();
