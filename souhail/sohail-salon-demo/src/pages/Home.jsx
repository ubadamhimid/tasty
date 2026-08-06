import BrandBanner from '../components/BrandBanner';
import CategoryCards from '../components/CategoryCards';
import ServicesLuxury from '../components/ServicesLuxury';
import GalleryGrid from '../components/GalleryGrid';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

const Home = () => {
  return (
    <div>
      <BrandBanner />
      <CategoryCards />
      <ServicesLuxury />
      <GalleryGrid limit={8} />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default Home;
