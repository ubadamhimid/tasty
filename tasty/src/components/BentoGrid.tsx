import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { MenuItem } from '../types';

interface BentoGridProps {
  onSelectItem: (item: MenuItem) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ onSelectItem }) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Floating Herb Particles */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-10 text-tasty-terracotta/25 text-3xl pointer-events-none"
      >
        <Icon icon="mdi:fire" />
      </motion.div>

      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left"
      >
        <div>
          <div className="inline-flex items-center gap-2 text-tasty-terracotta text-xs font-extrabold uppercase tracking-widest mb-2">
            <Icon icon="mdi:fire" className="text-base animate-pulse" />
            Signature Craft Creations
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-tasty-charcoal">
            Hilversum’s Best Sellers
          </h2>
        </div>
        <p className="text-tasty-charcoal-muted max-w-md text-sm leading-relaxed">
          Crafted with traditional spices, stone-baked dough, and signature house-made sauces. Every dish is a tribute to authentic Levantine hospitality.
        </p>
      </motion.div>

      {/* Asymmetric Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
        
        {/* Card 1: Shawarma Platter (Featured Big Bento Card - 7 Columns) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -8, scale: 1.01 }}
          className="md:col-span-7 group relative bg-white rounded-3xl p-6 sm:p-8 shadow-tasty-soft hover:shadow-tasty-hover border border-tasty-teal/15 overflow-hidden flex flex-col justify-between"
        >
          {/* Background Dish Cutout Image with Floating Zoom Animation */}
          <div className="absolute right-0 bottom-0 w-3/5 h-full opacity-95 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-500 pointer-events-none flex items-center justify-end">
            <img 
              src="/images/shawarma-platter.webp" 
              alt="Schotel Shawarma Kip & Fries" 
              loading="lazy"
              className="max-h-[110%] w-auto object-contain filter drop-shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
          </div>

          {/* Top Badge & Category */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-tasty-terracotta text-white shadow-sm flex items-center gap-1.5 animate-pulse">
              <Icon icon="mdi:fire" />
              #1 Best Seller
            </span>
            <span className="text-xs font-bold text-tasty-teal uppercase tracking-wider bg-tasty-teal-light px-3 py-1 rounded-full">
              Shawarma Platter
            </span>
          </div>

          {/* Card Content */}
          <div className="relative z-10 max-w-sm space-y-3">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-tasty-charcoal group-hover:text-tasty-teal transition-colors">
              Schotel Shawarma Kip & Fries
            </h3>
            <p className="text-tasty-charcoal-muted text-sm leading-relaxed">
              Juicy spiced chicken shawarma with golden fries, garlic toum, pickles, and crisp coleslaw.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-tasty-charcoal font-semibold">
              <Icon icon="mdi:star" className="text-amber-400 text-base" />
              <span>5.0 (412 Reviews)</span>
              <span>•</span>
              <span>990 kcal</span>
            </div>
          </div>

          {/* Bottom Action Row */}
          <div className="relative z-10 flex items-center justify-between pt-8 mt-auto">
            <div className="text-2xl font-bold text-tasty-charcoal">
              €14.<span className="text-sm font-semibold">50</span>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectItem({
                id: 'kapsalon-mix',
                name: 'Schotel Shawarma Kip & Fries',
                category: 'kapsalon',
                price: 14.50,
                description: 'Generous platter of tender chicken shawarma with golden fries, garlic toum, pickles, and crisp coleslaw.',
                rating: 5.0,
                reviewCount: 412,
                badge: 'Bestseller',
                image: '/images/shawarma-platter.webp',
                ingredients: ['Chicken Shawarma', 'Golden Fries', 'Garlic Toum', 'Pickles', 'Coleslaw']
              })}
              className="px-5 py-2.5 rounded-full bg-tasty-teal text-white text-xs font-bold shadow-md hover:bg-tasty-teal-dark transition-colors flex items-center gap-2"
            >
              <Icon icon="mdi:eye-outline" className="text-base" />
              <span>View Dish Details</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Card 2: Stone-Baked Manaqish (5 Columns) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ y: -8, scale: 1.01 }}
          className="md:col-span-5 group relative bg-white rounded-3xl p-6 sm:p-8 shadow-tasty-soft hover:shadow-tasty-hover border border-tasty-sage/20 overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute -right-4 -bottom-4 w-3/5 h-4/5 opacity-90 group-hover:scale-110 transition-all duration-500 pointer-events-none flex items-end justify-end">
            <img 
              src="/images/manaqish.webp" 
              alt="Manaqish Zaatar & Cheese" 
              loading="lazy"
              className="w-full h-auto object-contain filter drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
          </div>

          <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-tasty-sage-light text-tasty-teal border border-tasty-teal/20">
              Stone Oven Fresh
            </span>
            <span className="text-xs font-bold text-tasty-terracotta bg-tasty-terracotta-light px-3 py-1 rounded-full">
              Vegetarian
            </span>
          </div>

          <div className="relative z-10 space-y-2 my-4">
            <h3 className="text-2xl font-serif font-bold text-tasty-charcoal group-hover:text-tasty-teal transition-colors">
              Manaqish Za’atar & Kaas
            </h3>
            <p className="text-tasty-charcoal-muted text-xs sm:text-sm leading-relaxed max-w-xs">
              Half wild za’atar with olive oil & half melted cheese on oven-fresh flatbread.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-tasty-sage/20">
            <div className="text-xl font-bold text-tasty-charcoal">€6.90</div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectItem({
                id: 'manaqish-zaatar',
                name: 'Manaqish Za’atar & Kaas',
                category: 'manaqish',
                price: 6.90,
                description: 'Traditional oven-baked flatbread, half wild Levantine za’atar with olive oil and half melted cheese.',
                rating: 4.9,
                reviewCount: 290,
                image: '/images/manaqish.webp',
                ingredients: ['Za\'atar', 'Melted Cheese', 'Olive Oil']
              })}
              className="px-4 py-2 rounded-full bg-tasty-teal text-white text-xs font-bold shadow-sm hover:bg-tasty-teal-dark transition-colors flex items-center gap-1.5"
            >
              <Icon icon="mdi:eye" />
              <span>Details</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Card 3: Crispy Chicken Rice Bowl (5 Columns) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -8, scale: 1.01 }}
          className="md:col-span-5 group relative bg-white rounded-3xl p-6 sm:p-8 shadow-tasty-soft hover:shadow-tasty-hover border border-tasty-terracotta/20 overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute -right-6 -bottom-6 w-3/5 h-4/5 opacity-90 group-hover:scale-110 transition-all duration-500 pointer-events-none flex items-end justify-end">
            <img 
              src="/images/crispy-chicken-bowl.webp" 
              alt="Tasty Crispy Chicken Bowl" 
              loading="lazy"
              className="w-full h-auto object-contain filter drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
          </div>

          <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-tasty-terracotta-light text-tasty-terracotta">
              Chef Special
            </span>
            <span className="text-xs font-bold text-tasty-teal uppercase tracking-wider">
              Tasty Bowl
            </span>
          </div>

          <div className="relative z-10 space-y-2 my-4">
            <h3 className="text-2xl font-serif font-bold text-tasty-charcoal group-hover:text-tasty-terracotta transition-colors">
              Crispy Chicken Rice Bowl
            </h3>
            <p className="text-tasty-charcoal-muted text-xs sm:text-sm leading-relaxed max-w-xs">
              Golden crispy chicken cutlets over yellow turmeric basmati rice with house sauce.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-tasty-sage/20">
            <div className="text-xl font-bold text-tasty-charcoal">€13.90</div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectItem({
                id: 'bowl-crispy-chicken',
                name: 'Tasty Crispy Chicken Rice Bowl',
                category: 'bowls',
                price: 13.90,
                description: 'Golden crispy chicken cutlets over yellow turmeric basmati rice with house sauce.',
                rating: 4.9,
                reviewCount: 520,
                image: '/images/crispy-chicken-bowl.webp',
                ingredients: ['Crispy Chicken', 'Turmeric Rice', 'House Sauce']
              })}
              className="px-4 py-2 rounded-full bg-tasty-terracotta text-white text-xs font-bold shadow-sm hover:bg-tasty-terracotta-dark transition-colors flex items-center gap-1.5"
            >
              <Icon icon="mdi:eye" />
              <span>Details</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Card 4: Falafel & Hummus Feast Bowl (7 Columns) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -8, scale: 1.01 }}
          className="md:col-span-7 group relative bg-white rounded-3xl p-6 sm:p-8 shadow-tasty-soft hover:shadow-tasty-hover border border-tasty-teal/15 overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-90 group-hover:scale-110 transition-transform duration-500 pointer-events-none flex items-center justify-end">
            <img 
              src="/images/falafel-hummus-bowl.webp" 
              alt="Falafel & Hummus Feast Bowl" 
              loading="lazy"
              className="max-h-[110%] w-auto object-contain filter drop-shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
          </div>

          <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
              100% Vegan Feast
            </span>
            <span className="text-xs font-bold text-tasty-charcoal-muted">
              Homemade Dips
            </span>
          </div>

          <div className="relative z-10 max-w-sm space-y-2 my-4">
            <h3 className="text-2xl font-serif font-bold text-tasty-charcoal group-hover:text-tasty-teal transition-colors">
              Falafel & Hummus Feast Bowl
            </h3>
            <p className="text-tasty-charcoal-muted text-sm leading-relaxed">
              Crispy herb falafel donuts served over creamy hummus with sumac, pickled turnips, chopped salad, and fresh pita bread.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-6 mt-auto border-t border-tasty-sage/20">
            <div className="text-2xl font-bold text-tasty-charcoal">€12.90</div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectItem({
                id: 'bowl-falafel-hummus',
                name: 'Falafel & Hummus Feast Bowl',
                category: 'bowls',
                price: 12.90,
                description: 'Crispy herb falafel donuts served over creamy hummus with sumac, pickled turnips, chopped salad, and fresh pita bread.',
                rating: 4.9,
                reviewCount: 340,
                image: '/images/falafel-hummus-bowl.webp',
                ingredients: ['Herb Falafel', 'Creamy Hummus', 'Pickled Turnips', 'Stone-Baked Pita']
              })}
              className="px-5 py-2.5 rounded-full bg-tasty-teal text-white text-xs font-bold shadow-md hover:bg-tasty-teal-dark transition-colors flex items-center gap-2"
            >
              <Icon icon="mdi:eye" />
              <span>View Details</span>
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
