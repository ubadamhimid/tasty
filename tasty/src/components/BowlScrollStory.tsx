import React, { useEffect, useRef, useState } from 'react';
import { motion, MotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useCart } from '../context/CartContext';

/**
 * "Built layer by layer": the Shish Taouk bowl starts as separate ingredients
 * stacked vertically with labels, and assembles itself as the user scrolls.
 *
 * Each layer is a transparent 2048x2048 image in /public/images/layers/skewers-bowl/,
 * already positioned on the canvas so that stacking them builds the full bowl.
 * `bowl-front` is the bowl's front wall, drawn over the rice so it sits inside the bowl.
 */
const LAYER_DIR = '/images/layers/skewers-bowl';

const BOWL = {
  id: 'bowl-shish-taouk',
  name: 'Tasty Shish Taouk Bowl',
  price: 12,
  image: '/images/chicken-skewers-bowl.webp',
};

// Top of the stack first. `merge` is the scroll range in which the layer drops into place.
const LAYERS = [
  { key: 'skewers', label: 'Fire-grilled Shish Taouk', note: '24h marinade · charcoal grill', merge: [0.5, 0.72], tilt: 7 },
  { key: 'veg', label: 'Tomatoes, lime & fresh salad', note: 'Cut fresh every morning', merge: [0.36, 0.6], tilt: -6 },
  { key: 'rice', label: 'Yellow spiced rice', note: 'Turmeric & saffron basmati', merge: [0.22, 0.48], tilt: 5 },
  { key: 'bowl', label: 'Eco kraft bowl', note: '100% compostable', merge: [0.12, 0.36], tilt: -4 },
] as const;

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
};

const Layer: React.FC<{
  progress: MotionValue<number>;
  layer: (typeof LAYERS)[number];
  index: number;
  isDesktop: boolean;
  image?: string;
  zIndex?: number;
}> = ({ progress, layer, index, isDesktop, image = layer.key, zIndex = LAYERS.length - index }) => {
  const [start, end] = layer.merge;
  const gap = isDesktop ? 21 : 17; // vh between stacked layers
  const startY = (index - (LAYERS.length - 1) / 2) * gap;

  const y = useTransform(progress, [start, end], [`${startY}vh`, '0vh']);
  const scale = useTransform(progress, [start, end], [isDesktop ? 0.5 : 0.56, 1]);
  const rotate = useTransform(progress, [start, end], [layer.tilt, 0]);
  const labelOpacity = useTransform(progress, [0, 0.04, start, start + 0.06], [0, 1, 1, 0]);
  const labelX = useTransform(progress, [0, 0.04], [24, 0]);

  return (
    <motion.div style={{ y, zIndex }} className="absolute inset-0">
      <motion.img
        src={`${LAYER_DIR}/${image}.webp`}
        alt=""
        style={{ scale, rotate }}
        className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_22px_rgba(43,58,57,0.18)] will-change-transform"
        draggable={false}
      />
      {image === layer.key && (
      <motion.div
        style={{ opacity: labelOpacity, x: labelX }}
        className="absolute top-1/2 -mt-6 left-[73%] lg:left-[78%] w-[42vw] lg:w-64 flex items-center gap-2 lg:gap-3 pointer-events-none"
      >
        <span className="h-px w-5 lg:w-12 bg-tasty-charcoal/30 shrink-0" />
        <div>
          <p className="text-sm lg:text-lg font-semibold text-[#1A1A1A] leading-tight">{layer.label}</p>
          <p className="text-[11px] lg:text-sm text-tasty-charcoal-muted">{layer.note}</p>
        </div>
      </motion.div>
      )}
    </motion.div>
  );
};

export const BowlScrollStory: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const { addItem } = useCart();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  // Stack sits left to leave room for labels, centres once assembled,
  // then slides left on desktop for the call to action.
  const stackX = useTransform(
    progress,
    [0, 0.5, 0.72, 0.82, 0.92],
    isDesktop ? ['8vw', '8vw', '0vw', '0vw', '-16vw'] : ['-17vw', '-17vw', '0vw', '0vw', '0vw']
  );
  const stackY = useTransform(progress, [0.72, 0.82], ['0vh', isDesktop ? '0vh' : '-8vh']);
  const glowOpacity = useTransform(progress, [0.6, 0.78], [0.15, 0.45]);

  const introOpacity = useTransform(progress, [0, 0.08], [1, 0]);
  const introY = useTransform(progress, [0, 0.08], [0, -30]);
  const ctaOpacity = useTransform(progress, [0.84, 0.92], [0, 1]);
  const ctaY = useTransform(progress, [0.84, 0.92], [40, 0]);
  const ctaPointer = useTransform(progress, (v) => (v > 0.86 ? 'auto' : 'none'));
  const barScale = useTransform(progress, [0.1, 0.8], [0, 1]);

  const handleAdd = () => addItem({ id: BOWL.id, name: BOWL.name, price: BOWL.price, image: BOWL.image });

  if (reduceMotion) {
    return (
      <section id="bowl-story" className="py-20 bg-tasty-bg-warm">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <img src={BOWL.image} alt={BOWL.name} className="w-full max-w-md mx-auto" loading="lazy" />
          <div className="space-y-4">
            {LAYERS.map((l) => (
              <div key={l.key}>
                <h3 className="text-xl font-serif font-bold">{l.label}</h3>
                <p className="text-tasty-charcoal-muted">{l.note}</p>
              </div>
            ))}
            <button onClick={handleAdd} className="px-6 py-3 rounded-full bg-tasty-terracotta text-white font-semibold">
              Add to order · €{BOWL.price.toFixed(2)}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="bowl-story" ref={sectionRef} className="relative h-[420vh] bg-tasty-bg-warm">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Intro heading */}
        <div className="absolute inset-x-4 top-20 sm:top-24 lg:inset-y-0 lg:top-0 lg:left-[6vw] lg:right-auto lg:w-[30vw] z-20 flex flex-col lg:justify-center pointer-events-none">
        <motion.div style={{ opacity: introOpacity, y: introY }} className="text-center lg:text-left">
          <span className="font-handwriting text-2xl text-tasty-terracotta">Chef Special</span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1A1A1A]">
            Built <span className="italic font-normal text-tasty-terracotta">layer by layer</span>
          </h2>
          <p className="mt-2 text-sm text-tasty-charcoal-muted flex items-center justify-center lg:justify-start gap-1.5">
            <Icon icon="ph:mouse-scroll" className="text-lg" /> Scroll to build your Shish Taouk bowl
          </p>
        </motion.div>
        </div>

        {/* The stack */}
        <motion.div style={{ x: stackX, y: stackY }} className="absolute inset-0 flex items-center justify-center pt-16">
          <motion.div
            style={{ opacity: glowOpacity }}
            className="absolute w-[60vmin] h-[60vmin] rounded-full bg-tasty-terracotta blur-3xl"
          />
          <div className="relative w-[84vmin] lg:w-[62vmin] max-w-[620px] aspect-square">
            {LAYERS.map((layer, i) => (
              <Layer
                key={layer.key}
                progress={progress}
                layer={layer}
                index={i}
                isDesktop={isDesktop}
                zIndex={layer.key === 'skewers' ? LAYERS.length + 1 : undefined}
              />
            ))}
            <Layer
              progress={progress}
              layer={LAYERS[LAYERS.length - 1]}
              index={LAYERS.length - 1}
              isDesktop={isDesktop}
              image="bowl-front"
              zIndex={LAYERS.length}
            />
          </div>
        </motion.div>

        {/* Final call to action */}
        <div className="absolute inset-x-4 bottom-24 sm:bottom-10 lg:inset-x-auto lg:right-[6vw] lg:top-0 lg:bottom-0 lg:w-[34%] z-20 flex flex-col lg:justify-center pointer-events-none">
          <motion.div style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaPointer }} className="text-center lg:text-left">
            <span className="font-handwriting text-2xl text-tasty-terracotta">Ready in minutes</span>
            <h3 className="mt-1 text-2xl sm:text-5xl font-serif font-bold text-[#1A1A1A]">{BOWL.name}</h3>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-tasty-charcoal-muted">
              Grilled chicken skewers · Yellow rice · Fresh salad · House sauce
            </p>
            <div className="mt-4 sm:mt-6 flex items-center justify-center lg:justify-start gap-4">
              <span className="text-3xl font-bold text-tasty-charcoal">€{BOWL.price.toFixed(2)}</span>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-tasty-terracotta hover:bg-tasty-terracotta-dark text-white font-semibold shadow-terracotta-glow transition-colors"
              >
                <Icon icon="ph:plus-bold" /> Add to order
              </button>
            </div>
          </motion.div>
        </div>

        {/* Progress rail */}
        <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-40 w-[3px] rounded-full bg-tasty-charcoal/10 hidden sm:block">
          <motion.div style={{ scaleY: barScale }} className="h-full w-full origin-top rounded-full bg-tasty-terracotta" />
        </div>
      </div>
    </section>
  );
};
