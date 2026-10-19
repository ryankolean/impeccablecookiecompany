# AGENTS.md

Vite + React + TypeScript + Tailwind site for impeccablecookie.com, deployed to GitHub Pages on push to `main`.

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

`npm run build` also prerenders: it runs `vite build`, then `vite build --ssr src/entry-server.tsx --outDir dist-ssr`, then `scripts/prerender.mjs` writes the rendered pages into `dist/index.html` and `dist/about/index.html` and deletes `dist-ssr`. Components must not read `window`, `matchMedia`, storage, `Date` or `Math.random` while rendering; do that in effects.

## Pages

Two prerendered pages share one bundle: `/` (`src/App.tsx`) and `/about/` (`src/AboutApp.tsx`, copy in `src/components/About.tsx`). `src/main.tsx` hydrates the About tree when the markup carries `data-page="about"` (on the dev server, which serves `index.html` for every path, when the path is `/about/`). `scripts/prerender.mjs` builds the About head from the same template: its own title, description, canonical and Open Graph and Twitter URL and text, and no hero image preload. Each replacement must match exactly once or the build fails. It also strips the template's HTML comments, never the app markup's (React's hydration markers). `Header` and `Footer` take `page="about"`: their links lead back to the homepage sections (`/#cookies`, `/#order`), the wordmark to `/`, and "My story" is `aria-current="page"`. A new page also goes in `public/sitemap.xml` and `public/llms.txt`.

## Hero image

The hero is the cookie itself, cut out of its photo with no frame. `scripts/optimize-images.sh <dir-with-originals>` lifts the subject with `scripts/lift-subject.swift` (Apple Vision, macOS 14+), cleans the mask edge, applies the grade in the script, and writes `public/images/hero-{480,720,960,1440}.avif` and `.webp`, both with alpha and stripped of metadata. Camera originals carry GPS and device EXIF and never go in the repo. The butter disc behind the cookie (`.hero__stage::before`), the contact shadow (a CSS gradient) and the crumbs (a CSS `data:` SVG) are drawn in `src/styles/hero.css`, never baked into the image. `HERO_SIZES` in `src/components/Photo.tsx` is the cookie's rendered width at each step of `hero.css`, and the `imagesrcset` / `imagesizes` preload in `index.html` must equal it, or the preload is wasted.

## CSS order

Component stylesheets (`src/styles/*.css`) load before `src/index.css` in the bundle, so a one-class rule there loses to a primitive of equal specificity such as `.pill`. Scope any override of a primitive with a second class (`.how__next .ready`, `.order-form .order-form__submit`, `.cookie-card .cookie-card__cta`).

## Motion

Motion is a progressive layer: the built HTML is complete and visible without JS, and every effect has a static fallback.

- **CSS first, on the critical path.** The hero text load (`.hero-in`, `.hero-in.no-fade`) and section reveals (`.reveal`) live in `src/index.css`. The hero cookie's load settle (`.hero-cookie-in`) and scroll exit (`.hero-exit-lift`) live in `src/styles/hero.css`. The order step cards rise with `.reveal`; their badge pop and arrow draw are CSS view timelines in `src/styles/order.css`, where the "Ready to order?" arrow bob also lives. Scroll-driven rules sit behind `@supports (animation-timeline: view()) and (animation-range: entry 0% cover 30%)`; where that fails (Firefox) the badges and arrows stay static and `runtime.ts` replays `.reveal`.
- **One deferred chunk.** `src/motion/MotionProvider.tsx` (tiny, critical path) dynamic-imports `src/motion/runtime.ts` after the `load` event plus `requestIdleCallback` (300 ms timeout where it is missing). The chunk holds GSAP (core, ScrollTrigger, SplitText) and Lenis, driven by one `gsap.ticker` loop. It is never downloaded under `prefers-reduced-motion: reduce` or Save-Data. The data-attribute contract (`data-split`, `data-scroll-reveal`, `data-arrival-focus`, `.reveal`) is documented at the top of `runtime.ts`.
- **Build gate.** `grep -c ScrollTrigger dist/assets/index-*.js` must print `0`, and `dist/index.html` must not modulepreload the runtime chunk. Never import `gsap`, `lenis` or a GSAP-based React Bits component from a critical-path module; the earlier eager GSAP attempt added 28.5 kB gzip and about 400 ms of mobile LCP.
- **In-page jumps** go through `useMotion().scrollToSection(id)` (hash links are routed automatically). It honours `scroll-padding-top: var(--header-h)`, focuses `[data-arrival-focus]` and writes the hash. Do not call `scrollIntoView` directly and do not add `scroll-behavior: smooth`.
- **Never fade the hero cookie** (or its wrappers) from opacity 0: it is the LCP element. Hero text that could be the mobile LCP (H1, lede) moves with transform only.
- Measure Lighthouse mobile before and after any motion change, with both builds served by a static server that gzips text responses the way GitHub Pages does. An uncompressed server such as `python3 -m http.server` reads far worse and is not comparable (the earlier 94/93/96/92, 2.9 s, 507 KiB baseline came from one).
- Rebrand measurement, 2026-10-14: Lighthouse 12.8.2, mobile, simulated throttling, `--chrome-flags="--headless=new"`, 5 alternating runs per build, medians. Both builds (`vite build` of origin/main, and this branch's `npm run build`) were served locally by a small Node static server that gzips text responses the way GitHub Pages does.

  | Build | Performance | Accessibility | Best practices | SEO | LCP | FCP | TBT | CLS | Weight |
  |---|---|---|---|---|---|---|---|---|---|
  | main (3a73970) | 99 | 93 | 96 | 92 | 1.95 s | 1.20 s | 0 ms | 0.0001 | 378 KiB |
  | Rebrand | 99 | 100 | 100 | 100 | 1.82 s | 1.36 s | 0 ms | 0 | 238 KiB |

- Hero cutout and ordering cards, 2026-10-16: same method, with `npm run build` for both builds (main is now prerendered too).

  | Build | Performance | Accessibility | Best practices | SEO | LCP | FCP | TBT | CLS | Weight |
  |---|---|---|---|---|---|---|---|---|---|
  | main (7faef8e) | 99 | 100 | 100 | 100 | 1.83 s | 1.36 s | 0 ms | 0 | 238 KiB |
  | Hero cutout + step cards | 99 | 100 | 100 | 100 | 1.68 s | 1.36 s | 0 ms | 0 | 236 KiB |

- About page and story high points, 2026-10-19: same method. The homepage carries the About component and `about.css` in the shared bundle (+2.6 KiB), and its HTML is 0.1 KB smaller (template comments stripped).

  | Build | Performance | Accessibility | Best practices | SEO | LCP | FCP | TBT | CLS | Weight |
  |---|---|---|---|---|---|---|---|---|---|
  | main (556087f), homepage | 99 | 100 | 100 | 100 | 1.68 s | 1.36 s | 0 ms | 0 | 235 KiB |
  | This change, homepage | 99 | 100 | 100 | 100 | 1.68 s | 1.37 s | 0 ms | 0 | 238 KiB |
  | This change, /about/ | 100 | 100 | 100 | 100 | 1.51 s | 1.36 s | 0 ms | 0 | 202 KiB |

- **Keep `dist/index.html` under about 14 KB gzip**, one TCP initial window. At 14.9 KB the page took an extra round trip and Lighthouse mobile read 300 ms worse on both FCP and LCP. Decorative drawings that need no animation go in CSS as `data:` SVG backgrounds (the hero crumbs, the order chapter's pin, sparks, loop, heart and corner cookie), not inline SVG.
