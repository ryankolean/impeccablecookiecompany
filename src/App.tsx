import MotionProvider from './motion/MotionProvider';
import Header from './components/Header';
import Hero from './components/Hero';
import Story from './components/Story';
import Cookies from './components/Cookies';
import OrderChapter from './components/OrderChapter';
import Footer from './components/Footer';

// Section ids: #home (Hero), #story, #cookies, #how and #contact > #order
// (OrderChapter). Rendered to static HTML at build time (src/entry-server.tsx), so
// nothing here may read window, Date, Math.random or storage during render.
export default function App() {
  return (
    <MotionProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <a className="skip-link" href="#order">
        Skip to order form
      </a>
      <Header />
      <main id="main" tabIndex={-1} data-arrival-focus>
        <Hero />
        <Story />
        <Cookies />
        <OrderChapter />
      </main>
      <Footer />
    </MotionProvider>
  );
}
