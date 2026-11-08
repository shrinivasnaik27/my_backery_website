import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, CartItem } from '../types';
import { X, Plus, Minus, Trash2, ShoppingBag, User, Phone, CheckCircle2 } from 'lucide-react';

interface CounterPosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CounterPosModal: React.FC<CounterPosModalProps> = ({ isOpen, onClose }) => {
  const { products, takeCounterOrder, categories } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'counter-walkin' | 'phone-order'>('counter-walkin');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddItem = (product: Product, portionLabel?: string, portionMultiplier = 1) => {
    const itemPrice = Math.round(product.price * portionMultiplier);
    setSelectedItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.product.id === product.id && it.selectedPortion === portionLabel
      );
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedPortion: portionLabel,
          itemPrice,
        },
      ];
    });
  };

  const handleUpdateQty = (idx: number, delta: number) => {
    setSelectedItems((prev) => {
      return prev
        .map((item, i) => {
          if (i === idx) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemove = (idx: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalAmount = selectedItems.reduce((sum, it) => sum + it.itemPrice * it.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || selectedItems.length === 0) return;

    const newOrder = takeCounterOrder({
      customerName,
      customerPhone: customerPhone || 'Counter Patron',
      items: selectedItems,
      orderType,
      specialInstructions,
    });

    setGeneratedToken(newOrder.tokenNumber);
  };

  const handleReset = () => {
    setCustomerName('');
    setCustomerPhone('');
    setSelectedItems([]);
    setSpecialInstructions('');
    setGeneratedToken(null);
  };

  const displayedProducts = products.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="counter-pos-title"
      className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden border border-[#E6DBCE] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2C1810] text-white px-6 py-4 flex items-center justify-between border-b border-[#422518] shrink-0">
          <div>
            <h2 id="counter-pos-title" className="font-serif text-lg font-bold text-white">
              Take Counter Order · Quick Token POS
            </h2>
            <p className="text-[11px] text-[#DFB75A] font-kannada">
              ಕೌಂಟರ್ ಆರ್ಡರ್ ನಮೂದು &amp; ತ್ವರಿತ ಟೋಕನ್ ವಿತರಣೆ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Generated Token Success Screen */}
        {generatedToken ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-[#7A4B34] tracking-wider">
                Order Sent to Packaging Station!
              </span>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#2C1810] my-2 bg-white px-6 py-3 rounded-2xl border-2 border-[#C89D3C] inline-block shadow-md">
                {generatedToken}
              </div>
              <p className="text-sm font-semibold text-[#2C1810] mt-1">
                Customer: {customerName}
              </p>
              <p className="text-xs text-[#7A4B34]">
                Total Amount: <strong className="text-[#2C1810] font-mono">₹{totalAmount}</strong>
              </p>
            </div>

            <p className="text-xs text-[#5C3624] max-w-md">
              The order slip has been dispatched to the <strong>Making Parcel</strong> screen. 
              The customer can wait or listen for their token call when the packaging bell chimes.
            </p>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 bg-[#2C1810] text-white text-xs font-bold rounded-lg hover:bg-[#422518]"
              >
                Take Next Counter Order
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-[#E6DBCE] bg-white text-xs font-semibold rounded-lg hover:bg-[#F3ECE2]"
              >
                Close Station
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left: Product Picker (7 cols) */}
            <div className="lg:col-span-7 border-r border-[#E6DBCE] flex flex-col h-full bg-white overflow-hidden">
              {/* Category tabs */}
              <div className="p-3 border-b border-[#E6DBCE] flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-[#F3ECE2]/60">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    activeCategory === 'all'
                      ? 'bg-[#2C1810] text-white'
                      : 'bg-white text-[#7A4B34] border border-[#E6DBCE]'
                  }`}
                >
                  All Items
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategory(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      activeCategory === c.id
                        ? 'bg-[#2C1810] text-white'
                        : 'bg-white text-[#7A4B34] border border-[#E6DBCE]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Items grid */}
              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-xl border border-[#E6DBCE] bg-[#FAF7F2] hover:border-[#2C1810] transition-all flex flex-col justify-between space-y-2 text-left"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#7A4B34] block">
                        {prod.category}
                      </span>
                      <h4 className="text-xs font-bold text-[#2C1810] line-clamp-1">{prod.name}</h4>
                      <p className="text-[11px] font-kannada text-[#7A4B34] line-clamp-1">{prod.nameKannada}</p>
                      <div className="text-xs font-mono font-bold text-[#2C1810] mt-1">
                        ₹{prod.price} <span className="text-[10px] text-[#7A4B34] font-normal">{prod.unit}</span>
                      </div>
                    </div>

                    {/* Portion buttons if available */}
                    {prod.portionOptions && prod.portionOptions.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        {prod.portionOptions.map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => handleAddItem(prod, opt.label, opt.priceMultiplier)}
                            className="px-1.5 py-1 bg-white border border-[#E6DBCE] hover:bg-[#2C1810] hover:text-white rounded text-[10px] font-semibold text-center transition-colors"
                          >
                            +{opt.label.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddItem(prod)}
                        className="w-full py-1.5 bg-[#2C1810] hover:bg-[#422518] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Selected Parcel Slip & Customer Details (5 cols) */}
            <form onSubmit={handleSubmit} className="lg:col-span-5 flex flex-col h-full bg-[#FAF7F2] p-4 sm:p-5 justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6DBCE] pb-2">
                  <span className="font-serif text-sm font-bold text-[#2C1810]">
                    Current Parcel Cart ({selectedItems.length})
                  </span>
                  <span className="font-mono text-base font-bold text-[#2C1810]">
                    Total: ₹{totalAmount}
                  </span>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-2 bg-white p-3 rounded-xl border border-[#E6DBCE]">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-[#2C1810] block mb-0.5">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ramesh"
                        className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-2.5 py-1.5 text-xs text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#2C1810] block mb-0.5">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 9448..."
                        className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-2.5 py-1.5 text-xs text-[#2C1810]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="orderType"
                        checked={orderType === 'counter-walkin'}
                        onChange={() => setOrderType('counter-walkin')}
                      />
                      <span>Walk-in Counter</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="orderType"
                        checked={orderType === 'phone-order'}
                        onChange={() => setOrderType('phone-order')}
                      />
                      <span>Phone Order</span>
                    </label>
                  </div>
                </div>

                {/* Selected Items List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedItems.length === 0 ? (
                    <p className="text-xs text-[#7A4B34] text-center py-6">
                      Click items from the menu on the left to add to parcel.
                    </p>
                  ) : (
                    selectedItems.map((it, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-lg border border-[#E6DBCE] flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-bold text-[#2C1810] truncate">{it.product.name}</p>
                          {it.selectedPortion && (
                            <span className="text-[10px] text-[#7A4B34]">{it.selectedPortion}</span>
                          )}
                          <span className="font-mono text-[11px] text-[#2C1810] block">
                            ₹{it.itemPrice * it.quantity}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center border border-[#E6DBCE] rounded bg-[#FAF7F2]">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(idx, -1)}
                              className="px-2 py-0.5 hover:bg-[#E6DBCE]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono font-bold">{it.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(idx, 1)}
                              className="px-2 py-0.5 hover:bg-[#E6DBCE]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemove(idx)}
                            className="text-rose-600 hover:text-rose-800 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Notes (e.g. ribbon packing, warm samosa)..."
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-1.5 text-xs text-[#2C1810]"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#E6DBCE]">
                <button
                  type="submit"
                  disabled={selectedItems.length === 0}
                  className="w-full bg-[#2C1810] hover:bg-[#422518] disabled:opacity-50 text-white py-3 rounded-lg text-xs font-bold transition-all shadow-md active:scale-98"
                >
                  Create Order &amp; Dispatch to Packing Counter
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
