import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useCart } from '../context/CartContext';
import {
  getWhatsAppOrderUrl,
  formatCartOrderMessage,
  OrderType,
  RESTAURANT_PHONE_DISPLAY,
  DELIVERY_FEE,
} from '../utils/whatsapp';
import { CLOSED_TITLE, CLOSED_TEXT } from '../utils/openingHours';

type Step = 'cart' | 'checkout' | 'sent';

const DETAILS_KEY = 'tasty_checkout_v1';
const SHOP_ADDRESS = 'Groest 50, 1211 EC Hilversum';

interface SavedDetails {
  orderType?: OrderType;
  name?: string;
  address?: string;
}

const loadDetails = (): SavedDetails => {
  try {
    return JSON.parse(localStorage.getItem(DETAILS_KEY) || '{}');
  } catch {
    return {};
  }
};

const eur = (n: number) => `€${n.toFixed(2)}`;

/* ------------------------------------------------------------------ */
/* Header cart button (used in the Navbar)                             */
/* ------------------------------------------------------------------ */
export const CartButton: React.FC = () => {
  const { itemCount, openCart } = useCart();
  return (
    <motion.button
      onClick={openCart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center justify-center gap-1.5 bg-tasty-charcoal hover:bg-tasty-teal-dark text-white font-bold p-2 sm:px-3.5 sm:py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 shrink-0"
      aria-label={`Open your order (${itemCount} items)`}
      title="Your order"
    >
      <Icon icon="mdi:shopping-outline" className="text-lg sm:text-base" />
      <span className="hidden sm:inline text-xs font-bold">Order</span>
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-tasty-terracotta text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-[#FDFBF7]"
          >
            {itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/* ------------------------------------------------------------------ */
/* Floating "View order" bar + "added" toast                           */
/* ------------------------------------------------------------------ */
const ClosedNotice: React.FC = () => (
  <div className="mx-5 sm:mx-6 mt-4 flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-left" role="alert">
    <Icon icon="mdi:store-clock-outline" className="text-red-600 text-2xl shrink-0 mt-0.5" />
    <div>
      <div className="text-sm font-bold text-red-800">{CLOSED_TITLE}</div>
      <p className="text-xs text-red-700 leading-relaxed mt-0.5">{CLOSED_TEXT}</p>
    </div>
  </div>
);

export const FloatingCartBar: React.FC = () => {
  const { itemCount, subtotal, isOpen, openCart, toast, dismissToast } = useCart();

  return (
    <>
      <AnimatePresence>
        {toast && !isOpen && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 sm:top-24 inset-x-0 mx-auto w-fit z-[55] flex items-center gap-3 text-white pl-4 py-2 rounded-full shadow-2xl text-xs sm:text-sm font-semibold max-w-[92vw] ${
              toast.kind === 'closed' ? 'bg-red-700 pr-4' : 'bg-tasty-charcoal pr-2'
            }`}
            role="status"
          >
            <Icon
              icon={toast.kind === 'closed' ? 'mdi:store-clock-outline' : 'mdi:check-circle'}
              className={`text-lg shrink-0 ${toast.kind === 'closed' ? 'text-white' : 'text-emerald-400'}`}
            />
            <span className={toast.kind === 'closed' ? 'leading-snug' : 'truncate'}>{toast.message}</span>
            {toast.kind !== 'closed' && (
              <button
                onClick={() => { dismissToast(); openCart(); }}
                className="shrink-0 bg-tasty-terracotta hover:bg-tasty-terracotta-dark px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
              >
                View order
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {itemCount > 0 && !isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCart}
            className="fixed bottom-20 sm:bottom-5 inset-x-0 mx-auto w-fit z-40 flex items-center gap-3 whitespace-nowrap bg-tasty-terracotta hover:bg-tasty-terracotta-dark text-white pl-4 pr-5 py-3 rounded-full shadow-2xl font-bold text-sm transition-colors"
          >
            <span className="relative">
              <Icon icon="mdi:shopping" className="text-xl" />
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-white text-tasty-terracotta text-[10px] font-extrabold flex items-center justify-center">
                {itemCount}
              </span>
            </span>
            <span>View order</span>
            <span className="opacity-60">•</span>
            <span>{eur(subtotal)}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Cart drawer: cart -> checkout (delivery/pickup + address) -> sent   */
/* ------------------------------------------------------------------ */
export const CartDrawer: React.FC = () => {
  const { items, itemCount, subtotal, isOpen, isClosed, closeCart, updateQuantity, removeItem, clearCart } = useCart();

  const saved = loadDetails();
  const [step, setStep] = useState<Step>('cart');
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [name, setName] = useState(saved.name || '');
  const [address, setAddress] = useState(saved.address || '');
  const [notes, setNotes] = useState('');
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [lastUrl, setLastUrl] = useState('');

  // Delivery adds a flat fee; pickup is free
  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  // Always start from the cart view when the drawer is opened
  useEffect(() => {
    if (isOpen) {
      setStep('cart');
      setOrderType('delivery'); // delivery is always the default choice
      setTriedSubmit(false);
    }
  }, [isOpen]);

  // Lock page scroll + close on Escape while open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeCart]);

  // If the cart empties out while checking out, go back to the cart view
  useEffect(() => {
    if (items.length === 0 && step === 'checkout') setStep('cart');
  }, [items.length, step]);

  const addressMissing = orderType === 'delivery' && address.trim().length < 5;

  const handleSend = () => {
    setTriedSubmit(true);
    if (isClosed || addressMissing || items.length === 0) return;

    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify({ name, address }));
    } catch { /* ignore */ }

    const url = getWhatsAppOrderUrl(
      formatCartOrderMessage({ items, subtotal, deliveryFee, total, orderType, customerName: name, address, notes })
    );
    setLastUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
    setStep('sent');
  };

  const goToMenu = () => {
    closeCart();
    setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 250);
  };

  const finish = () => {
    clearCart();
    setNotes('');
    closeCart();
  };

  const inputClass =
    'w-full px-4 py-3 rounded-2xl bg-white border border-tasty-sage/30 text-tasty-charcoal placeholder-tasty-charcoal-muted text-sm focus:outline-none focus:border-tasty-teal focus:ring-2 focus:ring-tasty-teal/20 transition-all';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="Your order">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-tasty-charcoal/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md h-full bg-[#FDFBF7] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-tasty-terracotta/15 bg-white/70">
              <div className="flex items-center gap-2.5">
                {step === 'checkout' && (
                  <button
                    onClick={() => setStep('cart')}
                    className="w-8 h-8 rounded-full bg-tasty-bg-warm border border-tasty-charcoal/10 flex items-center justify-center hover:bg-tasty-terracotta-light transition-colors"
                    aria-label="Back to cart"
                  >
                    <Icon icon="mdi:arrow-left" />
                  </button>
                )}
                <div>
                  <h2 className="font-serif text-xl font-bold text-tasty-charcoal leading-tight">
                    {step === 'cart' && 'Your Order'}
                    {step === 'checkout' && 'Almost there'}
                    {step === 'sent' && 'Order ready'}
                  </h2>
                  {step !== 'sent' && (
                    <p className="text-[11px] text-tasty-charcoal-muted font-medium">
                      {step === 'cart'
                        ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
                        : 'Step 2 of 2 · Delivery details'}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-white border border-tasty-charcoal/10 flex items-center justify-center hover:bg-tasty-terracotta-light transition-colors"
                aria-label="Close"
              >
                <Icon icon="mdi:close" className="text-xl" />
              </button>
            </div>

            {/* ---------------- STEP 1: CART ---------------- */}
            {step === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                    <div className="w-20 h-20 rounded-full bg-tasty-terracotta-light text-tasty-terracotta flex items-center justify-center text-4xl">
                      <Icon icon="mdi:shopping-outline" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-tasty-charcoal">Your order is empty</h3>
                    <p className="text-sm text-tasty-charcoal-muted">
                      Pick your favourite dishes from the menu and add them here.
                    </p>
                    <button
                      onClick={goToMenu}
                      className="px-6 py-3 rounded-full bg-tasty-teal hover:bg-tasty-teal-dark text-white text-sm font-bold shadow-sm transition-colors"
                    >
                      Browse the menu
                    </button>
                  </div>
                ) : (
                  <>
                    {isClosed && <ClosedNotice />}
                    <ul className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <motion.li
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            className="flex gap-3 bg-white rounded-2xl p-3 border border-tasty-sage/20 shadow-tasty-soft"
                          >
                            <div className="w-16 h-16 shrink-0 rounded-xl bg-tasty-bg-warm flex items-center justify-center p-1">
                              <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-serif text-sm font-bold text-tasty-charcoal leading-snug">{item.name}</h3>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-tasty-charcoal-muted hover:text-tasty-terracotta transition-colors shrink-0"
                                  aria-label={`Remove ${item.name}`}
                                >
                                  <Icon icon="mdi:trash-can-outline" className="text-lg" />
                                </button>
                              </div>
                              {item.customizations && item.customizations.length > 0 && (
                                <ul className="mt-1 space-y-0.5">
                                  {item.customizations.map((c, i) => (
                                    <li key={i} className="text-[11px] text-tasty-charcoal-muted leading-snug">{c}</li>
                                  ))}
                                </ul>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <div className="inline-flex items-center rounded-full border border-tasty-charcoal/15 bg-tasty-bg-warm">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-tasty-terracotta-light transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <Icon icon="mdi:minus" />
                                  </button>
                                  <span className="w-6 text-center text-sm font-bold text-tasty-charcoal">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-tasty-terracotta-light transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    <Icon icon="mdi:plus" />
                                  </button>
                                </div>
                                <span className="font-bold text-tasty-charcoal">{eur(item.price * item.quantity)}</span>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>

                    <div className="px-5 sm:px-6 py-4 border-t border-tasty-terracotta/15 bg-white/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-tasty-charcoal-muted">Subtotal</span>
                        <span className="text-2xl font-bold text-tasty-charcoal">{eur(subtotal)}</span>
                      </div>
                      <button
                        onClick={() => setStep('checkout')}
                        disabled={isClosed}
                        className="w-full py-3.5 rounded-full bg-tasty-terracotta hover:bg-tasty-terracotta-dark text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
                      >
                        <span>Continue</span>
                        <Icon icon="mdi:arrow-right" className="text-lg" />
                      </button>
                      <button
                        onClick={clearCart}
                        className="w-full text-xs font-semibold text-tasty-charcoal-muted hover:text-tasty-terracotta transition-colors"
                      >
                        Clear order
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ---------------- STEP 2: CHECKOUT ---------------- */}
            {step === 'checkout' && (
              <>
                <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
                  {/* Order type */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider">How would you like it?</span>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { id: 'delivery' as OrderType, label: 'Delivery', sub: `+${eur(DELIVERY_FEE)} · To your door`, icon: 'mdi:moped' },
                        { id: 'pickup' as OrderType, label: 'Pickup', sub: 'Free · Collect at the shop', icon: 'mdi:store-outline' },
                      ]).map((opt) => {
                        const active = orderType === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setOrderType(opt.id)}
                            className={`text-left p-4 rounded-2xl border-2 transition-all ${
                              active
                                ? 'border-tasty-terracotta bg-tasty-terracotta-light shadow-sm'
                                : 'border-tasty-sage/30 bg-white hover:border-tasty-terracotta/40'
                            }`}
                            aria-pressed={active}
                          >
                            <Icon icon={opt.icon} className={`text-2xl mb-1.5 ${active ? 'text-tasty-terracotta' : 'text-tasty-charcoal-muted'}`} />
                            <div className="font-bold text-sm text-tasty-charcoal">{opt.label}</div>
                            <div className="text-[11px] text-tasty-charcoal-muted">{opt.sub}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery address OR shop address */}
                  {orderType === 'delivery' ? (
                    <div className="space-y-1.5">
                      <label htmlFor="cart-address" className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider">
                        Delivery address <span className="text-tasty-terracotta">*</span>
                      </label>
                      <textarea
                        id="cart-address"
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, house number, postcode, Hilversum"
                        className={`${inputClass} resize-none ${triedSubmit && addressMissing ? 'border-red-400 ring-2 ring-red-200' : ''}`}
                      />
                      {triedSubmit && addressMissing && (
                        <p className="text-xs font-semibold text-red-600">Please enter your delivery address.</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-tasty-teal-light border border-tasty-teal/20">
                      <Icon icon="mdi:map-marker" className="text-tasty-teal text-2xl shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider">Pick up at</div>
                        <div className="text-sm font-semibold text-tasty-charcoal mt-0.5">TASTY · {SHOP_ADDRESS}</div>
                        <div className="text-[11px] text-tasty-charcoal-muted mt-0.5">We'll confirm your pickup time on WhatsApp.</div>
                      </div>
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="cart-name" className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider">
                      Your name <span className="text-tasty-charcoal-muted normal-case font-medium">(optional)</span>
                    </label>
                    <input
                      id="cart-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="So we know who to call out"
                      className={inputClass}
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label htmlFor="cart-notes" className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider">
                      Notes <span className="text-tasty-charcoal-muted normal-case font-medium">(optional)</span>
                    </label>
                    <textarea
                      id="cart-notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="No onions, extra garlic sauce, ring the bell…"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Summary */}
                  <div className="rounded-2xl bg-white border border-tasty-sage/20 p-4 space-y-1.5">
                    <span className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider">Summary</span>
                    {items.map((i) => (
                      <div key={i.id} className="flex justify-between gap-3 text-xs text-tasty-charcoal">
                        <span className="min-w-0 truncate">{i.quantity}× {i.name}</span>
                        <span className="font-semibold shrink-0">{eur(i.price * i.quantity)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3 text-xs text-tasty-charcoal-muted pt-1.5 mt-1.5 border-t border-tasty-sage/20">
                      <span>Subtotal</span>
                      <span className="font-semibold">{eur(subtotal)}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-xs text-tasty-charcoal-muted">
                      <span>{orderType === 'delivery' ? 'Delivery fee' : 'Pickup'}</span>
                      <span className="font-semibold">{orderType === 'delivery' ? eur(deliveryFee) : 'Free'}</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-4 border-t border-tasty-terracotta/15 bg-white/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-tasty-charcoal-muted">Total</span>
                    <span className="text-2xl font-bold text-tasty-charcoal">{eur(total)}</span>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={isClosed}
                    className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    <Icon icon="mdi:whatsapp" className="text-xl" />
                    <span>Send order via WhatsApp</span>
                  </button>
                  <p className="text-[11px] text-center text-tasty-charcoal-muted">
                    {orderType === 'delivery' ? `Includes ${eur(DELIVERY_FEE)} delivery fee.` : 'No delivery fee for pickup.'}
                  </p>
                </div>
              </>
            )}

            {/* ---------------- STEP 3: SENT ---------------- */}
            {step === 'sent' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                  className="w-20 h-20 rounded-full bg-[#25D366] text-white flex items-center justify-center text-4xl shadow-lg"
                >
                  <Icon icon="mdi:whatsapp" />
                </motion.div>
                <h3 className="font-serif text-2xl font-bold text-tasty-charcoal">WhatsApp is open</h3>
                <p className="text-sm text-tasty-charcoal-muted leading-relaxed">
                  Your order is written and ready. Just press <strong>Send</strong> in WhatsApp and we'll confirm it with you.
                </p>
                <div className="w-full space-y-2.5 pt-2">
                  <a
                    href={lastUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:open-in-new" />
                    <span>WhatsApp didn't open? Try again</span>
                  </a>
                  <button
                    onClick={() => setStep('cart')}
                    className="w-full py-2.5 rounded-full bg-white border border-tasty-charcoal/15 text-tasty-charcoal font-semibold text-sm hover:bg-tasty-terracotta-light transition-colors"
                  >
                    Edit my order
                  </button>
                  <button
                    onClick={finish}
                    className="w-full py-2.5 rounded-full bg-tasty-charcoal hover:bg-tasty-teal-dark text-white font-semibold text-sm transition-colors"
                  >
                    Done — start a new order
                  </button>
                  <a
                    href="tel:0352042001"
                    className="block text-xs font-semibold text-tasty-charcoal-muted hover:text-tasty-terracotta transition-colors pt-1"
                  >
                    Prefer to call? {RESTAURANT_PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
