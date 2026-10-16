import OrderForm, { InstagramLink } from './OrderForm';
import Steps from './Steps';
import Eyebrow from './ui/Eyebrow';
import PillLink from './ui/PillLink';
import Stamp from './ui/Stamp';
import { ArrowDownIcon } from './icons/OrderArt';
import '../styles/order.css';

// "How ordering works" and the order form are one chapter: the sugar band ends on a
// scalloped edge with the "Ready to order?" pill sitting on it, and the cocoa band
// opens with the form on a salt pad. The #contact wrapper keeps legacy /#contact links
// landing on the form.
export default function OrderChapter() {
  return (
    <>
      <section id="how" className="how" aria-labelledby="how-title">
        <span className="how__sparks how__sparks--top" aria-hidden="true" />
        <span className="how__sparks how__sparks--bottom" aria-hidden="true" />
        <div className="container how__grid">
          <div className="how__intro">
            <Eyebrow className="how__eyebrow">How ordering works</Eyebrow>
            <h2 id="how-title" className="how__title" tabIndex={-1} data-arrival-focus data-split>
              Request first. <em>Pay after I confirm.</em>
            </h2>
            <p className="how__lead reveal">
              There&apos;s no checkout on this site. Ordering is a short conversation, and you never pay before your
              order is confirmed.
            </p>
            <p className="how__where reveal">
              <span className="how__pin" aria-hidden="true" />
              <span>Pickup, delivery or shipping, all within Michigan only.</span>
            </p>
          </div>
          <Steps />
          <div className="how__next">
            <PillLink href="#order" className="ready">
              <span className="ready__text">
                <span className="ready__title">Ready to order?</span>
                <span className="ready__sub">Fill out the form below</span>
              </span>
              <span className="ready__arrow">
                <ArrowDownIcon />
              </span>
            </PillLink>
            <span className="how__loop" aria-hidden="true" />
          </div>
        </div>
      </section>
      <div id="contact">
        <section id="order" className="order surface-dark" aria-labelledby="order-title">
          <div className="container order__grid">
            <div className="order__intro">
              <span className="order__stamp">
                <Stamp />
              </span>
              <h2 id="order-title" className="order__title" tabIndex={-1} data-arrival-focus>
                Your order request
              </h2>
              <p className="order__lede">
                Questions first? Message me on Instagram at <InstagramLink />.
              </p>
              <span className="order__heart" aria-hidden="true" />
            </div>
            <div className="pad surface-light">
              <OrderForm />
              <span className="pad__art" aria-hidden="true" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
