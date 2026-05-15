import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — cyan/turquoise from the "Makenna" wordmark
        cyan: {
          DEFAULT: '#4FB8C9',
          50:  '#E5F6F8',
          100: '#CDEDF1',
          200: '#A6E0E5',
          300: '#7DD0D9',
          400: '#4FB8C9',
          500: '#2A95A8',
          600: '#1E7383',
          700: '#16545F',
          800: '#0E363D',
          900: '#071B1F',
        },
        // Hibiscus red
        hibiscus: {
          DEFAULT: '#C5293A',
          50:  '#FBE9EB',
          100: '#F4D5D9',
          200: '#E89BA4',
          300: '#DC616F',
          400: '#C5293A',
          500: '#9F1F2E',
          600: '#791722',
          700: '#530F17',
          800: '#2E080C',
        },
        // Royal blue
        royal: {
          DEFAULT: '#1F5FB6',
          50:  '#E8F0FA',
          100: '#D8E3F3',
          200: '#A8C2E5',
          300: '#6E97D2',
          400: '#1F5FB6',
          500: '#164683',
          600: '#0F315B',
          700: '#091D36',
          800: '#040C17',
        },
        // Pink/magenta playful accent
        pink: {
          DEFAULT: '#E91E63',
          100: '#FCE0EB',
          200: '#F8B0CB',
          400: '#E91E63',
          600: '#B81550',
        },
        // Page / surface
        page: '#FFFFFF',
        cream: '#FFF8E7',
        ink: {
          DEFAULT: '#0F1729',
          50:  '#F4F6FA',
          100: '#E2E8F0',
          200: '#CAD3E0',
          300: '#94A0B0',
          400: '#5A6577',
          500: '#39455A',
          600: '#1F2B40',
          700: '#0F1729',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        script: ['Pacifico', '"Brush Script MT"', 'cursive'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(15, 23, 41, 0.06), 0 1px 2px rgba(15, 23, 41, 0.04)',
        card: '0 4px 14px rgba(15, 23, 41, 0.08), 0 2px 6px rgba(15, 23, 41, 0.04)',
      },
      backgroundImage: {
        // The site's signature horizontal tri-stripe (red, royal blue, cyan)
        'tri-stripe':
          'linear-gradient(to right, #C5293A 0%, #C5293A 33%, #1F5FB6 33%, #1F5FB6 66%, #7DD0D9 66%, #7DD0D9 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
