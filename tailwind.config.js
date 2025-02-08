/** @type {import('tailwindcss').Config} */
import fluid, { extract, fontSize, screens } from 'fluid-tailwind'
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: "selector",
  content: {
    files: ["./src/**/*.{html,njk,js}"],
    extract,
  },
  theme: {
    fontSize: fontSize,
    screens: screens,
    extend: {
      fontFamily: {
        "sans": ["TT Travels", defaultTheme.fontFamily.sans],
        "proxima-nova": ["Proxima Nova", defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: "#CE2327",
        secondary: "#FFC30C",
        tertiary: "#2159AA"
      }
    },
  },
  plugins: [
    fluid,
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
}