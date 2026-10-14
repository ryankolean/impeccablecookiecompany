import Photo from './Photo';

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#F5F2ED]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal space-y-6">
            <h2 className="text-4xl md:text-5xl font-light text-[#3D2B1F] tracking-tight">
              Our Story
            </h2>
            <div className="space-y-4 text-[#2C2C2C] font-light text-lg leading-relaxed">
              <p>
                Impeccable Cookie Company began with a simple mission: to elevate the humble cookie
                into something truly exceptional.
              </p>
              <p>
                What started as a passion for home baking has grown into an ongoing journey of
                experimentation and improvement. Each small batch receives the attention it deserves,
                and we're always tinkering, tasting, and refining our recipes to make them better.
              </p>
              <p>
                Each and every cookie is handmade, because we believe even the simplest treat can be
                extraordinary.
              </p>
            </div>
          </div>

          <div className="reveal grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Photo
                name="chocolate-chip"
                sizes="(min-width: 1536px) 350px, (min-width: 768px) 22vw, calc(50vw - 32px)"
                alt="Mixing cookie dough"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <Photo
                name="snickerdoodle"
                sizes="(min-width: 1536px) 350px, (min-width: 768px) 22vw, calc(50vw - 32px)"
                alt="Premium baking ingredients"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-4 pt-8">
              <Photo
                name="oven"
                sizes="(min-width: 1536px) 350px, (min-width: 768px) 22vw, calc(50vw - 32px)"
                alt="Freshly baked cookies in oven"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <Photo
                name="artisan"
                sizes="(min-width: 1536px) 350px, (min-width: 768px) 22vw, calc(50vw - 32px)"
                alt="Artisan cookie baking process"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
