import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

export const VisitorCounterBadge: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState(1482);
  const [activeNow, setActiveNow] = useState(19);

  useEffect(() => {
    // Simulate real-time live visitors incrementing
    const interval = setInterval(() => {
      setVisitorCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
      setActiveNow((prev) => Math.max(12, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-tasty-teal/20 shadow-md text-xs"
    >
      <div className="flex items-center gap-1.5 font-bold text-tasty-charcoal">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-emerald-700">{activeNow} Diners Live</span>
      </div>

      <span className="text-tasty-sage font-bold">•</span>

      <div className="flex items-center gap-1 font-semibold text-tasty-charcoal-muted">
        <Icon icon="mdi:eye-outline" className="text-tasty-teal text-sm" />
        <AnimatePresence mode="wait">
          <motion.span
            key={visitorCount}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-bold text-tasty-teal"
          >
            {visitorCount.toLocaleString()}
          </motion.span>
        </AnimatePresence>
        <span>Hilversum Visitors Today</span>
      </div>
    </motion.div>
  );
};
