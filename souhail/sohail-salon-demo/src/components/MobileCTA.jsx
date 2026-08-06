import { Link } from 'react-router-dom';
import { FaWhatsapp, FaCalendarAlt } from 'react-icons/fa';

const MobileCTA = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-2xl border-t border-gray-200">
      <div className="flex items-center">
        <Link
          to="/book"
          className="flex-1 bg-gold-500 text-white py-4 px-4 font-bold text-center flex items-center justify-center gap-2 hover:bg-gold-600 transition-colors"
        >
          <FaCalendarAlt />
          <span>احجز موعد</span>
        </Link>
        <a
          href="https://wa.me/966501234567?text=مرحباً، أرغب في حجز موعد"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-600 text-white py-4 px-4 font-bold text-center flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
        >
          <FaWhatsapp />
          <span>واتساب</span>
        </a>
      </div>
    </div>
  );
};

export default MobileCTA;
