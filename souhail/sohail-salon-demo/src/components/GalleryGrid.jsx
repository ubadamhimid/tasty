import { useState } from 'react';
import { galleryImages } from '../data/gallery';
import Lightbox from './Lightbox';

const GalleryGrid = ({ limit = null, showTitle = true }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = limit ? galleryImages.slice(0, limit) : galleryImages;

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        {showTitle && (
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              معرض الأعمال
            </h2>
            <p className="text-lg text-gray-600 font-light">
              شاهدي أحدث إبداعاتنا
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 aspect-square cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <svg
                    className="w-16 h-16 text-white drop-shadow-lg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                    />
                  </svg>
                </div>
              </div>

              {/* Glass Border */}
              <div className="absolute inset-0 border border-white/20 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setCurrentImageIndex}
        />
      )}
    </section>
  );
};

export default GalleryGrid;
