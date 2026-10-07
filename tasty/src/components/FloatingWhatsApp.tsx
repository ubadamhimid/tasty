import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { getWhatsAppOrderUrl, formatGeneralInquiryMessage } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 select-none">
      
      {/* Sleek Tooltip Pill (Visible on Desktop hover or subtle pulse) */}
      <span
        className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-gray-800 shadow-md border border-emerald-200/80 text-xs font-bold pointer-events-none"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Bestel via WhatsApp 🛵</span>
      </span>

      {/* Direct WhatsApp Open Button (No popup, instant 1-tap open) */}
      <motion.a
        href={getWhatsAppOrderUrl(formatGeneralInquiryMessage())}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all group"
        aria-label="Chat direct via WhatsApp"
        title="Bestel direct via WhatsApp (+31 6 84632782)"
      >
        <Icon icon="mdi:whatsapp" className="text-2xl sm:text-3xl text-white group-hover:scale-110 transition-transform" />
      </motion.a>

    </aside>
  );
};
