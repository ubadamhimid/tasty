import React from 'react';
import { Icon } from '@iconify/react';

export const SidewaysMarquee: React.FC = () => {
  const marqueeItems = [
    { text: 'AUTHENTIC LEVANTINE FLAVOURS', icon: 'mdi:star-four-points' },
    { text: 'STONE-BAKED MANAQISH', icon: 'mdi:bread-slice-outline' },
    { text: 'SIGNATURE KAPSALON KIP & LAMS', icon: 'mdi:food' },
    { text: 'HOMEMADE GARLIC TOUM & MOHAMARA', icon: 'mdi:bowl-mix' },
    { text: 'FRESHLY BAKED DAILY IN HILVERSUM', icon: 'mdi:map-marker-radius' },
    { text: 'CRAFT YOUR LEVANTINE BOWL', icon: 'mdi:magic-staff' },
    { text: '100% FRESH HALAL QUALITY', icon: 'mdi:shield-check' },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-tasty-teal via-[#538a87] to-tasty-teal text-white py-4 overflow-hidden shadow-md relative z-10 border-y border-white/20">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Double the array for seamless infinite looping */}
        {[...marqueeItems, ...marqueeItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 mx-6 font-bold text-xs sm:text-sm tracking-widest uppercase">
            <span>{item.text}</span>
            <Icon icon={item.icon} className="text-tasty-sage text-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};
