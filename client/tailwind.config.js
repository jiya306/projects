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
          light: '#B8E7FA',
          DEFAULT: '#7CCBEE',
          hover: '#42A9D8',
          deep: '#298EBE',
        },
        surface: {
          cream: '#F9F7F3',
          bone: '#F3F0E8',
          card: '#FFFFFF',
          dark: '#202020',
          black: '#000000',
        },
        text: {
          primary: '#202020',
          body: '#3A3A3A',
          secondary: '#575757',
          muted: '#646464',
        },
        status: {
          success: '#2B9A66',
        },
        salon: {
          border: 'rgba(32, 32, 32, 0.12)',
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'serif', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(32, 32, 32, 0.05)',
        'card': '0 4px 20px -4px rgba(32, 32, 32, 0.06)',
        'glow': '0 0 20px rgba(184, 231, 250, 0.5)',
      },
      borderRadius: {
        'card': '14px',
      }
    },
  },
  plugins: [],
}
