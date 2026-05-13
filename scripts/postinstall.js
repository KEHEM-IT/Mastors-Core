#!/usr/bin/env node
// =============================================================================
// Mastors-Core | postinstall.js
// Runs after `npm install @mastorscdn/core`
// Auto-detects the user's framework and prints the exact setup guide.
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
// When installed as a dep, __dirname = .../node_modules/@mastorscdn/core/scripts
// So root is several levels up from here.
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

function getUserPkg() {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  } catch (_) {
    return {};
  }
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

// ── Guides ────────────────────────────────────────────────────────────────────

function guideNode() {
  console.log(b(g('  ✔  Plain Node + Sass')));
  console.log('');
  console.log('  Run sass with --load-path:');
  console.log('');
  console.log(c('    sass --watch src/main.scss:dist/main.css --load-path=node_modules'));
  console.log('');
  console.log('  Or add to your package.json scripts:');
  console.log('');
  console.log(gr('    "sass:watch": "sass --watch src/main.scss:dist/main.css --load-path=node_modules"'));
  console.log('');
  console.log('  Then in your SCSS:');
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
  console.log('  Import in ' + c('app/layout.tsx') + ' or ' + c('pages/_app.js') + ':');
  console.log(gr("    import '../styles/globals.scss';"));
  console.log('');
  console.log('  In globals.scss:');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideVite(flavour) {
  const label = { 'vite-vue': 'Vite + Vue', 'vite-react': 'Vite + React', 'vite': 'Vite' }[flavour] || 'Vite';
  console.log(b(g(`  ✔  ${label} detected`)));
  console.log('');
  console.log('  Add to ' + c('vite.config.js') + ':');
  console.log('');
  console.log(gr("    import path from 'path';"));
  console.log(gr("    export default defineConfig({"));
  console.log(gr("      css: {"));
  console.log(gr("        preprocessorOptions: {"));
  console.log(gr("          scss: {"));
  console.log(gr("            api: 'modern-compiler',"));
  console.log(gr("            loadPaths: [path.resolve(__dirname, 'node_modules')],"));
  console.log(gr("          },"));
  console.log(gr("        },"));
  console.log(gr("      },"));
  console.log(gr("    });"));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideNuxt() {
  console.log(b(g('  ✔  Nuxt detected')));
  console.log('');
  console.log('  Add to ' + c('nuxt.config.ts') + ':');
  console.log('');
  console.log(gr("    export default defineNuxtConfig({"));
  console.log(gr("      vite: {"));
  console.log(gr("        css: {"));
  console.log(gr("          preprocessorOptions: {"));
  console.log(gr("            scss: {"));
  console.log(gr("              api: 'modern-compiler',"));
  console.log(gr("              loadPaths: ['./node_modules'],"));
  console.log(gr("            },"));
  console.log(gr("          },"));
  console.log(gr("        },"));
  console.log(gr("      },"));
  console.log(gr("    });"));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideAstro() {
  console.log(b(g('  ✔  Astro detected')));
  console.log('');
  console.log('  Add to ' + c('astro.config.mjs') + ':');
  console.log('');
  console.log(gr("    import path from 'path';"));
  console.log(gr("    export default defineConfig({"));
  console.log(gr("      vite: {"));
  console.log(gr("        css: { preprocessorOptions: { scss: {"));
  console.log(gr("          api: 'modern-compiler',"));
  console.log(gr("          loadPaths: [path.resolve('./node_modules')],"));
  console.log(gr("        } } },"));
  console.log(gr("      },"));
  console.log(gr("    });"));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideSvelteKit() {
  console.log(b(g('  ✔  SvelteKit detected')));
  console.log('');
  console.log('  Add to ' + c('vite.config.js') + ':');
  console.log('');
  console.log(gr("    import path from 'path';"));
  console.log(gr("    export default { plugins: [sveltekit()],"));
  console.log(gr("      css: { preprocessorOptions: { scss: {"));
  console.log(gr("        api: 'modern-compiler',"));
  console.log(gr("        loadPaths: [path.resolve('./node_modules')],"));
  console.log(gr("      } } },"));
  console.log(gr("    };"));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
}

function guideRemix() {
  console.log(b(g('  ✔  Remix detected')));
  console.log('');
  console.log('  Add to ' + c('vite.config.ts') + ' css section:');
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

// ── Write mc.config.js ────────────────────────────────────────────────────────
function writeMcConfig(framework) {
  const configPath = path.join(ROOT, 'mc.config.js');
  if (fs.existsSync(configPath)) return;

  const content = `// =============================================================================
// mc.config.js — Mastors Core Configuration Reference
// Auto-generated by @mastorscdn/core on install
// Detected framework: ${framework}
//
// Copy the relevant snippet from this file into your bundler config.
// Full docs: https://mastorscdn.kehem.com/
// =============================================================================

/** @type {import('@mastorscdn/core').McConfig} */
const mcConfig = {
  // Add to your bundler's scss preprocessorOptions:
  loadPaths: ['./node_modules'],

  // Override Mastors tokens in SCSS:
  //   @use '@mastorscdn/core' with (
  //     $enable-dark-theme:   true,
  //     $enable-utilities:    true,
  //     $mastors-prefix:      'mc',
  //   );
};

module.exports = mcConfig;
`;

  try { fs.writeFileSync(configPath, content, 'utf8'); } catch (_) {}
}

// ── Footer ────────────────────────────────────────────────────────────────────
function footer(framework) {
  console.log(b('  ─────────────────────────────────────────────'));
  console.log('');
  console.log('  ' + b('In any .scss file:'));
  console.log('');
  console.log(m("    @use '@mastorscdn/core' as mc;"));
  console.log('');
  console.log(gr('    .card {'));
  console.log(gr("      color: mc.color('primary');"));
  console.log(gr("      border-radius: mc.radius('lg');"));
  console.log(gr("      box-shadow: mc.shadow('md');"));
  console.log(gr("      @include mc.up('md') { padding: 2rem; }"));
  console.log(gr('    }'));
  console.log('');
  console.log('  ' + b('Docs:') + ' ' + c('https://mastorscdn.kehem.com/'));
  console.log('  ' + b('npm:')  + ' ' + c('https://www.npmjs.com/package/@mastorscdn/core'));
  console.log('');
  if (framework !== 'node') {
    console.log('  ' + y('📄 mc.config.js written to your project root.'));
    console.log('');
  }
  console.log(b(c('  Happy styling with Mastors Core! 🚀')));
  console.log('');
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  if (process.env.CI && process.env.MASTORS_SILENT) return;

  const pkg       = getUserPkg();
  const framework = detectFramework(pkg);

  banner();
  console.log(`  ${b('Detected environment:')} ${g(framework)}`);
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

  if (framework !== 'node') writeMcConfig(framework);
  footer(framework);
}

main();
