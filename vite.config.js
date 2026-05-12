import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // ── Build Configuration ─────────────────────────────────────────────────
  build: {
    outDir: 'dist',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        'mastors-core': path.resolve(__dirname, 'scss/mastors-core.scss'),
      },
      output: {
        assetFileNames: '[name][extname]',
      },
    },

    cssCodeSplit: false,
    sourcemap: true,
    minify: false, // Use sass:min script for minified version
  },

  // ── CSS / SCSS Configuration ─────────────────────────────────────────────
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',        // Dart Sass modern API
        silenceDeprecations: [],       // Surface all deprecations
        alertColor: true,
      },
    },
    devSourcemap: true,
  },

  // ── Resolve Aliases ──────────────────────────────────────────────────────
  resolve: {
    alias: {
      '@mastors/core':    path.resolve(__dirname, 'scss/_index.scss'),
      '@tokens':          path.resolve(__dirname, 'scss/tokens'),
      '@functions':       path.resolve(__dirname, 'scss/functions'),
      '@mixins':          path.resolve(__dirname, 'scss/mixins'),
      '@themes':          path.resolve(__dirname, 'scss/themes'),
      '@generators':      path.resolve(__dirname, 'scss/generators'),
      '@utilities':       path.resolve(__dirname, 'scss/utilities'),
      '@base':            path.resolve(__dirname, 'scss/base'),
      '@helpers':         path.resolve(__dirname, 'scss/helpers'),
      '@accessibility':   path.resolve(__dirname, 'scss/accessibility'),
      '@abstracts':       path.resolve(__dirname, 'scss/abstracts'),
    },
  },

  // ── Dev Server ───────────────────────────────────────────────────────────
  server: {
    port: 3900,
    open: false,
  },
});
