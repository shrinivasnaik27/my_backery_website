import React from 'react';
import { OrderEnquiry } from '../types';
import { useStore } from '../context/StoreContext';
import { X, Clock, MessageCircle, PackageCheck, Printer, BellRing } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: OrderEnquiry;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  const {
    generateWhatsAppOrderLink,
    setActiveTrackingToken,
    setIsTrackingModalOpen,
    setSelectedOrderForSlip,
  } = useStore();

  const handleTrackLive = () => {
    setActiveTrackingToken(order.tokenNumber);
    onClose();
    setIsTrackingModalOpen(true);
  };

  const handleOpenSlip = () => {
    setSelectedOrderForSlip(order);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-conf-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-2xl max-w-lg w-full border border-[#E6DBCE] shadow-2xl p-6 sm:p-8 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white text-[#2C1810] p-2 rounded-full shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          {/* Token Box */}
          <div className="inline-block bg-white px-5 py-2.5 rounded-2xl border-2 border-[#C89D3C] shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#7A4B34] tracking-wider block">
              Your Pickup Token
            </span>
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#2C1810]">
              {order.tokenNumber}
            </span>
          </div>

          <h3 id="order-conf-title" className="font-serif text-2xl font-bold text-[#2C1810]">
            Order Dispatched to Packaging Station!
          </h3>

          <p className="text-xs text-[#5C3624] leading-relaxed max-w-md mx-auto">
            Thank you, <strong>{order.customerName}</strong>! Your order is being weighed, boxed, and 
            prepared at our sweet &amp; bakery packing counter.
          </p>
        </div>

        {/* Order Details Receipt */}
        <div className="bg-white rounded-xl p-4 border border-[#E6DBCE] space-y-2 text-xs">
          <div className="flex justify-between border-b border-[#E6DBCE] pb-2 font-semibold text-[#2C1810]">
            <span>Items to Pack ({order.items.length})</span>
            <span>Est. Amount</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-[#5C3624]">
                <span>
                  {it.product.name} {it.selectedPortion && `(${it.selectedPortion})`} x {it.quantity}
                </span>
                <span className="font-mono font-medium text-[#2C1810]">
                  ₹{it.itemPrice * it.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E6DBCE] flex justify-between font-bold text-sm text-[#2C1810]">
            <span>Estimated Total:</span>
            <span className="font-mono text-base tabular-nums">₹{order.estimatedTotal}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* Track Live Parcel Progress */}
          <button
            type="button"
            onClick={handleTrackLive}
            className="w-full flex items-center justify-center gap-2 bg-[#2C1810] hover:bg-[#422518] text-white py-3 rounded-lg text-xs font-bold transition-all shadow-md active:scale-98"
          >
            <BellRing className="w-4 h-4 text-[#DFB75A]" />
            <span>Track Live Parcel Status on Token Board</span>
          </button>

          {/* WhatsApp Direct */}
          <a
            href={generateWhatsAppOrderLink(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5C] text-white py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open WhatsApp with Order Summary</span>
          </a>

          {/* View Parcel Slip */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpenSlip}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[#E6DBCE] bg-white hover:bg-[#F3ECE2] text-xs font-semibold rounded-lg text-[#2C1810]"
            >
              <Printer className="w-3.5 h-3.5 text-[#7A4B34]" />
              <span>View Parcel Slip</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs font-semibold text-[#7A4B34] hover:text-[#2C1810]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
