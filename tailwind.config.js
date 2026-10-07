/** @type {import('tailwindcss').Config} */

// "Ink & Brass" palette: warm charcoal neutrals with a muted gold accent.
// The markup uses Tailwind's slate/blue/emerald class names, so the palette is
// swapped here by redefining those scales rather than renaming every class.
const ink = {
  50: '#fafafa',
  100: '#f0f0ee',
  200: '#dededb',
  300: '#c8c8c4',
  400: '#a0a09b',
  500: '#7a7a75',
  600: '#4a443a',
  700: '#2e2a24',
  800: '#1d1a16',
  900: '#14120f',
  950: '#0d0b09',
};

const brass = {
  50: '#faf5ec',
  100: '#f2e6cf',
  200: '#e6d2ab',
  300: '#d9bf8f',
  400: '#d1b383',
  500: '#b8955f',
  600: '#8a6d3f',
  700: '#735a33',
  800: '#5c482a',
  900: '#46371f',
  950: '#2b2113',
};

module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        white: '#fafafa',
        slate: ink,
        blue: brass,
        emerald: { 400: '#8fae8b', 500: '#7d9c79' },
      },
    },
  },
  plugins: [],
};
