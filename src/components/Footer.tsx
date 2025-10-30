import { Instagram, Mail, Phone, MessageCircle, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#3D2B1F] text-[#F5F2ED] py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-light mb-4 tracking-wider">
              Impeccable Cookie Company
            </h3>
            <p className="font-light text-[#F5F2ED]/80 leading-relaxed">
              Crafting exceptional cookies with passion, precision, and the finest ingredients.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-light mb-4 tracking-wide">Contact</h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@impeccablecookies.com"
                className="flex items-center gap-3 text-[#F5F2ED]/80 hover:text-[#F5F2ED] transition-colors duration-300 font-light"
              >
                <Mail size={18} />
                <span>hello@impeccablecookies.com</span>
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center gap-3 text-[#F5F2ED]/80 hover:text-[#F5F2ED] transition-colors duration-300 font-light"
              >
                <Phone size={18} />
                <span>(555) 123-4567</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-light mb-4 tracking-wide">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/p/DEbdDohsF_0/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#F5F2ED]/10 hover:bg-[#8B7355] flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.threads.com/@impeccablecookieco"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#F5F2ED]/10 hover:bg-[#8B7355] flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Threads"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="https://share.google/22K2JXGzhwju16PMH"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#F5F2ED]/10 hover:bg-[#8B7355] flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Google Maps"
              >
                <MapPin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#F5F2ED]/20 text-center">
          <p className="text-[#F5F2ED]/60 font-light text-sm">
            {new Date().getFullYear()} Impeccable Cookie Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
