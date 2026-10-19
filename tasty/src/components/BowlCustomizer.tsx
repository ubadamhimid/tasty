import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useCart } from '../context/CartContext';

export const BowlCustomizer: React.FC = () => {
  const { addItem, isClosed } = useCart();
  const [selectedBase, setSelectedBase] = useState('Yellow Rice');
  const [selectedProtein, setSelectedProtein] = useState('Crispy Chicken');
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['Pickles']);
  const [selectedSauces, setSelectedSauces] = useState<string[]>(['House Sauce']);

  // Options mirror the real TASTY bowls in menuData.ts (all bowls are €12.00)
  const bases = [
    { name: 'Yellow Rice', price: 0, icon: 'mdi:rice' },
    { name: 'Golden Fries', price: 0, icon: 'mdi:french-fries' },
  ];

  const proteins = [
    { name: 'Crispy Chicken', price: 12.00, icon: 'mdi:food-drumstick', image: '/images/crispy-chicken-bowl.webp' },
    { name: 'Shish Taouk', price: 12.00, icon: 'game-icons:kebab-spit', image: '/images/chicken-skewers-bowl.webp' },
  ];

  const toppings = [
    'Pickles', 'Fresh Salad'
  ];

  const sauces = [
    'House Sauce', 'Syrian Garlic Sauce', 'Tahini Sauce', 'Spicy Mohamara'
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

  const handleAddBowl = () => {
    const customizations = [
      `Base: ${selectedBase}`,
      `Protein: ${selectedProtein}`,
      `Toppings: ${selectedToppings.length > 0 ? selectedToppings.join(', ') : 'None'}`,
      `Sauces: ${selectedSauces.length > 0 ? selectedSauces.join(', ') : 'None'}`,
    ];
    // Same recipe = same cart line (quantity goes up); different recipe = new line
    const recipeId = `custom-bowl|${selectedBase}|${selectedProtein}|${[...selectedToppings].sort().join(',')}|${[...selectedSauces].sort().join(',')}`;
    addItem({
      id: recipeId,
      name: 'Custom Levantine Bowl',
      price: totalPrice,
      image: selectedProteinObj.image,
      customizations,
    });
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
            Pick your protein, choose rice or fries, then add pickles, salad and your favourite sauce. Every Tasty bowl is €12.00.
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

            {/* Price & Order Actions */}
            <div className="pt-2 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-tasty-charcoal-muted font-semibold">Estimated Price:</span>
                <span className="text-2xl font-bold text-tasty-charcoal">€{totalPrice.toFixed(2)}</span>
              </div>

              {/* Delivery Now Available Tag */}
              <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 text-[11px] font-bold text-center">
                <span className="inline-block animate-pulse">🛵</span>
                <span>Now delivering in Hilversum! Fresh to your door</span>
              </div>

              {/* Primary: add the customized bowl to the order cart */}
              <motion.button 
                onClick={handleAddBowl}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 rounded-full text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  isClosed ? 'bg-gray-400' : 'bg-tasty-terracotta hover:bg-tasty-terracotta-dark hover:shadow-lg'
                }`}
              >
                <Icon icon="mdi:shopping-outline" className="text-xl shrink-0" />
                <span>{isClosed ? 'Closed today' : `Add Bowl to Order • €${totalPrice.toFixed(2)}`}</span>
              </motion.button>

              {/* Secondary: Phone Order */}
              <motion.a 
                href="tel:0352042001"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-2.5 rounded-full bg-tasty-bg-warm border border-tasty-charcoal/15 text-tasty-charcoal hover:bg-tasty-terracotta-light hover:text-tasty-terracotta font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:phone" className="text-base text-tasty-terracotta" />
                <span>Or call: 035 204 2001</span>
              </motion.a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
