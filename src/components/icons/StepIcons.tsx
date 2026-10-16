// Line icons for the three order steps, drawn on a 48 grid. Decorative (aria-hidden);
// order.css colours them: strokes cocoa, .step__icon-accent caramel, .step__icon-chip a
// cocoa fill, .step__icon-dot a caramel fill, .step__icon-knock a salt fill that hides
// the stroke behind it.

type IconProps = { className?: string };

export function CookieIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M37.04 21.53A16 16 0 1 1 26.14 11.55A4.4 4.4 0 0 0 29.22 19.12A4.6 4.6 0 0 0 37.04 21.53z" />
      <circle className="step__icon-chip" cx="14.5" cy="24" r="1.8" />
      <circle className="step__icon-chip" cx="22" cy="31" r="1.8" />
      <circle className="step__icon-chip" cx="29" cy="33.5" r="1.8" />
      <circle className="step__icon-chip" cx="16.5" cy="35.5" r="1.8" />
      <circle className="step__icon-chip" cx="21.5" cy="20" r="1.8" />
      <path className="step__icon-accent" d="M35.5 9 37 5.5M39.5 12.5l3-2.5M41.5 17l3.5-.5" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M10 8h14a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H15l-6 5v-5.3A6 6 0 0 1 4 20v-6a6 6 0 0 1 6-6z" />
      <path className="step__icon-accent" d="M30 18h8a6 6 0 0 1 6 6v5a6 6 0 0 1-4 5.6V40l-6-5h-6a6 6 0 0 1-6-6v-3" />
      <circle className="step__icon-dot" cx="11" cy="17" r="1.7" />
      <circle className="step__icon-dot" cx="17" cy="17" r="1.7" />
      <circle className="step__icon-dot" cx="23" cy="17" r="1.7" />
      <path className="step__icon-accent" d="M33.5 9 35 5.5M37.5 12l3-2.5M39.5 16l3.5-.5" />
    </svg>
  );
}

export function CardCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M7 11h24a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V15a4 4 0 0 1 4-4zM3 17.5h32M8 26h7M18 26h4" />
      <circle className="step__icon-knock step__icon-accent" cx="35" cy="32" r="8.5" />
      <path className="step__icon-accent" d="M31.2 32.2l2.6 2.6 5-5.2M38 8.5 39.5 5M41.5 12l3-2.5M43 16.5l3.5-.5" />
    </svg>
  );
}
