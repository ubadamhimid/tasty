import bannerImage from '../assets/banner.jpg';

const BrandBanner = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image Only - No Text */}
      <div 
        className="w-full bg-no-repeat bg-center h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]"
        style={{ 
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      />
    </section>
  );
};

export default BrandBanner;
