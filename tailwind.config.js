/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports  = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
   
    extend: {
      backgroundImage: {
        'black-gradient': 'linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #333333 100%)',
        'black-gradient-reverse': 'linear-gradient(0deg, #000000 0%, #1a1a1a 50%, #333333 100%)',
        'black-gradient-diagonal': 'linear-gradient(45deg, #000000 0%, #1a1a1a 50%, #333333 100%)',
        'black-gradient-radial': 'radial-gradient(circle, #000000 0%, #1a1a1a 50%, #333333 100%)',
      },
      colors: {
        'black-light': '#333333',
        'black-medium': '#1a1a1a',
        'black-dark': '#000000',
      },
    },
   
  },
  plugins: [],
})
