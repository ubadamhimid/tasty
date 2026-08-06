import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, 
  FaInstagram, 
  FaFacebook, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaCheckCircle,
  FaBolt,
  FaCalendarAlt,
  FaMapPin
} from 'react-icons/fa';

// Contact Information Constants
const CONTACT_INFO = {
  phone: '+963 991 85 86 87',
  phoneDisplay: '+963 991 85 86 87',
  phoneClean: '963991858687',
  instagram: '@souhail_khoury',
  instagramUrl: 'https://instagram.com/souhail_khoury',
  facebook: 'Souhail khoury Salon',
  facebookUrl: 'https://facebook.com/sohailkhoury',
  address: 'أبو رمانة – شارع نزار قباني – مقابل السفارة السعودية – دمشق',
  workingHours: 'حسب الحجز المسبق',
  mapUrl: '' // TODO: Add Google Maps link
};

const Contact = () => {
  // Animation states
  const [heroVisible, setHeroVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [mainSectionVisible, setMainSectionVisible] = useState(false);
  const [socialVisible, setSocialVisible] = useState(false);
  const [instagramVisible, setInstagramVisible] = useState(false);
  const [finalCtaVisible, setFinalCtaVisible] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Refs
  const cardsRef = useRef(null);
  const mainSectionRef = useRef(null);
  const socialRef = useRef(null);
  const instagramRef = useRef(null);
  const finalCtaRef = useRef(null);

  // Intersection Observer setup
  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);

    const observerOptions = { threshold: 0.1 };

    const observers = [
      { ref: cardsRef, setter: setCardsVisible },
      { ref: mainSectionRef, setter: setMainSectionVisible },
      { ref: socialRef, setter: setSocialVisible },
      { ref: instagramRef, setter: setInstagramVisible },
      { ref: finalCtaRef, setter: setFinalCtaVisible }
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

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build WhatsApp message
    const message = `مرحباً، اسمي ${formData.name}%0A` +
                   `رقم الهاتف: ${formData.phone}%0A` +
                   `الخدمة المطلوبة: ${formData.service}%0A` +
                   `الرسالة: ${formData.message}`;
    
    const whatsappUrl = `https://wa.me/${CONTACT_INFO.phoneClean}?text=${message}`;
    
    // Show success and open WhatsApp
    setShowSuccess(true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setShowSuccess(false);
      setFormData({ name: '', phone: '', service: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 sm:py-24 lg:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC0 50%, #F5F1E8 100%)'
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #C9A961 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        <div
          className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #B8935A 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />

        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          {/* Title */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            اتصل بنا
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl md:text-2xl mb-8 md:mb-10 text-gray-700 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            نحن هنا للإجابة على جميع استفساراتك
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transition-all duration-1000 delay-400 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <a
              href={`https://wa.me/${CONTACT_INFO.phoneClean}?text=مرحباً، لدي استفسار عن خدمات الصالون`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#FFFFFF',
                boxShadow: '0 6px 24px rgba(37, 211, 102, 0.4)',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              <FaWhatsapp className="text-xl" />
              تواصل عبر واتساب
            </a>

            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg border-2 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              style={{
                borderColor: '#C9A961',
                color: '#C9A961',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              <FaPhone className="text-lg" />
              اتصال مباشر
            </a>
          </div>

          {/* Trust Badges */}
          <div
            className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-600 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {[
              { icon: <FaBolt />, text: 'رد سريع' },
              { icon: <FaCheckCircle />, text: 'استشارة' },
              { icon: <FaCalendarAlt />, text: 'حجز موعد' },
              { icon: <FaMapPin />, text: 'موقع مميز' }
            ].map((badge, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(201, 169, 97, 0.3)',
                  color: '#1A1A2E'
                }}
              >
                <span style={{ color: '#C9A961' }}>{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section ref={cardsRef} className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* WhatsApp Card */}
            <div
              className={`rounded-2xl p-6 transition-all duration-1000 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC0 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                >
                  <FaWhatsapp />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}>
                  واتساب
                </h3>
              </div>
              <p className="text-gray-700 mb-4 text-lg" dir="ltr">
                {CONTACT_INFO.phoneDisplay}
              </p>
              <a
                href={`https://wa.me/${CONTACT_INFO.phoneClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif'
                }}
              >
                فتح واتساب
              </a>
            </div>

            {/* Phone Card */}
            <div
              className={`rounded-2xl p-6 transition-all duration-1000 delay-200 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC0 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)' }}
                >
                  <FaPhone />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}>
                  اتصال
                </h3>
              </div>
              <p className="text-gray-700 mb-4 text-lg" dir="ltr">
                {CONTACT_INFO.phoneDisplay}
              </p>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="block w-full text-center px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif'
                }}
              >
                اتصال الآن
              </a>
            </div>

            {/* Location Card */}
            <div
              className={`rounded-2xl p-6 transition-all duration-1000 delay-400 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC0 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)' }}
                >
                  <FaMapMarkerAlt />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}>
                  الموقع
                </h3>
              </div>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                {CONTACT_INFO.address}
              </p>
              {CONTACT_INFO.mapUrl ? (
                <a
                  href={CONTACT_INFO.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                    color: '#FFFFFF',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                >
                  فتح الخريطة
                </a>
              ) : (
                <div className="text-center px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(201, 169, 97, 0.1)', color: '#999' }}>
                  {/* TODO: Add Google Maps URL */}
                  قريباً
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Section: Contact Info + Form */}
      <section
        ref={mainSectionRef}
        className="py-16 lg:py-20"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F1E8 100%)' }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info Card */}
            <div
              className={`transition-all duration-1000 ${
                mainSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <div
                className="rounded-2xl p-8 h-full"
                style={{
                  background: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <h2
                  className="text-3xl font-bold mb-8"
                  style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                >
                  معلومات التواصل
                </h2>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(201, 169, 97, 0.1)' }}
                    >
                      <FaPhone className="text-xl" style={{ color: '#C9A961' }} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#1A1A2E' }}>
                        الهاتف
                      </h3>
                      <a
                        href={`tel:${CONTACT_INFO.phone}`}
                        className="text-gray-600 hover:text-gold-600 transition-colors"
                        dir="ltr"
                      >
                        {CONTACT_INFO.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(201, 169, 97, 0.1)' }}
                    >
                      <FaMapMarkerAlt className="text-xl" style={{ color: '#C9A961' }} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#1A1A2E' }}>
                        الموقع
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {CONTACT_INFO.address}
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(201, 169, 97, 0.1)' }}
                    >
                      <FaClock className="text-xl" style={{ color: '#C9A961' }} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#1A1A2E' }}>
                        ساعات العمل
                      </h3>
                      <p className="text-gray-600">
                        {CONTACT_INFO.workingHours}
                      </p>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(201, 169, 97, 0.1)' }}
                    >
                      <FaInstagram className="text-xl" style={{ color: '#C9A961' }} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#1A1A2E' }}>
                        Instagram
                      </h3>
                      <a
                        href={CONTACT_INFO.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-pink-600 transition-colors"
                      >
                        {CONTACT_INFO.instagram}
                      </a>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${CONTACT_INFO.phoneClean}?text=مرحباً، لدي استفسار عن خدمات الصالون`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: '#FFFFFF',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                >
                  <FaWhatsapp className="text-2xl" />
                  تواصل عبر واتساب
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                mainSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <div
                className="rounded-2xl p-8"
                style={{
                  background: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <h2
                  className="text-3xl font-bold mb-8"
                  style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                >
                  أرسلي رسالة
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                    >
                      الاسم
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                      style={{
                        borderColor: '#E5E5E5',
                        fontFamily: 'Cairo, sans-serif'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#C9A961'}
                      onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                      placeholder="اسمك الكريم"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                    >
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                      style={{
                        borderColor: '#E5E5E5',
                        fontFamily: 'Cairo, sans-serif'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#C9A961'}
                      onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                      placeholder="رقم هاتفك"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                    >
                      نوع الخدمة
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                      style={{
                        borderColor: '#E5E5E5',
                        fontFamily: 'Cairo, sans-serif'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#C9A961'}
                      onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                    >
                      <option value="">اختاري الخدمة</option>
                      <option value="عرائس">عرائس</option>
                      <option value="صبغات">صبغات</option>
                      <option value="وصلات">وصلات</option>
                      <option value="استشارة">استشارة</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                    >
                      الرسالة
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none resize-none"
                      style={{
                        borderColor: '#E5E5E5',
                        fontFamily: 'Cairo, sans-serif'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#C9A961'}
                      onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                      placeholder="اكتبي رسالتك هنا..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                      color: '#FFFFFF',
                      fontFamily: 'Cairo, sans-serif',
                      boxShadow: '0 6px 24px rgba(201, 169, 97, 0.4)'
                    }}
                  >
                    إرسال الرسالة
                  </button>
                </form>

                {/* Success Message */}
                {showSuccess && (
                  <div
                    className="mt-6 p-4 rounded-xl text-center font-bold"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10B981',
                      fontFamily: 'Cairo, sans-serif'
                    }}
                  >
                    ✓ جاري فتح واتساب...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Cards */}
      <section ref={socialRef} className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 transition-all duration-1000 ${
              socialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            تابعنا
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Instagram Card */}
            <a
              href={CONTACT_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-2xl p-8 transition-all duration-1000 hover:-translate-y-2 ${
                socialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC0 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(201, 169, 97, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl text-white"
                  style={{
                    background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)'
                  }}
                >
                  <FaInstagram />
                </div>
                <div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                  >
                    Instagram
                  </h3>
                  <p className="text-gray-600">{CONTACT_INFO.instagram}</p>
                </div>
              </div>
              <div
                className="text-center px-4 py-3 rounded-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif'
                }}
              >
                زيارة الإنستغرام
              </div>
            </a>

            {/* Facebook Card */}
            <a
              href={CONTACT_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-2xl p-8 transition-all duration-1000 delay-200 hover:-translate-y-2 ${
                socialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC0 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(201, 169, 97, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl text-white"
                  style={{
                    background: 'linear-gradient(135deg, #1877F2 0%, #0051C3 100%)'
                  }}
                >
                  <FaFacebook />
                </div>
                <div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
                  >
                    Facebook
                  </h3>
                  <p className="text-gray-600">{CONTACT_INFO.facebook}</p>
                </div>
              </div>
              <div
                className="text-center px-4 py-3 rounded-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #1877F2 0%, #0051C3 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif'
                }}
              >
                زيارة فيسبوك
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Instagram Posts Skeleton */}
      <section
        ref={instagramRef}
        className="py-16 lg:py-20"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F1E8 100%)' }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 transition-all duration-1000 ${
              instagramVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            آخر المنشورات
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={index}
                className={`aspect-square rounded-2xl transition-all duration-1000 ${
                  instagramVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC0 100%)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
            ))}
          </div>

          <p
            className={`text-center text-gray-500 text-sm transition-all duration-1000 delay-600 ${
              instagramVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            سيتم عرض منشورات إنستغرام هنا تلقائياً
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section
        ref={finalCtaRef}
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
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white transition-all duration-1000 ${
              finalCtaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
          >
            جاهزة للتغيير؟ احجزي موعدك الآن
          </h2>

          <p
            className={`text-lg sm:text-xl mb-8 text-white/90 transition-all duration-1000 delay-200 ${
              finalCtaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            dir="ltr"
          >
            {CONTACT_INFO.phoneDisplay}
          </p>

          <a
            href={`https://wa.me/${CONTACT_INFO.phoneClean}?text=مرحباً، أرغب بحجز موعد`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-3 px-8 lg:px-10 py-4 lg:py-5 rounded-xl font-bold text-base lg:text-lg transition-all duration-1000 delay-400 hover:scale-105 ${
              finalCtaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              background: '#FFFFFF',
              color: '#1A1A2E',
              fontFamily: 'Cairo, sans-serif',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)'
            }}
          >
            <FaWhatsapp className="text-2xl" style={{ color: '#25D366' }} />
            تواصل عبر واتساب
          </a>
        </div>
      </section>

      {/* Pulse animation for skeleton */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
