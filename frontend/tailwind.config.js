/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdbff',
          300: '#8ec3ff',
          400: '#59a1ff',
          500: '#327efb',
          600: '#1b60f0',
          700: '#154ad7',
          800: '#173db0',
          900: '#18378b',
          950: '#132354',
        }
      }
    },
  },
  plugins: [],
}
