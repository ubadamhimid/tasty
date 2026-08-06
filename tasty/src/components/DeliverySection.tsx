import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export const DeliverySection: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <section id="delivery" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Banner: Visit Us / Phone Callout */}
      <div className="bg-gradient-to-r from-tasty-teal via-[#4c817e] to-tasty-teal text-white rounded-3xl p-8 sm:p-12 shadow-tasty-hover relative overflow-hidden mb-16">
        <div className="absolute right-0 top-0 w-96 h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-8 space-y-4 text-left">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
              <Icon icon="mdi:store-outline" className="text-base" />
              Dine-In & Express Takeaway
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              Visit TASTY in Hilversum or Call for Pickup
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
              Experience authentic Levantine hospitality in our warm Hilversum kitchen, or call us directly at <strong>035 204 2001</strong> to place your order for fast takeaway pickup.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="tel:0352042001"
                className="bg-white text-tasty-teal hover:bg-tasty-sage-light font-bold px-7 py-3.5 rounded-full text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Icon icon="mdi:phone" className="text-xl text-tasty-teal" />
                <span>Call 035 204 2001</span>
              </a>
              <a 
                href="#contact" 
                className="bg-tasty-terracotta hover:bg-tasty-terracotta-dark text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Icon icon="mdi:map-marker" className="text-xl" />
                <span>View Store Location</span>
              </a>
            </div>
          </div>

          {/* QR Code Display Card */}
          <div className="lg:col-span-4 flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="bg-white text-tasty-charcoal p-6 rounded-3xl shadow-2xl text-center space-y-3 max-w-xs w-full"
            >
              <div className="bg-tasty-bg-warm p-4 rounded-2xl border border-tasty-sage/30 flex items-center justify-center">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://tasty-hilversum.nl&color=2B3A39&bgcolor=FFFDF9" 
                  alt="Scan Mobile Menu QR Code" 
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-tasty-charcoal">Scan Mobile Menu</h4>
                <p className="text-tasty-charcoal-muted text-xs">View full digital menu on your smartphone</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Grid: Location & Hours + Contact Form */}
      <div id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left (6 cols): Store Details & Opening Hours */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-tasty-sage/20 shadow-tasty-soft space-y-6">
          <div className="space-y-2">
            <span className="text-tasty-teal text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="mdi:map-marker" /> Store Location
            </span>
            <h3 className="text-2xl font-serif font-bold text-tasty-charcoal">
              Visit TASTY Hilversum
            </h3>
            <p className="text-tasty-charcoal-muted text-sm leading-relaxed">
              Located in the heart of Hilversum. Dine-in in our warm minimalist kitchen or grab a fresh wrap on the go.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-tasty-bg-warm border border-tasty-sage/20">
              <Icon icon="mdi:map-marker-radius" className="text-tasty-teal text-2xl shrink-0 mt-0.5" />
              <div>
                <strong className="block text-tasty-charcoal">Address</strong>
                <span className="text-tasty-charcoal-muted">Leeuwenstraat 14, 1211 MD Hilversum</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-tasty-bg-warm border border-tasty-sage/20">
              <Icon icon="mdi:phone-in-talk" className="text-tasty-terracotta text-2xl shrink-0 mt-0.5" />
              <div>
                <strong className="block text-tasty-charcoal">Direct Telephone</strong>
                <a href="tel:0352042001" className="text-tasty-teal hover:underline font-semibold">035 204 2001</a>
              </div>
            </div>

            {/* Opening Hours Table */}
            <div className="p-4 rounded-2xl bg-tasty-teal-light border border-tasty-teal/20 space-y-2">
              <div className="flex items-center gap-2 font-bold text-tasty-teal text-xs uppercase tracking-wider mb-2">
                <Icon icon="mdi:clock-outline" /> Opening Hours
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-tasty-teal/10">
                <span className="text-tasty-charcoal font-medium">Monday – Thursday</span>
                <span className="font-bold text-tasty-charcoal">12:00 – 22:00</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-tasty-teal/10">
                <span className="text-tasty-charcoal font-medium">Friday – Saturday</span>
                <span className="font-bold text-tasty-charcoal">12:00 – 23:00</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-tasty-charcoal font-medium">Sunday</span>
                <span className="font-bold text-tasty-charcoal">13:00 – 22:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right (6 cols): Direct Contact & Message Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-tasty-sage/20 shadow-tasty-soft space-y-6">
          <div className="space-y-2">
            <span className="text-tasty-terracotta text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="mdi:email-outline" /> Get in Touch
            </span>
            <h3 className="text-2xl font-serif font-bold text-tasty-charcoal">
              Catering & Direct Support
            </h3>
            <p className="text-tasty-charcoal-muted text-sm">
              Planning a group event in Hilversum or have questions about our menu? Send us a message!
            </p>
          </div>

          {formSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl">
                <Icon icon="mdi:check" />
              </div>
              <h4 className="font-serif font-bold text-lg text-emerald-900">Message Received!</h4>
              <p className="text-emerald-700 text-xs">
                Thank you for contacting TASTY Hilversum. Our team will get back to you shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-tasty-charcoal mb-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Jan de Vries"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-tasty-bg-warm border border-tasty-sage/30 text-sm focus:outline-none focus:border-tasty-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-tasty-charcoal mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="jan@example.nl"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-tasty-bg-warm border border-tasty-sage/30 text-sm focus:outline-none focus:border-tasty-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-tasty-charcoal mb-1">Message / Catering Request</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Tell us how we can help..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-tasty-bg-warm border border-tasty-sage/30 text-sm focus:outline-none focus:border-tasty-teal resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 rounded-full bg-tasty-teal text-white font-bold text-sm shadow-md hover:bg-tasty-teal-dark transition-colors flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:send" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F2] text-tasty-charcoal pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-tasty-teal/20 overflow-hidden">
      
      {/* Background Watermark Branding */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-7xl pointer-events-none select-none overflow-hidden opacity-5 text-center">
        <span className="font-serif font-extrabold text-[7vw] leading-none text-tasty-teal uppercase tracking-widest whitespace-nowrap">
          TASTY HILVERSUM
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-16 border-b border-tasty-sage/20 text-left">
          
          {/* Col 1 (5 Cols): Brand Identity & Nuwa Software Credit Badge */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-white shadow-md border border-tasty-teal/20">
                <img src="/images/logo.png" alt="TASTY Logo" className="h-11 w-auto object-contain" />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl text-tasty-charcoal block leading-none">TASTY</span>
                <span className="text-[11px] font-bold text-tasty-terracotta uppercase tracking-wider">Levantine Flavours</span>
              </div>
            </div>

            <p className="text-tasty-charcoal-muted text-sm max-w-sm leading-relaxed">
              Hilversum's premier fast-casual Mediterranean kitchen. Crafting stone-baked Manaqish, signature shawarma platters, fresh Levantine bowls, and homemade whipped dips daily.
            </p>

            {/* Nuwa Partner Badge under logo */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tasty-teal-light border border-tasty-teal/20 text-xs text-tasty-charcoal">
              <Icon icon="mdi:code-tags" className="text-tasty-teal text-base" />
              <span>Digital Experience by</span>
              <a 
                href="https://nuwasoftware.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-tasty-teal hover:text-tasty-terracotta hover:underline transition-colors flex items-center gap-1"
              >
                Nuwa Software
                <Icon icon="mdi:open-in-new" className="text-[10px]" />
              </a>
            </div>

            {/* Social Links Pills */}
            <div className="flex items-center gap-3 pt-1">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border border-tasty-teal/20 text-tasty-teal flex items-center justify-center shadow-sm hover:bg-tasty-teal hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Icon icon="mdi:instagram" className="text-xl" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border border-tasty-teal/20 text-tasty-teal flex items-center justify-center shadow-sm hover:bg-tasty-teal hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Icon icon="mdi:facebook" className="text-xl" />
              </a>
              <a 
                href="https://wa.me/31352042001" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-tasty-teal/20 text-tasty-teal flex items-center justify-center shadow-sm hover:bg-tasty-teal hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <Icon icon="mdi:whatsapp" className="text-xl" />
              </a>
            </div>
          </div>

          {/* Col 2 (3 Cols): Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-base text-tasty-teal flex items-center gap-2">
              <Icon icon="mdi:navigation-outline" />
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-tasty-charcoal-muted">
              <li>
                <a href="#hero" className="hover:text-tasty-terracotta hover:translate-x-1 inline-block transition-all">Home Showcase</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-tasty-terracotta hover:translate-x-1 inline-block transition-all">Menu & Dishes</a>
              </li>
              <li>
                <a href="#customizer" className="hover:text-tasty-terracotta hover:translate-x-1 inline-block transition-all">Craft Your Bowl</a>
              </li>
              <li>
                <a href="#story" className="hover:text-tasty-terracotta hover:translate-x-1 inline-block transition-all">Our Story & Heritage</a>
              </li>
              <li>
                <a href="#delivery" className="hover:text-tasty-terracotta hover:translate-x-1 inline-block transition-all">Location & Hours</a>
              </li>
            </ul>
          </div>

          {/* Col 3 (4 Cols): Store Contact & Order Pill */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif font-bold text-base text-tasty-terracotta flex items-center gap-2">
              <Icon icon="mdi:storefront-outline" />
              Hilversum Kitchen
            </h4>
            
            <div className="bg-white rounded-2xl p-5 border border-tasty-sage/30 shadow-tasty-soft space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-tasty-charcoal">
                <Icon icon="mdi:map-marker" className="text-tasty-teal text-lg shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Leeuwenstraat 14</span>
                  <span className="text-tasty-charcoal-muted">1211 MD Hilversum, Netherlands</span>
                </div>
              </div>

              <div className="pt-2 border-t border-tasty-sage/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-tasty-charcoal">Orders & Pickup:</span>
                </div>
                <a 
                  href="tel:0352042001" 
                  className="px-3.5 py-1.5 rounded-full bg-tasty-teal text-white font-bold text-xs shadow-sm hover:bg-tasty-teal-dark transition-colors"
                >
                  035 204 2001
                </a>
              </div>

              {/* Direct Google Review Button */}
              <div className="pt-2 border-t border-tasty-sage/20">
                <a
                  href="https://g.page/r/CUkMh7UTSm9TEBM/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-tasty-terracotta-light text-tasty-terracotta border border-tasty-terracotta/30 text-xs font-bold flex items-center justify-center gap-2 hover:bg-tasty-terracotta hover:text-white transition-all"
                >
                  <Icon icon="logos:google-icon" className="text-sm" />
                  <span>Leave Us a 5-Star Review ★</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-tasty-charcoal-muted">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} TASTY Levantine Flavours Hilversum. All rights reserved.</span>
          </div>

          {/* Back to Top Scroll Button */}
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-tasty-teal/20 text-tasty-teal hover:bg-tasty-teal hover:text-white font-bold transition-all duration-300 shadow-sm"
          >
            <span>Back to Top</span>
            <Icon icon="mdi:arrow-up" className="text-sm" />
          </button>
        </div>

      </div>
    </footer>
  );
};
