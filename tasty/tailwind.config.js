/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tasty: {
          teal: '#5E9895',
          'teal-dark': '#487A77',
          'teal-light': '#E9F3F2',
          sage: '#9DBEBB',
          'sage-light': '#F0F6F5',
          terracotta: '#E29578',
          'terracotta-dark': '#C87455',
          'terracotta-light': '#FBF0EB',
          charcoal: '#2B3A39',
          'charcoal-muted': '#556866',
          bg: '#FFFDF9',
          'bg-warm': '#FAF7F2',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'tasty-soft': '0 12px 32px -4px rgba(94, 152, 149, 0.08), 0 4px 12px -2px rgba(94, 152, 149, 0.04)',
        'tasty-hover': '0 20px 40px -4px rgba(94, 152, 149, 0.16), 0 8px 16px -2px rgba(226, 149, 120, 0.12)',
        'tasty-glow': '0 0 25px 2px rgba(94, 152, 149, 0.25)',
        'terracotta-glow': '0 0 25px 2px rgba(226, 149, 120, 0.3)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
