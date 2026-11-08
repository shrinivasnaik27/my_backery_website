import React from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { MessageCircle, Navigation, ChevronRight, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Hero: React.FC = () => {
  const { businessSettings, language, generateWhatsAppGeneralLink } = useStore();
  const t = TRANSLATIONS[language];

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#E6DBCE] pt-8 pb-16 lg:py-20">
      {/* Subtle radial backdrop for warmth */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DFB75A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#C89D3C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Story & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location & Brand Origin Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#7A4B34] uppercase">
              <span className="font-kannada text-xs font-normal text-[#C89D3C]">
                ಶಬರಿ ಸ್ವೀಟ್ಸ್ &amp; ಬೇಕರಿ
              </span>
              <span aria-hidden="true" className="text-[#E6DBCE]">·</span>
              <span>Bhatkal, Karnataka</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2C1810] tracking-tight leading-[1.15] text-balance">
              {language === 'kn' ? (
                <>
                  ಸ್ವಲ್ಪ ಮಾಧುರ್ಯ, <br />
                  <span className="text-[#C89D3C] italic font-normal">ಅಪಾರ ಸಂತೋಷ.</span>
                </>
              ) : language === 'hi' ? (
                <>
                  थोड़ी मिठास, <br />
                  <span className="text-[#C89D3C] italic font-normal">ढेर सारी खुशियाँ।</span>
                </>
              ) : (
                <>
                  A Little Sweetness, <br />
                  <span className="text-[#C89D3C] italic font-normal">A Lot of Happiness.</span>
                </>
              )}
            </h1>

            {/* Supporting Intro */}
            <p className="text-base sm:text-lg text-[#5C3624] leading-relaxed max-w-xl">
              Welcome to <strong className="text-[#2C1810] font-semibold">SHABARI Sweets &amp; Bakery</strong> in Bhatkal. 
              We take pride in preparing traditional pure ghee Indian sweets, artisan celebration cakes, 
              crisp oven-baked pastries, and authentic evening chaats — crafted fresh daily for your family celebrations.
            </p>

            {/* Quick Trust Badges (Anti-slop: clean unboxed text with subtle dividers) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-[#7A4B34] pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C89D3C]" />
                Pure Desi Ghee &amp; Fresh Bakes
              </span>
              <span aria-hidden="true" className="text-[#E6DBCE]">·</span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C89D3C]" />
                Custom Birthday &amp; Event Cakes
              </span>
              <span aria-hidden="true" className="text-[#E6DBCE]">·</span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#C89D3C]" />
                Friendly Bhatkal Hospitality
              </span>
            </div>

            {/* CTAs: 3 Key Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 bg-[#2C1810] hover:bg-[#422518] text-[#FAF7F2] px-6 py-3.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C89D3C] whitespace-nowrap active:scale-98"
              >
                <span>{t.exploreMenu}</span>
                <ChevronRight className="w-4 h-4 text-[#DFB75A]" />
              </a>

              <a
                href={generateWhatsAppGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5C] text-white px-5 py-3.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#25D366] whitespace-nowrap active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.orderWhatsApp}</span>
              </a>

              <a
                href={businessSettings.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#F3ECE2] hover:bg-[#E6DBCE] text-[#2C1810] border border-[#E6DBCE] px-5 py-3.5 rounded-lg text-sm font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C89D3C] whitespace-nowrap active:scale-98"
              >
                <Navigation className="w-4 h-4 text-[#C89D3C]" />
                <span>{t.getDirections}</span>
              </a>
            </div>

            {/* Storefront Note */}
            <p className="text-xs text-[#7A4B34]/80 italic pt-1">
              Visit our physical store in Bhatkal or pre-order customized birthday cakes with 24h advance notice.
            </p>
          </div>

          {/* Right Column: Hero High-Res Food Imagery with Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative card shadow */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#E6DBCE] bg-[#F3ECE2]">
                <img
                  src="/src/assets/images/hero_shabari_sweets_1794111050804.jpg"
                  alt="Authentic traditional Indian sweets on brass platter at Shabari Sweets"
                  className="w-full h-80 sm:h-96 lg:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to solid container if image ever fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Fallback container if image fails to render */}
                <div className="absolute inset-0 bg-linear-to-tr from-[#2C1810] to-[#5C3624] -z-10 flex flex-col items-center justify-center p-6 text-center text-white">
                  <span className="font-serif text-2xl font-bold">SHABARI Sweets &amp; Bakery</span>
                  <span className="font-kannada text-sm text-[#DFB75A] mt-1">ಶಬರಿ ಸ್ವೀಟ್ಸ್ &amp; ಬೇಕರಿ</span>
                </div>

                {/* Subtle Image Scrim for legibility overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2C1810]/85 via-[#2C1810]/40 to-transparent p-5 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#DFB75A] uppercase tracking-wider font-sans">
                        Fresh Daily
                      </p>
                      <p className="font-serif text-lg font-bold text-white">
                        Desi Ghee Sweets &amp; Laddus
                      </p>
                      <p className="text-xs text-[#FAF7F2]/90 font-kannada">
                        ಶುದ್ಧ ತುಪ್ಪದ ಸಾಂಪ್ರದಾಯಿಕ ಸಿಹಿ ತಿಂಡಿಗಳು
                      </p>
                    </div>
                    <a
                      href="#menu"
                      className="text-xs bg-[#DFB75A] hover:bg-[#C89D3C] text-[#2C1810] font-bold px-3 py-1.5 rounded-md transition-colors shrink-0"
                    >
                      View Menu
                    </a>
                  </div>
                </div>
              </div>

              {/* Floating Review Badge Overlay */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-xl border border-[#E6DBCE] max-w-[220px]">
                <div className="flex items-center gap-1.5 text-[#C89D3C]">
                  {'★'.repeat(5)}
                  <span className="text-xs font-bold text-[#2C1810] ml-1">5.0</span>
                </div>
                <p className="text-xs font-semibold text-[#2C1810] mt-1">
                  Loved in Bhatkal
                </p>
                <p className="text-[11px] text-[#7A4B34] line-clamp-1">
                  Fresh taste &amp; warm service
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
