import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Photo from './Photo';

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const container = useRef<HTMLElement>(null);

  // Page-load sequence, pattern from summit-components/motion/examples/03.
  // from() tweens only: with reduced motion or no JS the hero is already complete.
  // No SplitText here: splitting before Inter loads re-wraps the headline when the
  // font swaps in, which Lighthouse measured as 0.044 CLS. Transforms do not shift layout.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('.hero-title', { y: 40, autoAlpha: 0, duration: 0.9 })
          .from('.hero-lede', { y: 20, autoAlpha: 0, duration: 0.6 }, '-=0.55')
          .from('.hero-cta', { y: 16, autoAlpha: 0, duration: 0.5 }, '-=0.35')
          // Transform only: the photo is the LCP element, and fading it from 0
          // delays LCP until the tween ends (measured +400 ms).
          .from('.hero-image', { y: 32, scale: 0.96, duration: 0.9 }, 0)
          .from('.hero-glow', { scale: 0, duration: 0.9, ease: 'back.out(1.7)', stagger: 0.12 }, 0.15);
      });
    },
    { scope: container }
  );

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={container}
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F2ED] to-[#FAF8F5] pt-20"
    >
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="hero-title text-5xl md:text-7xl font-light text-[#3D2B1F] leading-tight tracking-tight">
              Artisanal Cookies Crafted to Perfection
            </h1>
            <p className="hero-lede text-xl md:text-2xl text-[#8B7355] font-light leading-relaxed">
              Premium ingredients. Traditional methods. Exceptional taste.
            </p>
            <div className="hero-cta">
              <button
                onClick={scrollToContact}
                className="group inline-flex items-center gap-3 bg-[#3D2B1F] text-[#F5F2ED] px-8 py-4 rounded-full hover:bg-[#8B7355] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-[.97]"
              >
                <span className="font-light tracking-wide">Order Your Cookies</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="hero-image aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Photo
                name="hero"
                alt="Artisanal cookies"
                sizes="(min-width: 1536px) 720px, (min-width: 768px) 45vw, calc(100vw - 48px)"
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="hero-glow absolute -bottom-6 -right-6 w-48 h-48 bg-[#8B7355]/20 rounded-full blur-3xl -z-10"></div>
            <div className="hero-glow absolute -top-6 -left-6 w-48 h-48 bg-[#3D2B1F]/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
