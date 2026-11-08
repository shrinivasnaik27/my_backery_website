import React from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { MapPin, Phone, MessageCircle, Heart, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin, onOpenAdminDashboard }) => {
  const { businessSettings, language, isAdminLoggedIn, generateWhatsAppGeneralLink } = useStore();
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-[#2C1810] text-[#FAF7F2] border-t border-[#422518]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                SHABARI <span className="text-[#DFB75A] font-normal">Sweets &amp; Bakery</span>
              </span>
              <span className="text-xs font-kannada text-[#DFB75A] block">
                ಶಬರಿ ಸ್ವೀಟ್ಸ್ &amp; ಬೇಕರಿ · ಭಟ್ಕಳ, ಕರ್ನಾಟಕ
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#E6DBCE] leading-relaxed max-w-sm">
              "{businessSettings.tagline}" Crafting traditional pure ghee sweets, 
              designer birthday cakes, fresh pastries, evening chaats, and bakery delicacies 
              for the wonderful people of Bhatkal.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={generateWhatsAppGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="WhatsApp Chat"
                aria-label="WhatsApp Chat"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <a
                href={`tel:${businessSettings.phone.replace(/[^0-9+]/g, '')}`}
                className="w-9 h-9 rounded-lg bg-[#422518] text-[#DFB75A] flex items-center justify-center hover:bg-[#5C3624] transition-colors"
                title="Call Shop"
                aria-label="Call Shop"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={businessSettings.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#422518] text-[#DFB75A] flex items-center justify-center hover:bg-[#5C3624] transition-colors"
                title="Google Maps Location"
                aria-label="Google Maps Location"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Menu Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFB75A]">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#E6DBCE]">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Traditional Indian Sweets
                </a>
              </li>
              <li>
                <a href="#cakes" className="hover:text-white transition-colors">
                  Celebration &amp; Birthday Cakes
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Fresh Pastries &amp; Tarts
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Chats &amp; Evening Snacks
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Ice Cream &amp; Matka Kulfi
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Bakery Buns, Puffs &amp; Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Store Location & Timings */}
          <div className="lg:col-span-4 space-y-3 text-xs text-[#E6DBCE]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFB75A]">
              Visit Our Store
            </h4>
            <p className="leading-relaxed">
              {businessSettings.address}
            </p>
            <p className="font-kannada text-[#DFB75A]/90">
              {businessSettings.addressKannada}
            </p>
            <div className="pt-1">
              <span className="font-semibold text-white block">Opening Hours:</span>
              <span className="text-[#E6DBCE]">8:00 AM – 10:00 PM (Daily)</span>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Owner Bar */}
        <div className="mt-12 pt-8 border-t border-[#422518] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E6DBCE]/70">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} SHABARI Sweets &amp; Bakery, Bhatkal. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>for local patrons.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] opacity-75">
              Demonstration Mode Active
            </span>
            <button
              type="button"
              onClick={isAdminLoggedIn ? onOpenAdminDashboard : onOpenAdminLogin}
              className="flex items-center gap-1 hover:text-white transition-colors text-xs font-medium"
            >
              <Lock className="w-3 h-3 text-[#DFB75A]" />
              <span>{isAdminLoggedIn ? 'Owner Dashboard' : 'Owner Portal'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
