import { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Book = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [bookings, setBookings] = useState([]);

  const services = [
    'قصات فاخرة',
    'صبغات احترافية',
    'عرايس VIP',
    'وصلات طبيعية',
    'علاجات الشعر',
    'تسريحات المناسبات',
  ];

  const timeSlots = [
    '10:00 ص',
    '11:00 ص',
    '12:00 م',
    '1:00 م',
    '2:00 م',
    '3:00 م',
    '4:00 م',
    '5:00 م',
    '6:00 م',
    '7:00 م',
    '8:00 م',
    '9:00 م',
  ];

  useEffect(() => {
    const savedBookings = localStorage.getItem('salonBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newBooking = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedBookings = [newBooking, ...bookings].slice(0, 3);
    setBookings(updatedBookings);
    localStorage.setItem('salonBookings', JSON.stringify(updatedBookings));

    setShowSuccess(true);
    setFormData({
      name: '',
      phone: '',
      service: '',
      date: '',
      time: '',
      notes: '',
    });

    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-beige-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">احجز موعدك</h1>
            <p className="text-xl text-gray-600">املأي النموذج وسنتواصل معك قريباً</p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 animate-slide-down">
              <FaCheckCircle className="text-2xl" />
              <div>
                <p className="font-bold">تم إرسال طلبك بنجاح! (Demo)</p>
                <p className="text-sm">سنتواصل معك قريباً لتأكيد الموعد</p>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:outline-none transition-colors"
                  placeholder="أدخلي اسمك الكامل"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">رقم الهاتف *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:outline-none transition-colors"
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                />
              </div>

              {/* Service */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الخدمة المطلوبة *</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="">اختاري الخدمة</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">التاريخ *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">الوقت *</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:outline-none transition-colors appearance-none bg-white"
                  >
                    <option value="">اختاري الوقت</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">ملاحظات إضافية</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:outline-none transition-colors resize-none"
                  placeholder="أي ملاحظات أو طلبات خاصة؟"
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full btn-primary py-4 text-xl">
                إرسال الطلب
              </button>
            </form>
          </div>

          {/* Recent Bookings */}
          {bookings.length > 0 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">آخر الحجوزات (Demo)</h3>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border-r-4 border-gold-500 pr-4 py-3 bg-beige-50 rounded">
                    <p className="font-semibold text-gray-800">{booking.name}</p>
                    <p className="text-sm text-gray-600">
                      {booking.service} - {booking.date} في {booking.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;
