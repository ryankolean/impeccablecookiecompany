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
                Born from a passion for traditional baking and an unwavering commitment to quality,
                Impeccable Cookie Company represents the perfect marriage of artisan craftsmanship
                and modern refinement.
              </p>
              <p>
                Every cookie begins with carefully selected ingredients sourced from trusted
                suppliers who share our values. We use only premium Belgian chocolate, organic
                flour, and real butter to create cookies that transcend the ordinary.
              </p>
              <p>
                Our small-batch approach ensures each cookie receives the attention it deserves,
                resulting in the perfect balance of texture, flavor, and visual appeal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Baking process"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/3951375/pexels-photo-3951375.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Cookie ingredients"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="https://images.pexels.com/photos/7937496/pexels-photo-7937496.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Fresh cookies"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Cookie details"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
