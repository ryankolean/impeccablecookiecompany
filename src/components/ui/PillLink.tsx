import type { AnchorHTMLAttributes, ReactNode } from 'react';
import Arrow from './Arrow';

type PillLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> & {
  href: string;
  // lg: 52px tall, 16px text. header: 44px tall, 15px text.
  size?: 'lg' | 'header';
  // Trailing arrow that nudges 4px on hover.
  arrow?: boolean;
  children: ReactNode;
};

// A link styled as a primary pill: cocoa fill, butter text (light surfaces). The href
// stays real so the link works without JS and with middle-click; MotionProvider routes
// plain clicks on #hash links through scrollToSection. To take over the jump yourself,
// call e.preventDefault() in a custom onClick.
export default function PillLink({ href, size = 'lg', arrow = false, className, children, ...rest }: PillLinkProps) {
  const classes = ['pill', 'pill--primary', size === 'header' && 'pill--header', className]
    .filter(Boolean)
    .join(' ');

  return (
    <a {...rest} href={href} className={classes}>
      {children}
      {arrow && <Arrow className="pill__arrow" />}
    </a>
  );
}
