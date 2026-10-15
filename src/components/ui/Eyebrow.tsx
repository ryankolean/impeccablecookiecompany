import type { ReactNode } from 'react';

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

// 13px Figtree 600 caps. Colour comes from the surface: caramel-ink on light bands,
// sugar inside .surface-dark.
export default function Eyebrow({ children, className }: EyebrowProps) {
  return <p className={className ? `eyebrow ${className}` : 'eyebrow'}>{children}</p>;
}
