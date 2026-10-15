import { useSvgId } from './useSvgId';

// The mark's shapes in a 32x32 box, for nesting inside another SVG (the stamp).
export function CookieMarkShapes() {
  const bite = useSvgId('bite');
  return (
    <>
      <mask id={bite}>
        <rect width="32" height="32" fill="#fff" />
        <circle cx="29.5" cy="4.5" r="5.2" fill="#000" />
        <circle cx="24.6" cy="1.2" r="3.4" fill="#000" />
        <circle cx="31.6" cy="10" r="3.4" fill="#000" />
      </mask>
      <circle className="cookie-mark__disc" cx="16" cy="16" r="15" mask={`url(#${bite})`} />
      <path className="cookie-mark__i" d="M14.3 13.2h4.3l-2.6 11.6h-4.3z" />
      <circle className="cookie-mark__i" cx="17.9" cy="9" r="2.3" />
    </>
  );
}
