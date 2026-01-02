/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B30102',
          dark: '#8a0102'
        },
        secondary: {
          DEFAULT: '#0EC86D'
        },
        surface: {
          light: '#ffffff',
          dark: '#f8fafc'
        }
      },
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
      },
      backgroundImage: {
        'moroccan-pattern': "url('https://www.transparenttextures.com/patterns/arabesque.png')",
      }
    },
  },
  plugins: [],
}
