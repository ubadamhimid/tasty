import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Icon } from '@iconify/react';
import { VisitorCounterBadge } from './VisitorCounter';

interface HeroProps {
  onOpenCustomizer: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  // Mouse Parallax Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const featuredDishes = [
    {
      id: 'wrap',
      title: 'Signature Chicken Shawarma Wrap',
      subtitle: 'Toasted durum with homemade garlic toum & crisp pickles',
      price: '€9.50',
      badge: 'Street Food Icon',
      prepTime: '5-7 Mins',
      rating: '4.9★',
      image: '/images/shawarma-wrap.webp',
      bgColor: 'from-tasty-teal/20 via-tasty-sage-light to-white',
    },
    {
      id: 'bowl',
      title: 'Grilled Chicken Skewers Bowl',
      subtitle: 'Fire-grilled skewers over turmeric basmati rice & salad',
      price: '€14.90',
      badge: 'Chef Special',
      prepTime: '8-10 Mins',
      rating: '5.0★',
      image: '/images/chicken-skewers-bowl.webp',
      bgColor: 'from-tasty-terracotta/20 via-tasty-terracotta-light to-white',
    },
    {
      id: 'manaqish',
      title: 'Manaqish Za’atar & Kaas',
      subtitle: 'Stone-baked flatbread with wild za’atar & melted cheese',
      price: '€6.90',
      badge: 'Stone Oven Fresh',
      prepTime: '4 Mins',
      rating: '4.9★',
      image: '/images/manaqish.webp',
      bgColor: 'from-amber-500/15 via-amber-50 to-white',
    }
  ];

  const activeDish = featuredDishes[activeDishIndex];

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      
      {/* Flying / Floating Background Herb & Spice Particles */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 20, 0], x: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-[8%] text-tasty-teal/40 text-3xl pointer-events-none z-10"
      >
        <Icon icon="mdi:leaf" />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 35, 0], rotate: [0, -25, 0], x: [0, -18, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute top-48 right-[10%] text-tasty-terracotta/40 text-3xl pointer-events-none z-10"
      >
        <Icon icon="mdi:star-four-points" />
      </motion.div>

      <motion.div 
        animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-20 left-[12%] text-emerald-600/30 text-3xl pointer-events-none z-10"
      >
        <Icon icon="mdi:chili-hot" />
      </motion.div>

      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-tasty-teal/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-tasty-terracotta/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (60% Desktop) - Editorial Typography */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Badges Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center gap-3"
            >
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-tasty-teal-light text-tasty-teal border border-tasty-teal/20 shadow-sm"
              >
                <Icon icon="mdi:star-four-points" className="text-tasty-teal animate-spin-slow" />
                Freshly Baked Daily
              </motion.span>

              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-tasty-terracotta-light text-tasty-terracotta border border-tasty-terracotta/20 shadow-sm"
              >
                <Icon icon="mdi:map-marker" className="text-tasty-terracotta animate-bounce" />
                Hilversum Center
              </motion.span>

              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Dine-In & Express Takeaway
              </motion.span>
            </motion.div>

            {/* Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-tasty-charcoal leading-[1.1] tracking-tight">
                Authentic <span className="italic text-tasty-teal relative inline-block">
                  Levant
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-tasty-sage/40" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="4" fill="none"/>
                  </svg>
                </span>, <br className="hidden sm:inline" />
                Crafted for Today.
              </h1>
              <p className="text-base sm:text-lg text-tasty-charcoal-muted max-w-2xl font-normal leading-relaxed pt-2">
                Experience Hilversum's premier fast-casual Mediterranean kitchen. From signature stone-baked Manaqish and spiced Shawarma wraps to customizable Levantine Rice Bowls & silky dips.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <motion.a 
                href="#menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-tasty-teal text-white font-bold text-base shadow-tasty-hover hover:bg-tasty-teal-dark transition-all duration-300 group"
              >
                <span>Explore Full Menu</span>
                <Icon icon="mdi:arrow-right" className="text-xl group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a 
                href="tel:0352042001"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white text-tasty-charcoal font-bold text-base border-2 border-tasty-terracotta/40 hover:border-tasty-terracotta hover:bg-tasty-terracotta-light shadow-sm transition-all duration-300 group"
              >
                <Icon icon="mdi:phone" className="text-xl text-tasty-terracotta group-hover:rotate-12 transition-transform" />
                <span>Call 035 204 2001</span>
              </motion.a>
            </motion.div>

            {/* Live Visitors Counter Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-2"
            >
              <VisitorCounterBadge />
            </motion.div>

          </div>

          {/* Right Column - 3D Interactive Parallax Showcase Stage */}
          <div className="lg:col-span-5 relative text-left">
            
            <motion.div 
              style={{ rotateX, rotateY }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-tasty-teal/20 relative preserve-3d cursor-grab"
            >
              
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6 border-b border-tasty-sage/20 pb-4">
                <span className="text-xs font-bold text-tasty-teal uppercase tracking-widest flex items-center gap-1.5">
                  <Icon icon="mdi:star-four-points" className="text-tasty-terracotta text-base animate-spin-slow" />
                  Featured House Special
                </span>
                
                {/* Clean Floating Choice Badge */}
                <span className="text-xs font-bold bg-tasty-terracotta text-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Icon icon="mdi:fire" />
                  Hilversum #1
                </span>
              </div>

              {/* Animated Floating Dish Stage */}
              <div className={`relative h-64 sm:h-72 rounded-2xl bg-gradient-to-b ${activeDish.bgColor} p-6 flex items-center justify-center overflow-hidden mb-6 transition-all duration-500`}>
                
                {/* Floating Dish Cutout with Parallax & Hover Rotation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDish.id}
                    initial={{ opacity: 0, scale: 0.75, rotate: -8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.75, rotate: 8, y: -20 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    whileHover={{ scale: 1.12, rotate: 3, y: -5 }}
                    className="w-full h-full flex items-center justify-center relative z-10"
                  >
                    <img 
                      src={activeDish.image} 
                      alt={activeDish.title}
                      loading="eager"
                      fetchPriority="high"
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_35px_rgba(43,58,57,0.3)] transition-transform duration-300"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Prep Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-tasty-charcoal shadow-sm flex items-center gap-1">
                  <Icon icon="mdi:clock-outline" className="text-tasty-teal" />
                  <span>Ready in {activeDish.prepTime}</span>
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-tasty-charcoal shadow-sm flex items-center gap-1">
                  <Icon icon="mdi:star" className="text-amber-400" />
                  <span>{activeDish.rating}</span>
                </div>
              </div>

              {/* Active Dish Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-tasty-charcoal">
                      {activeDish.title}
                    </h3>
                    <p className="text-tasty-charcoal-muted text-xs sm:text-sm mt-1 leading-relaxed">
                      {activeDish.subtitle}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-tasty-teal shrink-0">
                    {activeDish.price}
                  </div>
                </div>

                {/* Dish Switcher Buttons */}
                <div className="pt-4 border-t border-tasty-sage/20 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-tasty-charcoal-muted uppercase mr-1">Select:</span>
                  {featuredDishes.map((dish, idx) => (
                    <motion.button
                      key={dish.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveDishIndex(idx)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center border ${
                        activeDishIndex === idx
                          ? 'bg-tasty-teal text-white border-tasty-teal shadow-md'
                          : 'bg-tasty-bg-warm text-tasty-charcoal border-tasty-sage/30 hover:bg-white'
                      }`}
                    >
                      {dish.id === 'wrap' ? 'Shawarma' : dish.id === 'bowl' ? 'Rice Bowl' : 'Manaqish'}
                    </motion.button>
                  ))}
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
