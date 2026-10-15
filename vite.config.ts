import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // The client and the SSR build both inline this, so the prerendered copyright year
  // matches what hydration renders.
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  build: {
    // The SSR build (dist-ssr) only feeds scripts/prerender.mjs; it needs no public/ copy.
    copyPublicDir: !isSsrBuild,
  },
}));
