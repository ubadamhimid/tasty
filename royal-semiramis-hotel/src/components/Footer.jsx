import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPhone, mdiEmail, mdiMapMarker, mdiFacebook, mdiInstagram } from '@mdi/js';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);
  const { language, t } = useLanguage();

  // Fade-up animation on scroll
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

  const contactInfo = [
    {
      icon: mdiPhone,
      text: '+963 11 123 4567',
      label: 'الهاتف'
    },
    {
      icon: mdiEmail,
      text: 'info@royalsemiramis.sy',
      label: 'البريد الإلكتروني'
    },
    {
      icon: mdiMapMarker,
      text: 'دمشق، سوريا',
      label: 'الموقع'
    }
  ];

  const quickLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الغرف والأجنحة', path: '/rooms' },
    { name: 'اتصل بنا', path: '/contact' }
  ];

  const socialMedia = [
    { icon: mdiInstagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: mdiFacebook, url: 'https://facebook.com', label: 'Facebook' }
  ];

  return (
    <footer
      ref={footerRef}
      className={`bg-gradient-to-b from-ivory-50 to-ivory-100 text-charcoal-800 pt-20 pb-8 transition-all duration-1000 border-t border-gold-400/20 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 xl:px-20">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          
          {/* Contact Info Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gold-600 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                معلومات الاتصال
              </h3>
              <div className="w-12 h-px bg-gold-400 mb-6"></div>
            </div>
            <div className="space-y-5">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center flex-shrink-0 border border-gold-200/50 group-hover:border-gold-400 group-hover:shadow-lg group-hover:shadow-gold-500/20 group-hover:scale-105 transition-all duration-300">
                    <Icon path={item.icon} size={1} className="text-gold-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{item.label}</p>
                    <p className="text-base text-charcoal-800 font-medium group-hover:text-gold-600 transition-colors">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo & Description Section */}
          <div className="flex flex-col items-center text-center space-y-7">
            <Link to="/" className="group">
              <img
                src="/images/logo.png"
                alt="Royal Semiramis Hotel"
                className="h-24 w-auto object-contain group-hover:opacity-80 transition-opacity invert brightness-0"
              />
            </Link>
            <h2 
              className="text-4xl text-gold-600 italic tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Royal Semiramis
            </h2>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
              ))}
            </div>
            <p 
              className="text-gray-600 leading-relaxed max-w-sm text-sm px-4"
              style={{ fontFamily: "'Cairo', 'Inter', sans-serif", lineHeight: '1.8' }}
            >
              معلم من معالم الضيافة الفاخرة في دمشق، يقدم خدمة عالمية المستوى وأناقة معاصرة منذ عام 2020.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gold-600 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                روابط سريعة
              </h3>
              <div className="w-12 h-px bg-gold-400 mb-6"></div>
            </div>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-3 text-base text-charcoal-800 hover:text-gold-600 transition-all duration-300"
                    style={{ fontFamily: "'Cairo', 'Inter', sans-serif" }}
                  >
                    <div className="w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="group-hover:translate-x-2 inline-block transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Social Media Section */}
        <div className="text-center mb-12">
          <h3 className="text-xl font-bold text-charcoal-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            تابعنا
          </h3>
          <div className="flex justify-center gap-5">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-14 h-14 rounded-full bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center border-2 border-gold-200/50 hover:bg-gradient-to-br hover:from-gold-500 hover:to-gold-600 hover:border-gold-500 hover:shadow-xl hover:shadow-gold-500/40 hover:scale-110 transition-all duration-300"
                aria-label={social.label}
              >
                <Icon 
                  path={social.icon} 
                  size={1.3} 
                  className="text-gold-600 group-hover:text-white transition-colors duration-300"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Elegant Divider with Decorative Elements */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"></div>
          <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"></div>
        </div>

        {/* Copyright Bar */}
        <div className="text-center">
          <p 
            className="text-sm text-gray-500"
            style={{ fontFamily: "'Cairo', 'Inter', sans-serif" }}
          >
            © 2026 فندق رويال سميراميس. جميع الحقوق محفوظة.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

