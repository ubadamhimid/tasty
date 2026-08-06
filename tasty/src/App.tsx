import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SidewaysMarquee } from './components/SidewaysMarquee';
import { BentoGrid } from './components/BentoGrid';
import { MenuExplorer } from './components/MenuExplorer';
import { BowlCustomizer } from './components/BowlCustomizer';
import { OurStory } from './components/OurStory';
import { DeliverySection, Footer } from './components/DeliverySection';
import { DishModal } from './components/DishModal';
import { GoogleReviewModal } from './components/GoogleReviewModal';
import { MenuItem } from './types';

export const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const scrollToCustomizer = () => {
    const el = document.getElementById('customizer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B3A39] relative overflow-hidden">
      
      {/* Floating Navbar */}
      <Navbar 
        onOpenCustomizer={scrollToCustomizer}
      />

      <main>
        {/* Hero Section */}
        <Hero onOpenCustomizer={scrollToCustomizer} />

        {/* Sideways Text Marquee */}
        <SidewaysMarquee />

        {/* Best Sellers Bento Grid */}
        <BentoGrid 
          onSelectItem={setSelectedItem}
        />

        {/* Interactive Category Menu Explorer */}
        <MenuExplorer 
          onSelectItem={setSelectedItem}
        />

        {/* Interactive Custom Bowl Builder */}
        <BowlCustomizer />

        {/* Our Story & Craftsmanship */}
        <OurStory />

        {/* Location & Store Contact */}
        <DeliverySection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Item Detail Pop-up Modal */}
      <DishModal 
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Google Review Pop-up Prompt */}
      <GoogleReviewModal />

    </div>
  );
};

export default App;
