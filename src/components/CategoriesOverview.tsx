import React from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { ArrowUpRight } from 'lucide-react';
import { CategoryId } from '../types';

interface CategoriesOverviewProps {
  onSelectCategory: (catId: CategoryId) => void;
}

export const CategoriesOverview: React.FC<CategoriesOverviewProps> = ({ onSelectCategory }) => {
  const { categories, language } = useStore();
  const t = TRANSLATIONS[language];

  return (
    <section className="py-16 bg-[#FAF7F2] border-b border-[#E6DBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C89D3C]">
            {language === 'kn' ? 'ನಮ್ಮ ಆಕರ್ಷಕ ವಿಭಾಗಗಳು' : 'What We Craft'}
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2C1810] mt-2">
            {t.categoriesTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#5C3624] mt-3">
            {t.categoriesSubtitle}
          </p>
        </div>

        {/* 6 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative bg-[#F3ECE2] rounded-2xl overflow-hidden border border-[#E6DBCE] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Category Image */}
              <div className="relative h-52 overflow-hidden bg-[#E6DBCE]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/75 via-transparent to-black/10" />
                
                {/* Visual pill-free badge on top right */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#2C1810] p-2 rounded-full shadow-sm group-hover:bg-[#C89D3C] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif text-xl font-bold leading-tight drop-shadow-xs">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-kannada text-[#DFB75A] drop-shadow-xs">
                    {cat.nameKannada}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-[#5C3624] leading-relaxed">
                  {cat.description}
                </p>

                <div className="pt-4 mt-2 border-t border-[#E6DBCE]/60 flex items-center justify-between text-xs font-semibold text-[#2C1810] group-hover:text-[#C89D3C] transition-colors">
                  <span>Explore Items</span>
                  <span>View All →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
