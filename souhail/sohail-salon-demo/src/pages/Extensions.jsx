import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, 
  FaCheck, 
  FaTimes, 
  FaRuler, 
  FaCrown, 
  FaPalette, 
  FaStar, 
  FaShieldAlt, 
  FaBolt,
  FaChevronDown 
} from 'react-icons/fa';
import CTASection from '../components/CTASection';

const Extensions = () => {
  // Animation states
  const [heroVisible, setHeroVisible] = useState(false);
  const [whyUsVisible, setWhyUsVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [typesVisible, setTypesVisible] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);
  const [beforeAfterVisible, setBeforeAfterVisible] = useState(false);
  const [careTipsVisible, setCareTipsVisible] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);

  // Refs
  const whyUsRef = useRef(null);
  const featuresRef = useRef(null);
  const typesRef = useRef(null);
  const pricingRef = useRef(null);
  const beforeAfterRef = useRef(null);
  const careTipsRef = useRef(null);
  const faqRef = useRef(null);

  // Filter state
  const [activeFilter, setActiveFilter] = useState('الكل');

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  // Intersection Observer setup
  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);

    const observerOptions = { threshold: 0.1 };

    const observers = [
      { ref: whyUsRef, setter: setWhyUsVisible },
      { ref: featuresRef, setter: setFeaturesVisible },
      { ref: typesRef, setter: setTypesVisible },
      { ref: pricingRef, setter: setPricingVisible },
      { ref: beforeAfterRef, setter: setBeforeAfterVisible },
      { ref: careTipsRef, setter: setCareTipsVisible },
      { ref: faqRef, setter: setFaqVisible }
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

  const extensionTypes = [
    {
      name: 'وصلات الكليبس',
      category: 'الكليب',
      description: 'سهلة التركيب والإزالة، مثالية للمناسبات الخاصة',
      duration: 'استخدام يومي',
      suitability: 'جميع أنواع الشعر',
      appearance: 'طبيعي ومريح',
      price: 'من 500 ليرة سورية',
      image: '/images/clip_in_extensions.png'
    },
    {
      name: 'وصلات الشريط',
      category: 'الشريط',
      description: 'غير مرئية وخفيفة الوزن، مثالية للاستخدام اليومي',
      duration: '6-8 أسابيع',
      suitability: 'الشعر الخفيف والمتوسط',
      appearance: 'غير مرئي تماماً',
      price: 'من 800 ليرة سورية',
      image: '/images/tape_in_extensions.png'
    },
    {
      name: 'وصلات الكيراتين',
      category: 'الكيراتين',
      description: 'تدوم طويلاً وتندمج تماماً مع شعرك الطبيعي',
      duration: '3-6 أشهر',
      suitability: 'الشعر الكثيف',
      appearance: 'اندماج كامل',
      price: 'من 1200 ليرة سورية',
      image: '/images/keratin_bond_extensions.png'
    },
    {
      name: 'وصلات الميكرو',
      category: 'الميكرو',
      description: 'أصغر حجماً وأكثر طبيعية، مثالية للشعر الخفيف',
      duration: '4-6 أشهر',
      suitability: 'الشعر الخفيف',
      appearance: 'دقيق وطبيعي',
      price: 'من 1500 ليرة سورية',
      image: '/images/micro_ring_extensions.png'
    }
  ];

  const features = [
    { icon: <FaRuler />, title: 'طول فوري', description: 'نتيجة سريعة وملحوظة' },
    { icon: <FaCrown />, title: 'كثافة طبيعية', description: 'حجم رائع ومظهر كامل' },
    { icon: <FaPalette />, title: 'تنوع التسريحات', description: 'حرية كاملة في التصفيف' },
    { icon: <FaStar />, title: 'مظهر طبيعي 100%', description: 'اندماج تام مع الشعر' },
    { icon: <FaShieldAlt />, title: 'ثبات وأمان', description: 'تقنيات آمنة ومختبرة' },
    { icon: <FaBolt />, title: 'ثقة بالنفس', description: 'تحول فوري ومميز' }
  ];

  const pricingPackages = [
    {
      name: 'الباقة الاقتصادية',
      description: 'مثالية للمبتدئات',
      features: ['شعر طبيعي 100%', 'طول متوسط (40 سم)', 'تركيب احترافي', 'استشارة مجانية'],
      price: 'من 500 ليرة',
      popular: false
    },
    {
      name: 'الأكثر طلباً',
      description: 'الاختيار المثالي',
      features: ['شعر بريميوم', 'طول خاص (50-60 سم)', 'تركيب + صيانة', 'استشارة + متابعة'],
      price: 'من 1000 ليرة',
      popular: true
    },
    {
      name: 'الباقة الفاخرة',
      description: 'للباحثات عن التميز',
      features: ['شعر لوكس', 'طول حسب الطلب', 'خدمة VIP', 'متابعة مستمرة'],
      price: 'من 1800 ليرة',
      popular: false
    }
  ];

  const faqs = [
    {
      q: 'كم تدوم الوصلات؟',
      a: 'تختلف المدة حسب النوع: الكليبس يومي، الشريط 6-8 أسابيع، الكيراتين 3-6 أشهر، والميكرو 4-6 أشهر مع العناية المناسبة.'
    },
    {
      q: 'هل تؤذي الوصلات الشعر الطبيعي؟',
      a: 'لا، عند التركيب بشكل احترافي واستخدام تقنيات آمنة. نحن نستخدم طرق لا تضر بجذور الشعر أو فروة الرأس.'
    },
    {
      q: 'هل يمكن صبغ أو تصفيف الوصلات؟',
      a: 'نعم! الوصلات من شعر طبيعي 100% يمكن صبغها وتصفيفها بالحرارة كشعرك الطبيعي، لكن ننصح باستشارة الخبير أولاً.'
    },
    {
      q: 'كيف تتم الصيانة الدورية؟',
      a: 'ننصح بزيارة الصالون كل 6-8 أسابيع لضبط الوصلات وتنظيفها احترافياً، مع استخدام منتجات مخصصة في المنزل.'
    },
    {
      q: 'كم جلسة تحتاج للتركيب؟',
      a: 'عادة جلسة واحدة من 2-4 ساعات حسب النوع والكمية. نبدأ باستشارة مجانية لتحديد الأنسب لك.'
    }
  ];

  const filteredTypes = activeFilter === 'الكل' 
    ? extensionTypes 
    : extensionTypes.filter(type => type.category === activeFilter);

  const filterOptions = ['الكل', 'الكليب', 'الشريط', 'الكيراتين', 'الميكرو'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
        <img
          src="/images/extensions_hero.png"
          alt="وصلات الشعر"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(26,26,46,0.75) 0%, rgba(15,20,25,0.65) 100%)'
          }}
        />
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          {/* Title */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: 'Cairo, sans-serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            وصلات الشعر
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl md:text-2xl mb-8 md:mb-10 transition-all duration-1000 delay-200 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            طول وكثافة طبيعية 100%
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transition-all duration-1000 delay-400 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              to="/book"
              className="px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                boxShadow: '0 6px 24px rgba(201, 169, 97, 0.4)',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              احجز موعد
            </Link>

            <Link
              to="/contact"
              className="px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg border-2 border-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              استشارة مجانية
            </Link>
          </div>

          {/* Trust Badges */}
          <div
            className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-600 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {['شعر طبيعي 100%', 'تركيب آمن', 'نتيجة فورية', 'صيانة دورية'].map((badge, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section
        ref={whyUsRef}
        className="py-16 lg:py-20 bg-white"
      >
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div
              className={`transition-all duration-1000 ${
                whyUsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
                style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
              >
                وصلات شعر طبيعية بجودة استثنائية
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                نستخدم فقط شعر طبيعي 100% من أعلى جودة، مع تقنيات تركيب آمنة لا تضر بشعرك.
              </p>
              <ul className="space-y-3">
                {[
                  'شعر طبيعي معتمد من أفضل المصادر',
                  'تقنيات تركيب حديثة وآمنة',
                  'استشارة مجانية لتحديد الأنسب لك',
                  'ضمان الجودة والمتابعة المستمرة'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheck className="text-xl flex-shrink-0 mt-1" style={{ color: '#C9A961' }} />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                whyUsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}
              >
                <img
                  src="/images/extensions_why_us.png"
                  alt="وصلات شعر طبيعية"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        ref={featuresRef}
        className="py-16 lg:py-20"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F1E8 100%)' }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 transition-all duration-1000 ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            مميزات الوصلات
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className="p-6 rounded-2xl text-center h-full transition-all duration-300 hover:-translate-y-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(201, 169, 97, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.9)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(201, 169, 97, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(201, 169, 97, 0.1)';
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                      color: '#FFFFFF'
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="text-base font-bold mb-2"
                    style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types Section with Filter */}
      <section ref={typesRef} className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 transition-all duration-1000 ${
              typesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            أنواع الوصلات
          </h2>

          {/* Filter Tabs */}
          <div
            className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${
              typesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                style={{
                  background: activeFilter === filter 
                    ? 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)'
                    : '#F5F1E8',
                  color: activeFilter === filter ? '#FFFFFF' : '#1A1A2E',
                  fontFamily: 'Cairo, sans-serif',
                  boxShadow: activeFilter === filter 
                    ? '0 4px 15px rgba(201, 169, 97, 0.3)' 
                    : 'none'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredTypes.map((type, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden transition-all duration-1000 ${
                  typesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  background: '#FFFFFF'
                }}
              >
                {/* Image */}
                <div className="overflow-hidden h-56">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                  >
                    {type.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{type.description}</p>

                  {/* Quick Points */}
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 rounded-full" style={{ background: '#C9A961' }} />
                      <strong>المدة:</strong> {type.duration}
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 rounded-full" style={{ background: '#C9A961' }} />
                      <strong>الملاءمة:</strong> {type.suitability}
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 rounded-full" style={{ background: '#C9A961' }} />
                      <strong>المظهر:</strong> {type.appearance}
                    </li>
                  </ul>

                  {/* Price */}
                  <div
                    className="inline-block px-4 py-2 rounded-lg mb-4 text-sm font-bold"
                    style={{
                      background: 'rgba(201, 169, 97, 0.1)',
                      color: '#C9A961'
                    }}
                  >
                    {type.price}
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
                    احجز الآن
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section
        ref={pricingRef}
        className="py-16 lg:py-20"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F1E8 100%)' }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 transition-all duration-1000 ${
              pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            الباقات والأسعار
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
            {pricingPackages.map((pkg, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden transition-all duration-1000 ${
                  pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${pkg.popular ? 'transform scale-105' : ''}`}
                style={{
                  transitionDelay: `${index * 200}ms`,
                  boxShadow: pkg.popular 
                    ? '0 8px 32px rgba(201, 169, 97, 0.3)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.08)',
                  background: '#FFFFFF',
                  border: pkg.popular ? '2px solid #C9A961' : '1px solid #E5E5E5'
                }}
              >
                {pkg.popular && (
                  <div
                    className="py-2 text-center text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)' }}
                  >
                    الأكثر طلباً
                  </div>
                )}

                <div className="p-8">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                  >
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">{pkg.description}</p>

                  <div className="mb-6">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: '#C9A961', fontFamily: 'Cairo, sans-serif' }}
                    >
                      {pkg.price}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <FaCheck className="text-lg flex-shrink-0 mt-1" style={{ color: '#C9A961' }} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/book"
                    className="block w-full text-center px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                    style={{
                      background: pkg.popular 
                        ? 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)'
                        : 'transparent',
                      border: pkg.popular ? 'none' : '2px solid #C9A961',
                      color: pkg.popular ? '#FFFFFF' : '#C9A961',
                      fontFamily: 'Cairo, sans-serif'
                    }}
                  >
                    اختر هذه الباقة
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm max-w-2xl mx-auto">
            * السعر النهائي يحدد بعد المعاينة حسب الطول والكثافة المطلوبة
          </p>
        </div>
      </section>

      {/* Before/After Placeholder */}
      <section
        ref={beforeAfterRef}
        className="py-16 lg:py-20 bg-white"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              'extensions_before_after_1.png',
              'extensions_before_after_2.png'
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
                  alt={`تحول الوصلات ${index + 1}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Tips - Split Design */}
      <section
        ref={careTipsRef}
        className="py-16 lg:py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC0 100%)' }}
      >
        {/* Decorative blur shapes */}
        <div
          className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #C9A961 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        <div
          className="absolute bottom-10 left-10 w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #B8935A 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 transition-all duration-1000 ${
              careTipsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            كيف تعتنين بالوصلات؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Do's */}
            <div
              className={`rounded-2xl p-8 transition-all duration-1000 ${
                careTipsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(201, 169, 97, 0.2)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                >
                  <FaCheck />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: '#10B981', fontFamily: 'Cairo, sans-serif' }}
                >
                  افعلي
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  'مشطي شعرك بلطف من الأسفل للأعلى',
                  'استخدمي شامبو خالي من السلفات',
                  'جففي شعرك بالمنشفة بلطف',
                  'راجعي الصالون للصيانة الدورية'
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-500">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div
              className={`rounded-2xl p-8 transition-all duration-1000 delay-200 ${
                careTipsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(201, 169, 97, 0.2)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
                >
                  <FaTimes />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: '#EF4444', fontFamily: 'Cairo, sans-serif' }}
                >
                  تجنبي
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  'النوم والشعر مبلل',
                  'استخدام حرارة عالية جداً',
                  'شد الشعر بقوة',
                  'استخدام منتجات زيتية على نقاط التركيب'
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-red-500">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 transition-all duration-1000 ${
              faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            أسئلة شائعة
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden transition-all duration-1000 ${
                  faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #E5E5E5'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-right flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span
                    className="font-bold text-lg"
                    style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                  >
                    {faq.q}
                  </span>
                  <FaChevronDown
                    className={`text-xl transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    style={{ color: '#C9A961' }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: openFaq === index ? '300px' : '0'
                  }}
                >
                  <div className="p-6 pt-0 text-gray-700 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative py-16 lg:py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #C9A961 0%, #E8DCC0 50%, #C9A961 100%)'
        }}
      >
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
            جاهزة لشعر أحلامك؟
          </h2>

          <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            احجزي موعدك الآن واحصلي على استشارة مجانية مع خبرائنا
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
              احجزي موعدك الآن
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

export default Extensions;
