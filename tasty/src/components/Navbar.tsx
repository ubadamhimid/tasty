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
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-8 py-3 sm:py-4 transition-all duration-300">
        <nav 
          className={`max-w-7xl mx-auto rounded-full px-4 sm:px-7 py-2.5 sm:py-3 transition-all duration-300 flex items-center justify-between ${
            isScrolled 
              ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-md border border-tasty-terracotta/20 py-2 sm:py-2.5' 
              : 'bg-[#FDFBF7]/85 backdrop-blur-md border border-tasty-terracotta/15 shadow-sm'
          }`}
        >
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0 group">
            <div className="relative overflow-hidden rounded-full p-0.5 transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/images/logo.webp" 
                alt="TASTY Levantine Flavours Logo" 
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-tasty-charcoal/90 text-sm tracking-wide">
            <a href="#hero" className="hover:text-tasty-terracotta transition-colors duration-200">Home</a>
            <a href="#menu" className="hover:text-tasty-terracotta transition-colors duration-200">Menu</a>
            <a 
              href="#customizer" 
              onClick={(e) => { e.preventDefault(); onOpenCustomizer(); }}
              className="text-tasty-terracotta font-semibold hover:text-tasty-terracotta-dark transition-colors"
            >
              Craft Bowl
            </a>
            <a href="#story" className="hover:text-tasty-terracotta transition-colors duration-200">Our Story</a>
            <a href="#delivery" className="hover:text-tasty-terracotta transition-colors duration-200">Location & Hours</a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Share Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-full bg-tasty-bg-warm text-tasty-charcoal border border-tasty-terracotta/20 hover:bg-tasty-terracotta-light hover:text-tasty-terracotta transition-all duration-300"
              title="Share TASTY Hilversum"
            >
              <Icon icon="mdi:share-variant" className="text-base sm:text-lg" />
            </button>

            {/* Dynamic Tactile Phone Pill Button */}
            <motion.a 
              href="tel:0352042001"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-tasty-terracotta hover:bg-tasty-terracotta-dark text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap group"
            >
              <Icon icon="mdi:phone" className="text-sm sm:text-base text-white group-hover:rotate-12 transition-transform duration-300 shrink-0" />
              <span className="font-bold tracking-tight hidden sm:inline">035 204 2001</span>
              <span className="font-bold tracking-tight sm:hidden text-xs">Call</span>
            </motion.a>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-tasty-charcoal hover:bg-tasty-terracotta-light transition-colors"
              aria-label="Toggle menu"
            >
              <Icon icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"} className="text-xl sm:text-2xl" />
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
              className="md:hidden mt-2 max-w-7xl mx-auto bg-[#FDFBF7] rounded-3xl p-5 shadow-xl flex flex-col gap-3.5 border border-tasty-terracotta/20"
            >
              <a 
                href="#hero" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-tasty-charcoal hover:text-tasty-terracotta"
              >
                Home
              </a>
              <a 
                href="#menu" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-tasty-charcoal hover:text-tasty-terracotta"
              >
                Menu
              </a>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenCustomizer(); }}
                className="text-left text-base font-semibold text-tasty-terracotta"
              >
                Craft Custom Bowl
              </button>
              <a 
                href="#story" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-tasty-charcoal hover:text-tasty-terracotta"
              >
                Our Story
              </a>
              <a 
                href="#delivery" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-tasty-charcoal hover:text-tasty-terracotta"
              >
                Location & Opening Hours
              </a>
              <div className="pt-3 border-t border-tasty-terracotta/15 flex flex-col gap-2.5">
                <button
                  onClick={() => { setMobileMenuOpen(false); setShareModalOpen(true); }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-tasty-bg-warm text-tasty-charcoal font-medium text-sm border border-tasty-terracotta/20"
                >
                  <Icon icon="mdi:share-variant" />
                  <span>Share Website</span>
                </button>
                <a 
                  href="tel:0352042001"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-tasty-terracotta text-white font-semibold text-sm shadow-sm whitespace-nowrap"
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
