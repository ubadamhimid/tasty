import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import brideImage from '../assets/services/bride-vip.png';
import colorImage from '../assets/services/hair-color.png';
import occasionImage from '../assets/services/occasion-styling.png';
import treatmentImage from '../assets/services/hair-treatment.png';

const ServicesLuxury = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const cardsRef = useRef([]);

  const services = [
    {
      id: 1,
      title: 'صبغات احترافية',
      description: 'تقنيات حديثة ونتائج طبيعية فاخرة مع أفضل المنتجات',
      price: '300',
      image: colorImage
    },
    {
      id: 2,
      title: 'عرائس VIP',
      description: 'إطلالة عروس كاملة بلمسات فاخرة ومكياج احترافي',
      price: '800',
      image: brideImage
    },
    {
      id: 3,
      title: 'علاجات الشعر',
      description: 'عناية مكثفة لشعر صحي ولامع بأحدث التقنيات',
      price: '200',
      image: treatmentImage
    },
    {
      id: 4,
      title: 'تسريحات المناسبات',
      description: 'ستايل فاخر لكل مناسبة خاصة مع لمسة احترافية',
      price: '180',
      image: occasionImage
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 lg:py-32" style={{ backgroundColor: '#F5F1E8' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 
            className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4" 
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            خدماتنا الفاخرة
          </h2>
          {/* Gold Divider */}
          <div className="flex justify-center mt-6">
            <div className="w-20 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }}></div>
          </div>
          <p className="text-lg lg:text-xl font-light mt-6" style={{ color: '#5A5A6E' }}>
            خدمات مختارة بعناية لتجربة صالون استثنائية
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (cardsRef.current[index] = el)}
              data-index={index}
              className={`group bg-white rounded-2xl overflow-hidden transition-all duration-700 ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Service Image with Zoom Effect */}
              <div className="relative h-80 lg:h-96 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gold Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#C9A961]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Service Content */}
              <div className="p-8 lg:p-10">
                {/* Service Name */}
                <h3 
                  className="text-2xl lg:text-3xl font-bold mb-4" 
                  style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-base lg:text-lg mb-6 leading-relaxed" style={{ color: '#5A5A6E' }}>
                  {service.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-sm mb-1" style={{ color: '#9E9E9E' }}>
                    يبدأ من
                  </p>
                  <p className="text-3xl lg:text-4xl font-bold" style={{ color: '#C9A961' }}>
                    {service.price} <span className="text-xl" style={{ color: '#5A5A6E' }}>ليرة سورية</span>
                  </p>
                </div>

                {/* CTA Button */}
                <Link
                  to="/book"
                  className="block w-full text-center py-4 rounded-xl font-bold text-white transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                    boxShadow: '0 4px 16px rgba(201, 169, 97, 0.3)',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                >
                  احجزي الآن
                </Link>
              </div>

              {/* Gold Glow Effect on Hover */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ boxShadow: '0 0 30px rgba(201, 169, 97, 0.4)' }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesLuxury;
