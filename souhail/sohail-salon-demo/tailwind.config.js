/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        beige: {
          50: "#FAFAF5",
          100: "#F5F5DC",
          200: "#E8E8CE",
          300: "#DCDCBE",
          400: "#CFCFAE",
          500: "#C3C39E",
          600: "#B6B68E",
          700: "#9A9A76",
          800: "#7E7E5E",
          900: "#626246",
        },
        gold: {
          50: "#FDF8E8",
          100: "#F9ECBD",
          200: "#F5E092",
          300: "#F1D467",
          400: "#EDC83C",
          500: "#D4AF37",
          600: "#B8962F",
          700: "#9C7D27",
          800: "#80641F",
          900: "#644B17",
        },
        cream: {
          50: "#FFFEF9",
          100: "#FFFEF4",
          200: "#FFFEE8",
          300: "#FFFEDD",
          400: "#FFFED1",
          500: "#FFFDD0",
          600: "#E6E4BB",
          700: "#CCCBA6",
          800: "#B3B291",
          900: "#99997C",
        },
      },
      fontFamily: {
        arabic: ["Tajawal", "Cairo", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        "slide-right": "slideRight 0.4s ease-out",
        "zoom-in": "zoomIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.08)",
        gold: "0 4px 20px rgba(212, 175, 55, 0.15)",
      },
    },
  },
  plugins: [],
};
