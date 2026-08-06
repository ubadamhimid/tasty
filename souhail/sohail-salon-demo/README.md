# Souhail khoury Luxury Salon - README

## 🌟 Project Overview

موقع DEMO فاخر لصالون **Souhail khoury** النسائي - تجربة جمال استثنائية في عالم الرفاهية.

## 🚀 Quick Start

### Installation

```bash
cd c:\xampp\htdocs\souhail\sohail-salon-demo
npm install
```

### Development

```bash
npm run dev
```

**Server**: http://localhost:5173

### Production Build

```bash
npm run build
```

## 📁 Project Structure

```
sohail-salon-demo/
├── src/
│   ├── components/      # 11 reusable components
│   │   ├── Navbar.jsx
│   │   ├── MobileMenu.jsx
│   │   ├── Hero.jsx
│   │   ├── Footer.jsx
│   │   ├── MobileCTA.jsx
│   │   ├── CategoryCards.jsx
│   │   ├── ServicesGrid.jsx
│   │   ├── GalleryGrid.jsx
│   │   ├── Lightbox.jsx
│   │   ├── Testimonials.jsx
│   │   └── CTASection.jsx
│   │
│   ├── pages/           # 7 pages
│   │   ├── Home.jsx
│   │   ├── Brides.jsx
│   │   ├── HairColor.jsx
│   │   ├── Extensions.jsx
│   │   ├── Gallery.jsx
│   │   ├── Book.jsx
│   │   └── Contact.jsx
│   │
│   ├── data/            # Mock data
│   │   ├── services.js
│   │   ├── gallery.js
│   │   └── testimonials.js
│   │
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
│
├── index.html           # HTML template with RTL
├── tailwind.config.js   # Tailwind configuration
├── package.json
└── README.md
```

## ✨ Features

### Design System

- **Colors**: Beige (#F5F5DC) + Gold (#D4AF37) + Cream (#FFFDD0)
- **Typography**: Tajawal & Cairo (Google Fonts)
- **RTL Support**: Full Arabic right-to-left layout
- **Animations**: Smooth fade, slide, zoom effects
- **Responsive**: Mobile-first design

### Pages

1. **Home** - Hero + Categories + Services + Gallery + Testimonials
2. **Brides** - Wedding packages and bridal services
3. **Hair Color** - Coloring techniques and care tips
4. **Extensions** - Hair extension types and pricing
5. **Gallery** - Filterable image gallery with lightbox
6. **Book** - Booking form with localStorage
7. **Contact** - Contact info and social media links

### Key Components

- **Navbar**: Sticky navigation with mobile menu
- **Lightbox**: Full-screen image viewer with keyboard navigation
- **Booking Form**: localStorage integration for demo bookings
- **Mobile CTA**: Fixed bottom bar for mobile (Book + WhatsApp)
- **Gallery Filters**: Category-based image filtering

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change the color palette:

```js
colors: {
  beige: { /* ... */ },
  gold: { /* ... */ },
  cream: { /* ... */ }
}
```

### Mock Data

Update mock data in `src/data/`:

- `services.js` - Service offerings
- `gallery.js` - Gallery images
- `testimonials.js` - Customer reviews

### Contact Information

Update in multiple files:

- `src/components/Footer.jsx`
- `src/components/CTASection.jsx`
- `src/pages/Contact.jsx`

## 📱 Mobile Features

- Responsive hamburger menu
- Fixed mobile CTA bar (Book + WhatsApp)
- Touch-friendly interface
- Optimized images with lazy loading

## 🌐 Technologies

- **React 18** - UI library
- **Vite 5** - Build tool
- **TailwindCSS 3** - Styling
- **React Router 6** - Navigation
- **React Icons** - Icon library

## 📝 Notes

- This is a **DEMO** project with no backend
- Booking form saves to **localStorage** only
- Images are **placeholders** from Unsplash
- Instagram feed is a **placeholder** (API integration needed later)
- All content is in **Arabic** (RTL)

## 🔗 Important Links

- WhatsApp: +966 50 123 4567
- Instagram: @sohailkhoury
- Facebook: Souhail khoury Salon

## 📄 License

This is a demo project for client presentation.

---

**Made with ❤️ for Souhail khoury Luxury Salon**
