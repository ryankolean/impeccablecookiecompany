import type { MouseEvent } from 'react';
import Eyebrow from './ui/Eyebrow';
import PillLink from './ui/PillLink';
import ChocolateChipIllustration from './illustrations/ChocolateChipIllustration';
import SnickerdoodleIllustration from './illustrations/SnickerdoodleIllustration';
import { flavors, quantitySelectId, type Flavor } from '../data/flavors';
import { isPlainClick, useMotion } from '../motion/context';
import '../styles/cookies.css';

const illustrations: Record<Flavor['id'], typeof ChocolateChipIllustration> = {
  'chocolate-chip': ChocolateChipIllustration,
  snickerdoodle: SnickerdoodleIllustration,
};

// The owner's own list once she sends it; never a placeholder.
function allergenLine({ contains }: Flavor): string {
  return contains?.length
    ? `Contains: ${contains.join(', ')}`
    : 'Ask me about ingredients and allergens before you order.';
}

// Jumps to the order form and puts the visitor straight into this flavor's quantity
// select. Modified clicks keep the browser default. If the select is not there,
// MotionProvider's hash routing runs instead and focuses the form heading.
function RequestPill({ flavor }: { flavor: Flavor }) {
  const { scrollToSection } = useMotion();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return;
    const select = document.getElementById(quantitySelectId(flavor.id));
    if (!select) return;
    e.preventDefault();
    scrollToSection('order', { focus: false, reveal: select });
    select.focus({ preventScroll: true });
  };

  return (
    <PillLink href="#order" className="cookie-card__cta" onClick={onClick}>
      {`Request ${flavor.name.toLowerCase()}`}
    </PillLink>
  );
}

export default function Cookies() {
  return (
    <section id="cookies" className="cookies" aria-labelledby="cookies-title">
      <div className="container">
        <div className="cookies__head">
          <div>
            <Eyebrow>The cookies</Eyebrow>
            <h2 id="cookies-title" className="cookies__title" tabIndex={-1} data-arrival-focus data-split>
              Two cookies are <em>better than one.</em>
            </h2>
          </div>
          <p className="cookies__note">
            Questions about ingredients or allergens? Ask me before you order, or when I confirm your
            request.
          </p>
        </div>

        <ul className="cookies__cards" role="list">
          {flavors.map((flavor, i) => {
            const Illustration = illustrations[flavor.id];
            const titleId = `${flavor.id}-title`;
            return (
              <li key={flavor.id} className="reveal">
                <article className={`cookie-card cookie-card--${flavor.id}`} aria-labelledby={titleId}>
                  <div className="cookie-card__art">
                    <Illustration />
                  </div>
                  <div className="cookie-card__body">
                    <p className="cookie-card__num">{`No. ${String(i + 1).padStart(2, '0')}`}</p>
                    <h3 id={titleId} className="cookie-card__title">
                      {flavor.name}
                    </h3>
                    <p className="cookie-card__desc">{flavor.description}</p>
                  </div>
                  <div className="cookie-card__foot">
                    <p className="cookie-card__allergens">{allergenLine(flavor)}</p>
                    <RequestPill flavor={flavor} />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
