# impeccablecookiecompany

Site for impeccablecookie.com: Vite + React + TypeScript + Tailwind, deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `main`.

## Brand

Colours and breakpoints are tokens in `tailwind.config.js`. `src/index.css` mirrors the palette as CSS custom properties and holds the type scale (the `h1` to `h3` sizes and the `--fs-*` steps), the motion tokens (`--ease-*`, `--dur-micro`, `--rise-lg`), the self-hosted fonts (Newsreader and Figtree, in `public/fonts/`), the per-surface focus ring and the shared primitives.

## Content-Security-Policy

GitHub Pages cannot send response headers, so the policy is a `<meta http-equiv>` at the top of `index.html`. `scripts/prerender.mjs` replaces its dev-only `script-src 'unsafe-inline'` with a sha256 hash of each inline script in `dist/index.html`, and fails the build if one is left unhashed or if the markup has an inline event handler. A new third-party request (an API, an embed, a font host) needs its origin added to the matching directive.
