import { useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Lightbox = ({ images, currentIndex, onClose, onNavigate }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handleNext();
      if (e.key === 'ArrowRight') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 text-white text-3xl hover:text-gold-400 transition-colors z-10"
        aria-label="Close"
      >
        <FaTimes />
      </button>

      {/* Previous Button */}
      <button
        onClick={handlePrev}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gold-400 transition-colors z-10 bg-black/50 rounded-full p-4"
        aria-label="Previous"
      >
        <FaChevronRight />
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gold-400 transition-colors z-10 bg-black/50 rounded-full p-4"
        aria-label="Next"
      >
        <FaChevronLeft />
      </button>

      {/* Image */}
      <div className="max-w-6xl max-h-[90vh] mx-4">
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        {currentImage.caption && (
          <p className="text-white text-center mt-4 text-lg">{currentImage.caption}</p>
        )}
        <p className="text-gray-400 text-center mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
};

export default Lightbox;
