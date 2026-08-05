import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

export const SocialShareModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://tasty-hilversum.nl';
  const shareTitle = 'Check out TASTY in Hilversum! Authentic Levantine & Mediterranean Fast-Casual Kitchen 🔥';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tasty-charcoal/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-tasty-teal/20 text-left space-y-6 relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-tasty-bg-warm text-tasty-charcoal hover:bg-tasty-sage-light flex items-center justify-center transition-colors"
          >
            <Icon icon="mdi:close" className="text-xl" />
          </button>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-tasty-teal-light text-tasty-teal">
              <Icon icon="mdi:share-variant" />
              Spread the Word
            </span>
            <h3 className="text-2xl font-serif font-bold text-tasty-charcoal">
              Share TASTY Hilversum
            </h3>
            <p className="text-tasty-charcoal-muted text-xs sm:text-sm">
              Recommend Hilversum's premier Levantine kitchen to your friends & family!
            </p>
          </div>

          {/* Social Action Grid */}
          <div className="grid grid-cols-2 gap-3">
            <a 
              href={shareWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Icon icon="mdi:whatsapp" className="text-lg" />
              <span>WhatsApp</span>
            </a>

            <a 
              href={shareFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Icon icon="mdi:facebook" className="text-lg" />
              <span>Facebook</span>
            </a>
          </div>

          {/* Copy Direct Link */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-tasty-charcoal mb-1">Direct Website Link</label>
            <div className="flex items-center gap-2 bg-tasty-bg-warm p-2 rounded-xl border border-tasty-sage/30">
              <input 
                type="text" 
                readOnly
                value={shareUrl}
                className="w-full bg-transparent text-xs font-semibold text-tasty-charcoal px-2 focus:outline-none"
              />
              <button 
                onClick={handleCopyLink}
                className="shrink-0 px-4 py-2 rounded-lg bg-tasty-teal text-white font-bold text-xs shadow-sm hover:bg-tasty-teal-dark transition-colors flex items-center gap-1"
              >
                <Icon icon={copied ? 'mdi:check' : 'mdi:content-copy'} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
