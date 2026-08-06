import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaChevronRight, FaStar, FaUsers, FaConciergeBell, FaUtensils, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t, language } = useLanguage();
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const headingY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const observers = {};

    Object.keys(sectionRefs.current).forEach((key) => {
      if (sectionRefs.current[key]) {
        observers[key] = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => ({ ...prev, [key]: true }));
            }
          },
          { threshold: 0.1 }
        );
        observers[key].observe(sectionRefs.current[key]);
      }
    });

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, []);

  const rooms = [
    {
      id: 1,
      image: '/images/deluxe_room_1769598768701.png',
      ...t('rooms.deluxe'),
    },
    {
      id: 2,
      image: '/images/executive_suite_1769598787155.png',
      ...t('rooms.executive'),
    },
    {
      id: 3,
      image: '/images/royal_suite_1769598812387.png',
      ...t('rooms.royal'),
    },
  ];

  const testimonials = [
    t('testimonials.testimonial1'),
    t('testimonials.testimonial2'),
    t('testimonials.testimonial3'),
  ];

  return (
    <div className="bg-white text-charcoal-800 selection:bg-gold-500 selection:text-white">
      {/* ===== ULTRA-LUXURY CINEMATIC HERO SECTION ===== */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Cinematic Background Image with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: headingY }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center animate-cinematic-zoom"
            style={{ backgroundImage: `url('/images/hero_luxury_damascus.png')` }}
          />
        </motion.div>

        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-10" />
        
        {/* Subtle Vignette Effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 z-10" />

        {/* Hero Content - Center Aligned */}
        <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center max-w-5xl"
          >
            
            {/* NEW ELEGANT STARS DESIGN - Horizontal Gold Bar */}
            <div className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent rounded-full border border-gold-400/30 backdrop-blur-sm mb-8">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className="text-gold-400 text-xl star-animated" 
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.6))',
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>

            {/* NEW PREMIUM TEXT DESIGN */}
            <div className="space-y-5 max-w-4xl">
              
              {/* Main Headline - Refined Size */}
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight tracking-wide">
                {language === 'ar' ? (
                  <span 
                    className="block bg-gradient-to-r from-white via-gold-100 to-white bg-clip-text text-transparent"
                    style={{ 
                      textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                      fontFamily: 'Tajawal, serif',
                      fontWeight: 700,
                      WebkitTextStroke: '0.5px rgba(255,255,255,0.3)'
                    }}
                  >
                    في قلب العاصمة دمشق
                  </span>
                ) : (
                  <span 
                    className="block bg-gradient-to-r from-white via-gold-100 to-white bg-clip-text text-transparent"
                    style={{ 
                      textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                      fontWeight: 400,
                      letterSpacing: '0.02em',
                      WebkitTextStroke: '0.5px rgba(255,255,255,0.2)'
                    }}
                  >
                    In The Heart of Damascus
                  </span>
                )}
              </h1>

              {/* Elegant Decorative Line */}
              <div className="flex items-center justify-center gap-4 py-3">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-gold-500"></div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="w-16 h-0.5 bg-gradient-to-l from-transparent via-gold-400 to-gold-500"></div>
              </div>

              {/* Secondary Text - Refined Size */}
              <p 
                className="text-xl md:text-2xl text-white/95 font-light leading-relaxed max-w-3xl mx-auto"
                style={{ 
                  textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.15)',
                  fontFamily: language === 'ar' ? 'Tajawal, sans-serif' : 'Playfair Display, serif',
                  fontWeight: 300,
                  fontStyle: language === 'ar' ? 'normal' : 'italic',
                  letterSpacing: '0.02em'
                }}
              >
                {language === 'ar'
                  ? 'حيث تلتقي الفخامة بالضيافة العربية الأصيلة'
                  : 'Where Luxury Meets Authentic Arabian Hospitality'}
              </p>

            </div>

          </motion.div>

        </div>
      </section>

      {/* Rooms & Suites Preview */}
      <section
        ref={(el) => (sectionRefs.current.rooms = el)}
        className="py-24 bg-ivory-200 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-1/4 -right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal-800 mb-4">
              {t('rooms.title')}
            </h2>
            <p className="text-lg text-gray-600 font-light italic">
              {t('rooms.subtitle')}
            </p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-6" />
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className={`group relative bg-ivory-500 rounded-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 shadow-soft hover:shadow-gold-glow ${
                  visibleSections.rooms ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Room Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

                  {/* Gold Badge */}
                  <div className="absolute -bottom-4 right-1/2 transform translate-x-1/2 w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center shadow-md z-10">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-charcoal-800 mb-3 mt-2 group-hover:text-gold-600 transition-colors">
                    {room.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm mb-4">
                    {room.desc}
                  </p>

                  {/* View Details Link */}
                  <Link
                    to="/rooms"
                    className="inline-flex items-center gap-2 text-gold-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span>{t('rooms.viewDetails')}</span>
                    <FaChevronRight
                      className={`w-3 h-3 group-hover:${
                        language === 'ar' ? 'translate-x-1' : '-translate-x-1'
                      } transition-transform`}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dining Section */}
      <section
        ref={(el) => (sectionRefs.current.dining = el)}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal-800 mb-4">
              {t('dining.title')}
            </h2>
            <p className="text-lg text-gray-600 font-light italic">
              {t('dining.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Toabel Restaurant */}
            <div
              className={`group relative overflow-hidden rounded-3xl shadow-lg transition-all duration-700 hover:shadow-2xl ${
                visibleSections.dining ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="relative h-96 overflow-hidden">
                <img
                  src="/images/dining_toabel_1769598831031.png"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Toabel Restaurant"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-gold-900/70 transition-all" />
              </div>
              <div className="absolute bottom-0 right-0 left-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-gold-200 transition-colors">
                  {t('dining.toabel.name')}
                </h3>
                <p className="text-sm opacity-90 mb-4">{t('dining.toabel.desc')}</p>
                <div className="flex items-center gap-2 text-gold-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">{t('dining.exploreMenu')}</span>
                  <FaChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Marco Polo Restaurant */}
            <div
              className={`group relative overflow-hidden rounded-3xl shadow-lg transition-all duration-700 hover:shadow-2xl ${
                visibleSections.dining ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="relative h-96 overflow-hidden">
                <img
                  src="/images/dining_marco_polo_1769598858428.png"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Marco Polo Restaurant"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-gold-900/70 transition-all" />
              </div>
              <div className="absolute bottom-0 right-0 left-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-gold-200 transition-colors">
                  {t('dining.marcoPolo.name')}
                </h3>
                <p className="text-sm opacity-90 mb-4">{t('dining.marcoPolo.desc')}</p>
                <div className="flex items-center gap-2 text-gold-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">{t('dining.exploreMenu')}</span>
                  <FaChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooftop Pool Section */}
      <section
        ref={(el) => (sectionRefs.current.rooftop = el)}
        className="relative h-[600px] overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/rooftop_pool_1769598879898.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/50" />

        <div className="relative h-full flex items-center justify-center px-6">
          <div
            className={`glass-panel rounded-3xl p-8 md:p-12 max-w-2xl text-center transition-all duration-1000 ${
              visibleSections.rooftop ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal-800 mb-4">
              {t('rooftop.title')}
            </h2>
            <p className="text-xl text-gray-700 mb-6 font-light">
              {t('rooftop.subtitle')}
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('rooftop.desc')}
            </p>
            <button className="btn-gold-outline">
              {t('rooftop.discover')}
            </button>
          </div>
        </div>
      </section>

      {/* Events & Ballrooms - ULTRA-LUXURY EDITORIAL REDESIGN */}
      <section
        ref={(el) => (sectionRefs.current.events = el)}
        className="relative py-32 bg-gradient-to-b from-white via-ivory-50 to-white overflow-hidden"
      >
        {/* Subtle Background Ambience */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/3 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-charcoal-900/3 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* MODERN SPLIT-LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            
            {/* LEFT SIDE: REFINED TEXT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={visibleSections.events ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Premium Heading */}
              <div className="space-y-4">
                <h2 className="font-serif text-5xl lg:text-6xl text-charcoal-900 leading-tight tracking-wide">
                  {language === 'ar' ? (
                    <>
                      قاعات احتفالات
                      <span className="block text-gold-600 mt-2">استثنائية</span>
                    </>
                  ) : (
                    <>
                      Exceptional Venues
                      <span className="block text-gold-600 mt-2">for Remarkable Moments</span>
                    </>
                  )}
                </h2>
                
                {/* Subtle Divider */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-12 h-px bg-gold-400"></div>
                  <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
                  <div className="w-12 h-px bg-gold-400"></div>
                </div>
              </div>

              {/* Refined Description */}
              <p className="text-lg text-charcoal-700 font-light leading-relaxed max-w-lg">
                {language === 'ar' 
                  ? 'استضف فعالياتك الخاصة في أجواء من الفخامة والأناقة. قاعاتنا توفر المساحة المثالية لكل مناسبة مميزة.'
                  : 'Host your special events in an atmosphere of luxury and elegance. Our grand ballrooms provide the perfect setting for every memorable occasion.'}
              </p>

              {/* Capacity Highlight */}
              <div className="inline-block bg-gold-500/10 px-6 py-3 rounded-full border border-gold-400/20">
                <p className="text-gold-700 font-semibold text-sm uppercase tracking-wider">
                  {language === 'ar' ? 'حتى 500 ضيف' : 'Up to 500 Guests'}
                </p>
              </div>

              {/* VERTICAL FEATURE LIST - LUXURY REDESIGN */}
              <div className="space-y-5 pt-4">
                {[
                  { 
                    icon: FaUsers, 
                    text: language === 'ar' ? 'قاعات احتفالات فخمة' : 'Grand Ballrooms',
                    delay: 0
                  },
                  { 
                    icon: FaChartLine, 
                    text: language === 'ar' ? 'معدات صوتية احترافية' : 'Professional AV Equipment',
                    delay: 100
                  },
                  { 
                    icon: FaUtensils, 
                    text: language === 'ar' ? 'خدمات ضيافة راقية' : 'Luxury Catering Services',
                    delay: 200
                  },
                  { 
                    icon: FaConciergeBell, 
                    text: language === 'ar' ? 'تخطيطات مرنة' : 'Flexible Layouts',
                    delay: 300
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={visibleSections.events ? { opacity: 1, x: 0 } : {}}
                    transition={{ 
                      duration: 0.8, 
                      delay: feature.delay / 1000,
                      ease: [0.22, 1, 0.36, 1] 
                    }}
                    className="flex items-center gap-5 group"
                  >
                    {/* Minimal Gold Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center border border-gold-200/50 group-hover:border-gold-400/70 group-hover:shadow-lg group-hover:shadow-gold-500/20 transition-all duration-500">
                      <feature.icon className="text-gold-600 text-lg" />
                    </div>
                    
                    {/* Feature Text */}
                    <p className="text-charcoal-800 font-medium text-base group-hover:text-gold-700 transition-colors duration-300">
                      {feature.text}
                    </p>
                    
                    {/* Subtle Divider */}
                    <div className="flex-1 h-px bg-gradient-to-r from-charcoal-200/40 to-transparent"></div>
                  </motion.div>
                ))}
              </div>

            </motion.div>

            {/* RIGHT SIDE: LAYERED CINEMATIC IMAGERY */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={visibleSections.events ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Main Image with Luxury Styling */}
              <div className="relative group">
                <img
                  src="/images/events_hall_1769598897077.png"
                  alt="Luxury Event Ballroom"
                  className="w-full h-auto rounded-3xl shadow-2xl shadow-charcoal-900/10 transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/20 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
                
                {/* Decorative Gold Accent Border */}
                <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-gold-400/20 rounded-3xl -z-10"></div>
              </div>

              {/* Floating Info Card - Optional Premium Touch */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={visibleSections.events ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gold-200/30 max-w-xs hidden lg:block"
              >
                <p className="text-charcoal-900 font-serif text-xl mb-1">
                  {language === 'ar' ? 'تجهيزات عالمية' : 'World-Class Facilities'}
                </p>
                <p className="text-charcoal-600 text-sm font-light">
                  {language === 'ar' ? 'كل ما تحتاجه لحدث مثالي' : 'Everything you need for the perfect event'}
                </p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Testimonials - ULTRA-LUXURY EDITORIAL REDESIGN */}
      <section
        ref={(el) => (sectionRefs.current.testimonials = el)}
        className="relative py-32 bg-gradient-to-b from-ivory-50 via-white to-ivory-50 overflow-hidden"
      >
        {/* Subtle Ambient Background */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-charcoal-900/3 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* PREMIUM SECTION HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={visibleSections.testimonials ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            {/* Luxury Title */}
            <h2 className="font-serif text-5xl lg:text-6xl text-charcoal-900 mb-6 leading-tight">
              {language === 'ar' ? (
                <>
                  تجارب <span className="text-gold-600">لا تُنسى</span>
                </>
              ) : (
                <>
                  Unforgettable <span className="text-gold-600">Experiences</span>
                </>
              )}
            </h2>

            {/* Refined Subtitle */}
            <p className="text-lg text-charcoal-600 font-light leading-relaxed max-w-xl mx-auto">
              {language === 'ar'
                ? 'ما يقوله ضيوفنا عن إقامتهم الفاخرة'
                : 'What our guests say about their luxury stay'}
            </p>

            {/* Subtle Divider */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-12 h-px bg-gold-400"></div>
              <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
              <div className="w-12 h-px bg-gold-400"></div>
            </div>
          </motion.div>

          {/* EDITORIAL LUXURY CARDS - HORIZONTAL SCROLL */}
          <div className="relative">
            
            {/* Cards Container - Horizontal Scroll on Mobile, Grid on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={visibleSections.testimonials ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ 
                    duration: 1.2, 
                    delay: index * 0.2,
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="group"
                >
                  {/* Premium Testimonial Card */}
                  <div className="relative h-full bg-white rounded-3xl p-10 shadow-lg shadow-charcoal-900/5 border border-charcoal-100/50 hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-2 transition-all duration-700 ease-out">
                    
                    {/* Decorative Quote Icon - Subtle */}
                    <div className="absolute top-8 right-8 text-gold-400/20 text-6xl font-serif leading-none select-none">"</div>

                    {/* Gold Star Rating - Animated */}
                    <div className="flex gap-1.5 mb-6 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={visibleSections.testimonials ? { opacity: 1, scale: 1 } : {}}
                          transition={{ 
                            duration: 0.5, 
                            delay: index * 0.2 + i * 0.1,
                            ease: [0.34, 1.56, 0.64, 1]
                          }}
                        >
                          <FaStar className="text-gold-500 text-base" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote Text - Premium Typography */}
                    <blockquote className="text-charcoal-800 text-lg font-light leading-relaxed mb-8 relative z-10 italic">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Guest Info - Elegant Layout */}
                    <div className="relative z-10 pt-6 border-t border-gold-400/20">
                      <p className="text-charcoal-900 font-semibold text-base mb-1">
                        {testimonial.name}
                      </p>
                      <p className="text-charcoal-500 text-sm font-light tracking-wide">
                        {testimonial.location}
                      </p>
                    </div>

                    {/* Subtle Hover Accent Line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  </div>
                </motion.div>
              ))}

            </div>

          </div>

          {/* Optional: Trust Badge or Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={visibleSections.testimonials ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-charcoal-500 text-sm font-light tracking-wider uppercase">
              {language === 'ar' 
                ? 'تقييمات حقيقية من ضيوفنا الكرام' 
                : 'Authentic reviews from our valued guests'}
            </p>
          </motion.div>

        </div>
      </section>

      {/* ============================================ */}
      {/* HERITAGE / HISTORY SECTION - LUXURY DOCUMENTARY STYLE */}
      {/* ============================================ */}
      <section
        id="heritage"
        ref={(el) => (sectionRefs.current.heritage = el)}
        className="py-32 bg-gradient-to-b from-ivory-50 via-ivory-100 to-ivory-50 overflow-hidden"
      >
        <div className="container mx-auto px-6">

          {/* 1️⃣ HERITAGE STATEMENT INTRO */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={visibleSections.heritage ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-4xl mx-auto mb-32"
          >
            {/* Large Serif Title */}
            <h2 
              className="text-5xl lg:text-6xl mb-6"
              style={{
                fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif',
                fontWeight: '700',
                color: '#2C2C2C',
                lineHeight: '1.3',
                letterSpacing: language === 'ar' ? '0.02em' : '0.04em'
              }}
            >
              {language === 'ar' 
                ? 'تاريخ فندق رويال سميراميس'
                : 'The Royal Semiramis Story'}
            </h2>

            {/* Subtitle */}
            <p className="text-charcoal-600 text-xl lg:text-2xl font-light mb-10" style={{ lineHeight: '1.8' }}>
              {language === 'ar'
                ? 'رحلة من العراقة إلى الفخامة الحديثة'
                : 'A Journey from Heritage to Modern Luxury'}
            </p>

            {/* Gold Divider with Center Dot */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-gold-400/70"></div>
              <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold-400/40 to-gold-400/70"></div>
            </div>
          </motion.div>

          {/* 2️⃣ VERTICAL TIMELINE STORY - Museum Style */}
          <div className="max-w-6xl mx-auto mb-32 space-y-24">
            
            {/* Timeline Item 1 - 1900s */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={visibleSections.heritage ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Text Content - Left */}
              <div className={`${language === 'ar' ? 'md:order-2 text-right' : 'text-left'}`}>
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-gold-100 to-gold-50 rounded-full mb-6 border border-gold-200/50">
                  <span className="text-gold-700 font-bold text-sm tracking-widest uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                    1900s
                  </span>
                </div>
                <h3 
                  className="text-3xl lg:text-4xl mb-4 text-charcoal-900"
                  style={{ fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif', fontWeight: '700' }}
                >
                  {language === 'ar' ? 'البدايات الأولى' : 'The Early Beginnings'}
                </h3>
                <p className="text-charcoal-600 text-lg leading-relaxed font-light">
                  {language === 'ar'
                    ? 'في قلب دمشق التاريخية، بدأت قصة فندق سميراميس كمعلم ثقافي وشاهد على عراقة المدينة وجمالها الأبدي.'
                    : 'In the heart of historic Damascus, the story of Semiramis Hotel began as a cultural landmark, witnessing the city\'s heritage and timeless beauty.'}
                </p>
              </div>

              {/* Image - Right */}
              <div className={`${language === 'ar' ? 'md:order-1' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                  <img 
                    src="/images/heritage_damascus_1900s.png" 
                    alt="Damascus 1900s" 
                    className="w-full h-80 object-cover"
                  />
                  {/* Subtle Sepia Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-amber-900/30 pointer-events-none"></div>
                </div>
              </div>
            </motion.div>

            {/* Timeline Connector Dot */}
            <div className="flex justify-center">
              <div className="w-3 h-3 bg-gold-400 rounded-full shadow-lg shadow-gold-500/50"></div>
            </div>

            {/* Timeline Item 2 - 1950s */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={visibleSections.heritage ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Image - Left */}
              <div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                  <img 
                    src="/images/heritage_hotel_1950s.png" 
                    alt="Hotel 1950s Golden Era" 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-800/10 to-amber-800/25 pointer-events-none"></div>
                </div>
              </div>

              {/* Text Content - Right */}
              <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-gold-100 to-gold-50 rounded-full mb-6 border border-gold-200/50">
                  <span className="text-gold-700 font-bold text-sm tracking-widest uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                    1950s
                  </span>
                </div>
                <h3 
                  className="text-3xl lg:text-4xl mb-4 text-charcoal-900"
                  style={{ fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif', fontWeight: '700' }}
                >
                  {language === 'ar' ? 'ازدهار الفندق' : 'Golden Era'}
                </h3>
                <p className="text-charcoal-600 text-lg leading-relaxed font-light">
                  {language === 'ar'
                    ? 'شهدت هذه الحقبة صعود الفندق كوجهة فاخرة ومكان لقاء الشخصيات البارزة والضيوف من جميع أنحاء العالم.'
                    : 'This era witnessed the hotel\'s rise as a luxury destination and meeting place for prominent figures and guests from around the world.'}
                </p>
              </div>
            </motion.div>

            {/* Timeline Connector Dot */}
            <div className="flex justify-center">
              <div className="w-3 h-3 bg-gold-400 rounded-full shadow-lg shadow-gold-500/50"></div>
            </div>

            {/* Timeline Item 3 - 2000s */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={visibleSections.heritage ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Text Content - Left */}
              <div className={`${language === 'ar' ? 'md:order-2 text-right' : 'text-left'}`}>
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-gold-100 to-gold-50 rounded-full mb-6 border border-gold-200/50">
                  <span className="text-gold-700 font-bold text-sm tracking-widest uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                    2000s
                  </span>
                </div>
                <h3 
                  className="text-3xl lg:text-4xl mb-4 text-charcoal-900"
                  style={{ fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif', fontWeight: '700' }}
                >
                  {language === 'ar' ? 'التحديث والتجديد' : 'Modernization'}
                </h3>
                <p className="text-charcoal-600 text-lg leading-relaxed font-light">
                  {language === 'ar'
                    ? 'تحول شامل للفندق مع الحفاظ على روحه التاريخية، ليجمع بين الأصالة والمعايير العالمية الحديثة للرفاهية.'
                    : 'A complete transformation while preserving the hotel\'s historical soul, blending authenticity with modern global luxury standards.'}
                </p>
              </div>

              {/* Image - Right */}
              <div className={`${language === 'ar' ? 'md:order-1' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                  <img 
                    src="/images/heritage_renovation_2000s.png" 
                    alt="Renovation 2000s" 
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Timeline Connector Dot */}
            <div className="flex justify-center">
              <div className="w-3 h-3 bg-gold-400 rounded-full shadow-lg shadow-gold-500/50"></div>
            </div>

            {/* Timeline Item 4 - Today */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={visibleSections.heritage ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Image - Left */}
              <div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                  <img 
                    src="/images/heritage_modern_luxury.png" 
                    alt="Modern Five-Star Luxury" 
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>

              {/* Text Content - Right */}
              <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-gold-100 to-gold-50 rounded-full mb-6 border border-gold-200/50">
                  <span className="text-gold-700 font-bold text-sm tracking-widest uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Today
                  </span>
                </div>
                <h3 
                  className="text-3xl lg:text-4xl mb-4 text-charcoal-900"
                  style={{ fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif', fontWeight: '700' }}
                >
                  {language === 'ar' ? 'فخامة خمس نجوم' : 'Five-Star Excellence'}
                </h3>
                <p className="text-charcoal-600 text-lg leading-relaxed font-light">
                  {language === 'ar'
                    ? 'اليوم، يقف فندق رويال سميراميس كوجهة فاخرة من فئة خمس نجوم، يجمع بين التراث الغني والضيافة العصرية الاستثنائية.'
                    : 'Today, Royal Semiramis stands as a five-star luxury destination, blending rich heritage with exceptional modern hospitality.'}
                </p>
              </div>
            </motion.div>

          </div>

          {/* 3️⃣ PAST vs PRESENT COMPARISON */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={visibleSections.heritage ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-6xl mx-auto mb-32"
          >
            {/* Caption Above */}
            <div className="text-center mb-12">
              <p 
                className="text-2xl lg:text-3xl text-charcoal-700 italic"
                style={{ fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif', fontWeight: '400' }}
              >
                {language === 'ar'
                  ? 'من ذاكرة المدينة… إلى فخامة اليوم'
                  : 'From the City\'s Memory... To Today\'s Luxury'}
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="w-12 h-px bg-gold-400/50"></div>
                <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
                <div className="w-12 h-px bg-gold-400/50"></div>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Past Image */}
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl shadow-black/25">
                <img 
                  src="/images/heritage_past_cityscape.png" 
                  alt="Past - Historical Damascus" 
                  className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Sepia Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-amber-900/40 pointer-events-none"></div>
                {/* Label */}
                <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md rounded-xl px-6 py-4">
                  <p className="text-white text-lg font-light tracking-wide" style={{ fontFamily: language === 'ar' ? 'Tajawal' : 'Inter' }}>
                    {language === 'ar' ? 'الماضي العريق' : 'The Past'}
                  </p>
                </div>
              </div>

              {/* Present Image */}
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl shadow-black/25">
                <img 
                  src="/images/heritage_modern_luxury.png" 
                  alt="Present - Modern Luxury" 
                  className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Label */}
                <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md rounded-xl px-6 py-4">
                  <p className="text-white text-lg font-light tracking-wide" style={{ fontFamily: language === 'ar' ? 'Tajawal' : 'Inter' }}>
                    {language === 'ar' ? 'الفخامة الحديثة' : 'The Present'}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* 4️⃣ DUAL VIDEO STORY BLOCKS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={visibleSections.heritage ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-6xl mx-auto mb-32"
          >
            <div className="grid md:grid-cols-2 gap-10">
              
              {/* Video 1 - The Past */}
              <div className="group">
                <h3 
                  className="text-2xl lg:text-3xl mb-6 text-charcoal-900 text-center"
                  style={{ fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif', fontWeight: '600' }}
                >
                  {language === 'ar' ? 'سميراميس… حكاية المكان' : 'Semiramis... The Story of Place'}
                </h3>
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/20 bg-gray-800">
                  {/* Placeholder Video - User will replace */}
                  <video 
                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-102"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    poster="/images/heritage_hotel_1950s.png"
                  >
                    <source src="/videos/heritage_past.mp4" type="video/mp4" />
                    {/* Fallback Image */}
                    <img src="/images/heritage_hotel_1950s.png" alt="The Past" className="w-full h-72 object-cover" />
                  </video>
                  {/* Sepia Filter Overlay for "Past" Feel */}
                  <div className="absolute inset-0 bg-amber-900/15 pointer-events-none mix-blend-multiply"></div>
                </div>
              </div>

              {/* Video 2 - The Present */}
              <div className="group">
                <h3 
                  className="text-2xl lg:text-3xl mb-6 text-charcoal-900 text-center"
                  style={{ fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif', fontWeight: '600' }}
                >
                  {language === 'ar' ? 'سميراميس اليوم… فخامة متجددة' : 'Semiramis Today... Renewed Luxury'}
                </h3>
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/20 bg-gray-800">
                  {/* Placeholder Video - User will replace */}
                  <video 
                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-102"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    poster="/images/heritage_modern_luxury.png"
                  >
                    <source src="/videos/heritage_present.mp4" type="video/mp4" />
                    {/* Fallback Image */}
                    <img src="/images/heritage_modern_luxury.png" alt="The Present" className="w-full h-72 object-cover" />
                  </video>
                </div>
              </div>

            </div>

            {/* Note for User */}
            <p className="text-center mt-8 text-charcoal-500 text-sm italic">
              {language === 'ar'
                ? '* الفيديوهات الحالية عبارة عن صور ثابتة. يمكنك استبدالها بمقاطع الفيديو الخاصة بك في مجلد /public/videos/'
                : '* Current videos are placeholder images. You can replace them with your actual videos in /public/videos/'}
            </p>
          </motion.div>

          {/* 5️⃣ FINAL HERITAGE STATEMENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={visibleSections.heritage ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
            </div>

            <h3 
              className="text-3xl lg:text-5xl leading-relaxed text-charcoal-900 mb-6"
              style={{ 
                fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif', 
                fontWeight: '600',
                lineHeight: '1.6'
              }}
            >
              {language === 'ar' ? (
                <>
                  أكثر من فندق…<br />
                  إنه جزء من تاريخ دمشق،<br />
                  ووجهة فاخرة للحاضر والمستقبل.
                </>
              ) : (
                <>
                  More than a hotel…<br />
                  It's a part of Damascus history,<br />
                  and a luxury destination for today and tomorrow.
                </>
              )}
            </h3>

            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Location Map */}
      <section
        ref={(el) => (sectionRefs.current.location = el)}
        className="py-24 bg-ivory-200"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal-800 mb-4">
              {t('location.title')}
            </h2>
            <p className="text-gray-600">{t('location.address')}</p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d588.0553779444285!2d36.29489828811281!3d33.51325056382881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e71f09f32db5%3A0x30d47f1e3df068db!2sRoyal%20Semiramis%20Hotel!5e0!3m2!1sen!2snl!4v1769623174835!5m2!1sen!2snl"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Hotel Location"
            />
          </div>

          <div className="text-center mt-8">
            <a
              href="https://share.google/JstknHUegaB0aF8zM"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-outline inline-block"
            >
              {t('location.directions')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

