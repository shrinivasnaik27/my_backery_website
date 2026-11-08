import React from 'react';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, Share2, Info } from 'lucide-react';

interface ImageLightboxModalProps {
  item: GalleryItem;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  item,
  onClose,
  onNext,
  onPrev,
}) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: item.title,
          text: item.caption,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[95vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls */}
        <div className="w-full flex items-center justify-between text-white pb-3 px-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#DFB75A] uppercase tracking-wider">
              {item.category}
            </span>
            <span>·</span>
            <span className="opacity-75">{item.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Share image"
              aria-label="Share image"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Close viewer"
              aria-label="Close viewer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Image with Nav Arrows */}
        <div className="relative w-full flex items-center justify-center">
          {onPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-2 sm:-left-12 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors backdrop-blur-xs"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="rounded-xl overflow-hidden max-h-[75vh] max-w-full bg-black/40 flex items-center justify-center border border-white/10 shadow-2xl">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="max-h-[75vh] w-auto max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {onNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-2 sm:-right-12 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors backdrop-blur-xs"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Caption bar */}
        <div className="w-full text-center text-white/90 text-xs sm:text-sm pt-3 px-4">
          <p id="lightbox-title" className="font-semibold">{item.title}</p>
          <p className="opacity-75 text-xs mt-0.5">{item.caption}</p>
        </div>
      </div>
    </div>
  );
};
