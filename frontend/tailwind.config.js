/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sky: {
          500: '#0EA5E9',
          600: '#0284C7',
        },
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [],
}

