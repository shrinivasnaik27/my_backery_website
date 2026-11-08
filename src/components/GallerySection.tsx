import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { ImageLightboxModal } from './ImageLightboxModal';
import { GalleryItem } from '../types';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery, language } = useStore();
  const t = TRANSLATIONS[language];

  const [activeFilter, setActiveFilter] = useState<'all' | 'storefront' | 'sweets' | 'cakes' | 'pastries' | 'chats'>('all');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const filteredGallery = gallery.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const currentItem = selectedItemIndex !== null ? filteredGallery[selectedItemIndex] : null;

  const handleNext = () => {
    if (selectedItemIndex !== null && selectedItemIndex < filteredGallery.length - 1) {
      setSelectedItemIndex(selectedItemIndex + 1);
    } else {
      setSelectedItemIndex(0);
    }
  };

  const handlePrev = () => {
    if (selectedItemIndex !== null && selectedItemIndex > 0) {
      setSelectedItemIndex(selectedItemIndex - 1);
    } else {
      setSelectedItemIndex(filteredGallery.length - 1);
    }
  };

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-[#F3ECE2] border-b border-[#E6DBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C89D3C] mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>{language === 'kn' ? 'ನಮ್ಮ ಗ್ಯಾಲರಿ' : 'Visual Showcase'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
            {t.galleryTitle}
          </h2>
          <p className="text-sm text-[#5C3624] mt-2">
            Explore authentic glimpses of our sweet counters, celebratory designer cakes, and daily bakery delicacies.
          </p>
        </div>

        {/* Gallery Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {(['all', 'storefront', 'sweets', 'cakes', 'pastries', 'chats'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeFilter === cat
                  ? 'bg-[#2C1810] text-white shadow-xs'
                  : 'bg-white text-[#7A4B34] border border-[#E6DBCE] hover:text-[#2C1810]'
              }`}
            >
              {cat === 'all' ? 'All Photos' : cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItemIndex(index)}
              className="group relative bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E6DBCE] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer aspect-4/3"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#DFB75A] tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold font-serif leading-tight mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-xs text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <ImageLightboxModal
          item={currentItem}
          onClose={() => setSelectedItemIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </section>
  );
};
