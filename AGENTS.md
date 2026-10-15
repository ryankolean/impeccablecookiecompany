# AGENTS.md

Vite + React + TypeScript + Tailwind site for impeccablecookie.com, deployed to GitHub Pages on push to `main`.

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

`npm run build` also prerenders: it runs `vite build`, then `vite build --ssr src/entry-server.tsx --outDir dist-ssr`, then `scripts/prerender.mjs` writes the rendered app into `dist/index.html` and deletes `dist-ssr`. Components must not read `window`, `matchMedia`, storage, `Date` or `Math.random` while rendering; do that in effects.

## Motion

Motion is a progressive layer: the built HTML is complete and visible without JS, and every effect has a static fallback.

- **CSS first, on the critical path.** The hero load sequence (`.hero-in`, `.hero-in.no-fade`, `.hero-photo-in`, `.stamp-press`), the hero exit view timeline (`.hero-exit-turn`, `.hero-exit-shrink`) and section reveals (`.reveal`) live in `src/index.css`. Scroll-driven rules sit behind `@supports (animation-timeline: view()) and (animation-range: entry 0% cover 30%)`.
- **One deferred chunk.** `src/motion/MotionProvider.tsx` (tiny, critical path) dynamic-imports `src/motion/runtime.ts` after the `load` event plus `requestIdleCallback` (300 ms timeout where it is missing). The chunk holds GSAP (core, ScrollTrigger, SplitText) and Lenis, driven by one `gsap.ticker` loop. It is never downloaded under `prefers-reduced-motion: reduce` or Save-Data. The data-attribute contract (`data-split`, `data-scroll-reveal`, `data-ticket`, `data-arrival-focus`, `.reveal`) is documented at the top of `runtime.ts`.
- **Build gate.** `grep -c ScrollTrigger dist/assets/index-*.js` must print `0`, and `dist/index.html` must not modulepreload the runtime chunk. Never import `gsap`, `lenis` or a GSAP-based React Bits component from a critical-path module; the earlier eager GSAP attempt added 28.5 kB gzip and about 400 ms of mobile LCP.
- **In-page jumps** go through `useMotion().scrollToSection(id)` (hash links are routed automatically). It honours `scroll-padding-top: var(--header-h)`, focuses `[data-arrival-focus]` and writes the hash. Do not call `scrollIntoView` directly and do not add `scroll-behavior: smooth`.
- **Never fade the hero photo** (or its wrapper) from opacity 0: it is the LCP element. Hero text that could be the mobile LCP (H1, lede) moves with transform only.
- Measure Lighthouse mobile before and after any motion change, with both builds served by a static server that gzips text responses the way GitHub Pages does. An uncompressed server such as `python3 -m http.server` reads far worse and is not comparable (the earlier 94/93/96/92, 2.9 s, 507 KiB baseline came from one).
- Rebrand measurement, 2026-10-14: Lighthouse 12.8.2, mobile, simulated throttling, `--chrome-flags="--headless=new"`, 5 alternating runs per build, medians. Both builds (`vite build` of origin/main, and this branch's `npm run build`) were served locally by a small Node static server that gzips text responses the way GitHub Pages does.

  | Build | Performance | Accessibility | Best practices | SEO | LCP | FCP | TBT | CLS | Weight |
  |---|---|---|---|---|---|---|---|---|---|
  | main (3a73970) | 99 | 93 | 96 | 92 | 1.95 s | 1.20 s | 0 ms | 0.0001 | 378 KiB |
  | Rebrand | 99 | 100 | 100 | 100 | 1.82 s | 1.36 s | 0 ms | 0 | 238 KiB |
