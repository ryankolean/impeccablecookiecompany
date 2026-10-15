import type { ReactNode } from 'react';

// Caramel hand-drawn underline under one headline word (the SVG lives in .swash::after
// in src/index.css, so it adds no DOM and no request). Graphic only, never a text colour.
export default function Swash({ children }: { children: ReactNode }) {
  return <span className="swash">{children}</span>;
}
