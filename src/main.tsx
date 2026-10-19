import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import AboutApp from './AboutApp.tsx';
// Imported after the pages on purpose: the section stylesheets (imported by the
// components) come first in the bundle, so Tailwind utilities win over them at equal
// specificity.
import './index.css';

const root = document.getElementById('root')!;
// One bundle for both pages, so the About page's "Request an order" lands on a homepage
// whose script is already cached. The prerendered markup says which page this is
// (dist/about/index.html carries data-page="about"); the dev server serves index.html for
// every path, so there the URL decides.
const about = root.firstElementChild
  ? root.querySelector('[data-page="about"]') !== null
  : /^\/about\/?$/.test(location.pathname);
const app = <StrictMode>{about ? <AboutApp /> : <App />}</StrictMode>;

// The production build prerenders the app into #root (scripts/prerender.mjs); the dev
// server serves an empty #root.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

// Newsreader italic 400 only sets accent words below the homepage hero, and the About
// page's chapter numbers and pull quote, each on a line of its own so the swap reflows
// nothing (the About H1 uses a swash for this reason). Registered after the load event,
// so it never competes with the hero photo (the LCP element) or the first paint; until it
// lands those words show the roman face slanted. Same subset as src/index.css.
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
