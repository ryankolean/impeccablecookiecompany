import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
// Type-only import: erased at build, so gsap and lenis stay out of the entry chunk.
import type { MotionRuntime } from './runtime';
import { isPlainClick, MotionContext, type ScrollToOptions } from './context';

const REDUCE = '(prefers-reduced-motion: reduce)';

// After the load event (the hero photo, the LCP element, has arrived), then when the
// main thread is idle. Safari and iOS have no requestIdleCallback: 300ms timeout instead.
function afterLoadIdle(cb: () => void): () => void {
  let idle = 0;
  let timer = 0;
  const schedule = () => {
    if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(cb, { timeout: 2000 });
    else timer = window.setTimeout(cb, 300);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  return () => {
    window.removeEventListener('load', schedule);
    if (idle) window.cancelIdleCallback(idle);
    if (timer) window.clearTimeout(timer);
  };
}

// The element that takes focus when a jump lands: the target itself when it carries
// data-arrival-focus (main), else the first one inside it (the #order heading).
function arrivalTarget(target: HTMLElement): HTMLElement | null {
  if (target.hasAttribute('data-arrival-focus')) return target;
  return target.querySelector<HTMLElement>('[data-arrival-focus]');
}

// The fixed header's height in px, read from html scroll-padding-top (var(--header-h)).
function headerOffset(): number {
  return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
}

// How much further than "target under the header" a jump must go so that `reveal` is
// fully visible, with a 16px margin above the bottom edge. 0 when it already fits.
function revealOffset(target: HTMLElement, reveal: Element): number {
  const bottom = headerOffset() + reveal.getBoundingClientRect().bottom - target.getBoundingClientRect().top;
  return Math.max(0, Math.round(bottom - (window.innerHeight - 16)));
}

function hashId(hash: string): string {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return '';
  }
}

export default function MotionProvider({ children }: { children: ReactNode }) {
  const runtime = useRef<MotionRuntime | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    // Reduced motion or Save-Data: download nothing. Native scroll, CSS end states.
    if (window.matchMedia(REDUCE).matches || saveData) return;
    let cancelled = false; // StrictMode mounts twice; a late import must not start a second loop
    const cancelIdle = afterLoadIdle(() => {
      import('./runtime')
        .then(({ startMotion }) => {
          if (cancelled) return;
          runtime.current = startMotion();
          setReady(true);
        })
        .catch(() => {}); // chunk failed to load: the page still works with native scroll
    });
    return () => {
      cancelled = true;
      cancelIdle();
      runtime.current?.destroy();
      runtime.current = null;
      setReady(false);
    };
  }, []);

  const setScrollLock = useCallback((locked: boolean) => {
    document.documentElement.classList.toggle('scroll-locked', locked);
    const lenis = runtime.current?.lenis;
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, []);

  const scrollToSection = useCallback(
    (id: string, { focus = true, reveal }: ScrollToOptions = {}) => {
      const target = document.getElementById(id);
      if (!target) return;
      setScrollLock(false); // scrollTo is ignored while Lenis is stopped
      const extra = reveal ? revealOffset(target, reveal) : 0;
      const lenis = runtime.current?.lenis;
      if (lenis) {
        // Lenis 1.3 subtracts html scroll-padding-top (var(--header-h)) from element
        // targets itself: that is the -header-height offset. Passing it here too would
        // subtract the header twice.
        // resize() first: a layout change (the success panel replacing the long form)
        // can clamp the native scroll before Lenis hears of it, and the jump would then
        // be measured from its stale position and page height.
        lenis.resize();
        lenis.scrollTo(target, { offset: extra, duration: 1.1 });
      } else {
        const behavior = window.matchMedia(REDUCE).matches ? 'auto' : 'smooth';
        if (extra) {
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerOffset() + extra, behavior });
        } else {
          target.scrollIntoView({ behavior, block: 'start' });
        }
      }
      // preventScroll: focus() must not jump the page ahead of the smooth scroll.
      if (focus) arrivalTarget(target)?.focus({ preventScroll: true });
      history.replaceState(null, '', `#${id}`);
    },
    [setScrollLock],
  );

  // Deep links (/#order, /#contact from Instagram): land instantly under the header and
  // focus the arrival element. Re-align once web fonts settle unless the visitor scrolled.
  useEffect(() => {
    const id = hashId(location.hash);
    const target = id ? document.getElementById(id) : null;
    if (!target || target.contains(document.activeElement)) return; // visitor is already in the form
    const jump = () => target.scrollIntoView({ behavior: 'instant', block: 'start' });
    jump();
    const focusArrival = () => arrivalTarget(target)?.focus({ preventScroll: true });
    focusArrival();
    const y = window.scrollY;
    let live = true;
    // Chromium runs its own fragment focus at the first frame and clears ours when the
    // section itself is not focusable, so restore it two frames later if it was lost.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (live && document.activeElement === document.body) focusArrival();
      });
    });
    document.fonts?.ready.then(() => {
      if (live && window.scrollY === y) jump();
    });
    return () => {
      live = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  // Every same-page hash link (<a href="#order">, PillLink included) routes through
  // scrollToSection, so links stay real links for no-JS and middle-click. Handlers that
  // already called preventDefault (a custom onClick taking over the jump) are left alone.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || !isPlainClick(e)) return;
      const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      const id = link ? hashId(link.hash) : '';
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToSection(id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [scrollToSection]);

  const api = useMemo(() => ({ ready, scrollToSection, setScrollLock }), [ready, scrollToSection, setScrollLock]);
  return <MotionContext.Provider value={api}>{children}</MotionContext.Provider>;
}
