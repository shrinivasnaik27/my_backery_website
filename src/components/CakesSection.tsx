import React from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { Cake, Sparkles, MessageCircle, CalendarCheck, ShieldCheck } from 'lucide-react';

interface CakesSectionProps {
  onOpenCakeModal: (flavor?: string) => void;
}

export const CakesSection: React.FC<CakesSectionProps> = ({ onOpenCakeModal }) => {
  const { language } = useStore();
  const t = TRANSLATIONS[language];

  const featuredFlavors = [
    {
      name: 'Dutch Truffle Dark Chocolate',
      nameKn: 'ಡಚ್ ಚಾಕೊಲೇಟ್ ಟ್ರಫಲ್',
      desc: 'Velvety dark chocolate ganache with moist sponge.',
      priceEst: '₹650',
    },
    {
      name: 'Fresh Strawberry Vanilla Gateau',
      nameKn: 'ತಾಜಾ ಸ್ಟ್ರಾಬೆರಿ ವೆನಿಲ್ಲಾ ಗಾಟೋ',
      desc: 'Layers of seasonal fruit compote & whipped cream.',
      priceEst: '₹580',
    },
    {
      name: 'Royal Rasmalai Fusion Cake',
      nameKn: 'ರಸಮಲೈ ಫ್ಯೂಷನ್ ಕೇಕ್',
      desc: 'Cardamom rabdi sponge with pistachio & rasmalai.',
      priceEst: '₹720',
    },
    {
      name: 'Classic Black Forest',
      nameKn: 'ಕ್ಲಾಸಿಕ್ ಬ್ಲಾಕ್ ಫಾರೆಸ್ಟ್',
      desc: 'Rich chocolate flakes, sour cherries & cream.',
      priceEst: '₹520',
    },
  ];

  return (
    <section id="cakes" className="py-16 sm:py-20 bg-[#F3ECE2] border-b border-[#E6DBCE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Cake Details & Form Trigger */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C89D3C]">
              <Cake className="w-4 h-4" />
              <span>{language === 'kn' ? 'ಸಂಭ್ರಮದ ಕೇಕ್ಸ್' : 'Celebrations & Milestones'}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C1810] tracking-tight leading-tight">
              {t.cakeSectionTitle}
            </h2>

            <p className="text-base text-[#5C3624] leading-relaxed">
              Every milestone deserves a cake baked with passion. Whether it is a child’s first birthday, 
              an anniversary, a graduation, or a family reunion in Bhatkal, we handcraft custom cakes with 
              fresh fruit compotes, premium chocolates, and 100% vegetarian eggless options.
            </p>

            {/* Cake Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/80 p-3.5 rounded-xl border border-[#E6DBCE] text-xs space-y-1">
                <span className="font-bold text-[#2C1810] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C89D3C]" />
                  100% Eggless
                </span>
                <p className="text-[#7A4B34]">Vegetarian bakery safe for all family celebrations.</p>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xl border border-[#E6DBCE] text-xs space-y-1">
                <span className="font-bold text-[#2C1810] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C89D3C]" />
                  Custom Lettering
                </span>
                <p className="text-[#7A4B34]">Personalized names and heartfelt occasion messages.</p>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xl border border-[#E6DBCE] text-xs space-y-1">
                <span className="font-bold text-[#2C1810] flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-[#C89D3C]" />
                  24h Pre-Order
                </span>
                <p className="text-[#7A4B34]">Prepared fresh on your chosen pickup day &amp; time.</p>
              </div>
            </div>

            {/* Popular Flavors Strip */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A4B34] mb-3">
                Popular Celebration Flavors:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuredFlavors.map((flv) => (
                  <div
                    key={flv.name}
                    onClick={() => onOpenCakeModal(flv.name)}
                    className="p-3 bg-white rounded-xl border border-[#E6DBCE] hover:border-[#C89D3C] transition-all cursor-pointer shadow-xs hover:shadow-md flex justify-between items-center group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#2C1810] group-hover:text-[#C89D3C] transition-colors">
                        {flv.name}
                      </h4>
                      <p className="text-[11px] font-kannada text-[#7A4B34]">{flv.nameKn}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#2C1810] shrink-0 ml-2">
                      {flv.priceEst} <span className="text-[10px] text-[#7A4B34]">/ 500g</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => onOpenCakeModal()}
                className="flex items-center gap-2 bg-[#2C1810] hover:bg-[#422518] text-[#FAF7F2] px-6 py-3.5 rounded-lg text-sm font-semibold transition-all shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C89D3C] active:scale-98"
              >
                <Cake className="w-4 h-4 text-[#DFB75A]" />
                <span>{t.customizeCake}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCakeModal()}
                className="flex items-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#2C1810] border border-[#E6DBCE] px-5 py-3.5 rounded-lg text-sm font-semibold transition-all shadow-xs active:scale-98"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Quick WhatsApp Consultation</span>
              </button>
            </div>

            <p className="text-xs text-[#7A4B34] italic">
              * Note: Custom cake shapes, tier cakes, and delivery arrangements require proprietor confirmation.
            </p>
          </div>

          {/* Right Column: High-Res Cake Presentation */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#E6DBCE] bg-[#FAF7F2]">
              <img
                src="/src/assets/images/celebration_cakes_1794111051858.jpg"
                alt="Artisan fresh celebration berry cake at Shabari Sweets"
                className="w-full h-80 sm:h-96 lg:h-[460px] object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2C1810]/90 via-[#2C1810]/40 to-transparent p-6 text-white">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#DFB75A]">
                  Fresh Baked on Order
                </span>
                <p className="font-serif text-xl font-bold text-white mt-1">
                  Custom Birthday &amp; Celebration Cakes
                </p>
                <p className="text-xs text-[#FAF7F2]/80 mt-1">
                  Pure vegetarian, soft layers, crafted fresh for your event in Bhatkal.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
