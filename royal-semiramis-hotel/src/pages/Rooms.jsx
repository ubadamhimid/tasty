import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaWifi, FaTv, FaGlassMartini, FaMountain, FaBed } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Rooms = () => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const rooms = [
    {
      id: 1,
      ...t('rooms.deluxe'),
      image: '/images/deluxe_room_1769598768701.png',
      price: 150,
      amenities: [
        { icon: FaBed, text: 'King Bed' },
        { icon: FaWifi, text: 'Free WiFi' },
        { icon: FaTv, text: '55" Smart TV' },
        { icon: FaGlassMartini, text: 'Minibar' },
        { icon: FaMountain, text: 'City View' },
      ],
    },
    {
      id: 2,
      ...t('rooms.executive'),
      image: '/images/executive_suite_1769598787155.png',
      price: 250,
      amenities: [
        { icon: FaBed, text: 'King Bed + Sofa' },
        { icon: FaWifi, text: 'Free WiFi' },
        { icon: FaTv, text: '65" Smart TV' },
        { icon: FaGlassMartini, text: 'Premium Minibar' },
        { icon: FaMountain, text: 'Panoramic View' },
      ],
    },
    {
      id: 3,
      ...t('rooms.royal'),
      image: '/images/royal_suite_1769598812387.png',
      price: 500,
      amenities: [
        { icon: FaBed, text: 'King Bed + Living Room' },
        { icon: FaWifi, text: 'Free WiFi' },
        { icon: FaTv, text: '75" Smart TV' },
        { icon: FaGlassMartini, text: 'Luxury Bar' },
        { icon: FaMountain, text: 'Skyline View' },
      ],
    },
  ];

  return (
    <div>
      {/* ULTRA-LUXURY ASYMMETRIC EDITORIAL HERO */}
      <section className="relative h-[95vh] min-h-[700px] overflow-hidden">
        
        {/* Cinematic Background with Slow Zoom */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
            style={{
              backgroundImage: `url('/images/hotel_interior_hero_1769598927302.png')`,
              animation: 'slowZoom 20s ease-out infinite alternate'
            }}
          />
        </div>

        {/* Warm Charcoal Overlay - Not Black */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 via-charcoal-800/50 to-charcoal-900/70" />

        {/* Asymmetric Editorial Content - Off-Center */}
        <div className="relative h-full flex items-center px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-3xl" style={{ marginLeft: language === 'ar' ? 'auto' : '0', marginRight: language === 'ar' ? '0' : 'auto' }}>
              
              {/* Subtle 5-Star Icons - Low Opacity */}
              <div className="flex gap-2 mb-8 opacity-30">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-gold-400 rounded-full"></div>
                ))}
              </div>

              {/* Large Serif Title - Fade + Rise Animation */}
              <h1 
                className="font-serif text-6xl md:text-7xl lg:text-8xl text-ivory-100 leading-tight mb-6 animate-fade-in-up"
                style={{
                  fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif',
                  letterSpacing: '0.03em',
                  fontWeight: language === 'ar' ? 700 : 400,
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)'
                }}
              >
                {language === 'ar' ? 'الغرف والأجنحة' : 'Rooms & Suites'}
              </h1>

              {/* Thin Gold Divider Line */}
              <div className="w-24 h-px bg-gold-400 mb-8"></div>

              {/* Calm Subtitle - Wide Letter Spacing */}
              <p 
                className="text-xl md:text-2xl text-ivory-200/90 font-light leading-relaxed max-w-2xl animate-fade-in-up"
                style={{
                  letterSpacing: '0.08em',
                  lineHeight: '1.8',
                  textShadow: '0 2px 20px rgba(0,0,0,0.6)',
                  animationDelay: '0.2s'
                }}
              >
                {language === 'ar' 
                  ? 'اكتشف ملاذك المثالي من الراحة والفخامة'
                  : 'Discover your perfect sanctuary of comfort and luxury'}
              </p>

            </div>
          </div>
        </div>

        {/* Scroll Indicator - Minimal */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-40 animate-bounce-slow">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-ivory-200 to-transparent"></div>
        </div>

      </section>

      {/* Add Keyframes for Slow Zoom */}
      <style jsx>{`
        @keyframes slowZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-slow-zoom {
          animation: slowZoom 20s ease-out infinite alternate;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Rooms Grid */}
      <section ref={sectionRef} className="py-24 bg-ivory-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-gold-glow transition-all duration-700 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-gold-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase">
                    Luxury
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-charcoal-800 mb-3 group-hover:text-gold-600 transition-colors">
                    {room.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                    {room.desc}
                  </p>

                  {/* Amenities */}
                  <div className="mb-6 space-y-2">
                    {room.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                        <amenity.icon className="text-gold-600" />
                        <span>{amenity.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('rooms.from')}</p>
                        <p className="text-3xl font-bold text-gold-600">
                          ${room.price}
                          <span className="text-sm text-gray-600 font-normal">
                            {t('rooms.perNight')}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/contact"
                      className="block btn-gold text-center text-sm py-3"
                    >
                      {t('rooms.bookRoom')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rooms;
