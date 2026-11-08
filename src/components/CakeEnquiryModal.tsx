import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Calendar, Clock, Cake as CakeIcon, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CakeEnquiryModalProps {
  initialFlavor?: string;
  onClose: () => void;
}

export const CakeEnquiryModal: React.FC<CakeEnquiryModalProps> = ({
  initialFlavor = 'Fresh Strawberry Vanilla Gateau',
  onClose,
}) => {
  const { submitCakeEnquiry, generateWhatsAppCakeLink } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [occasion, setOccasion] = useState('Birthday');
  const [flavor, setFlavor] = useState(initialFlavor);
  const [weightKg, setWeightKg] = useState('1 kg');
  const [eggless, setEggless] = useState(true);
  const [messageOnCake, setMessageOnCake] = useState('');
  const [pickupDate, setPickupDate] = useState(() => {
    // Tomorrow as sensible default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('5:00 PM');
  const [notes, setNotes] = useState('');

  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      return;
    }

    const created = submitCakeEnquiry({
      customerName,
      customerPhone,
      occasion,
      flavor,
      weightKg,
      eggless,
      messageOnCake,
      pickupDate,
      pickupTime,
      notes,
    });

    setSubmittedResult(created);
  };

  const handleOpenWhatsApp = () => {
    if (submittedResult) {
      window.open(generateWhatsAppCakeLink(submittedResult), '_blank');
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cake-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-[#E6DBCE] shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white text-[#2C1810] p-2 rounded-full shadow-md transition-colors"
          aria-label="Close cake modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedResult ? (
          /* Submission Confirmation View */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
              Cake Enquiry Recorded!
            </h3>
            <p className="text-xs text-[#7A4B34] max-w-md mx-auto">
              Ref: <strong className="font-mono text-[#2C1810]">#{submittedResult.id.slice(-6).toUpperCase()}</strong>
              <br />
              Your enquiry has been logged for Shabari Sweets &amp; Bakery. Click below to send this directly to the shop WhatsApp for rapid price &amp; pickup confirmation.
            </p>

            {/* Cake Summary Card */}
            <div className="bg-[#F3ECE2] border border-[#E6DBCE] rounded-xl p-4 text-left text-xs text-[#2C1810] space-y-1.5 my-4">
              <div><strong>Occasion:</strong> {submittedResult.occasion}</div>
              <div><strong>Flavour:</strong> {submittedResult.flavor} ({submittedResult.weightKg})</div>
              <div><strong>Dietary:</strong> {submittedResult.eggless ? '100% Eggless' : 'Standard'}</div>
              {submittedResult.messageOnCake && (
                <div><strong>Message on Cake:</strong> "{submittedResult.messageOnCake}"</div>
              )}
              <div><strong>Pickup:</strong> {submittedResult.pickupDate} at {submittedResult.pickupTime}</div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5C] text-white py-3.5 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send via WhatsApp for Shop Confirmation</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-xs text-[#7A4B34] hover:text-[#2C1810] py-2"
              >
                Close &amp; Return to Website
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C89D3C] uppercase tracking-wider">
                <CakeIcon className="w-4 h-4" />
                <span>Celebration Cake Planner</span>
              </div>
              <h3 id="cake-modal-title" className="font-serif text-2xl font-bold text-[#2C1810]">
                Custom Cake Enquiry
              </h3>
              <p className="text-xs text-[#7A4B34]">
                Plan your celebration cake with custom lettering, size, and pickup preferences.
              </p>
            </div>

            {/* Notice regarding confirmation */}
            <div className="bg-[#F3ECE2] border border-[#E6DBCE] p-3 rounded-xl flex items-start gap-2.5 text-xs text-[#7A4B34]">
              <AlertCircle className="w-4 h-4 text-[#C89D3C] shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> Custom designs and timings are subject to final owner confirmation on WhatsApp or telephone.
              </span>
            </div>

            {/* Occasion & Flavour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                  Occasion *
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                >
                  <option value="Birthday">Birthday Celebration</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Wedding / Engagement">Wedding / Engagement</option>
                  <option value="Baby Shower">Baby Shower / Naming Ceremony</option>
                  <option value="Graduation / Success">Graduation / Milestone</option>
                  <option value="Festival Special">Festival Special</option>
                  <option value="Other">Other Celebration</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                  Cake Flavour *
                </label>
                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                >
                  <option value="Dutch Truffle Dark Chocolate">Dutch Truffle Dark Chocolate</option>
                  <option value="Fresh Strawberry Vanilla Gateau">Fresh Strawberry Vanilla Gateau</option>
                  <option value="Classic Black Forest">Classic Black Forest</option>
                  <option value="Royal Rasmalai Fusion">Royal Rasmalai Fusion</option>
                  <option value="Butterscotch Crunch">Butterscotch Crunch</option>
                  <option value="Pineapple Fresh Cream">Pineapple Fresh Cream</option>
                  <option value="Red Velvet Cream Cheese">Red Velvet</option>
                  <option value="Special Custom Request">Other / Custom Flavour</option>
                </select>
              </div>
            </div>

            {/* Size & Dietary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                  Estimated Size / Weight *
                </label>
                <select
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                >
                  <option value="500g (Serves 4-6)">500 grams (Serves 4–6)</option>
                  <option value="1 kg (Serves 8-10)">1 kg (Serves 8–10)</option>
                  <option value="1.5 kg (Serves 12-15)">1.5 kg (Serves 12–15)</option>
                  <option value="2 kg (Party Size)">2 kg (Party Size)</option>
                  <option value="3 kg+ Multi-tier">3 kg+ Multi-tier</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2.5 bg-white border border-[#E6DBCE] rounded-lg cursor-pointer hover:border-[#7A4B34] transition-colors">
                  <input
                    type="checkbox"
                    checked={eggless}
                    onChange={(e) => setEggless(e.target.checked)}
                    className="rounded text-[#2C1810] focus:ring-[#C89D3C]"
                  />
                  <span className="text-xs font-medium text-[#2C1810]">
                    100% Eggless (Vegetarian)
                  </span>
                </label>
              </div>
            </div>

            {/* Message on Cake */}
            <div>
              <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                Name or Message on Cake (Optional)
              </label>
              <input
                type="text"
                value={messageOnCake}
                onChange={(e) => setMessageOnCake(e.target.value)}
                placeholder="e.g. Happy 10th Birthday Priya!"
                maxLength={45}
                className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
              />
              {messageOnCake && (
                <p className="text-[11px] text-[#7A4B34] mt-1 font-serif italic">
                  Preview text: "{messageOnCake}"
                </p>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#2C1810] flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C89D3C]" />
                  <span>Pickup Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C1810] flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#C89D3C]" />
                  <span>Pickup Time *</span>
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                >
                  <option value="10:00 AM">10:00 AM Morning</option>
                  <option value="1:00 PM">1:00 PM Afternoon</option>
                  <option value="5:00 PM">5:00 PM Evening</option>
                  <option value="7:30 PM">7:30 PM Night</option>
                  <option value="9:00 PM">9:00 PM Late Evening</option>
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Anand Bhat"
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                Special Decoration Requests / Theme Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Less sweet, extra chocolate shavings, photo topper request..."
                rows={2}
                className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#2C1810] hover:bg-[#422518] text-[#FAF7F2] py-3 rounded-lg text-sm font-semibold transition-all shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C89D3C] active:scale-98"
              >
                <span>Continue to WhatsApp Confirmation</span>
                <MessageCircle className="w-4 h-4 text-[#DFB75A]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
