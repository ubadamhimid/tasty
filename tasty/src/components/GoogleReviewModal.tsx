import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

const GOOGLE_REVIEW_URL = 'https://g.page/r/CUkMh7UTSm9TEBM/review';

export const GoogleReviewModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [minimizedBadge, setMinimizedBadge] = useState(false);

  useEffect(() => {
    // Check if user dismissed review prompt recently
    const isDismissed = localStorage.getItem('tasty_review_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3500); // Trigger after 3.5 seconds
      return () => clearTimeout(timer);
    } else {
      setMinimizedBadge(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setMinimizedBadge(true);
    localStorage.setItem('tasty_review_dismissed', 'true');
  };

  const handleReviewClick = () => {
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  return (
    <>
      {/* Minimized Floating Badge (Bottom Left) when closed */}
      {minimizedBadge && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 left-4 sm:left-6 z-40 bg-[#FFFDF9] text-tasty-charcoal border border-tasty-terracotta/30 px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-tasty-terracotta-light transition-all"
        >
          <div className="flex text-amber-400 text-xs">
            <Icon icon="mdi:star" />
            <Icon icon="mdi:star" />
            <Icon icon="mdi:star" />
            <Icon icon="mdi:star" />
            <Icon icon="mdi:star" />
          </div>
          <span className="text-xs font-bold text-tasty-charcoal">Review Us</span>
        </motion.button>
      )}

      {/* Review Prompt Notification */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile View: Non-blocking Bottom Toast Bar */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="sm:hidden fixed bottom-4 left-3 right-3 z-50 bg-[#FFFDF9] rounded-2xl p-3.5 shadow-2xl border border-tasty-terracotta/30 flex items-center justify-between gap-3 pointer-events-auto"
            >
              {/* Left: Star Icon & Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-tasty-terracotta-light border border-tasty-terracotta/20 flex items-center justify-center shrink-0 overflow-hidden p-1">
                  <img src="/images/icon.png" alt="TASTY Icon" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Icon icon="mdi:star" />
                    <Icon icon="mdi:star" />
                    <Icon icon="mdi:star" />
                    <Icon icon="mdi:star" />
                    <Icon icon="mdi:star" />
                  </div>
                  <h4 className="font-bold text-xs text-tasty-charcoal truncate">
                    Loved your TASTY meal?
                  </h4>
                  <p className="text-[11px] text-tasty-charcoal-muted truncate">
                    Leave us a 5-star Google review!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleReviewClick}
                  className="px-3.5 py-2 rounded-full bg-tasty-terracotta text-white font-bold text-xs shadow-sm hover:bg-tasty-terracotta-dark transition-all whitespace-nowrap"
                >
                  Review ★
                </button>

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full text-tasty-charcoal/50 hover:text-tasty-charcoal"
                  aria-label="Close"
                >
                  <Icon icon="mdi:close" className="text-lg" />
                </button>
              </div>
            </motion.div>

            {/* Desktop View: Centered Premium Modal */}
            <div className="hidden sm:flex fixed inset-0 z-50 items-center justify-center p-6 pointer-events-none">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="absolute inset-0 bg-tasty-charcoal/40 backdrop-blur-xs pointer-events-auto"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md bg-[#FFFDF9] rounded-3xl p-8 shadow-2xl border border-tasty-terracotta/30 text-center pointer-events-auto overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full text-tasty-charcoal/60 hover:text-tasty-charcoal hover:bg-tasty-sage-light transition-colors"
                  aria-label="Close review modal"
                >
                  <Icon icon="mdi:close" className="text-xl" />
                </button>

                {/* Header Icon / Google Branding */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-tasty-terracotta-light border border-tasty-terracotta/20 flex items-center justify-center p-2.5 shadow-xs overflow-hidden">
                  <img src="/images/icon.png" alt="TASTY Icon" className="w-full h-full object-contain" />
                </div>

                {/* 5 Stars Header */}
                <div className="flex justify-center text-amber-400 text-2xl gap-1 mb-2">
                  <Icon icon="mdi:star" />
                  <Icon icon="mdi:star" />
                  <Icon icon="mdi:star" />
                  <Icon icon="mdi:star" />
                  <Icon icon="mdi:star" />
                </div>

                {/* Title & Body */}
                <h3 className="font-serif font-bold text-2xl text-tasty-charcoal mb-2">
                  Loved your TASTY meal?
                </h3>
                <p className="text-tasty-charcoal-muted text-sm leading-relaxed mb-6">
                  Support Hilversum’s favorite Levantine kitchen! Leaving a 5-star Google review takes less than 10 seconds and helps us grow.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleReviewClick}
                    className="w-full py-3.5 px-6 rounded-full bg-tasty-terracotta hover:bg-tasty-terracotta-dark text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <Icon icon="mdi:google" className="text-lg" />
                    <span>Leave 5-Star Review</span>
                    <Icon icon="mdi:arrow-right" className="text-base group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 px-4 rounded-full text-tasty-charcoal/70 hover:text-tasty-charcoal text-xs font-semibold transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
