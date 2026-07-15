import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      /* ── Police par défaut — Inter, avec repli système ── */
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          deep: '#073F34',
          emerald: '#0C7A62',
          aubergine: '#4D2347',
          gold: '#D3A64A',
          sand: '#F8F5EF',
          mist: '#EEF2F0',
          ink: '#15201C',
          muted: '#66706B',
          error: '#B42318',
          success: '#16794A',
        },
        afd: {
          50:  '#EAF6FD',  /* Fond léger */
          100: '#D0ECFA',
          200: '#A8DBF5',
          300: '#72C4EE',
          400: '#36A2E0',  /* Couleur principale du logo */
          500: '#2B8BC4',
          600: '#1F6FA8',  /* Couleur secondaire */
          700: '#1A5C8C',
          800: '#154A70',
          900: '#0F3754',
        },
      },
      borderRadius: {
        card: '1rem',
        panel: '1.5rem',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(7, 63, 52, 0.10)',
        lift: '0 24px 60px rgba(7, 63, 52, 0.16)',
      },
    },
  },
  plugins: [],
};
