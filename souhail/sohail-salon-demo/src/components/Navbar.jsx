/*
 * Navbar Component - Enhanced Mobile Support
 * 
 * Improvements:
 * - Fixed header height (h-16 sm:h-20) for consistency
 * - Better padding and spacing on mobile
 * - Enhanced shadow on scroll
 * - Improved logo sizing for mobile
 * - Better button hover effects
 * - RTL support maintained
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import MobileMenu from './MobileMenu';
import logoImage from '../assets/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'العرايس', path: '/brides' },
    { name: 'الصبغات', path: '/hair-color' },
    { name: 'الوصلات', path: '/extensions' },
    { name: 'المعرض', path: '/gallery' },
    { name: 'اتصل بنا', path: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#FAF7F2]/98 backdrop-blur-lg shadow-xl' 
            : 'bg-white/90 backdrop-blur-sm shadow-md'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-20">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <img 
                src={logoImage} 
                alt="Sohail Khoury Logo" 
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[15px] xl:text-base font-semibold transition-all duration-300 relative py-2 ${
                    location.pathname === link.path
                      ? 'text-[#C9A961]'
                      : 'text-gray-700 hover:text-[#C9A961]'
                  }`}
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 right-0 h-0.5 bg-[#C9A961] transition-all duration-300 ${
                      location.pathname === link.path ? 'w-full' : 'w-0 hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* CTA + Mobile Menu */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* CTA Button - Hidden on small mobile */}
              <Link
                to="/book"
                className="hidden md:flex items-center justify-center px-5 lg:px-6 py-2.5 lg:py-3 rounded-xl text-sm lg:text-base font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  boxShadow: '0 4px 15px rgba(201, 169, 97, 0.3)'
                }}
              >
                احجز موعد
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Open Menu"
              >
                <FaBars className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Navbar;
