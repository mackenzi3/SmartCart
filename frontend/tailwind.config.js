/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#10b981', // Emerald
      },
      animation: {
        'scan': 'scan 2s linear infinite',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { top: '20px' },
          '50%': { top: '160px' },
        }
      }
    },
  },
  plugins: [],
}
