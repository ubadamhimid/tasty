import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface HeroProps {
  onOpenCustomizer?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCustomizer }) => {
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  const featuredDishes = [
    {
      id: 'wrap',
      title: 'Signature Chicken Shawarma Wrap',
      subtitle: 'Toasted durum with 24h marinated chicken, homemade garlic toum & crisp wild pickles',
      price: '€9.50',
      craftNote: 'Hand-rolled • Fire-roasted • House Garlic Toum',
      image: '/images/shawarma-wrap.webp',
    },
    {
      id: 'bowl',
      title: 'Grilled Chicken Skewers Bowl',
      subtitle: 'Fire-grilled skewers served over fragrant turmeric basmati rice with sumac side salad',
      price: '€14.90',
      craftNote: 'Charcoal Grilled • Turmeric Rice • Fresh Sumac',
      image: '/images/chicken-skewers-bowl.webp',
    },
    {
      id: 'manaqish',
      title: 'Manaqish Za’atar & Kaas',
      subtitle: 'Stone-baked artisan flatbread brushed with extra virgin olive oil, wild za’atar & melted cheese',
      price: '€6.90',
      craftNote: 'Stone Oven Baked • Wild Za’atar • EVOO',
      image: '/images/manaqish.webp',
    }
  ];

  const activeDish = featuredDishes[activeDishIndex];

  return (
    <section id="hero" className="relative pt-24 sm:pt-32 pb-16 md:pt-40 md:pb-28 bg-[#FDFBF7] overflow-hidden">
      
      {/* Subtle Warm Atmospheric Background Blur */}
      <div className="absolute top-12 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-tasty-terracotta/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-tasty-sage/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Column (7 cols Desktop) - Editorial Asymmetrical Layout */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {/* Authentic Micro-Detail Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2.5 sm:gap-3"
            >
              <span className="font-handwriting text-xl sm:text-2xl text-tasty-terracotta tracking-wide rotate-[-1deg] inline-block font-semibold">
                Artisanal Levantine Street Kitchen
              </span>
              <span className="h-px w-8 sm:w-10 bg-tasty-terracotta/30 hidden sm:inline-block"></span>
              <span className="text-[11px] sm:text-xs uppercase tracking-widest text-tasty-charcoal/60 font-medium hidden sm:inline-block">
                Hilversum Center
              </span>
            </motion.div>

            {/* Editorial Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-[#1A1A1A] leading-[1.1] tracking-tight">
                Authentic <span className="italic font-serif font-normal text-tasty-terracotta">Tasty</span> Craft.<br />
                Honest Levantine Flavors.
              </h1>
              
              <div className="border-l-2 border-tasty-terracotta/40 pl-3 sm:pl-4 py-0.5 sm:py-1">
                <p className="text-sm sm:text-base lg:text-lg text-tasty-charcoal/80 font-sans leading-relaxed max-w-xl">
                  Hilversum’s signature Mediterranean destination. From 24-hour marinated chicken shawarma wraps and stone-baked Manaqish to silkily whipped dips & artisan bowls.
                </p>
              </div>
            </motion.div>

            {/* Action Buttons: Side-by-side responsive layout */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-row items-center gap-3 pt-1"
            >
              <motion.a 
                href="#menu"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 rounded-full bg-tasty-charcoal text-white font-semibold text-sm sm:text-base shadow-sm hover:bg-[#111111] transition-all duration-300 whitespace-nowrap group"
              >
                <span>Explore Menu</span>
                <Icon icon="mdi:arrow-right" className="text-base sm:text-lg group-hover:translate-x-1 transition-transform" />
              </motion.a>

              {/* Dynamic Tactile Phone Pill Button */}
              <motion.a 
                href="tel:0352042001"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3.5 sm:py-4 rounded-full bg-tasty-terracotta hover:bg-tasty-terracotta-dark text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap group"
              >
                <Icon icon="mdi:phone" className="text-base sm:text-xl text-white group-hover:rotate-12 transition-transform duration-300 shrink-0" />
                <span>035 204 2001</span>
              </motion.a>
            </motion.div>

            {/* Micro Human Subtext */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-1 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-tasty-charcoal/70 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <Icon icon="mdi:map-marker-outline" className="text-tasty-terracotta text-sm sm:text-base shrink-0" />
                <span>Leeuwenstraat 14, Hilversum</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon icon="mdi:silverware-fork-knife" className="text-tasty-terracotta text-sm sm:text-base shrink-0" />
                <span>Dine-In & Express Takeaway</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column (5 cols Desktop) - High-End Restaurant Menu Spotlight Card */}
          <div className="lg:col-span-5 relative text-left mt-4 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-[#FAF7F2] rounded-3xl p-5 sm:p-7 border border-tasty-terracotta/20 shadow-xl shadow-tasty-terracotta/5 relative overflow-hidden"
            >
              
              {/* Header Label */}
              <div className="flex items-center justify-between mb-4 sm:mb-5 border-b border-tasty-terracotta/15 pb-3">
                <span className="text-xs font-semibold text-tasty-terracotta uppercase tracking-wider">
                  Menu Spotlight
                </span>
                <span className="font-handwriting text-base sm:text-lg text-tasty-charcoal/70 truncate ml-2">
                  {activeDish.craftNote}
                </span>
              </div>

              {/* Rich Food Photography Container */}
              <div className="relative h-56 sm:h-72 rounded-2xl bg-[#FFFDF9] border border-tasty-terracotta/15 p-4 sm:p-6 flex items-center justify-center overflow-hidden mb-5 sm:mb-6 shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDish.id}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex items-center justify-center relative z-10"
                  >
                    <img 
                      src={activeDish.image} 
                      alt={activeDish.title}
                      loading="eager"
                      fetchPriority="high"
                      className="max-h-full max-w-full object-contain filter drop-shadow-lg transition-transform duration-300 hover:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-3 right-3 bg-tasty-terracotta text-white px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                  {activeDish.price}
                </div>
              </div>

              {/* Active Dish Info */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-2xl text-[#1A1A1A]">
                    {activeDish.title}
                  </h3>
                  <p className="text-tasty-charcoal/75 text-xs sm:text-sm mt-1 leading-relaxed font-sans">
                    {activeDish.subtitle}
                  </p>
                </div>

                {/* Menu Tab Selector */}
                <div className="pt-3 border-t border-tasty-terracotta/15 flex items-center gap-1.5 sm:gap-2">
                  {featuredDishes.map((dish, idx) => (
                    <button
                      key={dish.id}
                      onClick={() => setActiveDishIndex(idx)}
                      className={`flex-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all text-center border ${
                        activeDishIndex === idx
                          ? 'bg-tasty-terracotta text-white border-tasty-terracotta shadow-xs'
                          : 'bg-[#FFFDF9] text-tasty-charcoal/80 border-tasty-terracotta/15 hover:bg-tasty-terracotta-light'
                      }`}
                    >
                      {dish.id === 'wrap' ? 'Shawarma' : dish.id === 'bowl' ? 'Rice Bowl' : 'Manaqish'}
                    </button>
                  ))}
                </div>

                {/* Action CTA inside Card */}
                <button
                  onClick={() => {
                    if (onOpenCustomizer) {
                      onOpenCustomizer();
                    } else {
                      const el = document.getElementById('menu');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-tasty-charcoal text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#111111] transition-colors shadow-xs"
                >
                  <span>Customize or Order Dish</span>
                  <Icon icon="mdi:arrow-right" className="text-sm sm:text-base" />
                </button>

              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
