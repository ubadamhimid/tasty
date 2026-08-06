import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, switchLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    switchLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.rooms'), path: '/rooms' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? 'glass-header-hero py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between">
          
          {/* Logo - Left Aligned */}
          <Link to="/" className="flex-shrink-0 group transition-all duration-500">
            <img
              src="/images/logo.png"
              alt="Royal Semiramis Hotel"
              className={`object-contain transition-all duration-700 ${
                isScrolled ? 'h-14' : 'h-20'
              } drop-shadow-2xl`}
              style={{ filter: 'brightness(1.1) saturate(1.2)' }}
            />
          </Link>

          {/* Desktop Navigation Links - Center */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`luxury-link text-base uppercase tracking-[0.15em] font-bold transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-gold-500 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                    : isScrolled
                    ? 'text-charcoal-800 hover:text-gold-600 drop-shadow-none'
                    : 'text-white hover:text-gold-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]'
                }`}
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Hotel History Link - Separate anchor for hash navigation */}
            <a
              href="/#heritage"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname !== '/') {
                  window.location.href = '/#heritage';
                } else {
                  document.getElementById('heritage')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`luxury-link text-base uppercase tracking-[0.15em] font-bold transition-all duration-300 ${
                isScrolled
                  ? 'text-charcoal-800 hover:text-gold-600 drop-shadow-none'
                  : 'text-white hover:text-gold-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]'
              }`}
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              {language === 'ar' ? 'تاريخ الفندق' : 'Hotel History'}
            </a>
          </div>

          {/* Right Side: Language + Book Now + Hamburger */}
          <div className="flex items-center gap-5">
            
            {/* Language Switcher - Minimal */}
            <button
              onClick={toggleLanguage}
              className={`text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
                isScrolled 
                  ? 'text-charcoal-700 hover:text-gold-600' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>

            {/* Book Now CTA - Desktop Only - Adaptive Style */}
            <Link
              to="/contact"
              className={`hidden md:inline-block transition-all duration-300 ${
                isScrolled 
                  ? 'btn-gold text-white' 
                  : 'btn-luxury-outline'
              }`}
            >
              {language === 'en' ? 'Book Now' : 'احجز الآن'}
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden flex flex-col gap-1.5 transition-all duration-300 ${
                isScrolled ? 'text-charcoal-800' : 'text-white/90'
              }`}
              aria-label="Open Menu"
            >
              <span className="w-7 h-0.5 bg-current transition-all"></span>
              <span className="w-7 h-0.5 bg-current transition-all"></span>
              <span className="w-7 h-0.5 bg-current transition-all"></span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Dark Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer - LUXURY FULL-SCREEN REDESIGN */}
      <div
        className={`fixed top-0 ${language === 'ar' ? 'left-0' : 'right-0'} h-full w-full max-w-sm bg-gradient-to-b from-[#2A2A2A] via-[#252525] to-[#1F1F1F] text-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out ${
          isMobileMenuOpen
            ? 'translate-x-0'
            : language === 'ar'
            ? '-translate-x-full'
            : 'translate-x-full'
        }`}
        style={{ 
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex flex-col h-full relative">
          
          {/* 1️⃣ TOP AREA - Logo + Close Button */}
          <div className="relative pt-8 pb-6 px-6 border-b border-gold-500/20">
            
            {/* Close Button - Top Left (Always Visible) */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="absolute top-8 left-6 text-ivory-200 hover:text-white transition-all duration-300 p-2 hover:bg-white/5 rounded-lg group"
              aria-label={language === 'ar' ? 'إغلاق القائمة' : 'Close Menu'}
            >
              <svg className="w-7 h-7 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Hotel Logo - Centered */}
            <div className="flex justify-center pt-2">
              <img 
                src="/images/logo.png" 
                alt="Royal Semiramis Hotel" 
                className="h-14 opacity-95 drop-shadow-lg"
                style={{ filter: 'brightness(1.1) saturate(1.15)' }}
              />
            </div>
          </div>

          {/* 2️⃣ MAIN NAV LINKS - Large Vertical List */}
          <nav className="flex-1 px-6 py-10 space-y-2 overflow-y-auto">
            
            {/* Home */}
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-4 px-5 rounded-lg text-xl font-light tracking-wide transition-all duration-300 ${
                location.pathname === '/'
                  ? 'text-gold-400 bg-gold-500/10 border-r-2 border-gold-400'
                  : 'text-ivory-100 hover:text-white hover:bg-white/5'
              }`}
              style={{ fontFamily: language === 'ar' ? 'Tajawal' : 'Inter' }}
            >
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>

            {/* Rooms & Suites */}
            <Link 
              to="/rooms" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-4 px-5 rounded-lg text-xl font-light tracking-wide transition-all duration-300 ${
                location.pathname === '/rooms'
                  ? 'text-gold-400 bg-gold-500/10 border-r-2 border-gold-400'
                  : 'text-ivory-100 hover:text-white hover:bg-white/5'
              }`}
              style={{ fontFamily: language === 'ar' ? 'Tajawal' : 'Inter' }}
            >
              {language === 'ar' ? 'الغرف والأجنحة' : 'Rooms & Suites'}
            </Link>

            {/* Restaurants (Link to home with scroll) */}
            <a 
              href="/#services" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-4 px-5 rounded-lg text-xl font-light tracking-wide text-ivory-100 hover:text-white hover:bg-white/5 transition-all duration-300"
              style={{ fontFamily: language === 'ar' ? 'Tajawal' : 'Inter' }}
            >
              {language === 'ar' ? 'المطاعم والخدمات' : 'Restaurants & Services'}
            </a>

            {/* Heritage/History (Link to home with scroll to heritage section) */}
            <a 
              href="/#heritage" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-4 px-5 rounded-lg text-xl font-light tracking-wide text-ivory-100 hover:text-white hover:bg-white/5 transition-all duration-300"
              style={{ fontFamily: language === 'ar' ? 'Tajawal' : 'Inter' }}
            >
              {language === 'ar' ? 'تاريخ الفندق' : 'Hotel History'}
            </a>

            {/* Contact */}
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-4 px-5 rounded-lg text-xl font-light tracking-wide transition-all duration-300 ${
                location.pathname === '/contact'
                  ? 'text-gold-400 bg-gold-500/10 border-r-2 border-gold-400'
                  : 'text-ivory-100 hover:text-white hover:bg-white/5'
              }`}
              style={{ fontFamily: language === 'ar' ? 'Tajawal' : 'Inter' }}
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Link>

            {/* Divider */}
            <div className="pt-6 pb-2">
              <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
            </div>

            {/* Language Switch - Simple & Elegant */}
            <div className="pt-4 pb-2">
              <p className="text-xs text-ivory-400 uppercase tracking-widest mb-3 px-5">
                {language === 'ar' ? 'اللغة' : 'Language'}
              </p>
              <div className="flex items-center justify-center gap-4 px-5">
                <button
                  onClick={() => {
                    if (language !== 'ar') toggleLanguage();
                  }}
                  className={`flex-1 py-3 rounded-lg font-light transition-all duration-300 ${
                    language === 'ar'
                      ? 'text-gold-400 bg-gold-500/15 border border-gold-400/40'
                      : 'text-ivory-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => {
                    if (language !== 'en') toggleLanguage();
                  }}
                  className={`flex-1 py-3 rounded-lg font-light transition-all duration-300 ${
                    language === 'en'
                      ? 'text-gold-400 bg-gold-500/15 border border-gold-400/40'
                      : 'text-ivory-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

          </nav>

          {/* 3️⃣ CTA AREA - Sticky Bottom Button */}
          <div className="sticky bottom-0 p-6 bg-gradient-to-t from-[#1F1F1F] via-[#252525] to-transparent border-t border-gold-500/20">
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full py-5 bg-gradient-to-r from-gold-600 to-gold-500 text-center text-black font-bold text-lg tracking-wide rounded-2xl hover:from-gold-500 hover:to-gold-400 active:scale-95 transition-all duration-300 shadow-xl shadow-gold-500/30"
            >
              {language === 'ar' ? 'احجز الآن' : 'Book Now'}
            </Link>
          </div>

          {/* Decorative Subtle Gold Glow */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
