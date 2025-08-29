const { defineConfig } = require('vitest/config');
const vue = require('@vitejs/plugin-vue');
const { resolve } = require('path');

module.exports = defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-inspiration-setup.js'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test-*.js',
        '**/*.config.js',
        '**/*.config.ts',
        'coverage/',
        'dist/',
        'build/',
      ],
    },
    reporters: ['verbose'],
    retry: 2,
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src'),
    },
  },
});
