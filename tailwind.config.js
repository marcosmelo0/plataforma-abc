/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.tsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Roboto, sans-serif'
      },
      colors: {
        green: {
          300: '#00B37E',
          500: '#00875F',
          700: '#015F43'
        },
        blue: {
          500: '#81D8F7',
          700: '#1b0daa'
        },
        orange: {
          500: '#FBA94C'
        },
        red: {
          500: '#F75A68'
        },
        gray: {
          100: '#E1E1E6',
          200: '#C4C4CC',
          300: '#8D8D99',
          500: '#323238',
          600: '#29292E',
          700: '#121214',
          900: '#09090A',
        }
      },
    },
  },
  plugins: [],
}

