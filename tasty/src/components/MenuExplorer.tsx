import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import { MenuItem, CategoryType } from '../types';

interface MenuExplorerProps {
  onSelectItem: (item: MenuItem) => void;
}

export const MenuExplorer: React.FC<MenuExplorerProps> = ({ onSelectItem }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVeggieOnly, setFilterVeggieOnly] = useState(false);
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.dutchName && item.dutchName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVeggie = !filterVeggieOnly || item.isVegetarian;
    const matchesSpicy = !filterSpicyOnly || item.isSpicy;
    return matchesCategory && matchesSearch && matchesVeggie && matchesSpicy;
  });

  return (
    <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header & Subtitle */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <span className="inline-flex items-center gap-2 text-tasty-teal text-xs font-extrabold uppercase tracking-widest bg-tasty-teal-light px-4 py-1.5 rounded-full">
          <Icon icon="mdi:silverware-fork-knife" />
          Full Menu Selection
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-tasty-charcoal">
          Explore Our Levantine Flavours
        </h2>
        <p className="text-tasty-charcoal-muted text-base">
          From freshly baked Manaqish flatbreads to savory Shawarma platters, falafel wraps, and signature bowls. Prepared fresh daily in Hilversum.
        </p>
      </div>

      {/* Controls Bar: Search & Diet Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 text-tasty-charcoal-muted text-xl" />
          <input 
            type="text"
            placeholder="Search dish, wrap, dip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-tasty-sage/30 text-tasty-charcoal placeholder-tasty-charcoal-muted text-sm focus:outline-none focus:border-tasty-teal focus:ring-2 focus:ring-tasty-teal/20 transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-tasty-charcoal-muted hover:text-tasty-charcoal text-sm"
            >
              <Icon icon="mdi:close-circle" />
            </button>
          )}
        </div>

        {/* Dietary Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
          <button 
            onClick={() => setFilterVeggieOnly(!filterVeggieOnly)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
              filterVeggieOnly 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <Icon icon="mdi:leaf" />
            <span>Vegetarian</span>
          </button>

          <button 
            onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
              filterSpicyOnly 
                ? 'bg-tasty-terracotta text-white border-tasty-terracotta shadow-sm' 
                : 'bg-white text-tasty-terracotta border-tasty-terracotta/40 hover:bg-tasty-terracotta-light'
            }`}
          >
            <Icon icon="mdi:chili-hot" />
            <span>Spicy</span>
          </button>
        </div>

      </div>

      {/* Category Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CategoryType)}
              className={`relative px-5 py-3 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                isActive 
                  ? 'bg-tasty-teal text-white shadow-tasty-soft scale-105' 
                  : 'bg-white text-tasty-charcoal hover:bg-tasty-sage-light border border-tasty-sage/20'
              }`}
            >
              <Icon icon={cat.icon} className="text-base" />
              <span>{cat.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-tasty-teal rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl overflow-hidden border border-tasty-sage/20 shadow-tasty-soft hover:shadow-tasty-hover flex flex-col justify-between group cursor-pointer"
              onClick={() => onSelectItem(item)}
            >
              {/* Card Header Image & Badges */}
              <div className="relative h-56 w-full overflow-hidden bg-tasty-bg-warm p-4 flex items-center justify-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {item.badge && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-tasty-terracotta text-white shadow-sm">
                      {item.badge}
                    </span>
                  )}
                  {item.isVegetarian && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                      <Icon icon="mdi:leaf" /> Veggie
                    </span>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-tasty-charcoal flex items-center gap-1 shadow-sm">
                  <Icon icon="mdi:star" className="text-amber-400 text-xs" />
                  <span>{item.rating}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-tasty-charcoal group-hover:text-tasty-teal transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-tasty-charcoal-muted text-xs line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Ingredients Pills */}
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.slice(0, 3).map((ing, idx) => (
                    <span key={idx} className="bg-tasty-sage-light text-tasty-charcoal-muted text-[10px] font-medium px-2 py-0.5 rounded-md">
                      {ing}
                    </span>
                  ))}
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-tasty-sage/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-tasty-charcoal-muted font-medium uppercase">Price</span>
                    <div className="text-lg font-bold text-tasty-charcoal">
                      €{item.price.toFixed(2)}
                    </div>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectItem(item); }}
                    className="px-4 py-2 rounded-full bg-tasty-teal text-white text-xs font-bold shadow-sm hover:bg-tasty-teal-dark transition-colors flex items-center gap-1.5"
                  >
                    <Icon icon="mdi:eye" />
                    <span>View Dish</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty Search Result */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-full bg-tasty-sage-light text-tasty-teal flex items-center justify-center mx-auto text-3xl">
            <Icon icon="mdi:silverware-clean" />
          </div>
          <h3 className="text-xl font-serif font-bold text-tasty-charcoal">No Dishes Found</h3>
          <p className="text-tasty-charcoal-muted text-sm">
            Try adjusting your search query or removing active dietary filters.
          </p>
          <button 
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); setFilterVeggieOnly(false); setFilterSpicyOnly(false); }}
            className="px-6 py-2.5 rounded-full bg-tasty-teal text-white text-xs font-bold shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
