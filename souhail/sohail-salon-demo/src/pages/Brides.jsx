import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaCrown, FaStar, FaHeart, FaGem } from 'react-icons/fa';
import bannerImage from '../assets/banner.jpg';
import bridesMainImage from '../assets/brides.png';
import CTASection from '../components/CTASection';
import Lightbox from '../components/Lightbox';

const Brides = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const sectionsRef = useRef([]);

  // Gallery Images
  const galleryImages = [
    bridesMainImage,
    bridesMainImage, // يمكن استبدالها لاحقاً
    bridesMainImage,
    bridesMainImage,
    bridesMainImage,
    bridesMainImage
  ];


  // Features
  const features = [
    {
      icon: <FaCrown className="text-4xl text-[#C9A961]" />,
      title: 'تسريحة العروس',
      description: 'تسريحات فاخرة بأحدث صيحات الموضة العالمية'
    },
    {
      icon: <FaStar className="text-4xl text-[#C9A961]" />,
      title: 'مكياج احترافي',
      description: 'مكياج كامل بمستحضرات عالمية فاخرة'
    },
    {
      icon: <FaHeart className="text-4xl text-[#C9A961]" />,
      title: 'زيارة تجريبية',
      description: 'جلسة تجربة مجانية قبل يوم الزفاف'
    },
    {
      icon: <FaGem className="text-4xl text-[#C9A961]" />,
      title: 'لمسات نهائية',
      description: 'فريق كامل في خدمتك يوم الزفاف'
    }
  ];

  // Packages
  const packages = [
    {
      name: 'الباقة الكلاسيكية',
      price: '800',
      features: [
        'تسريحة عروس فاخرة',
        'مكياج كامل احترافي',
        'جلسة تجربة مسبقة',
        'لمسات نهائية يوم الزفاف',
        'منتجات عالمية فاخرة'
      ],
      highlight: false
    },
    {
      name: 'الباقة الملكية',
      price: '1500',
      features: [
        'كل مميزات الباقة الكلاسيكية',
        'جلسة عناية بالشعر والبشرة',
        'تسريحة لوالدة العروس',
        'خدمة منزلية يوم الزفاف',
        'مصور للتحضيرات',
        'استشارة مجانية'
      ],
      highlight: true,
      badge: 'الأكثر طلباً'
    },
    {
      name: 'باقة VIP',
      price: '2500',
      features: [
        'كل مميزات الباقة الملكية',
        'برنامج عناية شامل (شهر)',
        'تسريحات لـ 5 أشخاص',
        'فريق كامل في منزلك',
        'استشارة خبير موضة',
        'هدايا فاخرة حصرية'
      ],
      highlight: false
    }
  ];

  // Scroll Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleSections((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${bannerImage})`,
            backgroundPosition: 'center center'
          }}
        >
          {/* Dark Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,46,0.7) 0%, rgba(15,20,25,0.6) 100%)'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-fade-in-up"
            style={{ fontFamily: 'Cairo, sans-serif', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            خدمات العرائس
          </h1>
          <p
            className="text-lg sm:text-xl lg:text-2xl mb-10 animate-fade-in-up animation-delay-200"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            يومك الخاص يستحق الكمال
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            <Link
              to="/book"
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                boxShadow: '0 6px 24px rgba(201, 169, 97, 0.4)',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              احجزي موعدك
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all duration-300 hover:scale-105 hover:bg-white/10"
              style={{
                borderColor: '#C9A961',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              تواصلي معنا
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        data-index="0"
        className={`py-20 lg:py-28 transition-all duration-1000 ${
          visibleSections.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ backgroundColor: '#F5F1E8' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4"
              style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
            >
              لماذا نحن؟
            </h2>
            <div className="flex justify-center mt-6">
              <div
                className="w-20 h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C9A961';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(201, 169, 97, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                }}
              >
                <div className="mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl lg:text-2xl font-bold mb-3" style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        data-index="1"
        className={`py-20 lg:py-28 transition-all duration-1000 ${
          visibleSections.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4"
              style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
            >
              باقات العرائس
            </h2>
            <div className="flex justify-center mt-6">
              <div
                className="w-20 h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 lg:p-10 transition-all duration-300 hover:-translate-y-2 ${
                  pkg.highlight ? 'lg:scale-105' : ''
                }`}
                style={{
                  boxShadow: pkg.highlight
                    ? '0 8px 40px rgba(201, 169, 97, 0.3)'
                    : '0 4px 20px rgba(0, 0, 0, 0.06)',
                  border: pkg.highlight ? '3px solid #C9A961' : '2px solid #F5F1E8'
                }}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)' }}
                  >
                    {pkg.badge}
                  </div>
                )}

                {/* Package Name */}
                <h3
                  className="text-2xl lg:text-3xl font-bold mb-4 mt-4"
                  style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                >
                  {pkg.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl lg:text-5xl font-bold" style={{ color: '#C9A961' }}>
                    {pkg.price}
                  </span>
                  <span className="text-xl text-gray-600 mr-2">ليرة سورية</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FaCheck className="text-[#C9A961] mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm lg:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  to="/book"
                  className="block w-full text-center py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                  style={{
                    background: pkg.highlight
                      ? 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)'
                      : 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
                    color: 'white',
                    boxShadow: pkg.highlight
                      ? '0 4px 16px rgba(201, 169, 97, 0.4)'
                      : '0 4px 16px rgba(26, 26, 46, 0.3)',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                >
                  احجزي الآن
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        data-index="2"
        className={`py-20 lg:py-28 transition-all duration-1000 ${
          visibleSections.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ backgroundColor: '#F5F1E8' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4"
              style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
            >
              أعمالنا السابقة
            </h2>
            <div className="flex justify-center mt-6">
              <div
                className="w-20 h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image}
                  alt={`عمل عروس ${index + 1}`}
                  className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Brides;
