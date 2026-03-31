import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F2ED] to-[#FAF8F5] pt-20"
    >
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-light text-[#3D2B1F] leading-tight tracking-tight">
              Artisanal Cookies Crafted to Perfection
            </h1>
            <p className="text-xl md:text-2xl text-[#8B7355] font-light leading-relaxed">
              Premium ingredients. Traditional methods. Exceptional taste.
            </p>
            <button
              onClick={scrollToContact}
              className="group inline-flex items-center gap-3 bg-[#3D2B1F] text-[#F5F2ED] px-8 py-4 rounded-full hover:bg-[#8B7355] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="font-light tracking-wide">Order Your Cookies</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/PXL_20241205_134705256.PORTRAIT.ORIGINAL.jpg"
                alt="Artisanal cookies"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#8B7355]/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-[#3D2B1F]/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
