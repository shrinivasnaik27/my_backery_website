import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, MessageCircle, Check, Info } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, generateWhatsAppGeneralLink, language } = useStore();

  const [selectedPortionIndex, setSelectedPortionIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const selectedPortion = product.portionOptions?.[selectedPortionIndex];
  const unitPrice = selectedPortion
    ? Math.round(product.price * selectedPortion.priceMultiplier)
    : product.price;

  const calculatedTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      selectedPortion?.label,
      selectedPortion ? selectedPortion.priceMultiplier : 1
    );
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleDirectWhatsApp = () => {
    const text = `Hello Shabari Sweets & Bakery (Bhatkal),\nI would like to enquire about:\n*${product.name}* (${product.nameKannada})\n${
      selectedPortion ? `Size/Portion: ${selectedPortion.label}\n` : ''
    }Quantity: ${quantity}\nEstimated Price: ₹${calculatedTotal}\n\nPlease let me know if this is currently available for pickup.`;
    window.open(generateWhatsAppGeneralLink(text), '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E6DBCE] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-[#2C1810] p-2 rounded-full shadow-md transition-colors"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Image */}
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden aspect-square bg-[#F3ECE2] border border-[#E6DBCE] relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#2C1810]/85 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                {product.dietary === 'eggless' ? '100% Eggless' : 'Pure Veg'}
              </div>
            </div>

            {/* Verification note */}
            {product.isDemonstration && (
              <div className="bg-[#F3ECE2] border border-[#E6DBCE] rounded-lg p-3 text-xs text-[#7A4B34] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#C89D3C] shrink-0 mt-0.5" />
                <span>
                  <strong>Owner Notice:</strong> This is an initial sample menu item. Final ingredients, current batches, and exact pricing are subject to shop owner confirmation.
                </span>
              </div>
            )}
          </div>

          {/* Details & Customization */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase font-semibold tracking-wider text-[#C89D3C]">
                {product.category}
              </p>
              <h2 id="product-modal-title" className="font-serif text-2xl font-bold text-[#2C1810]">
                {product.name}
              </h2>
              <p className="text-sm font-kannada text-[#7A4B34]">
                {product.nameKannada}
              </p>

              <p className="text-sm text-[#5C3624] leading-relaxed pt-2">
                {language === 'kn' && product.descriptionKannada
                  ? product.descriptionKannada
                  : product.description}
              </p>
            </div>

            {/* Portion / Size Selector */}
            {product.portionOptions && product.portionOptions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E6DBCE]">
                <label className="text-xs font-semibold text-[#2C1810] block">
                  Select Portion / Box Size:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.portionOptions.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedPortionIndex(idx)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                        selectedPortionIndex === idx
                          ? 'border-[#2C1810] bg-[#2C1810] text-white shadow-xs font-semibold'
                          : 'border-[#E6DBCE] bg-white text-[#2C1810] hover:border-[#7A4B34]'
                      }`}
                    >
                      <div>{opt.label}</div>
                      <div className="text-[11px] opacity-80">
                        ₹{Math.round(product.price * opt.priceMultiplier)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Price Calculation */}
            <div className="pt-2 border-t border-[#E6DBCE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2C1810]">Quantity:</span>
                <div className="flex items-center border border-[#E6DBCE] bg-white rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold text-[#2C1810] hover:bg-[#F3ECE2] rounded-l-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-bold font-mono tabular-nums text-[#2C1810]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm font-bold text-[#2C1810] hover:bg-[#F3ECE2] rounded-r-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-[#7A4B34]">Estimated Amount:</span>
                <span className="text-2xl font-bold font-mono text-[#2C1810] tabular-nums">
                  ₹{calculatedTotal}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addedSuccess}
                className="w-full flex items-center justify-center gap-2 bg-[#2C1810] hover:bg-[#422518] text-[#FAF7F2] py-3 rounded-lg text-sm font-semibold transition-all shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C89D3C]"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#DFB75A]" />
                    <span>Add to Order Enquiry (₹{calculatedTotal})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5C] text-white py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire Directly on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
