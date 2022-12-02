import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3200,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'setupTests.ts',
  },
});
