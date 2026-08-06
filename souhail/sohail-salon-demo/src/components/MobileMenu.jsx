/*
 * MobileMenu Component - Enhanced Design
 * 
 * Improvements:
 * - Modern drawer design with better spacing
 * - Gold active state for current page
 * - Smooth hover effects
 * - Clear close button (X) with hover
 * - Better line-height and readability
 * - Enhanced CTA button styling
 * - RTL support maintained
 */

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

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
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] sm:w-[320px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#C9A961', fontFamily: 'Cairo, sans-serif' }}>
              Sohail Khoury
            </h2>
            <p className="text-xs text-gray-600 mt-1">Luxury Hair Salon</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close Menu"
          >
            <FaTimes className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-6">
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block text-lg font-semibold py-3 px-5 rounded-xl transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-[#C9A961]/10 to-[#C9A961]/5 text-[#C9A961] border-r-4'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#C9A961]'
                  }`}
                  style={{
                    fontFamily: 'Cairo, sans-serif',
                    borderColor: location.pathname === link.path ? '#C9A961' : 'transparent'
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link
            to="/book"
            className="block mt-8 text-center px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
              color: '#FFFFFF',
              fontFamily: 'Cairo, sans-serif',
              boxShadow: '0 4px 15px rgba(201, 169, 97, 0.3)'
            }}
          >
            احجز موعد
          </Link>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
