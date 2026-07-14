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
      },
      /* ── Palette AFD — couleurs issues du logo officiel ── */
      colors: {
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
    },
  },
  plugins: [],
};
