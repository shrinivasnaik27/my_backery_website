import React from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { Heart, Sparkles, Shield, Clock, Info } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { language } = useStore();
  const t = TRANSLATIONS[language];

  return (
    <section id="about" className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E6DBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Authentic Storefront Photo */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-[#E6DBCE] bg-[#F3ECE2]">
              <img
                src="/src/assets/images/shabari_storefront_1794111052241.jpg"
                alt="SHABARI Sweets & Bakery storefront and service counter"
                className="w-full h-80 sm:h-96 lg:h-[450px] object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/75 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase font-semibold text-[#DFB75A] tracking-wider">
                  Storefront &amp; Hospitality
                </span>
                <p className="font-serif text-lg font-bold text-white">
                  SHABARI Sweets &amp; Bakery · Bhatkal
                </p>
                <p className="text-xs text-[#FAF7F2]/80 font-kannada">
                  ಶಬರಿ ಸ್ವೀಟ್ಸ್ &amp; ಬೇಕರಿ · ಸ್ಥಳೀಯ ಗ್ರಾಹಕರ ಪ್ರೀತಿಯ ತಾಣ
                </p>
              </div>
            </div>

            {/* Note about real storefront verification */}
            <div className="mt-3 text-[11px] text-[#7A4B34] flex items-center gap-1.5 italic">
              <Info className="w-3.5 h-3.5 text-[#C89D3C] shrink-0" />
              <span>Owner Notice: Shop photographs and interior counter details subject to owner verification.</span>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C89D3C]">
              <Heart className="w-4 h-4" />
              <span>{t.navAbout}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] tracking-tight leading-tight">
              A Warm Tradition of Freshness &amp; Sweet Celebrations in Bhatkal
            </h2>

            <p className="text-base text-[#5C3624] leading-relaxed">
              At <strong className="text-[#2C1810]">SHABARI Sweets &amp; Bakery (ಶಬರಿ ಸ್ವೀಟ್ಸ್ &amp; ಬೇಕರಿ)</strong>, 
              we believe that every special family moment, from festivals to intimate milestones, 
              becomes sweeter with authentic taste. Located in the heart of Bhatkal, Karnataka, our 
              shop brings together the best of traditional Indian confectionery and contemporary bakery craft.
            </p>

            <p className="text-sm text-[#5C3624] leading-relaxed">
              Our counters showcase an appetizing selection of pure ghee sweets, melt-in-mouth pedas, 
              rich cashew katlis, freshly baked celebration cakes, crispy tea snacks, evening street chaats, 
              and refreshing sundaes. We focus on cleanliness, quality ingredients, and warm local hospitality.
            </p>

            {/* Quality Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#F3ECE2] p-4 rounded-xl border border-[#E6DBCE] space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-[#2C1810]">
                  <Shield className="w-4 h-4 text-[#C89D3C]" />
                  <span>Pure &amp; Vegetarian Options</span>
                </div>
                <p className="text-xs text-[#7A4B34]">
                  Traditional sweets cooked in pure desi ghee and 100% vegetarian eggless cake options.
                </p>
              </div>

              <div className="bg-[#F3ECE2] p-4 rounded-xl border border-[#E6DBCE] space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-[#2C1810]">
                  <Clock className="w-4 h-4 text-[#C89D3C]" />
                  <span>Daily Fresh Batches</span>
                </div>
                <p className="text-xs text-[#7A4B34]">
                  Bakery puffs, pastries, and evening chaats prepared fresh daily for the local Bhatkal community.
                </p>
              </div>
            </div>

            {/* Disclaimer regarding unconfirmed history */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Owner Transparency:</strong> Founding milestones, company history, and proprietary recipes will be updated once verified by the business proprietor via the Owner Dashboard.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
