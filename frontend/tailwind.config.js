/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6C3D91',
        'primary-light': '#8B5FA8',
        'primary-lightest': '#E8DDF0',
        'primary-dark': '#5A3280',
        'neutral': '#78848E',
        'light-grey': '#F3F4F6',
        'off-white': '#F8F9FA',
        'white': '#FFFFFF',
        'dark': '#181512',
        'success': '#28A745',
        'error': '#DC3545',
        'warning': '#FFC107',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}