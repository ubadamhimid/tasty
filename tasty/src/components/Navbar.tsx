import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialShareModal } from './SocialShare';

interface NavbarProps {
  onOpenCustomizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCustomizer }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-300">
        <nav 
          className={`max-w-7xl mx-auto rounded-full px-6 py-3 transition-all duration-300 flex items-center justify-between ${
            isScrolled 
              ? 'glass-panel shadow-tasty-soft border-tasty-teal/20 py-2.5' 
              : 'bg-white/80 backdrop-blur-md border border-tasty-sage/20 shadow-sm'
          }`}
        >
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-full p-1 transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/images/logo.webp" 
                alt="TASTY Levantine Flavours Logo" 
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-[#2B3A39]/80 text-sm tracking-wide">
            <a href="#hero" className="hover:text-tasty-teal transition-colors duration-200">Home</a>
            <a href="#menu" className="hover:text-tasty-teal transition-colors duration-200">Menu</a>
            <a 
              href="#customizer" 
              onClick={(e) => { e.preventDefault(); onOpenCustomizer(); }}
              className="text-tasty-terracotta font-semibold hover:text-tasty-terracotta-dark transition-colors flex items-center gap-1.5"
            >
              <Icon icon="mdi:magic-staff" className="text-base animate-spin-slow" />
              Craft Bowl
            </a>
            <a href="#story" className="hover:text-tasty-teal transition-colors duration-200">Our Story</a>
            <a href="#delivery" className="hover:text-tasty-teal transition-colors duration-200">Location & Hours</a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Share Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2.5 rounded-full bg-tasty-bg-warm text-tasty-teal border border-tasty-teal/20 shadow-xs hover:bg-tasty-teal hover:text-white transition-all duration-300"
              title="Share TASTY Hilversum"
            >
              <Icon icon="mdi:share-variant" className="text-lg" />
            </button>

            <motion.a 
              href="tel:0352042001"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 bg-gradient-to-r from-tasty-teal to-[#487A77] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full shadow-tasty-soft hover:shadow-tasty-glow transition-all duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Icon icon="mdi:phone" className="text-base" />
              <span>035 204 2001</span>
            </motion.a>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-tasty-charcoal hover:bg-tasty-sage-light transition-colors"
            >
              <Icon icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"} className="text-2xl" />
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-3 max-w-7xl mx-auto glass-panel rounded-2xl p-6 shadow-xl flex flex-col gap-4 border border-tasty-teal/20"
            >
              <a 
                href="#hero" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-tasty-charcoal hover:text-tasty-teal"
              >
                Home
              </a>
              <a 
                href="#menu" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-tasty-charcoal hover:text-tasty-teal"
              >
                Menu
              </a>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenCustomizer(); }}
                className="text-left text-base font-bold text-tasty-terracotta flex items-center gap-2"
              >
                <Icon icon="mdi:magic-staff" />
                Craft Custom Bowl
              </button>
              <a 
                href="#story" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-tasty-charcoal hover:text-tasty-teal"
              >
                Our Story
              </a>
              <a 
                href="#delivery" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-tasty-charcoal hover:text-tasty-teal"
              >
                Location & Opening Hours
              </a>
              <div className="pt-2 border-t border-tasty-sage/20 flex flex-col gap-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); setShareModalOpen(true); }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-tasty-bg-warm text-tasty-teal font-bold text-sm border border-tasty-teal/20"
                >
                  <Icon icon="mdi:share-variant" />
                  <span>Share Website</span>
                </button>
                <a 
                  href="tel:0352042001"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-tasty-teal text-white font-semibold text-sm shadow-md"
                >
                  <Icon icon="mdi:phone" />
                  <span>Call 035 204 2001</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Share Modal */}
      <SocialShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </>
  );
};
