import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export const BowlCustomizer: React.FC = () => {
  const [selectedBase, setSelectedBase] = useState('Fragrant Spiced Rice');
  const [selectedProtein, setSelectedProtein] = useState('Chicken Shawarma');
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['Pickled Pink Turnips', 'Sumac Onions']);
  const [selectedSauces, setSelectedSauces] = useState<string[]>(['Garlic Toum']);

  const bases = [
    { name: 'Fragrant Spiced Rice', price: 0, icon: 'mdi:rice' },
    { name: 'Crispy Steak Fries', price: 0.50, icon: 'mdi:french-fries' },
    { name: 'Fresh Salad Bed', price: 0, icon: 'mdi:leaf' },
    { name: 'Half Rice & Half Fries', price: 0.75, icon: 'mdi:food' },
  ];

  const proteins = [
    { name: 'Chicken Shawarma', price: 12.50, icon: 'mdi:food-drumstick' },
    { name: 'Spiced Lamb Doner', price: 13.50, icon: 'mdi:food-variant' },
    { name: 'Crispy Chicken Cutlets', price: 13.90, icon: 'mdi:food-steak' },
    { name: 'Grilled Halloumi & Falafel', price: 11.90, icon: 'mdi:cheese' },
  ];

  const toppings = [
    'Pickled Pink Turnips', 'Sumac Onions', 'Crispy Cucumbers & Tomatoes', 
    'Pomegranate Seeds', 'Roasted Eggplant', 'Toasted Sesame'
  ];

  const sauces = [
    'Garlic Toum', 'Mohamara Red Pepper', 'Creamy Tahini', 'Spicy Shatta Chilli'
  ];

  // Calculate Base Price according to protein choice + extra base cost
  const selectedProteinObj = proteins.find(p => p.name === selectedProtein) || proteins[0];
  const selectedBaseObj = bases.find(b => b.name === selectedBase) || bases[0];
  const totalPrice = selectedProteinObj.price + selectedBaseObj.price;

  const toggleTopping = (topping: string) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter(t => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const toggleSauce = (sauce: string) => {
    if (selectedSauces.includes(sauce)) {
      setSelectedSauces(selectedSauces.filter(s => s !== sauce));
    } else {
      setSelectedSauces([...selectedSauces, sauce]);
    }
  };

  return (
    <section id="customizer" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-panel-warm rounded-3xl p-6 sm:p-10 shadow-tasty-hover border border-tasty-terracotta/20 relative overflow-hidden">
        
        {/* Header */}
        <div className="max-w-2xl space-y-3 mb-10 text-left">
          <span className="inline-flex items-center gap-2 text-tasty-terracotta text-xs font-extrabold uppercase tracking-widest bg-tasty-terracotta-light px-3.5 py-1.5 rounded-full">
            <Icon icon="mdi:magic-staff" />
            Interactive Craft Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-tasty-charcoal">
            Build Your Custom Levantine Bowl
          </h2>
          <p className="text-tasty-charcoal-muted text-sm leading-relaxed">
            Mix and match your choice of base, freshly grilled protein, signature pickled toppings, and house-made toum or mohamara sauces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): Builder Options */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Step 1: Base Selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-tasty-teal text-white flex items-center justify-center text-[10px]">1</span>
                Choose Your Base
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {bases.map((base) => (
                  <button
                    key={base.name}
                    onClick={() => setSelectedBase(base.name)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      selectedBase === base.name
                        ? 'border-tasty-teal bg-white shadow-md text-tasty-teal font-bold'
                        : 'border-tasty-sage/30 bg-white/60 text-tasty-charcoal hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon icon={base.icon} className="text-xl" />
                      <span className="text-xs sm:text-sm">{base.name}</span>
                    </div>
                    {base.price > 0 && (
                      <span className="text-[10px] bg-tasty-sage-light text-tasty-teal font-bold px-2 py-0.5 rounded-full">
                        +€{base.price.toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Protein Selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-tasty-terracotta text-white flex items-center justify-center text-[10px]">2</span>
                Choose Your Main Protein
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {proteins.map((protein) => (
                  <button
                    key={protein.name}
                    onClick={() => setSelectedProtein(protein.name)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      selectedProtein === protein.name
                        ? 'border-tasty-terracotta bg-white shadow-md text-tasty-terracotta font-bold'
                        : 'border-tasty-sage/30 bg-white/60 text-tasty-charcoal hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon icon={protein.icon} className="text-xl" />
                      <span className="text-xs sm:text-sm">{protein.name}</span>
                    </div>
                    <span className="text-xs font-bold">€{protein.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Toppings */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-tasty-teal text-white flex items-center justify-center text-[10px]">3</span>
                Select Toppings
              </h3>
              <div className="flex flex-wrap gap-2">
                {toppings.map((topping) => {
                  const isSelected = selectedToppings.includes(topping);
                  return (
                    <button
                      key={topping}
                      onClick={() => toggleTopping(topping)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                        isSelected 
                          ? 'bg-tasty-teal text-white border-tasty-teal shadow-sm' 
                          : 'bg-white text-tasty-charcoal border-tasty-sage/30 hover:bg-tasty-sage-light'
                      }`}
                    >
                      <Icon icon={isSelected ? "mdi:check" : "mdi:plus"} />
                      <span>{topping}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: House Sauces */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-tasty-charcoal uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-tasty-terracotta text-white flex items-center justify-center text-[10px]">4</span>
                Select Signature Sauces
              </h3>
              <div className="flex flex-wrap gap-2">
                {sauces.map((sauce) => {
                  const isSelected = selectedSauces.includes(sauce);
                  return (
                    <button
                      key={sauce}
                      onClick={() => toggleSauce(sauce)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                        isSelected 
                          ? 'bg-tasty-terracotta text-white border-tasty-terracotta shadow-sm' 
                          : 'bg-white text-tasty-charcoal border-tasty-sage/30 hover:bg-tasty-terracotta-light'
                      }`}
                    >
                      <Icon icon={isSelected ? "mdi:check" : "mdi:plus"} />
                      <span>{sauce}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Live Visual Bowl Summary Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-tasty-soft border border-tasty-teal/20 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-tasty-sage/20 pb-4">
              <h3 className="font-serif text-lg font-bold text-tasty-charcoal flex items-center gap-2">
                <Icon icon="mdi:bowl-mix" className="text-tasty-teal text-xl" />
                <span>Your Bowl Summary</span>
              </h3>
              <span className="text-xs font-bold text-tasty-terracotta bg-tasty-terracotta-light px-3 py-1 rounded-full">
                Freshly Assembled
              </span>
            </div>

            {/* Visual Bowl Layer Display */}
            <div className="space-y-3 bg-tasty-bg-warm rounded-2xl p-4 border border-tasty-sage/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-tasty-charcoal-muted">Base:</span>
                <span className="font-bold text-tasty-charcoal">{selectedBase}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-tasty-charcoal-muted">Protein:</span>
                <span className="font-bold text-tasty-terracotta">{selectedProtein}</span>
              </div>
              <div className="text-xs space-y-1 pt-1 border-t border-tasty-sage/20">
                <span className="text-tasty-charcoal-muted block">Toppings ({selectedToppings.length}):</span>
                <div className="flex flex-wrap gap-1">
                  {selectedToppings.map((t, i) => (
                    <span key={i} className="bg-white text-tasty-teal text-[10px] font-bold px-2 py-0.5 rounded-full border border-tasty-teal/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs space-y-1 pt-1">
                <span className="text-tasty-charcoal-muted block">Sauces ({selectedSauces.length}):</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSauces.map((s, i) => (
                    <span key={i} className="bg-tasty-terracotta-light text-tasty-terracotta text-[10px] font-bold px-2 py-0.5 rounded-full border border-tasty-terracotta/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Phone Order Action */}
            <div className="pt-2 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-tasty-charcoal-muted font-semibold">Estimated Price:</span>
                <span className="text-2xl font-bold text-tasty-charcoal">€{totalPrice.toFixed(2)}</span>
              </div>

              <motion.a 
                href="tel:0352042001"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-full bg-tasty-teal text-white font-bold text-sm shadow-tasty-hover hover:bg-tasty-teal-dark transition-all flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:phone" className="text-lg" />
                <span>Call to Order This Bowl • 035 204 2001</span>
              </motion.a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
