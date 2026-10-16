import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

interface DishModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const DishModal: React.FC<DishModalProps> = ({ item, onClose }) => {
  const { addItem, isClosed } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Start every opened dish at quantity 1
  useEffect(() => {
    setQuantity(1);
  }, [item?.id]);

  if (!item) return null;

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image }, quantity);
    if (!isClosed) onClose();
  };

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
                <span>Now delivering in Hilversum! Fresh to your door</span>
              </div>

              {/* Quantity + Add to Order */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-tasty-charcoal/15 bg-tasty-bg-warm shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-11 flex items-center justify-center rounded-full hover:bg-tasty-terracotta-light transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Icon icon="mdi:minus" className="text-lg" />
                  </button>
                  <span className="w-7 text-center text-base font-bold text-tasty-charcoal">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="w-10 h-11 flex items-center justify-center rounded-full hover:bg-tasty-terracotta-light transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Icon icon="mdi:plus" className="text-lg" />
                  </button>
                </div>

                <motion.button
                  onClick={handleAdd}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3.5 rounded-full text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isClosed ? 'bg-gray-400' : 'bg-tasty-terracotta hover:bg-tasty-terracotta-dark hover:shadow-lg'
                  }`}
                >
                  <Icon icon="mdi:shopping-outline" className="text-xl shrink-0" />
                  <span>{isClosed ? 'Closed today' : `Add to Order • €${(item.price * quantity).toFixed(2)}`}</span>
                </motion.button>
              </div>

              {/* Direct Phone Order Button */}
              <motion.a 
                href="tel:0352042001"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-2.5 rounded-full bg-tasty-bg-warm border border-tasty-charcoal/15 text-tasty-charcoal hover:bg-tasty-terracotta-light hover:text-tasty-terracotta font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:phone" className="text-base text-tasty-terracotta" />
                <span>Or call: 035 204 2001</span>
              </motion.a>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
