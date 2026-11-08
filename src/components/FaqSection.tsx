import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { faqs, language, generateWhatsAppGeneralLink } = useStore();
  const t = TRANSLATIONS[language];

  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F3ECE2] border-b border-[#E6DBCE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C89D3C] mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'kn' ? 'ಪ್ರಶ್ನೋತ್ತರಗಳು' : 'Customer Clarity'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
            {t.faqsTitle}
          </h2>
          <p className="text-sm text-[#5C3624] mt-2">
            Everything you need to know about placing WhatsApp enquiries, custom cake timings, and store pickups.
          </p>
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const q = language === 'kn' && faq.questionKannada ? faq.questionKannada : faq.question;
            const a = language === 'kn' && faq.answerKannada ? faq.answerKannada : faq.answer;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-[#E6DBCE] overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-hidden hover:bg-[#FAF7F2]/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-[#2C1810]">
                    {q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#F3ECE2] flex items-center justify-center text-[#2C1810] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#2C1810] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5C3624] leading-relaxed border-t border-[#E6DBCE]/50 animate-in fade-in">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Have another question? */}
        <div className="mt-8 text-center bg-white/70 p-4 rounded-xl border border-[#E6DBCE] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#5C3624]">
            Have a custom requirement, festive gift box order, or special catering question?
          </p>
          <a
            href={generateWhatsAppGeneralLink('Hello Shabari Sweets & Bakery, I have a question regarding an order.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask Us on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
