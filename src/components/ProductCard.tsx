import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Eye, Check, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, language } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.available) return;

    // If product has portion options, we default to the first portion option
    const defaultPortion = product.portionOptions?.[0];
    addToCart(
      product,
      1,
      defaultPortion?.label,
      defaultPortion ? defaultPortion.priceMultiplier : 1
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative bg-[#FAF7F2] rounded-2xl border border-[#E6DBCE] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#F3ECE2]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Fallback pattern */}
        <div className="absolute inset-0 bg-linear-to-tr from-[#E6DBCE] to-[#F3ECE2] -z-10 flex items-center justify-center text-xs font-serif text-[#7A4B34]">
          {product.name}
        </div>

        {/* Dietary / Special Tag (quiet clean unboxed text pill on image) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#2C1810]/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-xs">
          {product.dietary === 'eggless' ? (
            <span className="text-[#DFB75A]">100% Eggless</span>
          ) : (
            <span className="text-emerald-400">Pure Veg</span>
          )}
        </div>

        {/* Quick View Button on Image Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(product);
          }}
          className="absolute bottom-2.5 right-2.5 bg-white/95 text-[#2C1810] p-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#C89D3C] hover:text-white"
          title="Quick View"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Demo Item Indicator notice */}
        {product.isDemonstration && (
          <div className="absolute bottom-2.5 left-2.5 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#7A4B34] border border-[#E6DBCE] text-[10px] font-medium px-2 py-0.5 rounded shadow-2xs">
            Demo Sample · Verify with Owner
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Category Tag */}
          <p className="text-[11px] font-semibold tracking-wider uppercase text-[#7A4B34]">
            {product.category.replace('-', ' ')}
          </p>

          {/* Product Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#2C1810] leading-snug group-hover:text-[#C89D3C] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Kannada Name */}
          <p className="text-xs font-kannada text-[#7A4B34] line-clamp-1">
            {product.nameKannada}
          </p>

          {/* Description */}
          <p className="text-xs text-[#5C3624] line-clamp-2 pt-1 leading-relaxed">
            {language === 'kn' && product.descriptionKannada
              ? product.descriptionKannada
              : product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 mt-3 border-t border-[#E6DBCE]/70 flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-[#2C1810] font-mono tabular-nums">
                ₹{product.price}
              </span>
              <span className="text-[11px] text-[#7A4B34]">
                {product.unit}
              </span>
            </div>
            {product.portionOptions && (
              <span className="text-[10px] text-[#7A4B34] block">
                {product.portionOptions.length} size options available
              </span>
            )}
          </div>

          {/* Add / Action Button */}
          {product.available ? (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={justAdded}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C89D3C] ${
                justAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#2C1810] hover:bg-[#422518] text-[#FAF7F2]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#DFB75A]" />
                  <span>Add</span>
                </>
              )}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
              <AlertCircle className="w-3 h-3" />
              Pre-order
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
