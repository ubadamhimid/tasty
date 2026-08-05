import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export const OurStory: React.FC = () => {
  const pillars = [
    {
      title: "Wild Levantine Spices",
      desc: "Imported za’atar herbs, sumac, and fragrant Aleppo spices blended in-house for authentic taste.",
      icon: "mdi:shaker-outline",
      color: "bg-tasty-terracotta-light text-tasty-terracotta"
    },
    {
      title: "Stone Oven Mastery",
      desc: "Every Manaqish flatbread is hand-stretched and baked in our stone oven until perfectly golden.",
      icon: "mdi:fire",
      color: "bg-tasty-teal-light text-tasty-teal"
    },
    {
      title: "Whipped Toum & Dips",
      desc: "Zero preservatives. Silky garlic toum, creamy hummus, and rich mohamara made daily from scratch.",
      icon: "mdi:bowl-mix-outline",
      color: "bg-tasty-sage-light text-tasty-teal"
    },
    {
      title: "Hilversum Fresh",
      desc: "Proudly serving the Hilversum community with 100% fresh, locally sourced halal ingredients.",
      icon: "mdi:heart-outline",
      color: "bg-amber-50 text-amber-700"
    }
  ];

  return (
    <section id="story" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Background Watermark Leaf Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 leaf-pattern-overlay pointer-events-none opacity-40 -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Visual Column - Organic Food Cutouts Grid */}
        <div className="lg:col-span-6 relative">
          <div className="grid grid-cols-2 gap-4 text-left">
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="space-y-4"
            >
              <div className="h-64 sm:h-72 rounded-3xl overflow-hidden bg-tasty-bg-warm p-4 border border-tasty-sage/20 shadow-tasty-soft flex items-center justify-center">
                <img 
                  src="/images/falafel-hummus-bowl.webp" 
                  alt="Real TASTY Falafel Feast Bowl" 
                  loading="lazy"
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="glass-panel p-5 rounded-2xl space-y-1">
                <span className="text-2xl font-bold font-serif text-tasty-terracotta">100%</span>
                <p className="text-xs text-tasty-charcoal-muted font-medium">Stone-baked dough prepared fresh every morning.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="space-y-4 pt-8"
            >
              <div className="glass-panel p-5 rounded-2xl space-y-1">
                <span className="text-2xl font-bold font-serif text-tasty-teal">4.9★</span>
                <p className="text-xs text-tasty-charcoal-muted font-medium">Rated top fast-casual Levantine kitchen in Hilversum.</p>
              </div>
              <div className="h-64 sm:h-72 rounded-3xl overflow-hidden bg-tasty-bg-warm p-4 border border-tasty-teal/20 shadow-tasty-soft flex items-center justify-center">
                <img 
                  src="/images/hummus-dip.webp" 
                  alt="Real TASTY Homemade Hummus Dip" 
                  loading="lazy"
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </motion.div>

          </div>
        </div>

        {/* Right Content Column - Editorial Story */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-tasty-terracotta text-xs font-extrabold uppercase tracking-widest bg-tasty-terracotta-light px-3.5 py-1.5 rounded-full">
              <Icon icon="mdi:pot-steam-outline" />
              Our Heritage & Passion
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-tasty-charcoal leading-tight">
              Bringing the Rich Traditions of the Levant to Hilversum.
            </h2>
            <p className="text-tasty-charcoal-muted text-base leading-relaxed">
              At <strong className="text-tasty-teal">TASTY</strong>, we believe food is a celebration of culture and community. We brought the vibrant, aromatic street food traditions of the Levantine coast directly to Hilversum—reimagined in a contemporary, fast-casual setting.
            </p>
            <p className="text-tasty-charcoal-muted text-sm leading-relaxed">
              Every dish is crafted with reverence for traditional technique: dough stretched fresh for stone-oven Manaqish, slow-marinated chicken shawarma roasted to juicy perfection, and dips whipped daily using pure extra virgin olive oil.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {pillars.map((p, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-tasty-sage/20 shadow-sm space-y-2">
                <div className={`w-9 h-9 rounded-xl ${p.color} flex items-center justify-center`}>
                  <Icon icon={p.icon} className="text-xl" />
                </div>
                <h4 className="font-serif font-bold text-sm text-tasty-charcoal">{p.title}</h4>
                <p className="text-tasty-charcoal-muted text-xs leading-normal">{p.desc}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
