/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {'3xl': '1700px','4xl': '2150px'},
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        lora: ["Lora", "serif"],
        "playfair-display": ["Playfair Display", "serif"],
        "manrope": ["Manrope", "serif"],
      },
    },
  },
  plugins: [],
};
