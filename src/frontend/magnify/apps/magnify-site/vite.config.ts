import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // grommet declares in its package.json a sideEffects attribute which targets
      // ThemeContext module. For still unknown reason, this module is removed during
      // the rollup tree shaking. As a workaround, we disable the tree shaking.
      // The drawback is that the bundle size is bigger (about 9%).
      treeshake: false,
    },
  },
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
