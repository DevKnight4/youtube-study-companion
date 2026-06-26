/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./popup.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'panel-bg': 'rgba(15, 15, 20, 0.85)',
        'panel-border': 'rgba(255, 255, 255, 0.1)'
      }
    },
  },
  plugins: [],
}
