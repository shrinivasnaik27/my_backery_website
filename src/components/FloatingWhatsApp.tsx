import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, ShoppingBag } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { generateWhatsAppGeneralLink, cartCount, setIsCartOpen } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Floating Cart Button (shown if cart has items) */}
      {cartCount > 0 && (
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 bg-[#2C1810] text-[#FAF7F2] hover:bg-[#422518] px-4 py-2.5 rounded-full shadow-xl border border-[#DFB75A] transition-all hover:scale-105 active:scale-95 text-xs font-bold"
          aria-label="View Enquiry Cart"
        >
          <ShoppingBag className="w-4 h-4 text-[#DFB75A]" />
          <span>Cart ({cartCount})</span>
        </button>
      )}

      {/* Floating WhatsApp Action */}
      <a
        href={generateWhatsAppGeneralLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5C] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#25D366]"
        title="Chat with Shabari Sweets & Bakery on WhatsApp"
        aria-label="Chat with Shabari Sweets & Bakery on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="hidden sm:inline text-xs font-bold whitespace-nowrap">
          WhatsApp Assistance
        </span>
      </a>
    </div>
  );
};
