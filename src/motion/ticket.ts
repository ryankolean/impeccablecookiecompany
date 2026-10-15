import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

// Signature moment: the order ticket (src/components/Ticket.tsx). A scrubbed, unpinned
// timeline from 'top 70%' to 'bottom 60%': the three caramel checks draw at 0, 0.33 and
// 0.66 of the progress while the numerals fade out under them, each "Step n" label warms
// from muted to caramel ink, and the arrow tail draws toward the pad at the end. When the
// ticket's bottom passes 60% the stamp lands on its corner once (240ms).
//
// The markup is the static state (no JS, reduced motion, or a ticket already above the
// fold at init): numerals showing, checks undrawn, labels caramel ink, stamp in place,
// tail drawn. Start states are set here only, and runtime.ts calls this inside
// gsap.matchMedia('(prefers-reduced-motion: no-preference)').
//
// Hooks, all inside [data-ticket]:
//   [data-ticket-check]  <path> of each step's tick. CSS keeps it undrawn
//                        (stroke-dasharray 30, stroke-dashoffset 31; the path is ~28 long).
//   [data-ticket-num]    HTML numeral over each marker. Visual only: the <ol> numbers the
//                        steps for assistive tech.
//   [data-ticket-label]  The "Step n" label above each title. Colour only.
//   [data-ticket-stamp]  HTML wrapper of the stamp roundel (CSS rests it at rotate(-12deg)).
//   [data-ticket-tail]   <path> of the arrow tail below the ticket.
// None of these may carry .reveal or any other animation driver.

// Never hide what the visitor has already seen, and never hide anything in a hidden tab
// (rAF is paused there, so a hidden start state would stick). runtime.ts uses it too.
export function belowFold(el: Element): boolean {
  return document.visibilityState === 'visible' && el.getBoundingClientRect().top > window.innerHeight;
}

export function initTicket(gsap: typeof Gsap, ScrollTrigger: typeof ScrollTriggerType): () => void {
  const ticket = document.querySelector<HTMLElement>('[data-ticket]');
  if (!ticket || !belowFold(ticket)) return () => {};

  const checks = Array.from(ticket.querySelectorAll<SVGPathElement>('[data-ticket-check]'));
  const nums = Array.from(ticket.querySelectorAll<HTMLElement>('[data-ticket-num]'));
  const labels = Array.from(ticket.querySelectorAll<HTMLElement>('[data-ticket-label]'));
  const stamp = ticket.querySelector<HTMLElement>('[data-ticket-stamp]');
  const tail = ticket.querySelector<SVGPathElement>('[data-ticket-tail]');
  const muted = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim();

  // A context of its own, so the cleanup reverts only what this file made.
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: ticket, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
    });

    checks.forEach((check, i) => {
      const at = i * 0.33;
      if (labels[i]) {
        const ink = getComputedStyle(labels[i]).color;
        tl.fromTo(labels[i], { color: muted }, { color: ink, duration: 0.2 }, at);
      }
      // The numeral is mostly gone before the tick's first stroke, so the two never
      // read as one smudged mark mid-scrub.
      if (nums[i]) tl.to(nums[i], { opacity: 0, duration: 0.08 }, at);
      tl.to(check, { strokeDashoffset: 0, duration: 0.24, ease: 'power1.inOut' }, at + 0.06);
    });

    if (tail) {
      const length = tail.getTotalLength();
      tl.fromTo(
        tail,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 0.14 },
        0.86,
      );
    }

    if (stamp) {
      const land = gsap.fromTo(
        stamp,
        { opacity: 0, scale: 1.3, rotate: -24 },
        { opacity: 1, scale: 1, rotate: -12, duration: 0.24, ease: 'back.out(1.6)', paused: true },
      );
      ScrollTrigger.create({ trigger: ticket, start: 'bottom 60%', once: true, onEnter: () => void land.play() });
    }
  });

  return () => ctx.revert();
}
