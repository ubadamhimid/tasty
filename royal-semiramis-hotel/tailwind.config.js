/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Luxury Hotel Palette
        ivory: {
          50: "#FDFDFB",
          100: "#FCFCFA",
          200: "#FAF7F2",
          300: "#F7F7F2",
          400: "#F5F1E8",
          500: "#FFFDF9",
        },
        gold: {
          300: "#E8C872",
          400: "#DDB957",
          500: "#D4AF37",
          600: "#C9A961",
          700: "#B8935A",
          800: "#AA8C2C",
          900: "#8A6B1F",
        },
        beige: {
          100: "#F5F5DC",
          200: "#F5F1E8",
          300: "#E8DCC0",
        },
        charcoal: {
          800: "#1C1C1C",
          900: "#1A1A2E",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Tajawal", "Inter", "Open Sans", "sans-serif"],
        arabic: ["Tajawal", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 40px rgba(212, 175, 55, 0.1)",
        "gold-glow": "0 8px 30px rgba(212, 175, 55, 0.3)",
        soft: "0 4px 15px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
