/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          header: '#3b1c71',      // Deep Royal Purple header background from screenshot
          headerDark: '#291252',  // Header darker gradient shade
          accent: '#7c3aed',      // Primary Violet/Purple button accent
          accentHover: '#6d28d9',
          accentLight: '#f3e8ff', // Pastel Light Violet background
          sidebarActive: '#f3e8ff',
          badgePurple: '#8b5cf6',
          pastelBlue: '#e0e7ff',
          pastelYellow: '#fef3c7',
          pastelGreen: '#d1fae5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
