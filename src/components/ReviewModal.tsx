import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, CheckCircle, Info } from 'lucide-react';

interface ReviewModalProps {
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ onClose }) => {
  const { submitCustomerReview } = useStore();

  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    submitCustomerReview(author, rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-2xl max-w-md w-full border border-[#E6DBCE] shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white text-[#2C1810] p-2 rounded-full shadow-md transition-colors"
          aria-label="Close review modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
              Thank You!
            </h3>
            <p className="text-xs text-[#7A4B34]">
              Your customer feedback has been submitted to the shop owner for review. We appreciate your support for Shabari Sweets &amp; Bakery!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left space-y-1">
              <h3 id="review-modal-title" className="font-serif text-2xl font-bold text-[#2C1810]">
                Customer Feedback
              </h3>
              <p className="text-xs text-[#7A4B34]">
                Share your dining or celebratory cake experience with SHABARI.
              </p>
            </div>

            <div className="p-3 bg-[#F3ECE2] rounded-xl border border-[#E6DBCE] text-[11px] text-[#7A4B34] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#C89D3C] shrink-0 mt-0.5" />
              <span>
                To help our local business grow, we also encourage posting your review directly to our Google Maps profile!
              </span>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-hidden"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-[#DFB75A] text-[#DFB75A]'
                          : 'text-[#E6DBCE]'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#2C1810] ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Suresh Pai"
                className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                Your Review *
              </label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you enjoyed most about the sweets, pastries, or service..."
                rows={3}
                className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2C1810] hover:bg-[#422518] text-[#FAF7F2] py-3 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-98"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
