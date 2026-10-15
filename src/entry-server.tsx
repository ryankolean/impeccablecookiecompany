import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

// Built with `vite build --ssr` and called once by scripts/prerender.mjs. The tree must
// match src/main.tsx exactly so hydration finds the same markup.
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
