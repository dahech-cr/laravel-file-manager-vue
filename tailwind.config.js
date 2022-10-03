// tailwind.config.js

const colors = {
  light: '#f8f9fa',
  secondary : '#6c757d'
}

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: (theme) => ({
        ...colors,
      }),
      colors: (theme) => ({
        ...colors,
      }),
      fill: (theme) => ({
        ...colors,
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}