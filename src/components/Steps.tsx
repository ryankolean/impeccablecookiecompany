import type { ComponentType, ReactNode } from 'react';
import { CardCheckIcon, ChatIcon, CookieIcon } from './icons/StepIcons';

type Step = { title: string; text: ReactNode; Icon: ComponentType<{ className?: string }> };

// Step 2's meeting offer is required (MCL 289.4102(4)): never shorten it away.
const steps: Step[] = [
  {
    title: 'Send a request',
    text: "Pick your cookies and how many. It's a request, not a purchase, so nothing is charged.",
    Icon: CookieIcon,
  },
  {
    title: 'I confirm with you',
    text: "I'll reach out by your preferred method to confirm the details. Before you pay, you're welcome to meet me in person or on a video call to ask about ingredients, allergens or anything else.",
    Icon: ChatIcon,
  },
  {
    title: 'Pay by Venmo',
    text: (
      <>
        Once your order is confirmed, pay by Venmo to <span className="step__handle">@impeccablecookie</span>. Never
        before.
      </>
    ),
    Icon: CardCheckIcon,
  },
];

// Three salt step cards. Each card rises with the shared .reveal; its number badge pops
// and the arrow to the next card draws on the card's own view timeline (CSS only, in
// order.css). This markup is the static end state for no JS, reduced motion and browsers
// without scroll timelines. The badge numeral is visual only: the <ol> numbers the steps
// for assistive tech.
export default function Steps() {
  return (
    <ol className="steps" role="list">
      {steps.map(({ title, text, Icon }, i) => (
        <li className="step reveal" key={title}>
          <span className="step__num" aria-hidden="true">
            {i + 1}
          </span>
          <Icon className="step__icon" />
          <p className="step__label">{`Step ${i + 1}`}</p>
          <h3 className="step__title">{title}</h3>
          <p className="step__text">{text}</p>
          {i < steps.length - 1 && (
            <svg className="step__arrow" viewBox="0 0 28 16" aria-hidden="true" focusable="false">
              <path pathLength="1" d="M2 8h23M19.5 2.5 25 8l-5.5 5.5" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  );
}
