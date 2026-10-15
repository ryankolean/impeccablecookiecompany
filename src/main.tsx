import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
// Imported after App on purpose: the section stylesheets (imported by the components)
// come first in the bundle, so Tailwind utilities win over them at equal specificity.
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build prerenders the app into #root (scripts/prerender.mjs); the dev
// server serves an empty #root.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

// Newsreader italic 400 only sets below-the-fold accent words. Registered after the load
// event, so it never competes with the hero photo (the LCP element) or the first paint;
// until it lands those words show the roman face slanted. Same subset as src/index.css.
function loadItalic() {
  const italic = new FontFace('Newsreader', "url(/fonts/newsreader-italic-400.woff2) format('woff2')", {
    style: 'italic',
    weight: '400',
    display: 'swap',
    unicodeRange:
      'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  });
  document.fonts.add(italic);
  italic.load().catch(() => {}); // a failed download keeps the slanted roman
}
// Under Save-Data the slanted roman stays, as the motion chunk is skipped there too.
const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
if (!saveData) {
  if (document.readyState === 'complete') loadItalic();
  else window.addEventListener('load', loadItalic, { once: true });
}
