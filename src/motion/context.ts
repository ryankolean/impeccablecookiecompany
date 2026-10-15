import { createContext, useContext } from 'react';

export type ScrollToOptions = {
  // Focus the target's [data-arrival-focus] element (or the target itself when it
  // carries the attribute) after the jump. Default true.
  focus?: boolean;
  // An element inside the target that must end up fully on screen: when it would land
  // below the fold (a quantity select on a phone), the jump goes that much further.
  reveal?: Element | null;
};

export type MotionApi = {
  // True once the deferred runtime (GSAP + Lenis) is running. Stays false under
  // reduced motion, Save-Data, or if the chunk fails to load.
  ready: boolean;
  // The one path for every in-page jump. Works before, after and without Lenis.
  scrollToSection: (id: string, opts?: ScrollToOptions) => void;
  // Lock page scroll (mobile menu): stops Lenis when it runs and sets
  // html.scroll-locked either way. scrollToSection releases the lock itself.
  setScrollLock: (locked: boolean) => void;
};

export const MotionContext = createContext<MotionApi>({
  ready: false,
  scrollToSection: () => {},
  setScrollLock: () => {},
});

export const useMotion = () => useContext(MotionContext);

// A plain left click: no modifier, so it is not asking for a new tab or window. Anything
// else keeps the browser's default for the link.
export function isPlainClick(e: Pick<MouseEvent, 'button' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'>): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
