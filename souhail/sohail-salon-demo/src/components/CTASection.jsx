import { useEffect, useRef, useState } from 'react';

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const phoneNumber = '+963 99185 86 87'; // رقم الواتساب

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC0 50%, #D4C5A0 100%)'
      }}
    >
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #C9A961 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        <div
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #B8935A 0%, transparent 70%)',
            filter: 'blur(50px)'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
        {/* Gold Glow Behind Title */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #C9A961 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />

        {/* Animated Title */}
        <h2
          className={`relative text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            color: '#1A1A2E',
            fontFamily: 'Cairo, sans-serif',
            textShadow: '0 2px 20px rgba(201, 169, 97, 0.3)'
          }}
        >
          احجزي موعدك الآن
        </h2>

        {/* Description */}
        <p
          className={`text-lg sm:text-xl lg:text-2xl font-light mb-10 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ color: '#5A5A6E' }}
        >
          تجربة فاخرة مصممة خصيصاً لإبراز جمالك بأسلوب راقٍ
        </p>

        {/* Phone Number with Pulse Animation */}
        <a
          href={`tel:${phoneNumber}`}
          className={`inline-flex items-center gap-4 mb-12 group transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Phone Icon with Pulse */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ background: '#C9A961' }}
            />
            <div
              className="relative w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
                boxShadow: '0 4px 16px rgba(201, 169, 97, 0.4)'
              }}
            >
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
          </div>

          {/* Phone Number */}
          <span
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: '#1A1A2E', fontFamily: 'Cairo, sans-serif' }}
          >
            {phoneNumber}
          </span>
        </a>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Primary Button - Book Now */}
          <a
            href="/book"
            className="group relative w-full sm:w-auto px-10 py-5 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #C9A961 0%, #B8935A 100%)',
              boxShadow: '0 6px 24px rgba(201, 169, 97, 0.4)',
              fontFamily: 'Cairo, sans-serif'
            }}
          >
            <span className="relative z-10">احجزي موعد الآن</span>
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #C9A961 100%)',
                boxShadow: '0 8px 32px rgba(212, 175, 55, 0.6)'
              }}
            />
          </a>

          {/* Secondary Button - WhatsApp */}
          <a
            href={`https://wa.me/${phoneNumber.replace(/\+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full sm:w-auto px-10 py-5 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              boxShadow: '0 6px 24px rgba(37, 211, 102, 0.3)',
              fontFamily: 'Cairo, sans-serif'
            }}
          >
            {/* WhatsApp Icon */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="relative z-10">تواصلي عبر واتساب</span>
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, #2EE86E 0%, #25D366 100%)',
                boxShadow: '0 8px 32px rgba(46, 232, 110, 0.5)'
              }}
            />
          </a>
        </div>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, #C9A961, transparent)'
        }}
      />
    </section>
  );
};

export default CTASection;
