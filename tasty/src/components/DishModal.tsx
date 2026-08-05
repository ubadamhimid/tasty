import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { MenuItem } from '../types';

interface DishModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const DishModal: React.FC<DishModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-tasty-charcoal/60 backdrop-blur-sm" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-tasty-sage/20 relative"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-tasty-charcoal flex items-center justify-center hover:bg-white shadow-md transition-colors"
          >
            <Icon icon="mdi:close" className="text-xl" />
          </button>

          {/* Dish Header Image */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-tasty-bg-warm p-6 flex items-center justify-center">
            <img 
              src={item.image} 
              alt={item.name} 
              className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
            />
            {item.badge && (
              <span className="absolute top-4 left-4 bg-tasty-terracotta text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {item.badge}
              </span>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 text-left relative z-10">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-tasty-charcoal">{item.name}</h3>
                <span className="text-2xl font-bold text-tasty-teal">€{item.price.toFixed(2)}</span>
              </div>
              <p className="text-tasty-charcoal-muted text-sm mt-2 leading-relaxed">{item.description}</p>
            </div>

            {/* Ingredients List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider">Fresh Ingredients</span>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing, idx) => (
                  <span key={idx} className="bg-tasty-sage-light text-tasty-teal text-xs font-semibold px-3 py-1 rounded-full">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Phone Order Button */}
            <div className="pt-4 border-t border-tasty-sage/20">
              <motion.a 
                href="tel:0352042001"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-full bg-tasty-teal text-white font-bold text-sm shadow-tasty-hover hover:bg-tasty-teal-dark transition-all flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:phone" className="text-lg" />
                <span>Call to Order • 035 204 2001</span>
              </motion.a>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
