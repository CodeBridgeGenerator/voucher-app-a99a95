/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0a2540',
        secondary: '#0074b7',
        link: '#0082D4',
        grey: '#ADB5BD',
        // Add gold color palette
        gold: {
          300: '#f0c14b',
          400: '#e6b800',
          500: '#d4af37', // Classic gold color
          600: '#c9a227',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};