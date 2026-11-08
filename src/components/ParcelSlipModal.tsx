import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Printer, MessageCircle, CheckCircle2, MapPin } from 'lucide-react';

export const ParcelSlipModal: React.FC = () => {
  const { selectedOrderForSlip, setSelectedOrderForSlip, businessSettings, generateWhatsAppHandoverReceiptLink } = useStore();

  if (!selectedOrderForSlip) return null;
  const order = selectedOrderForSlip;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="slip-modal-title"
      className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={() => setSelectedOrderForSlip(null)}
    >
      <div
        className="relative bg-white rounded-2xl max-w-md w-full border border-[#E6DBCE] shadow-2xl p-6 sm:p-8 space-y-4 font-sans text-[#2C1810]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setSelectedOrderForSlip(null)}
          className="absolute top-4 right-4 text-[#7A4B34] hover:text-[#2C1810] p-1 print:hidden"
          aria-label="Close slip"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Receipt Content */}
        <div className="text-center border-b border-dashed border-[#2C1810]/30 pb-4 space-y-1">
          <h2 id="slip-modal-title" className="font-serif text-xl font-bold tracking-tight text-[#2C1810]">
            SHABARI Sweets &amp; Bakery
          </h2>
          <p className="text-xs font-kannada text-[#7A4B34]">
            ಶಬರಿ ಸ್ವೀಟ್ಸ್ &amp; ಬೇಕರಿ · ಭಟ್ಕಳ
          </p>
          <p className="text-[11px] text-[#7A4B34] flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-[#C89D3C]" />
            Main Road, Bhatkal, Karnataka
          </p>
          <p className="text-[11px] text-[#7A4B34] font-mono">
            Ph: {businessSettings.phone}
          </p>
        </div>

        {/* Token Badge */}
        <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DBCE] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#7A4B34] block">
              Parcel Token No.
            </span>
            <span className="text-3xl font-mono font-extrabold text-[#2C1810]">
              {order.tokenNumber}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded block">
              {order.status === 'handed_over' ? 'Handed Over' : 'Ready at Counter'}
            </span>
            <span className="text-[11px] text-[#7A4B34] mt-1 block">
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Customer & Box Info */}
        <div className="text-xs space-y-1 border-b border-dashed border-[#2C1810]/20 pb-3">
          <div className="flex justify-between">
            <span className="text-[#7A4B34]">Customer:</span>
            <strong className="text-[#2C1810]">{order.customerName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A4B34]">Phone:</span>
            <span className="font-mono">{order.customerPhone}</span>
          </div>
          {order.parcelDetails?.boxType && (
            <div className="flex justify-between">
              <span className="text-[#7A4B34]">Packaging:</span>
              <span>{order.parcelDetails.boxType}</span>
            </div>
          )}
          {order.parcelDetails?.handedOverTo && (
            <div className="flex justify-between">
              <span className="text-[#7A4B34]">Collected by:</span>
              <strong className="text-emerald-800">{order.parcelDetails.handedOverTo}</strong>
            </div>
          )}
        </div>

        {/* Itemized Table */}
        <div className="space-y-1.5 text-xs py-1 border-b border-dashed border-[#2C1810]/20 pb-3">
          <div className="flex justify-between font-bold text-[#7A4B34] uppercase text-[10px]">
            <span>Item &amp; Portion</span>
            <span>Price</span>
          </div>

          {order.items.map((it, idx) => (
            <div key={idx} className="flex justify-between text-[#422518]">
              <span>
                {it.product.name} {it.selectedPortion && `(${it.selectedPortion})`} x {it.quantity}
              </span>
              <span className="font-mono font-medium">₹{it.itemPrice * it.quantity}</span>
            </div>
          ))}
        </div>

        {/* Total & Payment Method */}
        <div className="space-y-1">
          <div className="flex justify-between items-baseline text-sm font-bold text-[#2C1810]">
            <span>Total Amount:</span>
            <span className="font-mono text-xl tabular-nums">₹{order.estimatedTotal}</span>
          </div>

          <div className="flex justify-between text-xs text-[#7A4B34]">
            <span>Payment Mode:</span>
            <span className="font-semibold text-[#2C1810]">
              {order.parcelDetails?.paymentMethod || 'Paid at Counter'}
            </span>
          </div>
        </div>

        {/* Quality Guarantee Stamp */}
        <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DBCE] text-center text-xs text-[#5C3624] space-y-0.5">
          <div className="flex items-center justify-center gap-1 font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Freshly Packed &amp; Handed Over</span>
          </div>
          <p className="text-[11px] text-[#7A4B34]">
            Thank you for celebrating with Shabari Sweets &amp; Bakery, Bhatkal!
          </p>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="flex gap-2 pt-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-[#2C1810] hover:bg-[#422518] text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-[#DFB75A]" />
            <span>Print Slip</span>
          </button>

          <a
            href={generateWhatsAppHandoverReceiptLink(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5C] text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Receipt</span>
          </a>
        </div>
      </div>
    </div>
  );
};
