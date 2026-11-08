import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { ProductCard } from './ProductCard';
import { Product, CategoryId } from '../types';
import { Search, SlidersHorizontal, Info, Sparkles } from 'lucide-react';

interface MenuSectionProps {
  activeCategoryFilter: CategoryId | 'all';
  onCategoryFilterChange: (catId: CategoryId | 'all') => void;
  onOpenProductModal: (prod: Product) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  activeCategoryFilter,
  onCategoryFilterChange,
  onOpenProductModal,
}) => {
  const { products, categories, language, businessSettings } = useStore();
  const t = TRANSLATIONS[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategoryFilter !== 'all' && p.category !== activeCategoryFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchKannada = p.nameKannada.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          return matchName || matchKannada || matchDesc || matchCategory;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        // Default: featured first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [products, activeCategoryFilter, searchQuery, sortBy]);

  return (
    <section id="menu" className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E6DBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C89D3C] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'kn' ? 'ನಮ್ಮ ರುಚಿಕರ ಮೆನು' : 'Fresh Handcrafted Menu'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
            {t.menuTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#5C3624] mt-2">
            {t.menuSubtitle}
          </p>
        </div>

        {/* Demonstration Mode Banner Notice */}
        {businessSettings.isDemoNoticeActive && (
          <div className="mb-8 p-3.5 sm:p-4 rounded-xl bg-[#F3ECE2] border border-[#E6DBCE] flex items-start gap-3 text-xs text-[#7A4B34]">
            <Info className="w-4 h-4 text-[#C89D3C] shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="text-[#2C1810] font-semibold">Demonstration Mode:</strong>{' '}
              {t.demoNotice}
            </div>
          </div>
        )}

        {/* Filter Controls: Category Tabs (Interactive buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <button
            type="button"
            onClick={() => onCategoryFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              activeCategoryFilter === 'all'
                ? 'bg-[#2C1810] text-white shadow-xs font-semibold'
                : 'bg-white text-[#5C3624] border border-[#E6DBCE] hover:border-[#7A4B34]'
            }`}
          >
            {t.allCategories} ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryFilterChange(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  activeCategoryFilter === cat.id
                    ? 'bg-[#2C1810] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#5C3624] border border-[#E6DBCE] hover:border-[#7A4B34]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] opacity-75 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-white p-3 rounded-xl border border-[#E6DBCE] shadow-xs mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#7A4B34] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#2C1810] placeholder-[#7A4B34]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C89D3C]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A4B34] hover:text-[#2C1810]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-[#7A4B34]" />
            <span className="text-xs text-[#7A4B34] whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:outline-hidden focus:ring-1 focus:ring-[#C89D3C]"
            >
              <option value="default">{t.sortDefault}</option>
              <option value="price-asc">{t.sortByPriceLow}</option>
              <option value="price-desc">{t.sortByPriceHigh}</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenProductModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E6DBCE] p-8">
            <p className="text-base font-semibold text-[#2C1810]">No delicacies found</p>
            <p className="text-xs text-[#7A4B34] mt-1">
              Try adjusting your search query or switching to another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onCategoryFilterChange('all');
              }}
              className="mt-4 px-4 py-2 bg-[#2C1810] text-white text-xs font-semibold rounded-lg hover:bg-[#422518]"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
