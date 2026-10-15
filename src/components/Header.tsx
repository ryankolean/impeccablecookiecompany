import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { isPlainClick, useMotion } from '../motion/context';
import PillLink from './ui/PillLink';
import Wordmark from './ui/Wordmark';
import '../styles/header.css';

const SECTIONS = [
  { id: 'story', label: 'My story' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'how', label: 'How ordering works' },
] as const;

const INSTAGRAM = 'https://www.instagram.com/impeccablecookieco/';
// The nav shows from here; below it the menu button does (same breakpoint, no gap).
const DESKTOP = '(min-width: 900px)';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="2" y="2" width="16" height="16" rx="4.6" />
        <circle cx="10" cy="10" r="3.7" />
      </g>
      <circle cx="14.7" cy="5.3" r="1.1" fill="currentColor" />
    </svg>
  );
}

// Fixed, solid parchment, exactly var(--header-h) tall with its hairline. Every link is a
// real #hash link; MotionProvider routes plain ones through scrollToSection, and the
// menu panel's links close the panel first and then jump.
export default function Header() {
  const { ready, scrollToSection, setScrollLock } = useMotion();
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [atOrder, setAtOrder] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Set while the menu is open: undoes the scroll lock and the inert page, once.
  const releaseRef = useRef<(() => void) | null>(null);
  // Esc and the button send focus back to the button; a link hands it to its target.
  const returnFocus = useRef(true);

  // Order pill state: a butter inner ring once the hero CTA has scrolled away under the
  // header, and aria-current while the order section crosses the middle of the screen.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const header = headerRef.current;
    const cta = document.querySelector('[data-hero-cta]');
    // rootMargin is fixed when an observer is made, so the CTA observer is made again
    // whenever the header's height changes (crossing 900px, or larger text).
    let ctaIo: IntersectionObserver | null = null;
    let headerHeight = -1;
    const watchCta = () => {
      const height = header?.offsetHeight ?? 0;
      if (!cta || height === headerHeight) return;
      headerHeight = height;
      ctaIo?.disconnect();
      ctaIo = new IntersectionObserver(
        ([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < (e.rootBounds?.top ?? 0)),
        { rootMargin: `-${height}px 0px 0px 0px` },
      );
      ctaIo.observe(cta);
    };
    watchCta();
    const resize = header && 'ResizeObserver' in window ? new ResizeObserver(watchCta) : null;
    if (header) resize?.observe(header);

    const order = document.getElementById('order');
    const orderIo = order
      ? new IntersectionObserver(([e]) => setAtOrder(e.isIntersecting), { rootMargin: '-45% 0px -45% 0px' })
      : null;
    if (order) orderIo?.observe(order);
    return () => {
      resize?.disconnect();
      ctaIo?.disconnect();
      orderIo?.disconnect();
    };
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    returnFocus.current = restoreFocus;
    setOpen(false);
  }, []);

  // Open menu: lock page scroll (stops Lenis), make the rest of the page inert, move focus
  // to the first item and keep Tab cycling between the menu button and the panel.
  useEffect(() => {
    const header = headerRef.current;
    const panel = panelRef.current;
    const button = buttonRef.current;
    if (!open || !header || !panel || !button) return;

    setScrollLock(true);
    const page = Array.from(header.parentElement?.children ?? []).filter(
      (el) => el !== header && !el.hasAttribute('inert'),
    );
    page.forEach((el) => el.setAttribute('inert', ''));
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      page.forEach((el) => el.removeAttribute('inert'));
      setScrollLock(false);
    };
    releaseRef.current = release;

    const items = () => [button, ...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
    items()[1]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== 'Tab') return;
      const list = items();
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (!(active instanceof HTMLElement) || !list.includes(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Widening past the breakpoint hides the button (except with large text, see
    // header.css): close quietly.
    const desktop = window.matchMedia(DESKTOP);
    const onDesktop = () => {
      if (desktop.matches) close(false);
    };
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
      releaseRef.current = null;
      release();
      if (returnFocus.current) button.focus();
      returnFocus.current = true;
    };
  }, [open, close, setScrollLock]);

  // Lenis can arrive after the menu opened: stop it too, or it would scroll the page under
  // the panel.
  useEffect(() => {
    if (open && ready) setScrollLock(true);
  }, [open, ready, setScrollLock]);

  // Panel links: release the page before the jump, so scrollToSection can scroll and
  // focus the target, then let the panel close behind it.
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!isPlainClick(e) || !document.getElementById(id)) return;
    e.preventDefault();
    returnFocus.current = false;
    releaseRef.current?.();
    setOpen(false);
    scrollToSection(id);
  };

  // The wordmark and the Order pill stay clickable above the open panel: close it quietly
  // before their jump lands.
  const onBarClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!open || !(e.target instanceof Element) || !e.target.closest('a[href^="#"]')) return;
    returnFocus.current = false;
    releaseRef.current?.();
    setOpen(false);
  };

  return (
    <header ref={headerRef} className="site-header">
      <div className="container site-header__bar" onClickCapture={onBarClick}>
        <Wordmark />
        <nav className="site-nav" aria-label="Main">
          <ul className="site-nav__list" role="list">
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <a className="site-nav__link" href={`#${id}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="site-header__instagram" href={INSTAGRAM} aria-label="Impeccable Cookie Company on Instagram">
          <InstagramIcon />
        </a>
        <PillLink
          href="#order"
          size="header"
          arrow
          className="site-header__order"
          data-ring={pastHero ? '' : undefined}
          aria-current={atOrder ? 'location' : undefined}
        >
          <span className="site-header__order-long">Request an order</span>
          <span className="site-header__order-short" aria-hidden="true">
            Order
          </span>
        </PillLink>
        <button
          ref={buttonRef}
          type="button"
          className="menu-button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => (open ? close(true) : setOpen(true))}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path
              d={open ? 'M4.5 4.5l11 11M15.5 4.5l-11 11' : 'M2 6.5h16M2 13.5h16'}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Full-screen panel under the bar. It scrolls on its own on short screens, so Lenis
          (stopped while it is open) must leave its wheel and touch events alone. */}
      <div id="mobile-menu" ref={panelRef} className="mobile-menu" hidden={!open} data-lenis-prevent>
        <nav className="container mobile-menu__inner" aria-label="Main">
          <PillLink href="#order" arrow className="mobile-menu__order" onClick={(e) => go(e, 'order')}>
            Request an order
          </PillLink>
          <ul className="mobile-menu__list" role="list">
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <a className="mobile-menu__link font-serif" href={`#${id}`} onClick={(e) => go(e, id)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a className="mobile-menu__instagram" href={INSTAGRAM}>
            <InstagramIcon />
            @impeccablecookieco on Instagram
          </a>
        </nav>
      </div>
    </header>
  );
}
