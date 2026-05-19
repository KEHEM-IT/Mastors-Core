#!/usr/bin/env node
// =============================================================================
// Mastors-Core | preuninstall.js
// Runs before `npm uninstall @mastorscdn/core`
// Cleans up all files that postinstall.js created in the user's project root.
// =============================================================================

'use strict';

const fs   = require('fs');
const path = require('path');

// ── ANSI colours ─────────────────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  gray:   '\x1b[90m',
};
const b  = (s) => `${C.bold}${s}${C.reset}`;
const c  = (s) => `${C.cyan}${s}${C.reset}`;
const g  = (s) => `${C.green}${s}${C.reset}`;
const y  = (s) => `${C.yellow}${s}${C.reset}`;
const r  = (s) => `${C.red}${s}${C.reset}`;
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

// ── Files that postinstall.js may have created ────────────────────────────────
// The canonical list is stored inside .mastors-cache.json under "generatedFiles".
// We also hard-code known candidates as a fallback in case the cache was deleted.
const FALLBACK_FILES = [
  '.mastors-cache.json',
  'mc.config.js',
  'mc.config.ts',
];

function getGeneratedFiles() {
  const cachePath = path.join(ROOT, '.mastors-cache.json');
  try {
    const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    if (Array.isArray(cache.generatedFiles) && cache.generatedFiles.length > 0) {
      // Always include the cache file itself
      const files = new Set([...cache.generatedFiles, '.mastors-cache.json']);
      return [...files];
    }
  } catch (_) {}
  return FALLBACK_FILES;
}

// ── Delete a single file safely ───────────────────────────────────────────────
function deleteFile(relPath) {
  const absPath = path.join(ROOT, relPath);
  try {
    if (fs.existsSync(absPath)) {
      fs.unlinkSync(absPath);
      console.log(`  ${g('✔')}  Removed  ${c(relPath)}`);
      return true;
    } else {
      console.log(`  ${gr('–')}  Not found ${gr(relPath)}`);
      return false;
    }
  } catch (err) {
    console.log(`  ${r('✘')}  Could not remove ${y(relPath)}: ${err.message}`);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('');
  console.log(b(c('  ╔══════════════════════════════════════════╗')));
  console.log(b(c('  ║     @mastorscdn/core  —  uninstalling    ║')));
  console.log(b(c('  ╚══════════════════════════════════════════╝')));
  console.log('');
  console.log(`  ${b('Cleaning up generated files…')}`);
  console.log('');

  const files = getGeneratedFiles();
  let removed = 0;

  for (const f of files) {
    if (deleteFile(f)) removed++;
  }

  console.log('');
  if (removed === 0) {
    console.log(`  ${gr('No generated files found — nothing to clean up.')}`);
  } else {
    console.log(`  ${g(`✔  ${removed} file(s) removed.`)}`);
  }
  console.log('');
  console.log(b(c('  @mastorscdn/core uninstalled. Goodbye! 👋')));
  console.log('');
}

main();
