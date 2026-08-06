import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FaWhatsapp, FaInstagram, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { SiThreads } from 'react-icons/si';
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const quickLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'العرائس', path: '/brides' },
    { name: 'المعرض', path: '/gallery' },
    { name: 'اتصل بنا', path: '/contact' }
  ];

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
    >
      {/* Strong Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, 
              #0A0D14 0%, 
              #141821 25%, 
              #1A1D2E 50%, 
              #141821 75%, 
              #0A0D14 100%
            )
          `
        }}
      />

      {/* Geometric Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(201, 169, 97, 0.1) 35px,
              rgba(201, 169, 97, 0.1) 70px
            )
          `
        }}
      />

      {/* Glowing Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-20" style={{
        background: 'radial-gradient(circle, #C9A961 0%, transparent 70%)',
        filter: 'blur(100px)'
      }} />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-15" style={{
        background: 'radial-gradient(circle, #C9A961 0%, transparent 70%)',
        filter: 'blur(100px)'
      }} />

      {/* Top Gold Border */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{
        background: 'linear-gradient(90deg, transparent 0%, #C9A961 50%, transparent 100%)',
        boxShadow: '0 0 20px rgba(201, 169, 97, 0.5)'
      }} />

      {/* Main Content */}
      <div
        className={`relative max-w-7xl mx-auto px-6 lg:px-16 py-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Top Section - Brand Centered */}
        <div className="text-center mb-16">
          {/* Logo */}
          <div className="inline-block mb-8">
            <div
              className="relative p-8 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F1E8 100%)',
                boxShadow: `
                  0 10px 40px rgba(201, 169, 97, 0.4),
                  0 0 0 3px #C9A961,
                  inset 0 0 30px rgba(201, 169, 97, 0.1)
                `,
                border: '1px solid rgba(201, 169, 97, 0.3)'
              }}
            >
              <img
                src={logo}
                alt="Souhail Khoury"
                className="w-28 h-28 object-contain"
                style={{ filter: 'brightness(1) contrast(1.15) saturate(1.1)' }}
              />
            </div>
          </div>

          {/* Brand Name */}
          <h2
            className="text-5xl lg:text-6xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #C9A961 50%, #B8935A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Cairo, sans-serif',
              letterSpacing: '0.02em',
              textShadow: '0 4px 20px rgba(201, 169, 97, 0.3)'
            }}
          >
            Souhail Khoury
          </h2>

          {/* Tagline */}
          <p className="text-xl text-gray-300 font-light tracking-wide mb-8">
            Luxury Hair Salon
          </p>

          {/* Decorative Line */}
          <div className="flex justify-center">
            <div className="w-32 h-px" style={{
              background: 'linear-gradient(90deg, transparent, #C9A961, transparent)'
            }} />
          </div>
        </div>

        {/* Main Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16">
          
          {/* Column 1: Quick Links */}
          <div className="text-center">
            <h3
              className="text-2xl font-bold mb-8 uppercase tracking-wider"
              style={{ color: '#C9A961', fontFamily: 'Cairo, sans-serif' }}
            >
              روابط سريعة
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group inline-block text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium relative"
                  >
                    <span className="relative px-4 py-2 block">
                      {link.name}
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 w-0 group-hover:w-full mx-auto transition-all duration-300"
                        style={{ background: '#C9A961' }}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div className="text-center">
            <h3
              className="text-2xl font-bold mb-8 uppercase tracking-wider"
              style={{ color: '#C9A961', fontFamily: 'Cairo, sans-serif' }}
            >
              تواصل معنا
            </h3>
            <div className="space-y-5">
              {/* Phone */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, rgba(201, 169, 97, 0.2), rgba(201, 169, 97, 0.05))',
                  border: '2px solid rgba(201, 169, 97, 0.3)'
                }}>
                  <FaPhone className="text-[#C9A961] text-lg" />
                </div>
                <a
                  href="tel:+963991858687"
                  className="text-gray-300 hover:text-[#C9A961] transition-colors text-lg font-medium"
                  dir="ltr"
                >
                  +963 991 85 86 87
                </a>
              </div>

              {/* Location */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, rgba(201, 169, 97, 0.2), rgba(201, 169, 97, 0.05))',
                  border: '2px solid rgba(201, 169, 97, 0.3)'
                }}>
                  <FaMapMarkerAlt className="text-[#C9A961] text-lg" />
                </div>
                <span className="text-gray-300 text-lg font-medium">دمشق، سوريا</span>
              </div>

              {/* Hours */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, rgba(201, 169, 97, 0.2), rgba(201, 169, 97, 0.05))',
                  border: '2px solid rgba(201, 169, 97, 0.3)'
                }}>
                  <FaClock className="text-[#C9A961] text-lg" />
                </div>
                <span className="text-gray-300 text-lg font-medium">السبت - الخميس: 10 ص - 10 م</span>
              </div>
            </div>
          </div>

          {/* Column 3: Social Media */}
          <div className="text-center">
            <h3
              className="text-2xl font-bold mb-8 uppercase tracking-wider"
              style={{ color: '#C9A961', fontFamily: 'Cairo, sans-serif' }}
            >
              تابعونا
            </h3>
            <div className="flex justify-center gap-5">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/souhail_khoury/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(201, 169, 97, 0.15), rgba(201, 169, 97, 0.05))',
                  border: '2px solid rgba(201, 169, 97, 0.4)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
                aria-label="Instagram"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C9A961';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(201, 169, 97, 0.6), 0 0 30px rgba(201, 169, 97, 0.4)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 169, 97, 0.3), rgba(201, 169, 97, 0.15))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 97, 0.4)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 169, 97, 0.15), rgba(201, 169, 97, 0.05))';
                }}
              >
                <FaInstagram className="text-2xl text-gray-300 group-hover:text-[#C9A961] transition-all duration-300" />
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.com/@souhail_khoury"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(201, 169, 97, 0.15), rgba(201, 169, 97, 0.05))',
                  border: '2px solid rgba(201, 169, 97, 0.4)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
                aria-label="Threads"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C9A961';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(201, 169, 97, 0.6), 0 0 30px rgba(201, 169, 97, 0.4)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 169, 97, 0.3), rgba(201, 169, 97, 0.15))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 97, 0.4)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 169, 97, 0.15), rgba(201, 169, 97, 0.05))';
                }}
              >
                <SiThreads className="text-2xl text-gray-300 group-hover:text-[#C9A961] transition-all duration-300" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/963991858687"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15), rgba(37, 211, 102, 0.05))',
                  border: '2px solid rgba(37, 211, 102, 0.4)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
                aria-label="WhatsApp"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#25D366';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(37, 211, 102, 0.6), 0 0 30px rgba(37, 211, 102, 0.4)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37, 211, 102, 0.3), rgba(37, 211, 102, 0.15))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.4)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37, 211, 102, 0.15), rgba(37, 211, 102, 0.05))';
                }}
              >
                <FaWhatsapp className="text-2xl text-gray-300 group-hover:text-[#25D366] transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="h-px mb-10" style={{
          background: 'linear-gradient(90deg, transparent, rgba(201, 169, 97, 0.5), transparent)',
          boxShadow: '0 0 10px rgba(201, 169, 97, 0.3)'
        }} />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <p className="text-gray-400 font-medium">
            © {currentYear} Souhail Khoury — جميع الحقوق محفوظة
          </p>
          <div className="flex gap-8">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-[#C9A961] transition-colors font-medium"
            >
              سياسة الخصوصية
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-[#C9A961] transition-colors font-medium"
            >
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent 0%, #C9A961 50%, transparent 100%)',
        boxShadow: '0 0 20px rgba(201, 169, 97, 0.5)'
      }} />
    </footer>
  );
};

export default Footer;
