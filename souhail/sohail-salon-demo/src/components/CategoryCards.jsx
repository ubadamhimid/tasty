import { Link } from 'react-router-dom';
import { categories } from '../data/services';

const CategoryCards = () => {
  return (
    <section className="py-8 bg-gradient-to-b from-[#FAF8F5] to-white">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            خدماتنا المتميزة
          </h2>
          <p className="text-lg text-gray-600 font-light">
            اكتشفي عالماً من الجمال والرفاهية
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-gold-900/70 transition-all duration-500" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 right-0 left-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-gold-200 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed opacity-90">
                  {category.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="mt-4 flex items-center gap-2 text-gold-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">اكتشف المزيد</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>

              {/* Glass Effect Border */}
              <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
