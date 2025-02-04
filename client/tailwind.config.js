const { heroui } = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px", 
      '2xl': "1536px",
    },    
    extend: {
      colors: {
        dark: "#003A55",
        blue: "#02CAD6",
        white: "#FFFFFF",
        lblue: "#E2F1FF",
        fcolor: "#333333",
      },
      fontFamily: {
        main: ["Montserrat"],
      },
      backgroundImage: {
        'bgMain': "url('bg.png')",
      },
      spacing: {
        18: '4.5rem', 
        22: '5.5rem',
        24: '6rem',
      },
      fontSize: {
        'xxs': '.60rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      textShadow: {
        DEFAULT: '2px 2px 4px rgba(0, 0, 0, 0.3)', 
        sm: '1px 1px 2px rgba(0, 0, 0, 0.2)', 
        lg: '4px 4px 8px rgba(0, 0, 0, 0.5)', 
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      require('@tailwindcss/line-clamp'),
      require('tailwindcss-textshadow'),
      
      addUtilities({
        ".text-outline": {
          textShadow:
            "-0.5px -0.5px 1px rgba(0,0,0,0.3),0.5px -0.5px 1px rgba(0,0,0,0.3),-0.5px 0.5px 1px rgba(0,0,0,0.3),0.5px 0.5px 1px rgba(0,0,0,0.3)",
        }, ".drop-shadow-dark": {
          filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.8))",
        }, ".drop-shadow-light": {
          filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.7))",
        },
      });
    }, heroui()],

}

