/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'lg': '1024px',
      'md': '768px',
      'sm': '1280px',
      'xl': '1440px',
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}

