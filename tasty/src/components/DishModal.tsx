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

  // Lock the page behind the popup while it is open (stops background scrolling on phones)
  useEffect(() => {
    if (!item) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [item]);

  if (!item) return null;

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image }, quantity);
    if (!isClosed) onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-tasty-charcoal/60 backdrop-blur-sm" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-xl w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col overflow-hidden shadow-2xl border border-tasty-sage/20 relative"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-tasty-charcoal flex items-center justify-center hover:bg-white shadow-md transition-colors"
            aria-label="Close"
          >
            <Icon icon="mdi:close" className="text-xl" />
          </button>

          {/* Scrollable content: image + details scroll together when the screen is short */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">

          {/* Dish Header Image */}
          <div className="relative h-[clamp(6.5rem,22dvh,11rem)] sm:h-72 w-full overflow-hidden bg-tasty-bg-warm p-3 sm:p-6 flex items-center justify-center">
            <img 
              src={item.image} 
              alt={item.name} 
              className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
            />
            {item.badge && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-tasty-terracotta text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                {item.badge}
              </span>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-8 space-y-3 sm:space-y-6 text-left relative z-10">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-lg leading-snug sm:text-3xl font-bold text-tasty-charcoal">{item.name}</h3>
                <span className="text-lg sm:text-2xl font-bold text-tasty-teal shrink-0">€{item.price.toFixed(2)}</span>
              </div>
              <p className="text-tasty-charcoal-muted text-xs sm:text-sm mt-1 sm:mt-2 leading-snug sm:leading-relaxed">{item.description}</p>
            </div>

            {/* Ingredients List */}
            <div className="space-y-2">
              <span className="hidden sm:block text-xs font-bold text-tasty-charcoal uppercase tracking-wider">Fresh Ingredients</span>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {item.ingredients.map((ing, idx) => (
                  <span key={idx} className="bg-tasty-sage-light text-tasty-teal text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Order Actions */}
            <div className="pt-3 sm:pt-4 border-t border-tasty-sage/20 space-y-2 sm:space-y-2.5">
              {/* Delivery Now Available Tag */}
              <div className="flex items-center justify-center gap-1.5 py-1 sm:py-1.5 px-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 text-[10px] sm:text-[11px] font-bold text-center">
                <span className="inline-block animate-pulse">🛵</span>
                <span>Now delivering in Hilversum! Fresh to your door</span>
              </div>

              {/* Quantity + Add to Order */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-tasty-charcoal/15 bg-tasty-bg-warm shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 sm:w-10 h-10 sm:h-11 flex items-center justify-center rounded-full hover:bg-tasty-terracotta-light transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Icon icon="mdi:minus" className="text-lg" />
                  </button>
                  <span className="w-7 text-center text-base font-bold text-tasty-charcoal">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="w-9 sm:w-10 h-10 sm:h-11 flex items-center justify-center rounded-full hover:bg-tasty-terracotta-light transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Icon icon="mdi:plus" className="text-lg" />
                  </button>
                </div>

                <motion.button
                  onClick={handleAdd}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-2.5 sm:py-3.5 rounded-full text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
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
                className="w-full py-2 sm:py-2.5 rounded-full bg-tasty-bg-warm border border-tasty-charcoal/15 text-tasty-charcoal hover:bg-tasty-terracotta-light hover:text-tasty-terracotta font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:phone" className="text-base text-tasty-terracotta" />
                <span>Or call: 035 204 2001</span>
              </motion.a>
            </div>

          </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
