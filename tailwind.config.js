/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-sky': {
          'dark': '#00233F',
          'medium': '#1F4260',
          'base': '#49799F',
          'light': '#90B6DB',
          'white': '#DCE9FA'
        }
      }
    },
  },
  plugins: [],
}