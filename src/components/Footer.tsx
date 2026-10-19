import type { Page } from '../pages';
import Wordmark from './ui/Wordmark';
import '../styles/footer.css';

// Cocoa-deep band. .surface-dark gives the butter focus ring and sugar eyebrows.
// No address, map, phone or Google share link: the owner's home must not be findable.
export default function Footer({ page = 'home' }: { page?: Page }) {
  return (
    <footer className="site-footer surface-dark">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Wordmark variant="reversed" href={page === 'home' ? '#home' : '/'} />
          <p className="site-footer__notice">
            Made in a home kitchen that has not been inspected by the Michigan Department of Agriculture and Rural
            Development.
          </p>
          <p className="site-footer__note">
            Michigan cottage food business. Pickup, delivery and shipping within Michigan only.
          </p>
        </div>

        <div>
          <h2 className="eyebrow mb-4">Contact</h2>
          <ul role="list" className="site-footer__list">
            <li>
              {/* <wbr> lets the address break at the "@" in a narrow column. */}
              <a className="site-footer__link" href="mailto:hello@impeccablecookie.com">
                hello
                <wbr />
                @impeccablecookie.com
              </a>
            </li>
            <li>
              <a className="site-footer__link" href="https://www.instagram.com/impeccablecookieco/">
                Instagram @impeccablecookieco
              </a>
            </li>
            <li>
              <a className="site-footer__link" href="https://venmo.com/u/impeccablecookie">
                Venmo @impeccablecookie
              </a>
              {' (after I confirm)'}
            </li>
          </ul>
        </div>

        <p className="site-footer__copy">{`© ${__BUILD_YEAR__} Impeccable Cookie Company`}</p>
      </div>
    </footer>
  );
}
