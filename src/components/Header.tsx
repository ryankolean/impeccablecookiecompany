import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2ED]/95 backdrop-blur-sm border-b border-[#8B7355]/20">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-light tracking-wider text-[#3D2B1F]">
            Impeccable Cookie Company
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[#2C2C2C] hover:text-[#8B7355] transition-colors duration-300 font-light"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-[#2C2C2C] hover:text-[#8B7355] transition-colors duration-300 font-light"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('cookies')}
              className="text-[#2C2C2C] hover:text-[#8B7355] transition-colors duration-300 font-light"
            >
              Cookies
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-[#2C2C2C] hover:text-[#8B7355] transition-colors duration-300 font-light"
            >
              Contact
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#3D2B1F]"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[#2C2C2C] hover:text-[#8B7355] transition-colors duration-300 font-light text-left"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-[#2C2C2C] hover:text-[#8B7355] transition-colors duration-300 font-light text-left"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('cookies')}
              className="text-[#2C2C2C] hover:text-[#8B7355] transition-colors duration-300 font-light text-left"
            >
              Cookies
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-[#2C2C2C] hover:text-[#8B7355] transition-colors duration-300 font-light text-left"
            >
              Contact
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
