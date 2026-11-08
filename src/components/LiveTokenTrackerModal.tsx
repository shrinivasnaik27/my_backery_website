import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Search, Clock, Box, PackageCheck, CheckCircle2, BellRing, Sparkles } from 'lucide-react';
import { playCounterChime } from '../utils/audio';

export const LiveTokenTrackerModal: React.FC = () => {
  const {
    orderEnquiries,
    activeTrackingToken,
    setActiveTrackingToken,
    isTrackingModalOpen,
    setIsTrackingModalOpen,
  } = useStore();

  const [inputToken, setInputToken] = useState(activeTrackingToken || '');

  if (!isTrackingModalOpen) return null;

  // Find tracked order
  const currentToken = inputToken.trim().toUpperCase();
  const trackedOrder = orderEnquiries.find(
    (o) => o.tokenNumber.toUpperCase() === currentToken || o.id === currentToken
  );

  // Ready tokens board
  const readyTokens = orderEnquiries.filter((o) => o.status === 'parcel_ready');
  const packingTokens = orderEnquiries.filter((o) => o.status === 'making_parcel');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracker-modal-title"
      className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={() => setIsTrackingModalOpen(false)}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-[#E6DBCE] shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsTrackingModalOpen(false)}
          className="absolute top-4 right-4 text-[#7A4B34] hover:text-[#2C1810] p-1.5 rounded-full"
          aria-label="Close token tracker"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C89D3C] uppercase tracking-wider">
            <BellRing className="w-4 h-4" />
            <span>Store Counter Live Token Display</span>
          </div>
          <h2 id="tracker-modal-title" className="font-serif text-2xl font-bold text-[#2C1810]">
            Track Your Parcel &amp; Pickup Token
          </h2>
          <p className="text-xs text-[#7A4B34]">
            Follow the live preparation of your sweets &amp; bakery parcel in real time.
          </p>
        </div>

        {/* Token Search Bar */}
        <div className="bg-white p-2 rounded-xl border border-[#E6DBCE] flex gap-2 shadow-2xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7A4B34] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Enter Token (e.g. TK-102 or TK-103)..."
              className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold uppercase text-[#2C1810] bg-transparent focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            onClick={() => setActiveTrackingToken(currentToken)}
            className="px-4 py-2 bg-[#2C1810] hover:bg-[#422518] text-white text-xs font-bold rounded-lg transition-colors shrink-0"
          >
            Track Token
          </button>
        </div>

        {/* Live Store Pickup Board (Now Serving / Ready at Counter) */}
        <div className="bg-[#F3ECE2] p-4 rounded-xl border border-[#E6DBCE] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#2C1810] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C89D3C]" />
              Ready at Counter for Collection:
            </span>
            <button
              type="button"
              onClick={() => playCounterChime()}
              className="text-[10px] text-[#7A4B34] hover:text-[#2C1810] underline"
            >
              Test Counter Chime 🔔
            </button>
          </div>

          {readyTokens.length === 0 ? (
            <p className="text-xs text-[#7A4B34] italic">
              All prepared parcels have been collected. Current parcels are being boxed!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {readyTokens.map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => setInputToken(ord.tokenNumber)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-sm px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 animate-pulse"
                >
                  <BellRing className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{ord.tokenNumber}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Tracked Order Timeline */}
        {trackedOrder ? (
          <div className="bg-white rounded-2xl p-5 border border-[#E6DBCE] shadow-xs space-y-5">
            <div className="flex justify-between items-center border-b border-[#E6DBCE] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A4B34] block">Your Token</span>
                <span className="font-mono text-2xl font-extrabold text-[#2C1810]">
                  {trackedOrder.tokenNumber}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#2C1810] block">{trackedOrder.customerName}</span>
                <span className="text-[11px] text-[#7A4B34] font-mono">Total: ₹{trackedOrder.estimatedTotal}</span>
              </div>
            </div>

            {/* Stepper Progression */}
            <div className="space-y-4">
              {/* Step 1: Received */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  trackedOrder.status === 'received'
                    ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2C1810]">1. Order Received</h4>
                  <p className="text-[11px] text-[#7A4B34]">Order slip logged in shop system and assigned to counter staff.</p>
                </div>
              </div>

              {/* Step 2: Making Parcel */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  trackedOrder.status === 'making_parcel'
                    ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400'
                    : trackedOrder.status === 'parcel_ready' || trackedOrder.status === 'handed_over'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#F3ECE2] text-[#7A4B34]'
                }`}>
                  <Box className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2C1810]">2. Making Parcel &amp; Boxing</h4>
                  <p className="text-[11px] text-[#7A4B34]">
                    Fresh delicacies being weighed, boxed in {trackedOrder.parcelDetails?.boxType || 'signature packaging'}, and sealed.
                  </p>
                </div>
              </div>

              {/* Step 3: Parcel Ready */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  trackedOrder.status === 'parcel_ready'
                    ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 animate-bounce'
                    : trackedOrder.status === 'handed_over'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#F3ECE2] text-[#7A4B34]'
                }`}>
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2C1810]">
                    3. Parcel Ready for Pickup!
                  </h4>
                  <p className="text-[11px] text-[#7A4B34]">
                    {trackedOrder.status === 'parcel_ready' ? (
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5">
                        👉 Ready at {trackedOrder.parcelDetails?.shelfRack || 'Main Counter'}! Please present Token #{trackedOrder.tokenNumber}.
                      </span>
                    ) : (
                      'Placed on counter shelf for customer collection.'
                    )}
                  </p>
                </div>
              </div>

              {/* Step 4: Handed Over */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  trackedOrder.status === 'handed_over'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-[#F3ECE2] text-[#7A4B34]'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2C1810]">4. Handed Over to Customer</h4>
                  <p className="text-[11px] text-[#7A4B34]">
                    {trackedOrder.status === 'handed_over'
                      ? `Collected by ${trackedOrder.parcelDetails?.handedOverTo || trackedOrder.customerName}. Enjoy your fresh delicacies!`
                      : 'Parcel collected and verified at counter.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Items inside this order */}
            <div className="pt-3 border-t border-[#E6DBCE] text-xs text-[#5C3624]">
              <span className="font-semibold text-[#2C1810] block mb-1">Items in this Parcel:</span>
              <ul className="space-y-1">
                {trackedOrder.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>• {it.product.name} (x{it.quantity})</span>
                    <span className="font-mono">₹{it.itemPrice * it.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#7A4B34]">
            <p>Enter any active Token number above (e.g. <strong className="text-[#2C1810]">TK-101</strong>, <strong className="text-[#2C1810]">TK-102</strong>, or <strong className="text-[#2C1810]">TK-103</strong>) to view its live preparation stages.</p>
          </div>
        )}
      </div>
    </div>
  );
};
