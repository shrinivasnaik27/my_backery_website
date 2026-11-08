import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesOverview } from './components/CategoriesOverview';
import { MenuSection } from './components/MenuSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CakesSection } from './components/CakesSection';
import { CakeEnquiryModal } from './components/CakeEnquiryModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ParcelStationModal } from './components/ParcelStationModal';
import { CounterPosModal } from './components/CounterPosModal';
import { ParcelSlipModal } from './components/ParcelSlipModal';
import { LiveTokenTrackerModal } from './components/LiveTokenTrackerModal';
import { CategoryId, Product, OrderEnquiry } from './types';
import { Box, BellRing, UserCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    isCakeModalOpen,
    setIsCakeModalOpen,
    activeProductModal,
    setActiveProductModal,
    isParcelStationOpen,
    setIsParcelStationOpen,
    isCounterPosOpen,
    setIsCounterPosOpen,
    setIsTrackingModalOpen,
    orderEnquiries,
  } = useStore();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [cakeModalFlavor, setCakeModalFlavor] = useState<string | undefined>(undefined);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderEnquiry | null>(null);

  const readyOrdersCount = orderEnquiries.filter((o) => o.status === 'parcel_ready').length;

  const handleSelectCategoryFromOverview = (catId: CategoryId) => {
    setActiveCategoryFilter(catId);
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCakeModal = (flavor?: string) => {
    setCakeModalFlavor(flavor);
    setIsCakeModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C1810]">
      {/* 1. Header Navigation */}
      <Header
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Hero Banner */}
        <Hero />

        {/* 3. Shop Categories Overview */}
        <CategoriesOverview onSelectCategory={handleSelectCategoryFromOverview} />

        {/* 4. Interactive Menu Experience */}
        <MenuSection
          activeCategoryFilter={activeCategoryFilter}
          onCategoryFilterChange={setActiveCategoryFilter}
          onOpenProductModal={(product) => setActiveProductModal(product)}
        />

        {/* 5. Dedicated Cakes and Celebrations Section */}
        <CakesSection onOpenCakeModal={handleOpenCakeModal} />

        {/* 6. About Us & Freshness Commitment */}
        <AboutSection />

        {/* 7. Store & Delicacies Photo Gallery with Lightbox */}
        <GallerySection />

        {/* 8. Local Customer Reviews & Feedback */}
        <ReviewsSection />

        {/* 9. Contact, Verified Location & Opening Hours with Google Maps */}
        <ContactSection />

        {/* 10. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* 11. Footer */}
      <Footer
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Operational Station Quick Pill (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsParcelStationOpen(true)}
          className="flex items-center gap-2 bg-[#2C1810] hover:bg-[#422518] text-[#FAF7F2] px-3.5 py-2.5 rounded-full shadow-2xl border border-[#C89D3C] text-xs font-bold transition-all hover:scale-105 active:scale-95"
          title="Open Packaging Station & Handover Counter"
        >
          <Box className="w-4 h-4 text-[#DFB75A]" />
          <span>Parcel &amp; Handover Counter</span>
          {readyOrdersCount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono animate-pulse">
              {readyOrdersCount} Ready
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsTrackingModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-[#F3ECE2] text-[#2C1810] border border-[#E6DBCE] px-3 py-2.5 rounded-full shadow-lg text-xs font-semibold transition-all hover:scale-105"
          title="Track Live Tokens & Customer Pickup Board"
        >
          <BellRing className="w-3.5 h-3.5 text-[#C89D3C]" />
          <span>Live Token Board</span>
        </button>
      </div>

      {/* Floating WhatsApp Assistance & Quick Cart Pill (Bottom Right) */}
      <FloatingWhatsApp />

      {/* Product Detail Modal */}
      {activeProductModal && (
        <ProductDetailModal
          product={activeProductModal}
          onClose={() => setActiveProductModal(null)}
        />
      )}

      {/* Cake Enquiry Modal */}
      {isCakeModalOpen && (
        <CakeEnquiryModal
          initialFlavor={cakeModalFlavor}
          onClose={() => setIsCakeModalOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSubmitted={(order) => setSubmittedOrder(order)}
      />

      {/* Post-Order Submission Modal */}
      {submittedOrder && (
        <OrderConfirmationModal
          order={submittedOrder}
          onClose={() => setSubmittedOrder(null)}
        />
      )}

      {/* Live Token Tracker Modal */}
      <LiveTokenTrackerModal />

      {/* Store Packaging Counter & Customer Handover Station */}
      <ParcelStationModal
        isOpen={isParcelStationOpen}
        onClose={() => setIsParcelStationOpen(false)}
        onOpenCounterPos={() => {
          setIsParcelStationOpen(false);
          setIsCounterPosOpen(true);
        }}
      />

      {/* Counter POS Order Entry Modal */}
      <CounterPosModal
        isOpen={isCounterPosOpen}
        onClose={() => setIsCounterPosOpen(false)}
      />

      {/* Digital & Printable Parcel Handover Slip */}
      <ParcelSlipModal />

      {/* Owner Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* Owner Management Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
