const path = require('path');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
    './index.html',
    './src/**/*.{vue,js}'
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Change with you want it
        primary: {...colors.orange, ...{700: '#EB3F19'}},
        secondary: colors.coolGray, 
        teal: colors.teal,
      }
    }
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      textOpacity: ['disabled'],
      textColor: ['disabled'],
      backgroundColor: ['disabled'],
      borderWidth: ['last'],
      filter: ['hover']
    }
  },
  plugins: [
    require('tailwindcss-rtl'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp')
  ]
};