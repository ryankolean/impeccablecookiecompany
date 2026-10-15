import type { ReactNode } from 'react';
import Stamp from './ui/Stamp';

type Step = { title: string; text: ReactNode };

const steps: Step[] = [
  {
    title: 'Send a request',
    text: "Pick your cookies and how many. It's a request, not a purchase, so nothing is charged.",
  },
  {
    title: 'I confirm with you',
    text: "I'll reach out by your preferred method to confirm the details. Before you pay, you're welcome to meet me in person or on a video call to ask about ingredients, allergens or anything else.",
  },
  {
    title: 'Pay by Venmo',
    text: (
      <>
        Once your order is confirmed, pay by Venmo to <span className="ticket__handle">@impeccablecookie</span>. Never
        before.
      </>
    ),
  },
];

// The order ticket: the signature moment (src/motion/ticket.ts documents the data-ticket
// hooks). This markup is the static, reduced-motion and no-JS state: numerals in the
// markers, checks undrawn, stamp in place, arrow tail drawn. Its perforated bottom edge
// sits on the band line, right above the order pad's matching scalloped top.
export default function Ticket() {
  return (
    <div className="ticket" data-ticket>
      <p className="ticket__head">Order ticket</p>
      <ol className="ticket__steps" role="list">
        {steps.map((step, i) => (
          <li className="ticket__step" key={step.title}>
            <span className="ticket__marker" aria-hidden="true">
              <svg className="ticket__check" viewBox="0 0 46 46" focusable="false">
                <circle className="ticket__ring" cx="23" cy="23" r="21" />
                <path className="ticket__tick" data-ticket-check d="M13.5 23.5l6.5 6.5 12.5-14" />
              </svg>
              <span className="ticket__num" data-ticket-num>
                {i + 1}
              </span>
            </span>
            <div>
              <p className="ticket__label" data-ticket-label>
                {`Step ${i + 1}`}
              </p>
              <h3 className="ticket__title">{step.title}</h3>
              <p className="ticket__text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="ticket__foot">
        <svg className="ticket__pin" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
          <path
            d="M9 1.5c-3 0-5.4 2.3-5.4 5.3 0 3.9 5.4 9.7 5.4 9.7s5.4-5.8 5.4-9.7c0-3-2.4-5.3-5.4-5.3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="9" cy="6.9" r="1.9" fill="currentColor" />
        </svg>
        <span>Pickup, delivery or shipping, all within Michigan only.</span>
      </p>
      <span className="ticket__stamp" data-ticket-stamp>
        <Stamp tone="salt" />
      </span>
      {/* Hand-drawn tail from the steps, across the tear, pointing into the order pad. */}
      <svg className="ticket__tail" viewBox="0 0 46 84" aria-hidden="true" focusable="false">
        <path
          data-ticket-tail
          d="M23 1C12 14 34 28 23 42C14 54 30 64 23 80L15.5 72.5L23 80L30.5 72.5"
        />
      </svg>
    </div>
  );
}
