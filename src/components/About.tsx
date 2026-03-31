export default function About() {
  return (
    <section id="about" className="py-24 bg-[#F5F2ED]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="/20241205_084636_0.jpg"
                alt="Mixing cookie dough"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <img
                src="/20241205_084639_0.jpg"
                alt="Premium baking ingredients"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="/PXL_20241119_023700041.MP.jpg"
                alt="Freshly baked cookies in oven"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <img
                src="/PXL_20241128_140429762.PORTRAIT.ORIGINAL.jpg"
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
