import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: {
        index: './src/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@tanstack/react-query', 'react-intl'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [dts(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'setupTests.ts',
    testTimeout: 10000,
  },
});
