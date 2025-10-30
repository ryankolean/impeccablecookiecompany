import { useState } from 'react';

const products = [
  {
    name: 'Classic Chocolate Chip',
    description: 'Rich Belgian chocolate chips folded into our signature buttery dough',
    image: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Traditional Snickerdoodle',
    description: 'Cinnamon-sugar perfection with a tender, melt-in-your-mouth texture',
    image: 'https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Artisan Collection',
    description: 'Seasonal specialties crafted with locally-sourced premium ingredients',
    image: 'https://images.pexels.com/photos/1307088/pexels-photo-1307088.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function ProductShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="cookies" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#3D2B1F] mb-4 tracking-tight">
            Our Collection
          </h2>
          <p className="text-lg text-[#8B7355] font-light max-w-2xl mx-auto">
            Each cookie is handcrafted with meticulous attention to detail and the finest ingredients
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-80 object-cover transition-transform duration-700 ${
                    hoveredIndex === index ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/80 to-transparent transition-opacity duration-300 ${
                    hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                ></div>
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-2xl font-light text-[#3D2B1F] tracking-wide">
                  {product.name}
                </h3>
                <p className="text-[#8B7355] font-light leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
