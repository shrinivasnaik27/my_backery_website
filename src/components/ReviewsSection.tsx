import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { ReviewModal } from './ReviewModal';
import { Star, MessageSquareHeart, ExternalLink, MapPin } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, businessSettings, language } = useStore();
  const t = TRANSLATIONS[language];

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Show approved reviews
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E6DBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C89D3C] mb-1">
              <MessageSquareHeart className="w-4 h-4" />
              <span>{language === 'kn' ? 'ಗ್ರಾಹಕರ ನಂಬಿಕೆ' : 'Local Community Love'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
              {t.reviewsTitle}
            </h2>
            <p className="text-sm text-[#5C3624] mt-2">
              {t.reviewDisclaimer}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={businessSettings.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F3ECE2] text-[#2C1810] border border-[#E6DBCE] px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-2xs hover:shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C89D3C]" />
              <span>{t.leaveReview}</span>
            </a>

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#2C1810] hover:bg-[#422518] text-[#FAF7F2] px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs"
            >
              <span>Write Feedback</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#F3ECE2] rounded-2xl p-6 border border-[#E6DBCE] flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#DFB75A]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'fill-[#DFB75A] text-[#DFB75A]'
                          : 'text-[#E6DBCE]'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-mono font-bold text-[#2C1810] ml-1.5">
                    {rev.rating}.0
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#422518] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Verification metadata */}
              <div className="pt-3 border-t border-[#E6DBCE]/70 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#2C1810]">{rev.author}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-[#7A4B34] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#C89D3C]" />
                    <span>Bhatkal Patron</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded border border-[#E6DBCE] text-[#7A4B34] block">
                    {rev.source}
                  </span>
                  <span className="text-[10px] text-[#7A4B34] mt-0.5 block opacity-75">
                    {rev.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {isReviewModalOpen && (
        <ReviewModal onClose={() => setIsReviewModalOpen(false)} />
      )}
    </section>
  );
};
