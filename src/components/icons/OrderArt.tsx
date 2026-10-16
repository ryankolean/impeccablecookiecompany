// The down arrow on the "Ready to order?" pill (aria-hidden, currentColor, bobbed in
// order.css). The chapter's other drawings (pin, sparks, loop, heart, corner cookie) are
// CSS backgrounds in order.css.

type ArtProps = { className?: string };

export function ArrowDownIcon({ className }: ArtProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M8 2v11M3.5 8.5 8 13l4.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
