/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'salesforce-blue': '#0176D3',
        'salesforce-dark-blue': '#014486',
        'salesforce-light-blue': '#E5F5FF',
        'salesforce-gray': '#706E6B',
        'salesforce-light-gray': '#F3F2F2',
        'midnight': '#0B1220',
      },
    },
  },
  plugins: [],
}
