// Deferred motion runtime. Only MotionProvider's dynamic import() reaches this file, so
// gsap, ScrollTrigger, SplitText and Lenis never enter the entry chunk (build gate:
// `grep -c ScrollTrigger` on dist/assets/index-*.js prints 0). It never loads under
// prefers-reduced-motion or Save-Data.
//
// Data-attribute contract. Markup is always the static, fully visible end state; this
// file only adds motion, only under prefers-reduced-motion: no-preference, and only
// hides a start state on elements below the fold at init in a visible tab.
//   .reveal              Block rises 48px and fades in. CSS view() drives it (index.css);
//                        ScrollTrigger.batch replays it where the @supports guard fails.
//   [data-split]         H2 below the hero: masked line reveal. Children must be static
//                        text (and <em>); React must never re-render them. Not on
//                        #order-title.
//   [data-scroll-reveal] One paragraph of plain text: words brighten 0.55 -> 1 as it is
//                        read, the block settles from a slight rotation.
//   [data-ticket]        The order ticket signature. Its child hooks are defined and
//                        documented in ./ticket.ts (order-chapter builder).
//   [data-arrival-focus] Read by MotionProvider: what scrollToSection focuses on landing.
// One driver per element: never put .reveal on an element that also carries
// [data-split], [data-scroll-reveal] or a ticket hook.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { belowFold, initTicket } from './ticket';

gsap.registerPlugin(ScrollTrigger, SplitText);

export type MotionRuntime = { lenis: Lenis; destroy: () => void };

const NO_PREFERENCE = '(prefers-reduced-motion: no-preference)';
// Same test as the CSS @supports guard, so an element is driven by CSS or GSAP, never both.
const CSS_TIMELINES = '(animation-timeline: view()) and (animation-range: entry 0% cover 30%)';

function initSplitHeadings(): () => void {
  const splits = gsap.utils.toArray<HTMLElement>('[data-split]').filter(belowFold).map((el) =>
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true, // re-splits after the font swap and on resize, keeping progress
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 100,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
    }),
  );
  return () => splits.forEach((s) => s.revert());
}

// Firefox stable has no animation-timeline yet: replay the .reveal entrance there.
// Opacity only (not autoAlpha) so a hidden block stays focusable for keyboard users.
function initRevealFallback(): void {
  if (CSS.supports(CSS_TIMELINES)) return;
  const reveals = gsap.utils.toArray<HTMLElement>('.reveal').filter(belowFold);
  if (!reveals.length) return;
  gsap.set(reveals, { opacity: 0, y: 48 });
  ScrollTrigger.batch(reveals, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }),
  });
}

// Ported from React Bits ScrollReveal (https://reactbits.dev/r/ScrollReveal-TS-TW,
// MIT + Commons Clause, David Haz) as a data-attribute pattern. Changes: baseOpacity
// 0.55 (3.28:1 on the story band, so words left mid-scrub still pass as large text), a
// range from 'top 90%' to 'top 45%' (measured from the top edge alone, so it cannot
// invert on a tall viewport the way the original 'bottom bottom' end did), scrub 1, no
// blur, no will-change, a screen-reader copy instead of per-word spans, and cleanup that
// kills only its own triggers (the original kills every ScrollTrigger on the page).
const BASE_OPACITY = 0.55;
const BASE_ROTATION = 3;

function initScrollReveal(): () => void {
  const cleanups: Array<() => void> = [];
  gsap.utils
    .toArray<HTMLElement>('[data-scroll-reveal]')
    .filter(belowFold)
    .forEach((el) => {
      const text = el.textContent ?? '';
      const split = SplitText.create(el, { type: 'words', tag: 'span', aria: 'none' });
      split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'));
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = text;
      el.prepend(sr);

      const settle = gsap.fromTo(
        el,
        { rotate: BASE_ROTATION, transformOrigin: '0% 50%' },
        { rotate: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 1 } },
      );
      const words = gsap.fromTo(
        split.words,
        { opacity: BASE_OPACITY },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 45%', scrub: 1 },
        },
      );
      cleanups.push(() => {
        settle.scrollTrigger?.kill();
        words.scrollTrigger?.kill();
        settle.revert();
        words.revert();
        sr.remove();
        split.revert();
      });
    });
  return () => cleanups.forEach((c) => c());
}

export function startMotion(): MotionRuntime {
  // One loop: GSAP's ticker drives Lenis. autoRaf stays false or the scroll double-steps.
  // allowNestedScroll: the wheel scrolls a child that can scroll (the notes textarea once
  // it overflows) first, and the page everywhere else.
  const lenis = new Lenis({ autoRaf: false, anchors: false, allowNestedScroll: true });
  const offScroll = lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000); // stored: remove() needs this exact reference
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  // A font that swaps in after init (the deferred italic) moves the text under every
  // trigger: recompute the starts and ends once it lands.
  const onFonts = () => ScrollTrigger.refresh();
  document.fonts?.addEventListener('loadingdone', onFonts);

  const mm = gsap.matchMedia();
  mm.add(NO_PREFERENCE, () => {
    const revertSplits = initSplitHeadings();
    initRevealFallback();
    const killTicket = initTicket(gsap, ScrollTrigger);
    const revertScrollReveal = initScrollReveal();
    return () => {
      revertScrollReveal();
      killTicket();
      revertSplits();
    };
  });

  return {
    lenis,
    destroy() {
      mm.revert(); // kills tweens and ScrollTriggers made inside, restores inline styles
      document.fonts?.removeEventListener('loadingdone', onFonts);
      offScroll();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    },
  };
}
