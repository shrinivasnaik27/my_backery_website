import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderEnquiry, ParcelDetails } from '../types';
import {
  X,
  PackageCheck,
  Box,
  CheckCircle2,
  Clock,
  UserCheck,
  Plus,
  Printer,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  BellRing,
  Database,
} from 'lucide-react';

interface ParcelStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCounterPos: () => void;
}

export const ParcelStationModal: React.FC<ParcelStationModalProps> = ({
  isOpen,
  onClose,
  onOpenCounterPos,
}) => {
  const {
    orderEnquiries,
    startMakingParcel,
    toggleItemPacked,
    markParcelReady,
    handoverParcel,
    setSelectedOrderForSlip,
    generateWhatsAppHandoverReceiptLink,
    supabaseStatus,
  } = useStore();

  const [activeStage, setActiveStage] = useState<'all' | 'received' | 'making_parcel' | 'parcel_ready' | 'handed_over'>('all');

  // Boxing dialog state
  const [boxingOrder, setBoxingOrder] = useState<OrderEnquiry | null>(null);
  const [boxType, setBoxType] = useState<ParcelDetails['boxType']>('Signature Gold Box');
  const [packedBy, setPackedBy] = useState('Sunil (Packaging Staff)');
  const [shelfRack, setShelfRack] = useState('Counter Shelf A1');

  // Handover dialog state
  const [handoveringOrder, setHandoveringOrder] = useState<OrderEnquiry | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<ParcelDetails['paymentMethod']>('Cash on Handover');

  if (!isOpen) return null;

  // Filter orders by active stage
  const filteredOrders = orderEnquiries.filter((ord) => {
    if (activeStage === 'all') return true;
    return ord.status === activeStage;
  });

  const countReceived = orderEnquiries.filter((o) => o.status === 'received').length;
  const countPacking = orderEnquiries.filter((o) => o.status === 'making_parcel').length;
  const countReady = orderEnquiries.filter((o) => o.status === 'parcel_ready').length;
  const countHandedOver = orderEnquiries.filter((o) => o.status === 'handed_over').length;

  const handleOpenBoxing = (order: OrderEnquiry) => {
    setBoxingOrder(order);
    setBoxType('Signature Gold Box');
    setPackedBy('Staff Member');
    setShelfRack('Counter Shelf A1');
  };

  const handleConfirmStartBoxing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boxingOrder) return;
    startMakingParcel(boxingOrder.id, boxType, packedBy, shelfRack);
    setBoxingOrder(null);
  };

  const handleOpenHandover = (order: OrderEnquiry) => {
    setHandoveringOrder(order);
    setRecipientName(order.customerName);
    setPaymentMethod('Cash on Handover');
  };

  const handleConfirmHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoveringOrder) return;
    handoverParcel(handoveringOrder.id, recipientName, paymentMethod);
    setHandoveringOrder(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="parcel-station-title"
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-2xl max-w-6xl w-full h-[95vh] flex flex-col overflow-hidden border border-[#E6DBCE] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#2C1810] text-white px-6 py-4 flex items-center justify-between border-b border-[#422518] shrink-0">
          <div className="flex items-center gap-3">
            <Box className="w-5 h-5 text-[#DFB75A]" />
            <div>
              <h2 id="parcel-station-title" className="font-serif text-lg font-bold leading-none text-white">
                Store Packaging Counter &amp; Customer Handover Station
              </h2>
              <span className="text-[11px] text-[#DFB75A] font-kannada">
                ಪಾರ್ಸಲ್ ತಯಾರಿಕೆ &amp; ಗ್ರಾಹಕರಿಗೆ ವಿತರಣಾ ಕೌಂಟರ್
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[11px] text-emerald-300">
              <Database className="w-3 h-3 text-emerald-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase Cloud Synced</span>
            </div>

            <button
              type="button"
              onClick={onOpenCounterPos}
              className="bg-[#C89D3C] hover:bg-[#A88029] text-[#2C1810] px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Take New Counter Order</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg"
              aria-label="Close station"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Pipeline Stage Tabs */}
        <div className="bg-[#F3ECE2] border-b border-[#E6DBCE] px-6 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveStage('all')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeStage === 'all'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            All Orders ({orderEnquiries.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveStage('received')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
              activeStage === 'received'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>1. Orders to Pack ({countReceived})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStage('making_parcel')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
              activeStage === 'making_parcel'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-blue-700" />
            <span>2. Making Parcel ({countPacking})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStage('parcel_ready')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
              activeStage === 'parcel_ready'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            <BellRing className="w-3.5 h-3.5 text-emerald-700" />
            <span>3. Ready for Handover ({countReady})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStage('handed_over')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
              activeStage === 'handed_over'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
            <span>4. Handed Over ({countHandedOver})</span>
          </button>
        </div>

        {/* Orders Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF7F2] space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E6DBCE] p-8">
              <Box className="w-12 h-12 text-[#7A4B34] opacity-30 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-[#2C1810]">No orders in this stage</h3>
              <p className="text-xs text-[#7A4B34] mt-1">
                Click "Take New Counter Order" above or place an order from the website to see it flow through parcel preparation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => {
                const checklist = order.parcelDetails?.packedItemsChecklist || {};
                const allItemsChecked = order.items.every((it) => checklist[it.product.name]);

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 shadow-xs transition-all ${
                      order.status === 'parcel_ready'
                        ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/30'
                        : order.status === 'making_parcel'
                        ? 'bg-blue-50/60 border-blue-200'
                        : order.status === 'handed_over'
                        ? 'bg-white border-[#E6DBCE] opacity-90'
                        : 'bg-white border-[#E6DBCE]'
                    }`}
                  >
                    {/* Header: Token & Status */}
                    <div className="flex items-start justify-between border-b border-[#E6DBCE]/70 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xl font-extrabold text-[#2C1810] tracking-tight bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E6DBCE]">
                            {order.tokenNumber}
                          </span>
                          <span className="text-xs font-semibold text-[#2C1810]">
                            {order.customerName}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A4B34] mt-1">
                          {order.customerPhone} · <span className="capitalize">{order.orderType.replace('-', ' ')}</span>
                        </p>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          order.status === 'parcel_ready'
                            ? 'bg-emerald-700 text-white animate-pulse'
                            : order.status === 'making_parcel'
                            ? 'bg-blue-700 text-white'
                            : order.status === 'handed_over'
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {order.status === 'parcel_ready'
                          ? 'Ready for Pickup'
                          : order.status === 'making_parcel'
                          ? 'Making Parcel'
                          : order.status === 'handed_over'
                          ? 'Handed Over'
                          : 'Order Received'}
                      </span>
                    </div>

                    {/* Items Checklist / Packaging View */}
                    <div className="space-y-2 flex-1">
                      <div className="flex justify-between items-center text-xs font-semibold text-[#7A4B34]">
                        <span>Items to Pack:</span>
                        <span className="font-mono text-[#2C1810] font-bold">₹{order.estimatedTotal}</span>
                      </div>

                      <div className="space-y-1.5 bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DBCE]">
                        {order.items.map((it, idx) => {
                          const isPacked = checklist[it.product.name] ?? false;
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                if (order.status === 'making_parcel') {
                                  toggleItemPacked(order.id, it.product.name);
                                }
                              }}
                              className={`flex items-center justify-between text-xs p-1.5 rounded transition-colors ${
                                order.status === 'making_parcel' ? 'cursor-pointer hover:bg-white' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {order.status === 'making_parcel' ? (
                                  <input
                                    type="checkbox"
                                    checked={isPacked}
                                    onChange={() => {}}
                                    className="rounded text-[#2C1810]"
                                  />
                                ) : (
                                  <span className="text-[#C89D3C]">•</span>
                                )}
                                <span className={isPacked ? 'line-through text-[#7A4B34]' : 'text-[#2C1810] font-medium'}>
                                  {it.product.name} {it.selectedPortion && `(${it.selectedPortion})`} x {it.quantity}
                                </span>
                              </div>
                              <span className="font-mono text-[11px] text-[#7A4B34]">
                                ₹{it.itemPrice * it.quantity}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Parcel Box & Shelf details if present */}
                      {order.parcelDetails && (
                        <div className="text-[11px] text-[#5C3624] space-y-0.5 pt-1">
                          <div className="flex justify-between">
                            <span>Box Type:</span>
                            <strong className="text-[#2C1810]">{order.parcelDetails.boxType}</strong>
                          </div>
                          {order.parcelDetails.shelfRack && (
                            <div className="flex justify-between">
                              <span>Pickup Shelf:</span>
                              <strong className="text-emerald-800 font-mono bg-emerald-100/70 px-1 rounded">
                                {order.parcelDetails.shelfRack}
                              </strong>
                            </div>
                          )}
                          {order.parcelDetails.handedOverTo && (
                            <div className="flex justify-between">
                              <span>Handed over to:</span>
                              <strong className="text-[#2C1810]">{order.parcelDetails.handedOverTo}</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {order.specialInstructions && (
                        <p className="text-[11px] text-[#7A4B34] italic bg-white p-2 rounded border border-[#E6DBCE]">
                          "{order.specialInstructions}"
                        </p>
                      )}
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="pt-3 border-t border-[#E6DBCE] space-y-2">
                      {/* Stage 1: Received -> Start Making Parcel */}
                      {order.status === 'received' && (
                        <button
                          type="button"
                          onClick={() => handleOpenBoxing(order)}
                          className="w-full flex items-center justify-center gap-2 bg-[#2C1810] hover:bg-[#422518] text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                        >
                          <Box className="w-4 h-4 text-[#DFB75A]" />
                          <span>Start Making Parcel</span>
                        </button>
                      )}

                      {/* Stage 2: Making Parcel -> Mark Ready */}
                      {order.status === 'making_parcel' && (
                        <button
                          type="button"
                          onClick={() => markParcelReady(order.id, order.parcelDetails?.shelfRack || 'Counter Shelf A1')}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>Mark Parcel Ready for Pickup</span>
                        </button>
                      )}

                      {/* Stage 3: Parcel Ready -> Handover to Customer */}
                      {order.status === 'parcel_ready' && (
                        <button
                          type="button"
                          onClick={() => handleOpenHandover(order)}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-98"
                        >
                          <UserCheck className="w-4 h-4 text-[#DFB75A]" />
                          <span>Handover Parcel to Customer</span>
                        </button>
                      )}

                      {/* Common View / Print Handover Slip & WhatsApp */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForSlip(order)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-[#E6DBCE] bg-white hover:bg-[#F3ECE2] text-xs font-medium text-[#2C1810] transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#7A4B34]" />
                          <span>Parcel Slip</span>
                        </button>

                        <a
                          href={generateWhatsAppHandoverReceiptLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-[#25D366] bg-emerald-50 hover:bg-emerald-100 text-[#25D366] transition-colors"
                          title="WhatsApp Handover Receipt"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DIALOG 1: START MAKING PARCEL (BOXING SELECTION) */}
      {boxingOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="boxing-dialog-title"
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setBoxingOrder(null)}
        >
          <div
            className="bg-[#FAF7F2] rounded-2xl max-w-md w-full border border-[#E6DBCE] shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#E6DBCE] pb-3">
              <div>
                <h3 id="boxing-dialog-title" className="font-serif text-lg font-bold text-[#2C1810]">
                  Make Parcel for Token {boxingOrder.tokenNumber}
                </h3>
                <p className="text-xs text-[#7A4B34]">Customer: {boxingOrder.customerName}</p>
              </div>
              <button
                type="button"
                onClick={() => setBoxingOrder(null)}
                className="text-[#7A4B34] hover:text-[#2C1810]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmStartBoxing} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                  Select Parcel Box Style:
                </label>
                <select
                  value={boxType}
                  onChange={(e) => setBoxType(e.target.value as any)}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                >
                  <option value="Signature Gold Box">Signature Gold Sweet Box (Festive Ribbon)</option>
                  <option value="Classic Sweet Box">Classic Shabari Sweet Box</option>
                  <option value="Pastry & Cake Box">Pastry &amp; Cake Safe Carry Box</option>
                  <option value="Standard Bakery Bag">Standard Bakery Paper Bag</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                  Packaging Staff Member:
                </label>
                <input
                  type="text"
                  required
                  value={packedBy}
                  onChange={(e) => setPackedBy(e.target.value)}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                  Designated Ready Shelf / Rack:
                </label>
                <select
                  value={shelfRack}
                  onChange={(e) => setShelfRack(e.target.value)}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                >
                  <option value="Counter Shelf A1">Counter Shelf A1 (Fast Pickup)</option>
                  <option value="Counter Shelf A2">Counter Shelf A2</option>
                  <option value="Chilled Pastry Unit #1">Chilled Pastry Unit #1 (Cakes)</option>
                  <option value="Large Hamper Rack #B">Large Hamper Rack #B (Bulk Boxes)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#2C1810] hover:bg-[#422518] text-white py-3 rounded-lg text-xs font-bold transition-all shadow-md"
                >
                  Confirm &amp; Begin Boxing Parcel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG 2: HANDOVER PARCEL TO CUSTOMER */}
      {handoveringOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="handover-dialog-title"
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setHandoveringOrder(null)}
        >
          <div
            className="bg-[#FAF7F2] rounded-2xl max-w-md w-full border border-[#E6DBCE] shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#E6DBCE] pb-3">
              <div>
                <h3 id="handover-dialog-title" className="font-serif text-lg font-bold text-[#2C1810]">
                  Handover Parcel · Token {handoveringOrder.tokenNumber}
                </h3>
                <p className="text-xs text-[#7A4B34]">Amount Due: ₹{handoveringOrder.estimatedTotal}</p>
              </div>
              <button
                type="button"
                onClick={() => setHandoveringOrder(null)}
                className="text-[#7A4B34] hover:text-[#2C1810]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmHandover} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                  Recipient Name (Person collecting):
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                  Payment Settlement Method:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                >
                  <option value="Cash on Handover">Cash on Handover (Received at Counter)</option>
                  <option value="UPI / GPay at Counter">UPI / GPay / QR Code at Counter</option>
                  <option value="Pre-paid Online">Pre-paid Online (WhatsApp Verified)</option>
                </select>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <strong>Handover Check:</strong> Verify all box seals and mention to customer to store cream cakes refrigerated.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3 rounded-lg text-xs font-bold transition-all shadow-md active:scale-98"
                >
                  Complete Handover &amp; Issue Parcel Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
