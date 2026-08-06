
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaShieldAlt, FaPalette, FaStar } from 'react-icons/fa';
import CTASection from '../components/CTASection';

const HairColor = () => {
  // Animation states
  const [heroVisible, setHeroVisible] = useState(false);
  const [whyUsVisible, setWhyUsVisible] = useState(false);
  const [techniquesVisible, setTechniquesVisible] = useState(false);
  const [beforeAfterVisible, setBeforeAfterVisible] = useState(false);
  const [tipsVisible, setTipsVisible] = useState(false);

  const whyUsRef = useRef(null);
  const techniquesRef = useRef(null);
  const beforeAfterRef = useRef(null);
  const tipsRef = useRef(null);

  // Intersection Observer setup
  useEffect(() => {
    // Hero animation on load
    setTimeout(() => setHeroVisible(true), 100);

    const observerOptions = { threshold: 0.1 };

    const observers = [
      { ref: whyUsRef, setter: setWhyUsVisible },
      { ref: techniquesRef, setter: setTechniquesVisible },
      { ref: beforeAfterRef, setter: setBeforeAfterVisible },
      { ref: tipsRef, setter: setTipsVisible }
    ].map(({ ref, setter }) => {
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setter(true),
        observerOptions
      );
      if (ref.current) observer.observe(ref.current);
      return observer;
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const colorTechniques = [
    {
      name: 'بلياج',
      description: 'تقنية فرنسية تعطي مظهر طبيعي ومتدرج للغاية',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
      price: 'من 400 ليرة سورية'
    },
    {
      name: 'أومبري',
      description: 'انتقال تدريجي رائع من الداكن  للفاتح',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
      price: 'من 350 ليرة سورية'
    },
    {
      name: 'هايلايت',
      description: 'خصل ملونة لإضافة بُعد ولمعان مميز',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
      price: 'من 300 ليرة سورية'
    },
    {
      name: 'صبغة كاملة',
      description: 'تغيير كامل للون بمنتجات عالمية فاخرة',
      image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&q=80',
      price: 'من 500 ليرة سورية'
    }
  ];

  const whyChooseUs = [
    {
      icon: <FaStar className="text-3xl" />,
      title: 'منتجات أصلية',
      description: 'نستخدم فقط منتجات أصلية من أفضل العلامات العالمية'
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'حماية ولمعان',
      description: 'تقنيات متقدمة تحمي شعرك وتمنحه لمعاناً دائماً'
    },
    {
      icon: <FaPalette className="text-3xl" />,
      title: 'تحديد لون مثالي',
      description: 'استشارة مجانية لتحديد اللون المناسب لبشرتك'
    }
  ];

  const tips = [
    'استخدمي شامبو وبلسم مخصص للشعر المصبوغ',
    'تجنبي غسل الشعر بالماء الساخن جداً',
    'احمي شعرك من الشمس باستخدام منتجات الحماية',
    'قومي بجلسات ترطيب دورية للحفاظ على اللون',
    'راجعي الصالون كل 6-8 أسابيع لتجديد اللون'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
          alt="صبغات الشعر"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(26,26,46,0.7) 0%, rgba(15,20,25,0.6) 100%)'
          }}
        />
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          {/* Brand Badge */}
          <div
            className={`inline-flex items-center gap-2 px-6 py-2 rounded-full mb-6 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              background: 'rgba(201, 169, 97, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(201, 169, 97, 0.3)'
            }}
          >
            <span className="text-sm font-semibold" style={{ color: '#C9A961' }}>
              L'Oréal • Wella • Schwarzkopf
            </span>
          </div>

          {/* Title */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 transition-all duration-1000 delay-200 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: 'Cairo, sans-serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            صبغات الشعر
          </h1>

          {/* Description */}
          <p
            className={`text-lg sm:text-xl md:text-2xl mb-8 md:mb-10 transition-all duration-1000 delay-400 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            ألوان عصرية بمنتجات عالمية ولمسة فاخرة
          </p>

          {/* CTA Button */}
          <Link
            to="/contact"
            className={`inline-block px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-1000 delay-600 hover:scale-105 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
              boxShadow: '0 6px 24px rgba(201, 169, 97, 0.4)',
              fontFamily: 'Cairo, sans-serif'
            }}
          >
            احجزي استشارة مجانية
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        ref={whyUsRef}
        className="py-16 lg:py-20"
        style={{ background: 'linear-gradient(180deg, #F5F1E8 0%, #FFFFFF 100%)' }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 transition-all duration-1000 ${
              whyUsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            لماذا صبغاتنا؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  whyUsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div
                  className="p-8 rounded-2xl text-center h-full"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(201, 169, 97, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                      color: '#FFFFFF'
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Color Techniques Section */}
      <section ref={techniquesRef} className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 transition-all duration-1000 ${
              techniquesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            تقنيات الصبغ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {colorTechniques.map((technique, index) => (
              <div
                key={index}
                className={`group transition-all duration-1000 ${
                  techniquesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                  style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    background: '#FFFFFF'
                  }}
                >
                  {/* Image */}
                  <div className="overflow-hidden h-56">
                    <img
                      src={technique.image}
                      alt={technique.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                    >
                      {technique.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {technique.description}
                    </p>

                    {/* Price Badge */}
                    <div
                      className="inline-block px-4 py-2 rounded-lg mb-4 text-sm font-bold"
                      style={{
                        background: 'rgba(201, 169, 97, 0.1)',
                        color: '#C9A961'
                      }}
                    >
                      {technique.price}
                    </div>

                    {/* Book Button */}
                    <Link
                      to="/book"
                      className="block w-full text-center px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                        color: '#FFFFFF',
                        fontFamily: 'Cairo, sans-serif'
                      }}
                    >
                      احجزي الآن
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section
        ref={beforeAfterRef}
        className="py-16 lg:py-20"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F1E8 100%)' }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 transition-all duration-1000 ${
              beforeAfterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            قبل وبعد
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              'hair_color_before_after_1_1769554348241.png',
              'hair_color_before_after_2_1769554361161.png',
              'hair_color_before_after_3_1769554376984.png'
            ].map((imageName, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden transition-all duration-1000 hover:scale-105 ${
                  beforeAfterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 200}ms`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                <img
                  src={`/images/${imageName}`}
                  alt={`تحول الصبغة ${index + 1}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Tips Section */}
      <section ref={tipsRef} className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div
              className={`rounded-3xl p-8 lg:p-12 transition-all duration-1000 ${
                tipsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC0 100%)',
                boxShadow: '0 8px 32px rgba(201, 169, 97, 0.2)'
              }}
            >
              <h2
                className="text-3xl sm:text-4xl font-bold text-center mb-10"
                style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
              >
                نصائح للعناية بالشعر المصبوغ
              </h2>

              <ul className="space-y-6">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-white"
                      style={{
                        background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                        boxShadow: '0 4px 12px rgba(201, 169, 97, 0.3)'
                      }}
                    >
                      {index + 1}
                    </div>
                    <span
                      className="text-base lg:text-lg pt-1 leading-relaxed"
                      style={{ color: '#1A1A2E' }}
                    >
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section
        className="relative py-16 lg:py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #C9A961 0%, #E8DCC0 50%, #C9A961 100%)'
        }}
      >
        {/* Decorative Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 30px,
              rgba(255, 255, 255, 0.1) 30px,
              rgba(255, 255, 255, 0.1) 60px
            )`
          }}
        />

        <div className="relative container mx-auto px-6 lg:px-12 text-center">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white"
            style={{ fontFamily: 'Cairo, sans-serif', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
          >
            جاهزة لتغيير يلفت الأنظار؟
          </h2>

          <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            احجزي موعدك الآن واحصلي على استشارة مجانية مع خبراء الألوان
          </p>

          {/* Phone Number */}
          <a
            href="tel:+963991858687"
            className="inline-flex items-center gap-3 mb-8 hover:scale-105 transition-transform"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              📞
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-white">
              +963 991 85 86 87
            </span>
          </a>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/book"
              className="px-8 lg:px-10 py-4 lg:py-5 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 hover:scale-105"
              style={{
                background: '#FFFFFF',
                color: '#1A1A2E',
                fontFamily: 'Cairo, sans-serif',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)'
              }}
            >
              احجزي موعد الآن
            </Link>

            <a
              href="https://wa.me/963991858687"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 lg:px-10 py-4 lg:py-5 rounded-xl font-bold text-base lg:text-lg border-2 border-white text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              <FaWhatsapp className="text-xl" />
              واتساب
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HairColor;
