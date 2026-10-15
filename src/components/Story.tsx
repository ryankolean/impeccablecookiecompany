import Eyebrow from './ui/Eyebrow';
import '../styles/story.css';

// Butter band, type only. The heading is a data-split line reveal and the statement a
// data-scroll-reveal (words brighten as it is read); both are runtime patterns that
// leave this static markup fully readable without JS or under reduced motion. Neither
// gets .reveal, on itself or a parent (one driver per element).
export default function Story() {
  return (
    <section id="story" className="story" aria-labelledby="story-title">
      <div className="container story__grid">
        <div>
          <Eyebrow>My story</Eyebrow>
          <h2 id="story-title" tabIndex={-1} data-arrival-focus data-split>
            It took <em>over a year</em> to make the perfect cookie.
          </h2>
        </div>
        <div>
          <p className="story__statement font-serif" data-scroll-reveal>
            I spent over a year developing my chocolate chip cookie recipe, and I'm still working on new
            ones. Every order is baked in my home kitchen in Michigan.
          </p>
          <p className="story__signoff font-serif reveal">From the Impeccable kitchen</p>
        </div>
      </div>
    </section>
  );
}
