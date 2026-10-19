import MotionProvider from './motion/MotionProvider';
import Header from './components/Header';
import About from './components/About';
import Footer from './components/Footer';

// The About page (/about/). Prerendered to dist/about/index.html (scripts/prerender.mjs)
// under the same rules as App: nothing here may read window, Date, Math.random or
// storage during render. data-page tells src/main.tsx which tree to hydrate.
export default function AboutApp() {
  return (
    <MotionProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header page="about" />
      <main id="main" tabIndex={-1} data-arrival-focus data-page="about">
        <About />
      </main>
      <Footer page="about" />
    </MotionProvider>
  );
}
