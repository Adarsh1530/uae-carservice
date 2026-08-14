/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00FF66',
          greenLight: '#33FF85',
          greenDark: '#00CC52',
          neon: '#00E676',
          bg: '#000000',
          surface: '#050505',
          card: '#0A0A0A',
          cardHover: '#121212',
          border: 'rgba(0, 255, 102, 0.2)',
          borderHover: 'rgba(0, 255, 102, 0.5)',
          muted: '#A0A0A0',
          darkGray: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-space)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(0, 255, 102, 0.3)',
        'neon-md': '0 0 20px rgba(0, 255, 102, 0.4)',
        'neon-lg': '0 0 35px rgba(0, 255, 102, 0.5)',
        'neon-xl': '0 0 50px rgba(0, 255, 102, 0.6)',
        'neon-inset': 'inset 0 0 15px rgba(0, 255, 102, 0.25)',
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'border-pulse': 'borderPulse 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradientX 15s ease infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(30px)' },
        },
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(0, 255, 102, 0.2)' },
          '50%': { borderColor: 'rgba(0, 255, 102, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
      },
    },
  },
  plugins: [],
};
