import OrderForm, { InstagramLink } from './OrderForm';
import Ticket from './Ticket';
import Eyebrow from './ui/Eyebrow';
import '../styles/order.css';

// "How ordering works" and the order form are one chapter: the ticket closes the sugar
// band on its perforated edge and the pad opens the cocoa band on the matching scallop.
// The #contact wrapper keeps legacy /#contact links landing on the form.
export default function OrderChapter() {
  return (
    <>
      <section id="how" className="how" aria-labelledby="how-title">
        <div className="container how__grid">
          <div className="how__intro">
            <Eyebrow>How ordering works</Eyebrow>
            <h2 id="how-title" tabIndex={-1} data-arrival-focus data-split>
              Request first. <em>Pay after I confirm.</em>
            </h2>
            <p className="how__lead reveal">
              There&apos;s no checkout on this site. Ordering is a short conversation, and you never pay before your
              order is confirmed.
            </p>
          </div>
          <div className="how__ticket">
            <Ticket />
          </div>
        </div>
      </section>
      <div id="contact">
        <section id="order" className="order surface-dark" aria-labelledby="order-title">
          <div className="container order__grid">
            <div className="order__intro">
              <h2 id="order-title" className="order__title" tabIndex={-1} data-arrival-focus>
                Your order request
              </h2>
              <p className="order__lede">
                Questions first? Message me on Instagram at <InstagramLink />.
              </p>
            </div>
            <div className="pad surface-light">
              <OrderForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
