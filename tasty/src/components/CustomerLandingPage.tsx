import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { SidewaysMarquee } from './SidewaysMarquee';
import { BentoGrid } from './BentoGrid';
import { MenuExplorer } from './MenuExplorer';
import { BowlCustomizer } from './BowlCustomizer';
import { OurStory } from './OurStory';
import { DeliverySection, Footer } from './DeliverySection';
import { DishModal } from './DishModal';
import { GoogleReviewModal } from './GoogleReviewModal';
import { MenuItem } from '../types';

export const CustomerLandingPage: React.FC = () => {
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
