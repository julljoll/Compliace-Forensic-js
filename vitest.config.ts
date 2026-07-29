import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/testing/setupTests.ts'],
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/tests/e2e/**',
    ],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'src/testing/',
        'tests/e2e/',
        '**/*.d.ts',
      ],
    },
  },
})
