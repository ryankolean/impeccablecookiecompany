import type { CSSProperties } from 'react';
import Photo, { HERO_SIZES } from './Photo';
import Eyebrow from './ui/Eyebrow';
import Magnet from './ui/Magnet';
import PillLink from './ui/PillLink';
import Stamp from './ui/Stamp';
import Swash from './ui/Swash';
import '../styles/hero.css';

const step = (i: number) => ({ '--i': i }) as CSSProperties;

// Load: .hero-in rises in an 80ms stagger; the H1 and lede move with transform only
// (either may be the mobile LCP) and the photo never touches opacity. Exit: the arch
// group shrinks and the stamp turns as the hero leaves (CSS view timelines in
// index.css). Each element runs one animation, so load and exit classes sit on
// different nested wrappers.
export default function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <Eyebrow className="hero-in">A Michigan home bakery</Eyebrow>
          <h1 id="hero-title" className="hero__title hero-in no-fade" style={step(1)}>
            The <Swash>perfect</Swash> cookie, made in Michigan.
          </h1>
          <p className="hero__lede hero-in no-fade" style={step(2)}>
            Chocolate chip and snickerdoodle, baked to order in my Michigan home kitchen. Send a request, I'll confirm
            the details with you, and you pay only after that.
          </p>
          {/* The header reads data-hero-cta: once this row scrolls away, its Order pill gains a ring. */}
          <div className="hero__ctas hero-in" style={step(3)} data-hero-cta>
            <Magnet>
              <PillLink href="#order" arrow>
                Request an order
              </PillLink>
            </Magnet>
            <a className="link" href="#cookies">
              Meet the cookies
            </a>
          </div>
          <ul className="hero__facts hero-in" style={step(4)} role="list">
            <li>Michigan orders only</li>
            <li>No payment until I confirm</li>
          </ul>
        </div>

        <div className="hero__art hero-exit-shrink">
          <div className="hero__plate" aria-hidden="true" />
          <div className="hero__arch hero-photo-in">
            <Photo
              name="hero"
              alt="A thick chocolate chip cookie topped with flaky sea salt on a gray stoneware plate"
              sizes={HERO_SIZES}
              className="hero__photo"
              priority
            />
          </div>
          <div className="hero__stamp stamp-press">
            <Stamp className="hero-exit-turn" />
          </div>
        </div>
      </div>
    </section>
  );
}
