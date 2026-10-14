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

For animation, follow `motion/AGENTS.md` in ryankolean/summit-components (local clone: `~/code/summit-components/motion/`) and reuse its examples. This site uses GSAP (`gsap`, `@gsap/react` with `useGSAP()`) plus CSS scroll-driven reveals (`.reveal` in `src/index.css`). Do not add Motion/Framer Motion alongside it.
