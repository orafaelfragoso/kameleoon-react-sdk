import { coverageConfigDefaults, defineConfig } from 'vitest/config'

/// <reference types="vitest" />
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      exclude: ['src/index.ts', ...coverageConfigDefaults.exclude],
      reporter: ['text', 'lcov'],
    },
  },
})
