/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nvidia: {
          bg: '#0A0D0F',
          surface: '#11161B',
          card: '#161D24',
          cardHover: '#1B242D',
          border: '#222C35',
          borderSubtle: '#192128',
          green: '#76B900',
          greenHover: '#87D300',
          greenDark: '#5E9400',
          greenGlow: 'rgba(118, 185, 0, 0.15)',
          muted: '#9CA3AF',
          mutedDark: '#6B7280',
          text: '#F3F4F6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}

