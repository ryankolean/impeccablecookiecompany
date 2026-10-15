// Inject the server-rendered app into dist/index.html, so every heading, all copy and
// the form are in the static HTML (crawlers, link previews, visitors without JS), pin the
// Content-Security-Policy to the final inline scripts, then delete the SSR build. Runs
// after `vite build` and `vite build --ssr` (npm run build).
import { createHash } from 'node:crypto';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ssrDir = `${root}dist-ssr`;
const htmlPath = `${root}dist/index.html`;
const marker = '<div id="root"></div>';

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

const { render } = await import(pathToFileURL(`${ssrDir}/entry-server.js`).href);
const html = await readFile(htmlPath, 'utf8');
if (!html.includes(marker)) throw new Error(`prerender: ${marker} not found in ${htmlPath}`);

const appHtml = render();
// Content must be visible before any JS runs: motion only ever hides from JS.
const hidden = appHtml.match(/style="[^"]*(?:opacity:\s*0(?![.\d])|visibility:\s*hidden)/);
if (hidden) throw new Error(`prerender: inline hidden style in the static HTML: ${hidden[0]}`);

// Function replacement: a "$" in the markup must not be read as a replace pattern.
await writeFile(htmlPath, pinScriptSrc(html.replace(marker, () => `<div id="root">${appHtml}</div>`)));
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: ${appHtml.length} bytes of HTML written into dist/index.html`);
