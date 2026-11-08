import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { ShoppingBag, Lock, Menu as MenuIcon, X, MapPin } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdminLogin,
  onOpenAdminDashboard,
}) => {
  const {
    businessSettings,
    cartCount,
    setIsCartOpen,
    language,
    setLanguage,
    isAdminLoggedIn,
    setIsTrackingModalOpen,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Notification Announcement Banner */}
      {businessSettings.announcement.enabled && (
        <aside aria-label="Announcement" className="bg-[#2C1810] text-[#FAF7F2] text-xs font-medium py-2 px-4 text-center border-b border-[#422518]">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <span className="text-[#DFB75A]">✨</span>
            <span>
              {language === 'kn' && businessSettings.announcement.textKannada
                ? businessSettings.announcement.textKannada
                : businessSettings.announcement.text}
            </span>
            <a
              href={businessSettings.announcement.linkUrl || '#cakes'}
              className="text-[#DFB75A] underline hover:text-white transition-colors ml-1"
            >
              {language === 'kn' ? 'ವಿವರ ನೋಡಿ →' : 'Learn more →'}
            </a>
          </div>
        </aside>
      )}

      {/* Main Sticky Header: 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DBCE] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              className="group flex flex-col focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C89D3C]"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2C1810] group-hover:text-[#C89D3C] transition-colors whitespace-nowrap">
                SHABARI <span className="text-[#C89D3C] font-normal">Sweets &amp; Bakery</span>
              </span>
              <span className="text-[11px] font-kannada text-[#7A4B34] tracking-wide -mt-0.5 whitespace-nowrap">
                ಶಬರಿ ಸ್ವೀಟ್ಸ್ &amp; ಬೇಕರಿ · ಭಟ್ಕಳ
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation Links (4-5 single-line clean text links) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#422518]">
            <a
              href="#menu"
              className="hover:text-[#C89D3C] transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#C89D3C] after:transition-all"
            >
              {t.navMenu}
            </a>
            <a
              href="#cakes"
              className="hover:text-[#C89D3C] transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#C89D3C] after:transition-all"
            >
              {t.navCakes}
            </a>
            <a
              href="#about"
              className="hover:text-[#C89D3C] transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#C89D3C] after:transition-all"
            >
              {t.navAbout}
            </a>
            <a
              href="#gallery"
              className="hover:text-[#C89D3C] transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#C89D3C] after:transition-all"
            >
              {t.navGallery}
            </a>
            <a
              href="#contact"
              className="hover:text-[#C89D3C] transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#C89D3C] after:transition-all"
            >
              {t.navContact}
            </a>
          </nav>

          {/* Zone 3: Primary Action & Utility Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center bg-[#F3ECE2] p-1 rounded-lg border border-[#E6DBCE] text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  language === 'en'
                    ? 'bg-white text-[#2C1810] shadow-xs font-semibold'
                    : 'text-[#7A4B34] hover:text-[#2C1810]'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('kn')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap font-kannada ${
                  language === 'kn'
                    ? 'bg-white text-[#2C1810] shadow-xs font-semibold'
                    : 'text-[#7A4B34] hover:text-[#2C1810]'
                }`}
                title="ಕನ್ನಡ"
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  language === 'hi'
                    ? 'bg-white text-[#2C1810] shadow-xs font-semibold'
                    : 'text-[#7A4B34] hover:text-[#2C1810]'
                }`}
                title="हिंदी"
              >
                हिं
              </button>
            </div>

            {/* Track Token Button */}
            <button
              type="button"
              onClick={() => setIsTrackingModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-lg border border-[#E6DBCE] bg-white hover:bg-[#F3ECE2] text-[#2C1810] text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-2xs"
              title="Track Live Order & Pickup Token"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping hidden sm:inline" />
              <span>Track Token</span>
            </button>

            {/* Admin Toggle */}
            <button
              type="button"
              onClick={isAdminLoggedIn ? onOpenAdminDashboard : onOpenAdminLogin}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 whitespace-nowrap shadow-2xs ${
                isAdminLoggedIn
                  ? 'bg-[#2C1810] text-[#DFB75A] border-[#2C1810] font-bold ring-1 ring-[#DFB75A]/50'
                  : 'bg-white text-[#2C1810] border-[#E6DBCE] hover:bg-[#F3ECE2] font-semibold'
              }`}
              title={isAdminLoggedIn ? 'Owner & Admin Panel (Active)' : 'Admin Login'}
              aria-label={isAdminLoggedIn ? 'Owner & Admin Panel' : 'Admin Login'}
            >
              <Lock className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-[#DFB75A]' : 'text-[#7A4B34]'}`} />
              <span className="hidden md:inline">
                {isAdminLoggedIn ? 'Admin Panel' : 'Admin'}
              </span>
            </button>

            {/* Primary Action: Enquiry Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#2C1810] hover:bg-[#422518] text-[#FAF7F2] px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-xs hover:shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C89D3C] whitespace-nowrap active:scale-98"
              aria-label="View Enquiry Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#DFB75A]" />
              <span className="hidden sm:inline">{t.cart}</span>
              {cartCount > 0 && (
                <span className="bg-[#C89D3C] text-[#2C1810] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2C1810] hover:text-[#C89D3C] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E6DBCE] px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DBCE]">
              <span className="text-xs font-semibold text-[#7A4B34] uppercase tracking-wider">
                Language
              </span>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded border ${
                    language === 'en'
                      ? 'bg-[#2C1810] text-white border-[#2C1810]'
                      : 'border-[#E6DBCE] text-[#422518]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('kn')}
                  className={`px-3 py-1 rounded border font-kannada ${
                    language === 'kn'
                      ? 'bg-[#2C1810] text-white border-[#2C1810]'
                      : 'border-[#E6DBCE] text-[#422518]'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-3 py-1 rounded border ${
                    language === 'hi'
                      ? 'bg-[#2C1810] text-white border-[#2C1810]'
                      : 'border-[#E6DBCE] text-[#422518]'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <nav className="flex flex-col space-y-2 text-base font-medium text-[#2C1810]">
              <a
                href="#menu"
                onClick={handleNavClick}
                className="py-2 px-3 rounded-md hover:bg-[#F3ECE2] transition-colors"
              >
                {t.navMenu}
              </a>
              <a
                href="#cakes"
                onClick={handleNavClick}
                className="py-2 px-3 rounded-md hover:bg-[#F3ECE2] transition-colors"
              >
                {t.navCakes}
              </a>
              <a
                href="#about"
                onClick={handleNavClick}
                className="py-2 px-3 rounded-md hover:bg-[#F3ECE2] transition-colors"
              >
                {t.navAbout}
              </a>
              <a
                href="#gallery"
                onClick={handleNavClick}
                className="py-2 px-3 rounded-md hover:bg-[#F3ECE2] transition-colors"
              >
                {t.navGallery}
              </a>
              <a
                href="#reviews"
                onClick={handleNavClick}
                className="py-2 px-3 rounded-md hover:bg-[#F3ECE2] transition-colors"
              >
                {t.navReviews}
              </a>
              <a
                href="#contact"
                onClick={handleNavClick}
                className="py-2 px-3 rounded-md hover:bg-[#F3ECE2] transition-colors"
              >
                {t.navContact}
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsTrackingModalOpen(true);
                }}
                className="py-2 px-3 text-left rounded-md bg-[#F3ECE2] text-[#2C1810] font-semibold flex items-center justify-between"
              >
                <span>Track Pickup Token</span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              </button>
            </nav>

            <div className="pt-2 border-t border-[#E6DBCE] flex justify-between items-center text-xs text-[#7A4B34]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C89D3C]" /> Bhatkal, Karnataka
              </span>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAdminLoggedIn) onOpenAdminDashboard();
                  else onOpenAdminLogin();
                }}
                className="underline text-[#2C1810] font-medium"
              >
                {isAdminLoggedIn ? 'Owner Panel' : 'Owner Login'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
