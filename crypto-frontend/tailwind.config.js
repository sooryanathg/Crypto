// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        bounceSmooth: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        pulseSlow: 'pulseSlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounceSmooth: 'bounceSmooth 1.2s infinite ease-in-out',
      },
      colors: {
        // Optional: Add custom colors or light/dark theme variables
        brand: {
          primary: '#ff8c00',
          secondary: '#ff3b3b',
        },
      },
    },
  },
  plugins: [],
};
