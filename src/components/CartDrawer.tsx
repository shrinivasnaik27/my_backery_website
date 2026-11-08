import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, AlertCircle, Store, Truck } from 'lucide-react';
import { OrderEnquiry } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSubmitted: (order: OrderEnquiry) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderSubmitted }) => {
  const {
    cart,
    cartTotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    submitOrderEnquiry,
    language,
    generateWhatsAppOrderLink,
  } = useStore();

  const t = TRANSLATIONS[language];

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupPreference, setPickupPreference] = useState<'store-pickup' | 'local-delivery-enquiry'>('store-pickup');
  const [address, setAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      return;
    }

    setIsSubmitting(true);
    const newOrder = submitOrderEnquiry({
      customerName,
      customerPhone,
      pickupPreference,
      address: pickupPreference === 'local-delivery-enquiry' ? address : undefined,
      specialInstructions,
    });

    setIsSubmitting(false);
    onClose();
    onOrderSubmitted(newOrder);

    // Open WhatsApp order window
    const waUrl = generateWhatsAppOrderLink(newOrder);
    window.open(waUrl, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#E6DBCE] shadow-2xl flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#E6DBCE] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C89D3C]" />
              <h2 id="cart-drawer-title" className="font-serif text-lg font-bold text-[#2C1810]">
                {t.cart} ({cartCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#7A4B34] hover:text-[#2C1810] rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 bg-[#F3ECE2] rounded-full flex items-center justify-center mx-auto text-[#7A4B34]">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-base font-semibold text-[#2C1810]">Your enquiry cart is empty</h3>
                <p className="text-xs text-[#7A4B34] max-w-xs mx-auto">
                  Browse our sweets, celebration cakes, and bakery specialties to add items to your enquiry.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-[#2C1810] text-white text-xs font-semibold rounded-lg hover:bg-[#422518]"
                >
                  Explore Menu Now
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center pb-2 border-b border-[#E6DBCE]">
                  <span className="text-xs font-semibold text-[#7A4B34] uppercase tracking-wider">
                    Selected Items
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-rose-700 hover:text-rose-900 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.product.id}-${item.selectedPortion || index}`}
                      className="bg-white rounded-xl p-3 border border-[#E6DBCE] flex gap-3 shadow-2xs items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-lg object-cover bg-[#F3ECE2] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#2C1810] truncate">
                            {item.product.name}
                          </h4>
                          {item.selectedPortion && (
                            <span className="text-[11px] text-[#7A4B34] block">
                              Size: {item.selectedPortion}
                            </span>
                          )}
                          <div className="text-xs font-mono font-bold text-[#2C1810] mt-0.5">
                            ₹{item.itemPrice}{' '}
                            <span className="text-[10px] text-[#7A4B34] font-normal">
                              x {item.quantity} = ₹{item.itemPrice * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-[#E6DBCE] rounded-md bg-[#FAF7F2]">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.selectedPortion, -1)
                            }
                            className="p-1 hover:bg-[#E6DBCE] text-[#2C1810] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.selectedPortion, 1)
                            }
                            className="p-1 hover:bg-[#E6DBCE] text-[#2C1810] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id, item.selectedPortion)}
                          className="text-[#7A4B34] hover:text-rose-600 p-1"
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal Card */}
                <div className="bg-[#F3ECE2] p-4 rounded-xl border border-[#E6DBCE] space-y-1">
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="font-semibold text-[#2C1810]">Estimated Subtotal:</span>
                    <span className="text-xl font-bold font-mono text-[#2C1810] tabular-nums">
                      ₹{cartTotal}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A4B34] leading-tight">
                    * Estimated price only. Official total and fresh item weights are confirmed by shop via WhatsApp.
                  </p>
                </div>

                {/* Customer Checkout Form */}
                <form id="cart-order-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7A4B34]">
                    Your Contact &amp; Pickup Preference
                  </p>

                  <div>
                    <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Hegde"
                      className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 9448123456"
                      className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                    />
                  </div>

                  {/* Pickup vs Delivery Enquiry */}
                  <div>
                    <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                      Fulfilment Preference *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPickupPreference('store-pickup')}
                        className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          pickupPreference === 'store-pickup'
                            ? 'bg-[#2C1810] text-white border-[#2C1810] font-semibold'
                            : 'bg-white text-[#2C1810] border-[#E6DBCE]'
                        }`}
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Store Pickup</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPickupPreference('local-delivery-enquiry')}
                        className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          pickupPreference === 'local-delivery-enquiry'
                            ? 'bg-[#2C1810] text-white border-[#2C1810] font-semibold'
                            : 'bg-white text-[#2C1810] border-[#E6DBCE]'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Delivery Enquiry</span>
                      </button>
                    </div>
                  </div>

                  {pickupPreference === 'local-delivery-enquiry' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2C1810] block">
                        Delivery Address in Bhatkal *
                      </label>
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Apartment name, landmark, road in Bhatkal..."
                        rows={2}
                        className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                      />
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                        * Local delivery is subject to store location, distance, and owner availability.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                      Special Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Packing in 2 separate gift boxes, pickup by 6 PM"
                      className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
                    />
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-[#E6DBCE] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#7A4B34]">
                <AlertCircle className="w-4 h-4 text-[#C89D3C] shrink-0" />
                <span>Orders are finalized upon store confirmation via WhatsApp.</span>
              </div>

              <button
                type="submit"
                form="cart-order-form"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5C] text-white py-3.5 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#25D366]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Submit &amp; Send WhatsApp Enquiry</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
