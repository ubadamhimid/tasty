import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: '',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Luxury Info Cards Data
  const contactInfo = [
    {
      icon: FaPhone,
      title: language === 'ar' ? 'الهاتف' : 'Phone',
      content: '+963 11 123 4567',
      link: 'tel:+963111234567',
    },
    {
      icon: FaEnvelope,
      title: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
      content: 'info@royalsemiramis.sy',
      link: 'mailto:info@royalsemiramis.sy',
    },
    {
      icon: FaMapMarkerAlt,
      title: language === 'ar' ? 'العنوان' : 'Address',
      content: language === 'ar' ? 'شارع بغداد، دمشق، سوريا' : 'Baghdad Street, Damascus, Syria',
      link: null,
    },
    {
      icon: FaClock,
      title: language === 'ar' ? 'ساعات العمل' : 'Business Hours',
      content: language === 'ar' ? '24/7 - خدمة متواصلة' : '24/7 - Continuous Service',
      link: null,
    },
  ];

  return (
    <div>
      {/* SOFT ELEGANT HERO - 55vh */}
      <section className="relative h-[55vh] min-h-[450px] overflow-hidden">
        
        {/* Calm Luxury Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/hotel_interior_hero_1769598927302.png')`,
          }}
        />

        {/* Soft Warm Overlay - Ivory/Beige */}
        <div className="absolute inset-0 bg-gradient-to-b from-ivory-100/80 via-beige-50/70 to-ivory-100/80" />

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-center max-w-3xl">
            
            {/* Large Serif Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-6xl md:text-7xl text-charcoal-900 mb-6 leading-tight"
              style={{
                fontFamily: language === 'ar' ? 'Tajawal, serif' : 'Playfair Display, serif',
                fontWeight: language === 'ar' ? 700 : 400,
              }}
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </motion.h1>

            {/* Subtle Gold Divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-px bg-gold-400 mx-auto mb-8"
            />

            {/* Elegant Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl text-charcoal-700 font-light leading-relaxed"
            >
              {language === 'ar' 
                ? 'نحن هنا لخدمتكم في أي وقت'
                : 'We are here to serve you at any time'}
            </motion.p>

          </div>
        </div>
      </section>

      {/* LUXURY FLOATING INFO CARDS */}
      <section className="relative -mt-20 z-10 pb-24 bg-gradient-to-b from-white via-ivory-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="group"
              >
                {/* Luxury Card */}
                <div className="h-full bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg shadow-charcoal-900/5 border border-charcoal-100/30 hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-1 transition-all duration-500">
                  
                  {/* Minimal Gold Icon */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center mb-6 border border-gold-200/50 group-hover:border-gold-400/70 group-hover:shadow-lg group-hover:shadow-gold-500/20 transition-all duration-500">
                    <item.icon className="text-gold-600 text-xl" />
                  </div>

                  {/* Title */}
                  <h3 className="text-charcoal-900 font-semibold text-lg mb-3">
                    {item.title}
                  </h3>

                  {/* Content */}
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-charcoal-600 font-light leading-relaxed hover:text-gold-600 transition-colors duration-300 block"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-charcoal-600 font-light leading-relaxed">
                      {item.content}
                    </p>
                  )}

                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* PREMIUM SPLIT LAYOUT - CONCIERGE MESSAGE + LUXURY FORM */}
      <section className="py-24 bg-gradient-to-b from-white via-ivory-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* LEFT: CONCIERGE MESSAGE */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Title */}
              <h2 className="font-serif text-4xl lg:text-5xl text-charcoal-900 leading-tight">
                {language === 'ar' 
                  ? 'فريقنا في خدمتكم'
                  : 'Our Team at Your Service'}
              </h2>

              {/* Thin Gold Line */}
              <div className="w-16 h-px bg-gold-400"></div>

              {/* Concierge Message */}
              <p className="text-lg text-charcoal-700 font-light leading-relaxed max-w-lg">
                {language === 'ar'
                  ? 'فريقنا جاهز لمساعدتكم في الحجوزات والاستفسارات الخاصة. نحن نقدم تجربة ضيافة استثنائية تليق بمستوى فندقنا.'
                  : 'Our team is ready to assist you with bookings and special inquiries. We provide an exceptional hospitality experience worthy of our hotel.'}
              </p>

              {/* Small 5-Star Icons */}
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-gold-500 text-sm" />
                ))}
              </div>

              {/* Trust Text */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-charcoal-700">
                  <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                  <span className="font-light">{language === 'ar' ? 'خدمة متواصلة 24/7' : '24/7 Continuous Service'}</span>
                </div>
                <div className="flex items-center gap-3 text-charcoal-700">
                  <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                  <span className="font-light">{language === 'ar' ? 'خدمة شخصية' : 'Personal Service'}</span>
                </div>
                <div className="flex items-center gap-3 text-charcoal-700">
                  <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                  <span className="font-light">{language === 'ar' ? 'استجابة سريعة' : 'Quick Response'}</span>
                </div>
              </div>

            </motion.div>

            {/* RIGHT: LUXURY FORM */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Floating Form Card */}
              <div className="bg-white rounded-3xl p-10 shadow-2xl shadow-charcoal-900/10 border border-charcoal-100/30">
                
                {/* Form Title */}
                <h3 className="text-2xl font-bold text-charcoal-900 mb-8">
                  {language === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}
                </h3>

                {/* Success Message */}
                {showSuccess && (
                  <div className="bg-gold-50 border-2 border-gold-400 text-charcoal-900 px-6 py-4 rounded-xl mb-6 text-center">
                    {language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!'}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Full Name - Large Input */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-800 mb-3 uppercase tracking-wider">
                      {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-charcoal-200 focus:border-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/20 transition-all duration-300 text-charcoal-900"
                      placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    />
                  </div>

                  {/* Email - Large Input */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-800 mb-3 uppercase tracking-wider">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-charcoal-200 focus:border-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/20 transition-all duration-300 text-charcoal-900"
                      placeholder={language === 'ar' ? 'example@email.com' : 'example@email.com'}
                    />
                  </div>

                  {/* Phone - Large Input */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-800 mb-3 uppercase tracking-wider">
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-charcoal-200 focus:border-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/20 transition-all duration-300 text-charcoal-900"
                      placeholder="+963"
                    />
                  </div>

                  {/* Inquiry Type - Select */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-800 mb-3 uppercase tracking-wider">
                      {language === 'ar' ? 'نوع الاستفسار' : 'Inquiry Type'}
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-charcoal-200 focus:border-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/20 transition-all duration-300 text-charcoal-900"
                    >
                      <option value="">{language === 'ar' ? 'اختر نوع الاستفسار' : 'Select inquiry type'}</option>
                      <option value="booking">{language === 'ar' ? 'حجز غرفة' : 'Room Booking'}</option>
                      <option value="event">{language === 'ar' ? 'حدث أو مناسبة' : 'Event or Occasion'}</option>
                      <option value="inquiry">{language === 'ar' ? 'استفسار عام' : 'General Inquiry'}</option>
                      <option value="feedback">{language === 'ar' ? 'ملاحظات' : 'Feedback'}</option>
                    </select>
                  </div>

                  {/* Message - Textarea */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-800 mb-3 uppercase tracking-wider">
                      {language === 'ar' ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-5 py-4 rounded-xl border-2 border-charcoal-200 focus:border-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/20 transition-all duration-300 resize-none text-charcoal-900"
                      placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                    />
                  </div>

                  {/* CTA Button - Wide & Confident */}
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold py-5 rounded-xl uppercase tracking-wider shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 transition-all duration-300"
                  >
                    {language === 'ar' ? 'إرسال الطلب' : 'Send Request'}
                  </button>

                </form>

              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* PREMIUM MAP SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Map Container with Rounded Corners */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-charcoal-900/10"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.453890123456!2d36.2911!3d33.5138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDMwJzQ5LjciTiAzNsKwMTcnMjguMCJF!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Hotel Location"
            />
            
            {/* Soft Overlay with Hotel Name */}
            <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg">
              <p className="text-charcoal-900 font-semibold text-lg">
                {language === 'ar' ? 'فندق رويال سميراميس' : 'Royal Semiramis Hotel'}
              </p>
              <p className="text-charcoal-600 text-sm mt-1">
                {language === 'ar' ? 'دمشق، سوريا' : 'Damascus, Syria'}
              </p>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default Contact;
