import { CookieMarkShapes } from './CookieMark';
import { useSvgId } from './useSvgId';

type StampProps = {
  // Sizes come from the wrapper (.order__stamp in the order band); the SVG fills it.
  className?: string;
};

// Brand roundel, decorative (aria-hidden). Its words are the business name and
// "Michigan home bakery" only: never approved, certified or confirmed.
// Drawn on a 171.43 grid (150 x 8/7) so the ring text is 12 units: the wrapper sets the
// rendered size, and Lighthouse's font-size audit reads the unscaled 12.
export default function Stamp({ className }: StampProps) {
  const ring = useSvgId('ring');
  return (
    <svg className={className ? `stamp ${className}` : 'stamp'} viewBox="0 0 171.43 171.43" aria-hidden="true" focusable="false">
      <defs>
        <path id={ring} d="M85.71,85.71 m-64,0 a64,64 0 1,1 128,0 a64,64 0 1,1 -128,0" />
      </defs>
      <circle className="stamp__face" cx="85.71" cy="85.71" r="83.43" strokeWidth="1.71" />
      <circle className="stamp__ring" cx="85.71" cy="85.71" r="50.29" strokeWidth="1.14" strokeDasharray="2.29 4.57" />
      <text className="stamp__text" fontSize="12">
        <textPath href={`#${ring}`} textLength="397.71" lengthAdjust="spacing">
          IMPECCABLE COOKIE COMPANY &#8226; MICHIGAN HOME BAKERY &#8226;
        </textPath>
      </text>
      {/* The cookie mark at r=29.71: its 32-unit box scaled to 63.39 and centred. */}
      <svg x="54.02" y="54.02" width="63.39" height="63.39" viewBox="0 0 32 32">
        <CookieMarkShapes />
      </svg>
    </svg>
  );
}
