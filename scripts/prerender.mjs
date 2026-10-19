// Inject the server-rendered pages into the built HTML, so every heading, all copy and
// the form are in the static HTML (crawlers, link previews, visitors without JS), pin the
// Content-Security-Policy to the final inline scripts, then delete the SSR build. Runs
// after `vite build` and `vite build --ssr` (npm run build). dist/index.html is the
// homepage; dist/about/index.html is the About page, made from the same built template
// with its own title, description and URLs, and without the hero image preload.
import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ssrDir = `${root}dist-ssr`;
const htmlPath = `${root}dist/index.html`;
const marker = '<div id="root"></div>';
const SITE = 'https://impeccablecookie.com';

const ABOUT = {
  path: `${root}dist/about/index.html`,
  url: `${SITE}/about/`,
  title: 'My story | Impeccable Cookie Company',
  description:
    'How I spent over a year on one chocolate chip cookie: brown butter, Callebaut Belgian dark chocolate, Toll House chips and dough rested overnight.',
};

// The CSP meta in index.html keeps script-src 'unsafe-inline' for the dev server (React
// refresh injects an inline script). Here it becomes the sha256 of every inline script in
// the final HTML, so a changed script can never ship with a stale hash.
const DEV_SCRIPT_SRC = "script-src 'self' 'unsafe-inline'";
const CSP_META = /<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]*)"\s*\/?>/g;

// Hash sources for the inline scripts a browser would run. External scripts are covered by
// 'self', and data blocks (the JSON-LD) never run, so neither needs a hash.
function inlineScriptHashes(doc) {
  const hashes = [];
  for (const [, attrs, body] of doc.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\ssrc\s*=/i.test(attrs)) continue;
    const type = attrs.match(/\stype\s*=\s*["']?([^"'\s>]*)/i)?.[1].toLowerCase();
    if (type && type !== 'module' && !/^(text|application)\/(x-)?(java|ecma)script$/.test(type)) continue;
    hashes.push(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
  return hashes;
}

function pinScriptSrc(doc) {
  const metas = [...doc.matchAll(CSP_META)];
  if (metas.length !== 1) throw new Error(`prerender: expected 1 CSP meta in ${htmlPath}, found ${metas.length}`);
  const [tag, policy] = metas[0];
  if (!policy.includes(DEV_SCRIPT_SRC)) throw new Error(`prerender: CSP has no "${DEV_SCRIPT_SRC}" to replace`);
  const pinned = policy.replace(DEV_SCRIPT_SRC, ["script-src 'self'", ...inlineScriptHashes(doc)].join(' '));
  const out = doc.replace(tag, () => tag.replace(policy, () => pinned));

  // Fail the build rather than ship a page whose own scripts the policy blocks.
  const scriptSrc = [...out.matchAll(CSP_META)][0][1].match(/script-src[^;]*/)[0];
  if (scriptSrc.includes("'unsafe-inline'")) throw new Error(`prerender: 'unsafe-inline' left in ${scriptSrc}`);
  const missing = inlineScriptHashes(out).filter((hash) => !scriptSrc.includes(hash));
  if (missing.length) throw new Error(`prerender: inline script without a CSP hash: ${missing.join(' ')}`);
  const handler = out.match(/<[a-z][^>]*\son[a-z]+\s*=/i);
  if (handler) throw new Error(`prerender: the CSP blocks inline event handlers: ${handler[0]}`);
  return out;
}

// Replace exactly one match in the head, or fail the build: a template change must never
// leave the About page with the homepage's title or URL.
function replaceOnce(doc, pattern, value, what) {
  const count = [...doc.matchAll(new RegExp(pattern.source, 'g'))].length;
  if (count !== 1) throw new Error(`prerender: expected 1 ${what} in ${htmlPath}, found ${count}`);
  return doc.replace(pattern, (_, before, after) => `${before}${value}${after}`);
}

function aboutHead(doc) {
  let out = replaceOnce(doc, /(<title>)[^<]*(<\/title>)/, ABOUT.title, '<title>');
  out = replaceOnce(out, /(<link\s+rel="canonical"\s+href=")[^"]*(")/, ABOUT.url, 'canonical link');
  out = replaceOnce(out, /(<meta\s+property="og:url"\s+content=")[^"]*(")/, ABOUT.url, 'og:url');
  for (const [attr, name, value] of [
    ['name', 'description', ABOUT.description],
    ['property', 'og:title', ABOUT.title],
    ['property', 'og:description', ABOUT.description],
    ['name', 'twitter:title', ABOUT.title],
    ['name', 'twitter:description', ABOUT.description],
  ]) {
    out = replaceOnce(out, new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`), value, name);
  }
  // The hero cookie is not on this page: preloading it would waste the first round trips.
  // Attribute by attribute, so a ">" inside a quoted value (a media range in imagesizes)
  // cannot end the match early.
  const preload = /\s*<link\s+rel="preload"\s+as="image"(?:\s+[a-z-]+(?:="[^"]*")?)*\s*\/?>/g;
  const preloads = [...out.matchAll(preload)].length;
  if (preloads !== 1) throw new Error(`prerender: expected 1 hero image preload, found ${preloads}`);
  return out.replace(preload, '');
}

function prerender(doc, appHtml, path) {
  // Content must be visible before any JS runs: motion only ever hides from JS.
  const hidden = appHtml.match(/style="[^"]*(?:opacity:\s*0(?![.\d])|visibility:\s*hidden)/);
  if (hidden) throw new Error(`prerender: inline hidden style in the static HTML of ${path}: ${hidden[0]}`);
  // Function replacement: a "$" in the markup must not be read as a replace pattern.
  return pinScriptSrc(doc.replace(marker, () => `<div id="root">${appHtml}</div>`));
}

const { render } = await import(pathToFileURL(`${ssrDir}/entry-server.js`).href);
// The template's HTML comments are notes for whoever edits index.html; dropping them keeps
// dist/index.html inside one TCP initial window (about 14 KB gzip). Only the template is
// stripped: the comments React writes into the app markup are hydration markers.
const html = (await readFile(htmlPath, 'utf8')).replace(/\s*<!--[\s\S]*?-->/g, '');
if (!html.includes(marker)) throw new Error(`prerender: ${marker} not found in ${htmlPath}`);

const homeHtml = render('home');
const aboutHtml = render('about');
await writeFile(htmlPath, prerender(html, homeHtml, htmlPath));
await mkdir(`${root}dist/about`, { recursive: true });
await writeFile(ABOUT.path, prerender(aboutHead(html), aboutHtml, ABOUT.path));
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: ${homeHtml.length} bytes into dist/index.html, ${aboutHtml.length} into dist/about/index.html`);
