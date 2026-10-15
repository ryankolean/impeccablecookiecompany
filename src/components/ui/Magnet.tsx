import { useEffect, useRef, type ReactNode } from 'react';

// Ported from React Bits Magnet (https://reactbits.dev/r/Magnet-TS-TW, MIT + Commons
// Clause, David Haz): the wrapped element eases toward a nearby pointer on a spring and
// settles back. Changes: one element per instance (no shared registry), translate only
// (no tilt or scale), a low default pull capped at a few pixels, and it only runs for a
// hovering fine pointer with no reduced-motion preference. Anywhere else, and in the
// prerendered HTML, the child renders exactly as it would unwrapped.
//
// Usage: wrap exactly one element, e.g. <Magnet><PillLink ... /></Magnet>. The wrapper is
// display: contents, so the child keeps its place in flex and grid layouts. Magnet moves
// the child with an inline transform: do not give that element its own transform,
// animation or transition on transform.

const ACTIVE = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const SPRING = { stiffness: 170, damping: 18, mass: 1 };
const REST = 0.05;

type MagnetProps = {
  children: ReactNode;
  // Distance in px outside the element where the pull starts.
  padding?: number;
  // Higher is weaker: the offset is the pointer's distance from centre divided by this.
  strength?: number;
  // Hard cap on the offset in px.
  maxOffset?: number;
};

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export default function Magnet({ children, padding = 64, strength = 8, maxOffset = 8 }: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current?.firstElementChild;
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) return;
    const query = window.matchMedia(ACTIVE);

    const enable = () => {
      const current = { x: 0, y: 0 };
      const velocity = { x: 0, y: 0 };
      let pointer: { x: number; y: number } | null = null;
      let raf = 0;
      let last = 0;

      const target = () => {
        const rest = { x: 0, y: 0 };
        if (!pointer) return rest;
        // Measure the resting box: take our own offset back out of the rect.
        const r = el.getBoundingClientRect();
        const dx = pointer.x - (r.left - current.x + r.width / 2);
        const dy = pointer.y - (r.top - current.y + r.height / 2);
        const outside = Math.hypot(Math.max(0, Math.abs(dx) - r.width / 2), Math.max(0, Math.abs(dy) - r.height / 2));
        if (outside > padding) return rest;
        const pull = 1 - smoothstep(padding * 0.5, padding, outside);
        let x = (dx / strength) * pull;
        let y = (dy / strength) * pull;
        const length = Math.hypot(x, y);
        if (length > maxOffset) {
          x *= maxOffset / length;
          y *= maxOffset / length;
        }
        return { x, y };
      };

      const frame = (now: number) => {
        raf = 0;
        const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
        last = now;
        const goal = target();
        const steps = Math.ceil(dt / (1 / 120));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          for (const k of ['x', 'y'] as const) {
            const force = SPRING.stiffness * (goal[k] - current[k]) - SPRING.damping * velocity[k];
            velocity[k] += (force / SPRING.mass) * h;
            current[k] += velocity[k] * h;
          }
        }
        const resting = (['x', 'y'] as const).every(
          (k) => Math.abs(goal[k] - current[k]) < REST && Math.abs(velocity[k]) < REST,
        );
        if (resting) {
          current.x = goal.x;
          current.y = goal.y;
          velocity.x = velocity.y = 0;
          last = 0;
        }
        // Back at rest in place: drop the inline transform so the element is untouched.
        el.style.transform =
          current.x || current.y ? `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)` : '';
        if (!resting) raf = requestAnimationFrame(frame);
      };

      const wake = () => {
        if (!raf) raf = requestAnimationFrame(frame);
      };
      // Only spend frames when the pointer is in range or the element is still displaced.
      const nudge = () => {
        const goal = target();
        if (goal.x || goal.y || current.x || current.y) wake();
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        pointer = { x: e.clientX, y: e.clientY };
        nudge();
      };
      const onLeave = () => {
        pointer = null;
        nudge();
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('scroll', nudge, { passive: true, capture: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      window.addEventListener('blur', onLeave);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('scroll', nudge, { capture: true });
        document.documentElement.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('blur', onLeave);
        el.style.transform = '';
      };
    };

    // Follow the media query live (a mouse plugged in, reduced motion switched on).
    let disable: (() => void) | null = null;
    const sync = () => {
      disable?.();
      disable = query.matches ? enable() : null;
    };
    sync();
    query.addEventListener('change', sync);
    return () => {
      query.removeEventListener('change', sync);
      disable?.();
    };
  }, [padding, strength, maxOffset]);

  return (
    <div ref={wrapperRef} className="magnet" style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
