import type { CSSProperties, ReactNode } from 'react';
import Eyebrow from './ui/Eyebrow';
import PillLink from './ui/PillLink';
import Swash from './ui/Swash';
import '../styles/about.css';

const step = (i: number) => ({ '--i': i }) as CSSProperties;

type Chapter = { id: string; num: string; title: string; body: ReactNode };

// Owner's story in his own words (first person). Brands are named in plain text only,
// never as logos or in a cookie's name.
const chapters: Chapter[] = [
  {
    id: 'unwind',
    num: 'One',
    title: 'Baking is how I unwind',
    body: (
      <>
        <p className="reveal">
          I've been baking for a long time, and cakes came first. They were always my favorite thing to bake and share
          with family and friends.
        </p>
        <p className="reveal">
          Baking is how I relieve stress. It's the closest thing I have to meditation. And the best part has never
          changed: walking in with something I made and watching people's faces light up.
        </p>
      </>
    ),
  },
  {
    id: 'wife',
    num: 'Two',
    title: 'Then I met my wife',
    body: (
      <p className="reveal">
        She doesn't like cake. Not the texture, and not most of the flavors. But she loves cookies, and cookies became
        the thing we bonded over. So I started baking cookies.
      </p>
    ),
  },
  {
    id: 'new-york',
    num: 'Three',
    title: 'Chasing a New York cookie',
    body: (
      <>
        <p className="reveal">
          For years I'd followed great bakeries across the US and around the world. I love the Great British Bake Off
          for how kind it is and how much skill it takes.
        </p>
        <p className="reveal">
          For a long time I tried to recreate Levain Bakery's cookies from New York in my own kitchen. Along the way,
          all that testing turned into my own recipe and method, pieced together from many recipes and adjusted batch
          after batch. Then I noticed other bakers doing the same thing: taking a recipe they made at home and building
          it into something of their own.
        </p>
      </>
    ),
  },
  {
    id: 'a-year',
    num: 'Four',
    title: 'Over a year to get it right',
    body: (
      <>
        <p className="reveal">
          The early batches spread too thin and baked up crisp. I wanted a cookie with lift: a crunchy outside that's
          still soft, and a dense center.
        </p>
        <p className="reveal">I also wanted it to be about half chocolate, so the first bite makes you stop and say:</p>
        <p className="about-pull reveal">“Wow, that's a lot of chocolate.”</p>
        <p className="reveal">It took over a year, and a lot of honest feedback from friends and family, to get there.</p>
        <div className="about-card reveal">
          <h3 className="about-card__title">In every chocolate chip cookie</h3>
          <ul className="about-card__list" role="list">
            <li>
              <strong>Brown butter,</strong> for a deep, toasted flavor.
            </li>
            <li>
              <strong>Callebaut Belgian dark chocolate,</strong> plus Toll House chips for the taste so many of us grew
              up with.
            </li>
            <li>
              <strong>Dough rested at least overnight</strong> before it's baked, so the flavors settle in.
            </li>
            <li>
              <strong>Baked fresh for your order.</strong> I portion and freeze the dough, then bake it when your order
              comes in.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'snickerdoodle',
    num: 'Five',
    title: 'A snickerdoodle for my wife',
    body: (
      <p className="reveal">
        Snickerdoodles are one of my wife's favorites, so that was the next cookie. It isn't the traditional recipe
        with cream of tartar. It's built on my own dough and rolled in as much cinnamon sugar as it will hold, so the
        outside bakes into a crunchy, sugary shell.
      </p>
    ),
  },
  {
    id: 'next',
    num: 'Six',
    title: "What's next",
    body: (
      <p className="reveal">
        The recipes are where I want them. Next, I'm working out what it would take to bake them at bakery scale, for
        bigger orders on real deadlines, without changing what makes them good.
      </p>
    ),
  },
];

// Butter top band, six chapters in one reading column on parchment, then a cocoa band
// back to the order form. Motion: the top band loads with .hero-in (the H1 and lede with
// transform only, as either may be the LCP). In each chapter the number and title rise
// together, then every paragraph and the card on their own: .reveal finishes once a block
// is fully on screen, so a whole chapter taller than a phone screen would sit half faded.
// The closing H2 is a data-split line reveal with no .reveal parent (one driver per
// element). The H1 accent is a swash, not italic: the italic face loads after the load
// event (src/main.tsx), and swapping it into the H1 would reflow the top band.
export default function About() {
  return (
    <>
      <section className="about-top" aria-labelledby="about-title">
        <div className="container">
          <Eyebrow className="hero-in">My story</Eyebrow>
          <h1 id="about-title" className="about-top__title hero-in no-fade" style={step(1)}>
            It started with someone who doesn't like <Swash>cake</Swash>.
          </h1>
          <p className="about-top__lede font-serif hero-in no-fade" style={step(2)}>
            I'm Ryan. I bake every Impeccable cookie myself, in my home kitchen in Michigan. This is how they came to
            be.
          </p>
        </div>
      </section>

      <div className="container about-body">
        {chapters.map(({ id, num, title, body }) => (
          <section className="about-ch" key={id} aria-labelledby={`about-${id}`}>
            <div className="reveal">
              <p className="about-ch__num font-serif" aria-hidden="true">
                {num}
              </p>
              <h2 id={`about-${id}`} className="about-ch__title">
                {title}
              </h2>
            </div>
            {body}
          </section>
        ))}
      </div>

      <section className="about-end surface-dark" aria-labelledby="about-end-title">
        <div className="container about-end__grid">
          <div>
            <h2 id="about-end-title" className="about-end__title" data-split>
              Try one for yourself.
            </h2>
            <p className="about-end__text">
              Send me a request and I'll confirm the details with you. Pickup, delivery or shipping, all within Michigan
              only.
            </p>
          </div>
          <PillLink href="/#order" arrow className="about-end__cta">
            Request an order
          </PillLink>
        </div>
      </section>
    </>
  );
}
