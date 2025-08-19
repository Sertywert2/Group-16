/** @type {import('tailwindcss').Config} */
export default {
  content: [
   './src/**/*.{js,jsx,ts,tsx}',
   './app/**/*.{js,jsx,ts,tsx}',
   './components/**/*.{js,jsx,ts,tsx}',
  ],
    theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

