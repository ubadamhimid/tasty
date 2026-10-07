import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { MenuItem } from '../types';
import { getWhatsAppOrderUrl, formatDishOrderMessage } from '../utils/whatsapp';

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

            {/* Order Actions */}
            <div className="pt-4 border-t border-tasty-sage/20 space-y-2.5">
              {/* Delivery Now Available Tag */}
              <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 text-[11px] font-bold text-center">
                <span className="inline-block animate-pulse">🛵</span>
                <span>Nu ook bezorging in Hilversum! Vers aan huis geleverd</span>
              </div>

              {/* WhatsApp Order Button */}
              <motion.a 
                href={getWhatsAppOrderUrl(formatDishOrderMessage(item.name, item.price))}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <Icon icon="mdi:whatsapp" className="text-xl shrink-0 group-hover:scale-110 transition-transform" />
                <span>Bestel via WhatsApp</span>
              </motion.a>

              {/* Direct Phone Order Button */}
              <motion.a 
                href="tel:0352042001"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-2.5 rounded-full bg-tasty-bg-warm border border-tasty-charcoal/15 text-tasty-charcoal hover:bg-tasty-terracotta-light hover:text-tasty-terracotta font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:phone" className="text-base text-tasty-terracotta" />
                <span>Of bel: 035 204 2001</span>
              </motion.a>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
