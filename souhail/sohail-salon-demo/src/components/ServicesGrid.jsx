import { services } from '../data/services';

const ServicesGrid = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">جميع خدماتنا</h2>
          <p className="section-subtitle">نقدم لكِ أفضل العناية بالشعر</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="card group hover:scale-105"
            >
              {/* Icon */}
              <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform emoji-icon">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                {service.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center mb-4 leading-relaxed">
                {service.description}
              </p>

              {/* Price */}
              <div className="text-center">
                <span className="inline-block bg-gold-100 text-gold-700 px-6 py-2 rounded-full font-bold text-lg">
                  {service.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
