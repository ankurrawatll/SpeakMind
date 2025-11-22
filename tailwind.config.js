/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#9D7CF3',
          pink: '#FFB8C4',
          yellow: '#FDC75E',
          orange: '#FF9A76',
        },
        gradient: {
          'purple-pink': 'linear-gradient(135deg, #9D7CF3 0%, #FFB8C4 100%)',
          'pink-yellow': 'linear-gradient(135deg, #FFB8C4 0%, #FDC75E 100%)',
          'purple-orange': 'linear-gradient(135deg, #9D7CF3 0%, #FF9A76 100%)',
        },
        dark: {
          bg: '#0F0F1E',
          'bg-secondary': '#1A1A2E',
          card: '#16213E',
          'card-hover': '#1E2746',
          text: '#EEEEFF',
          'text-secondary': '#B8B8D1',
          border: '#2A2A3E',
        },
        light: {
          bg: '#F8F9FF',
          'bg-secondary': '#FFFFFF',
          card: '#FFFFFF',
          'card-hover': '#F5F5FF',
          text: '#1A1A2E',
          'text-secondary': '#4A4A6A',
          border: '#E5E5F0',
        },
        // Dynamic theme colors (will be set via CSS variables)
        theme: {
          primary: 'var(--theme-primary)',
          secondary: 'var(--theme-secondary)',
          accent: 'var(--theme-accent)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '375px',
        'mobile': '414px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(157, 124, 243, 0.15)',
        'button': '0 8px 24px rgba(157, 124, 243, 0.3)',
      },
      keyframes: {
        moveBackground: {
          'from': { backgroundPosition: '0% 0%' },
          'to': { backgroundPosition: '0% -1000%' },
        }
      },
      animation: {
        moveBackground: 'moveBackground 60s linear infinite',
      }
    },
  },
  plugins: [],
}