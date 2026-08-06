import { useState } from 'react';
import { testimonials } from '../data/testimonials';
import { FaStar, FaQuoteRight } from 'react-icons/fa';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 bg-gradient-to-br from-cream-100 to-beige-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">آراء عملائنا</h2>
          <p className="section-subtitle">ثقة العملاء هي أغلى ما نملك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-soft p-8 hover:shadow-gold transition-all duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 text-gold-200 text-5xl opacity-20">
                <FaQuoteRight />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-gold-500 text-xl" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 leading-relaxed text-center italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex flex-col items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mb-3 object-cover"
                  loading="lazy"
                />
                <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                <p className="text-sm text-gold-600">{testimonial.service}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
