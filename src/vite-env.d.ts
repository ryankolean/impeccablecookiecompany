/// <reference types="vite/client" />

// Build year, injected by vite.config.ts `define` so the prerender and the client
// bundle print the same copyright year.
declare const __BUILD_YEAR__: number;
