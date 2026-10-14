# AGENTS.md

Vite + React + TypeScript + Tailwind site for impeccablecookie.com, deployed to GitHub Pages on push to `main`.

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Motion

For animation, follow `motion/AGENTS.md` in ryankolean/summit-components (local clone: `~/code/summit-components/motion/`) and reuse its examples. This site's motion is CSS only: the hero load sequence (`.hero-in`, `.hero-photo-in`, `.hero-glow-in`) and scroll-driven reveals (`.reveal`), all in `src/index.css`. GSAP was tried for the hero and removed: it added 28.5 kB gzip to the critical bundle and cost ~400 ms mobile LCP. Add a JS animation library only for something CSS cannot do, and measure Lighthouse before and after. Never fade the hero photo from opacity 0; it is the LCP element.
