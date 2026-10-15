/** @type {import('tailwindcss').Config} */

// Brand palette (direction B, "warm bakehouse"). src/index.css mirrors these as
// CSS custom properties on :root (--parchment, --caramel-ink, ...) via theme().
// Every text pair in use is AA; caramel is for graphics only, never text.
const palette = {
  parchment: '#FBF5EA', // page base, hero, cookies band, header
  butter: '#F5E6BC', // story band, arch plate, light text and buttons on cocoa
  sugar: '#E8CFA6', // how-ordering band, ticket hole punch, eyebrows on cocoa
  caramel: '#B5652A', // graphics only: swash, checks, speckles, underlines, dots
  'caramel-ink': '#8C4416', // eyebrows, step labels, card numbers, stamp, ring on light
  cocoa: '#3A2419', // headings, primary pill, order band
  'cocoa-deep': '#24160F', // footer, primary hover
  espresso: '#2B1C14', // body text on light bands
  muted: '#6A4C38', // secondary text, descriptions, captions, placeholders
  salt: '#FFFDF8', // cards, ticket, order pad
  field: '#8A6A50', // input, select and radio borders
  'cream-muted': '#D9C3A0', // secondary text on cocoa and cocoa-deep
  error: '#A1281C', // field errors on salt or white
};

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Replaced, not extended, so min-width queries stay in ascending order.
    // md 700: phone/tablet split (gutter, type steps, short header label).
    // nav 900: desktop nav and 72px header; below it the menu button shows.
    // lg 1100: two-column desktop layouts at full size.
    screens: {
      sm: '480px',
      md: '700px',
      nav: '900px',
      lg: '1100px',
      xl: '1280px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      white: '#FFFFFF',
      ...palette,
    },
    fontFamily: {
      serif: ['Newsreader', 'Newsreader Fallback', 'Georgia', 'serif'],
      sans: ['Figtree', 'Figtree Fallback', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    // 1240px content + var(--gutter) on each side (20px, 48px from md).
    container: {
      center: true,
      padding: 'var(--gutter)',
      screens: { wide: '1336px' },
    },
  },
  plugins: [],
};
