/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Complete remapping of purple palette to the exact user design theme:
        // #E43D12 (Vermillion / Flame)
        // #D6536D (Raspberry / Deep Rose)
        // #FFA2B6 (Blossom Pink / Peach Coral)
        // #EFB11D (Saffron Gold / Amber)
        // #EBE9E1 (Sandstone Cream / Warm Alabaster)
        purple: {
          50: '#FDF6F2',    // Subtle warm sand/peach tint
          100: '#FCEAE4',   // Soft peach blush
          200: '#FFA2B6',   // EXACT: Blossom Pink #FFA2B6
          300: '#F77F98',   // Medium blossom rose
          400: '#E65674',   // Deep rose pink
          500: '#D6536D',   // EXACT: Raspberry Pink #D6536D
          600: '#E43D12',   // EXACT: Vibrant Vermillion Flame #E43D12
          700: '#C7310B',   // Dark Vermillion hover
          800: '#8A2108',   // Deep Mahogany Vermillion
          900: '#3D130A',   // Dark Warm Espresso
          950: '#1F0A05',   // Obsidian Espresso
        },
        // Also map indigo to raspberry/rose shades for unified harmony
        indigo: {
          50: '#FDF1F4',
          100: '#FDE4E9',
          200: '#FFA2B6',
          300: '#F77F98',
          400: '#E65674',
          500: '#D6536D',
          600: '#C23D57',
          700: '#A42E45',
          800: '#691D2C',
          900: '#331017',
          950: '#1C080D',
        },
        // Theme specific semantic design tokens
        theme: {
          vermillion: '#E43D12',
          vermillionHover: '#C7310B',
          vermillionLight: '#FDF2EE',
          raspberry: '#D6536D',
          raspberryHover: '#BF425A',
          raspberryLight: '#FDF0F3',
          blush: '#FFA2B6',
          blushLight: '#FFF5F7',
          saffron: '#EFB11D',
          saffronHover: '#D79C0F',
          saffronLight: '#FEF8E7',
          sand: '#EBE9E1',
          sandLight: '#F6F4EE',
          sandDark: '#DDD7CB',
          espresso: '#1A1311',
          header: '#1A1210',
          headerDark: '#120C0A',
          accent: '#E43D12',
          accentHover: '#C7310B',
          accentLight: '#FCEAE4',
          sidebarActive: '#FDF2EE',
          badgePurple: '#D6536D',
          pastelBlue: '#EBE9E1',
          pastelYellow: '#FEF8E7',
          pastelGreen: '#EAF8EE',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
