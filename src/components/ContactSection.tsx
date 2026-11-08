import React from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { MapPin, Phone, MessageCircle, Clock, Navigation, Info, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { businessSettings, language, generateWhatsAppGeneralLink } = useStore();
  const t = TRANSLATIONS[language];

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E6DBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C89D3C] mb-1">
            <MapPin className="w-4 h-4" />
            <span>{language === 'kn' ? 'ಸ್ಥಳ & ಸಂಪರ್ಕ' : 'Visit & Contact'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
            {t.shopAddress}
          </h2>
          <p className="text-sm text-[#5C3624] mt-2">
            Located conveniently in Bhatkal, Karnataka. Walk in to explore fresh counters or connect with us on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards & Hours */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Store Address Card */}
            <div className="bg-[#F3ECE2] rounded-2xl p-6 border border-[#E6DBCE] space-y-3 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-[#C89D3C] shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#2C1810]">
                      Store Address
                    </h3>
                    <p className="text-xs font-kannada text-[#7A4B34]">ಅಂಗಡಿಯ ವಿಳಾಸ</p>
                  </div>
                </div>

                {!businessSettings.verifiedStatus.addressVerified && (
                  <span className="text-[10px] font-medium text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                    Verify with Owner
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm text-[#422518] leading-relaxed pt-1">
                <p className="font-medium text-[#2C1810]">{businessSettings.address}</p>
                <p className="font-kannada text-[#7A4B34] mt-1">{businessSettings.addressKannada}</p>
                <p className="text-xs text-[#7A4B34] mt-1">Landmark: {businessSettings.landmark}</p>
              </div>

              <div className="pt-2">
                <a
                  href={businessSettings.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2C1810] hover:text-[#C89D3C] transition-colors"
                >
                  <Navigation className="w-4 h-4 text-[#C89D3C]" />
                  <span>Open in Google Maps Directions →</span>
                </a>
              </div>
            </div>

            {/* Phone & WhatsApp Quick Connect */}
            <div className="bg-[#F3ECE2] rounded-2xl p-6 border border-[#E6DBCE] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#2C1810]">
                  Direct Assistance
                </h3>
                <span className="text-xs text-[#7A4B34]">Bhatkal Store</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${businessSettings.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E6DBCE] hover:border-[#2C1810] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#2C1810] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#7A4B34] group-hover:text-[#2C1810]">Call Shop</p>
                    <p className="text-xs font-bold font-mono text-[#2C1810] truncate">
                      {businessSettings.phone}
                    </p>
                  </div>
                </a>

                <a
                  href={generateWhatsAppGeneralLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E6DBCE] hover:border-[#25D366] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#7A4B34] group-hover:text-[#25D366]">WhatsApp</p>
                    <p className="text-xs font-bold text-[#2C1810] truncate">
                      Chat with Us
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Opening Hours Card */}
            <div className="bg-[#F3ECE2] rounded-2xl p-6 border border-[#E6DBCE] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C89D3C]" />
                  <h3 className="font-serif text-base font-bold text-[#2C1810]">
                    {t.openingHours}
                  </h3>
                </div>

                {!businessSettings.verifiedStatus.hoursVerified && (
                  <span className="text-[10px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                    Owner Confirmation Needed
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs divide-y divide-[#E6DBCE]/60">
                {businessSettings.openingHours.map((slot, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex justify-between items-center text-[#422518]">
                    <span className="font-medium">{slot.days}</span>
                    <span className="font-mono font-semibold text-[#2C1810]">{slot.hours}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-[#7A4B34] italic pt-1">
                * Note: Timings may vary during special Karnataka festival days and national holidays.
              </p>
            </div>

          </div>

          {/* Right Column: Google Maps Embed Frame */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-3 border border-[#E6DBCE] shadow-lg space-y-3">
              <div className="flex items-center justify-between px-2 pt-1 text-xs text-[#7A4B34]">
                <span className="font-semibold text-[#2C1810] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C89D3C]" />
                  Google Maps Location: Bhatkal, Karnataka
                </span>
                <a
                  href={businessSettings.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C89D3C] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Iframe */}
              <div className="rounded-xl overflow-hidden aspect-16/10 sm:aspect-16/9 bg-[#F3ECE2] border border-[#E6DBCE]">
                <iframe
                  title="SHABARI Sweets & Bakery Bhatkal Location Map"
                  src={businessSettings.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Map Footer Helper */}
              <div className="p-2 text-xs text-[#7A4B34] flex items-center justify-between">
                <span>Coordinates: 13.9856° N, 74.5539° E</span>
                <span className="font-medium text-[#2C1810]">Uttara Kannada District</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
