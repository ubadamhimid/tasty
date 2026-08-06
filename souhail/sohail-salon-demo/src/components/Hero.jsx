import { Link } from 'react-router-dom';
import heroBrideImage from '../assets/hero_banner_bride_1769538562730.png';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container mx-auto px-8 lg:px-20 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT SIDE - Bride Image */}
          <div className="relative order-1 lg:order-1">
            {/* Image Container with luxury shadow and glow */}
            <div className="relative">
              {/* Soft glow effect behind image */}
              <div className="absolute -inset-6 bg-gradient-to-br from-[#D4AF37]/15 via-white/5 to-transparent rounded-[2rem] blur-2xl"></div>
              
              {/* Main image with rounded corners */}
              <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  src={heroBrideImage}
                  alt="Elegant Bride"
                  className="w-full h-auto object-cover"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to Unsplash if local image fails
                    e.target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=90";
                  }}
                />
                {/* Warm light overlay effect (like in reference) */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 via-transparent to-black/10 pointer-events-none mix-blend-soft-light"></div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Content */}
          <div className="text-center lg:text-right space-y-6 order-2 lg:order-2">
            {/* Decorative Gold Line */}
            <div className="flex justify-center lg:justify-end mb-2">
              <div className="w-16 h-1 bg-[#D4AF37] rounded-full"></div>
            </div>

            {/* Brand Name - Elegant Serif */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-serif italic text-gray-800 leading-tight mb-3" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}>
              Sohail Khoury
            </h1>

            {/* Main Arabic Heading */}
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-700 mb-4 leading-snug">
              جمال مبتكر ومتقن
            </h2>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-600 font-light tracking-wide mb-6">
              Luxury Hair Salon
            </p>

            {/* Description */}
            <p className="text-base lg:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mr-0 mb-8">
              صالون شعر فاخر متخصص بتسريحات العرائس، صبغات الشعر الاحترافية، والوصلات الطبيعية
            </p>

            {/* CTA Button - Matching reference */}
            <div className="pt-4">
              <Link
                to="/book"
                className="inline-block text-white px-12 py-4 rounded-lg text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #E8C07D 0%, #D4A86A 100%)' }}
              >
                احجز موعد
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Subtle Background Decoration */}
      <div className="absolute top-1/4 right-10 w-80 h-80 bg-[#D4AF37]/3 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
};

export default Hero;
