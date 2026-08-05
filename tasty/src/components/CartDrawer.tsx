import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [tip, setTip] = useState(2.00);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? 2.50 : 0.00;
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee + tip : 0;

  const handleCheckout = () => {
    setOrderPlaced(true);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#5E9895', '#E29578', '#9DBEBB', '#2B3A39']
    });

    setTimeout(() => {
      setOrderPlaced(false);
      onClearCart();
      onClose();
    }, 4500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-tasty-charcoal/50 backdrop-blur-xs">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-tasty-sage/20 flex items-center justify-between bg-tasty-bg-warm">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:shopping" className="text-2xl text-tasty-teal" />
              <div>
                <h3 className="font-serif font-bold text-xl text-tasty-charcoal">Your Order</h3>
                <p className="text-tasty-charcoal-muted text-xs">TASTY Hilversum Kitchen</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full text-tasty-charcoal hover:bg-white transition-colors"
            >
              <Icon icon="mdi:close" className="text-xl" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {orderPlaced ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                  <Icon icon="mdi:check-bold" />
                </div>
                <h4 className="font-serif font-bold text-2xl text-tasty-charcoal">Order Confirmed!</h4>
                <p className="text-tasty-charcoal-muted text-sm max-w-xs mx-auto">
                  Thank you! TASTY kitchen has received your order. Estimated preparation time: <strong>20 - 30 minutes</strong>.
                </p>
              </motion.div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-tasty-sage-light text-tasty-teal flex items-center justify-center mx-auto text-3xl">
                  <Icon icon="mdi:shopping-outline" />
                </div>
                <h4 className="font-serif font-bold text-lg text-tasty-charcoal">Your Order Bag is Empty</h4>
                <p className="text-tasty-charcoal-muted text-xs max-w-xs mx-auto">
                  Explore our menu or craft your custom Levantine bowl to get started.
                </p>
              </div>
            ) : (
              <>
                {/* Delivery vs Pickup Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-tasty-bg-warm rounded-2xl border border-tasty-sage/20">
                  <button 
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      orderType === 'delivery' ? 'bg-white text-tasty-teal shadow-sm' : 'text-tasty-charcoal-muted'
                    }`}
                  >
                    <Icon icon="mdi:bike-fast" /> Delivery (€2.50)
                  </button>
                  <button 
                    onClick={() => setOrderType('pickup')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      orderType === 'pickup' ? 'bg-white text-tasty-terracotta shadow-sm' : 'text-tasty-charcoal-muted'
                    }`}
                  >
                    <Icon icon="mdi:store-outline" /> Takeaway Pickup
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-tasty-sage/20 bg-tasty-bg-warm">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0 text-left">
                        <h5 className="font-bold text-xs text-tasty-charcoal truncate">{item.name}</h5>
                        <p className="text-tasty-teal text-xs font-bold mt-0.5">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 border border-tasty-sage/30">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded-full text-tasty-charcoal flex items-center justify-center text-xs font-bold hover:bg-tasty-sage-light"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-tasty-charcoal">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded-full text-tasty-charcoal flex items-center justify-center text-xs font-bold hover:bg-tasty-sage-light"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-tasty-charcoal-muted hover:text-red-500 text-base"
                      >
                        <Icon icon="mdi:trash-can-outline" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tip Selector */}
                <div className="space-y-2 pt-2 text-left">
                  <span className="text-xs font-bold text-tasty-charcoal">Support the Kitchen Tip</span>
                  <div className="flex gap-2">
                    {[1.00, 2.00, 3.00, 5.00].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTip(t)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          tip === t ? 'bg-tasty-terracotta text-white border-tasty-terracotta' : 'bg-white text-tasty-charcoal border-tasty-sage/30'
                        }`}
                      >
                        €{t.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer Summary & Checkout Button */}
          {cartItems.length > 0 && !orderPlaced && (
            <div className="p-6 border-t border-tasty-sage/20 bg-tasty-bg-warm space-y-4 text-left">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-tasty-charcoal-muted">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-tasty-charcoal-muted">
                  <span>Delivery Fee</span>
                  <span>€{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-tasty-charcoal-muted">
                  <span>Tip</span>
                  <span>€{tip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-tasty-charcoal pt-2 border-t border-tasty-sage/20">
                  <span>Total</span>
                  <span>€{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full py-4 rounded-full bg-tasty-teal text-white font-bold text-sm shadow-tasty-hover hover:bg-tasty-teal-dark transition-all flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:lock" />
                <span>Place Order • €{grandTotal.toFixed(2)}</span>
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
