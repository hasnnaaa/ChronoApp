/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        logo: ['"League Spartan"', 'sans-serif'],
      },
      colors: {
        pastel: {
          red: '#e2a5a4',
          olive: '#d4cfb2',
          peach: '#e7cebe',
          sand: '#e2d6cb',
          clay: '#e3bcb4',
        },
        brown: {
          warm: '#a67c52',
          dark: '#8B4513',
        },
        fafaf9: '#fafaf9',
        fdfcfb: '#fdfcfb',
        fcfaf8: '#fcfaf8',
      }
    },
  },
  plugins: [],
}