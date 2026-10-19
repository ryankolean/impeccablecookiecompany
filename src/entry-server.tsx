import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import AboutApp from './AboutApp';
import type { Page } from './pages';

// Built with `vite build --ssr` and called once per page by scripts/prerender.mjs. Each
// tree must match the one src/main.tsx hydrates exactly.
export function render(page: Page): string {
  return renderToString(<StrictMode>{page === 'about' ? <AboutApp /> : <App />}</StrictMode>);
}
