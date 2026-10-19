import Arrow from './ui/Arrow';
import Eyebrow from './ui/Eyebrow';
import '../styles/story.css';

// The full story lives on the About page (/about/); this band gives the high points.
const points = [
  { lead: 'Brown butter', text: ' for a deep, toasted flavor.' },
  { lead: 'About half chocolate:', text: ' Callebaut Belgian dark, plus the Toll House chips we all grew up with.' },
  { lead: 'Rested overnight,', text: ' then baked to order in my Michigan home kitchen.' },
];

// Butter band, type only. The heading is a data-split line reveal and the statement a
// data-scroll-reveal (words brighten as it is read); both are runtime patterns that
// leave this static markup fully readable without JS or under reduced motion. Neither
// gets .reveal, on itself or a parent (one driver per element); the points each rise
// with .reveal. Their numerals are visual only.
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
            My wife doesn't like cake, but she loves cookies. So I set out to bake her the best one I could.
          </p>
          <ul className="story__points" role="list">
            {points.map(({ lead, text }, i) => (
              <li className="story__point reveal" key={lead}>
                <span className="story__num" aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  <strong>{lead}</strong>
                  {text}
                </span>
              </li>
            ))}
          </ul>
          <a className="link story__more" href="/about/">
            Read my story
            <Arrow className="story__more-arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
